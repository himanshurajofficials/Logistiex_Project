import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {NativeBaseProvider, Box, Image, Center, VStack, Button, Icon, Input, Heading, Alert, Text, Modal } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { PermissionsAndroid, Pressable, SafeAreaView, StyleSheet, TouchableHighlight, View , ActivityIndicator, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { decode } from "react-native-pure-jwt";
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Marker from 'react-native-image-marker';
import { ScrollView } from 'react-native-gesture-handler';
import { backendUrl } from '../utils/backendUrl';

export default function StartTrip() {

  const [vehicle, setVehicle] = useState('');
  const [startkm, setStartKm] = useState('');
  const [ImageUrl, setImageUrl] = useState('');
  const [tripValue, setTripValue] = useState('Start Trip');
  const [tripID, setTripID] = useState("");
  const [userId, setUserId] = useState('');
  const [uploadStatus, setUploadStatus] = useState('idle');
  const [modalVisible, setModalVisible] = useState(false);
  const [message, setMessage] = useState(0);
  const [status, setStatus] = useState('info');
  const [showModal, setShowModal] = useState(false);
  const navigation = useNavigation();

  const getUserId = async () => {
    try {
      const value = await AsyncStorage.getItem('@storage_Key');
      if (value !== null) {
          const data = JSON.parse(value);
          setUserId(data.userId);
          // console.log(data.userId);
      } else {
          setUserId(' ');
      }
  } catch (e) {
      console.log(e);
  }
  };
  useEffect(() => {
    getUserId();
}, []);
useEffect(() => {
axios
  .get(backendUrl + `SellerMainScreen/vehicleNumber/${userId}`)
  .then(response => {
    console.log('data', response);
    setVehicle(response.data.data.vehicleNumber);
  })
  .catch(error => {
    console.log(error, 'error');
  });
}, [userId]);
console.log(vehicle);
  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'App needs camera permission',
        },
      );
      // If CAMERA Permission is granted
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const createFormData = (photo, body) => {
    const data = new FormData();
  
    data.append("file", {
      name: photo.fileName,
      type: photo.type,
      uri:
        Platform.OS === "android" ? photo.uri : photo.uri.replace("file://", "")
    });
  
    Object.keys(body).forEach(key => {
      data.append(key, body[key]);
    });
    return data;
  };

  const storeData = async(data) => {
    try {
      await AsyncStorage.setItem('@TripID', JSON.stringify(data));
      getData();
    } catch (e) {
      console.log(e);
    }
  }

  const storeDataTripValue = async() => {
    try {
      // await AsyncStorage.setItem('@StartEndTrip', JSON.stringify('End Trip'));
      // await AsyncStorage.setItem('@VehicleStartkm', JSON.stringify({
      //   vehicle,
      //   startkm
      // }));
      navigation.navigate('Main',{tripID:userId+"_"+date});
    } catch (e) {
      console.log(e);
    }
  }

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@TripID')
      if(value !== null) {
        const data = JSON.parse(value);
        setTripID(data);
      }
    } catch(e) {
      console.log(e);
    }
  }
  const takePhoto= async()=>{
    setUploadStatus('uploading');
    let options = {
        mediaType:'photo',
        quality:1,
        cameraType:'back',
        maxWidth : 480,
        maxHeight : 480,
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
    }
    let isGranted = await requestCameraPermission();
    let result = null;
    if(isGranted){
        result = await launchCamera(options);
        console.log(result)
    }
    if(result.assets !== undefined){          
      fetch(backendUrl + 'DSQCPicture/uploadPicture', {
        method: 'POST',
        body: createFormData(result.assets[0], {
          useCase: 'DSQC',
          type: 'front',
          contextId: 'SI002',
          contextType: 'shipment',
          hubCode: 'HC001',
        }),
      })
        .then(data => data.json())
        .then(res => {
          setImageUrl(res.publicURL);
          setUploadStatus('done');
          console.log('upload succes', res);
        })
        .catch(error => {
          console.log('upload error', error);
          setUploadStatus('error');
        });
    }
}
// useEffect(() => {
//   storeData(new Date() + "UI001");
// }, []);

let current=new Date();
let tripid=current.toString();
let time = tripid.match(/\d{2}:\d{2}:\d{2}/)[0];

let dateStart = 0; 
let dateEnd = tripid.indexOf(" ", tripid.indexOf(" ", tripid.indexOf(" ") + 1) + 1); 
let date = dateEnd ? tripid.substring(dateStart, dateEnd+5) : "No match found";
const ImageHandle = () => 
  {
    (async() => {
        await axios
          .post(backendUrl + 'UserTripInfo/userTripDetails', {
            tripID: userId + '_' + date,
            userID: userId,
            date: new Date(),
            startTime: time,
            vehicleNumber: vehicle,
            startKilometer: startkm,
            startVehicleImageUrl: ImageUrl,
          })
          .then(function (res) {
            console.log('dscsdc', res.data.msg);
            // storeDataTripValue();
            if (res.data.msg == 'TripID already exists') {
              setMessage(2);
            } else {
              storeDataTripValue();
              setMessage(1);
            }
            setShowModal(true);
          })
          .catch(function (error) {
            console.log(error);
          });
    }) ();
   }

  return (
    <NativeBaseProvider>
        <Box flex={1} bg="gray.300" alignItems="center" pt={'4%'}>
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <Modal.Content backgroundColor={message === 1 ? '#dcfce7' : '#fee2e2'}>
            <Modal.CloseButton />
            <Modal.Body>
              <Alert w="100%" status={message === 1 ? 'success' : 'error'}>
                <VStack space={1} flexShrink={1} w="100%" alignItems="center">
                  <Alert.Icon size="4xl" />
                  <Text my={3} fontSize="md" fontWeight="medium">{message === 1 ? 'Trip Started Successfully' : 'Trip ID already exists'}</Text>
                </VStack>
              </Alert>
            </Modal.Body>
          </Modal.Content>
        </Modal>
        <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)} size="lg">
        <Modal.Content maxWidth="350">
          <Modal.CloseButton />
          <Modal.Header />
          <Modal.Body>
          
          <View style={{width: '90%', flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'center'}}>
          <Image 
                      source={{ uri: ImageUrl }} 
                      style={{ width: 400, height: 600 }} 
                      alt = 'image not shown'
                    />
          </View>
          </Modal.Body>
        </Modal.Content>
      </Modal>
            <Box justifyContent="space-between" py={10} px={6} bg="#fff" rounded="xl" width={"90%"} maxWidth="100%" _text={{fontWeight: "medium",}}>
            <ScrollView>
            <VStack space={6}>
                <Input editable={false} value={vehicle} size="lg" placeholder="Vehicle No." />
                <Input keyboardType="numeric" value={startkm} onChangeText={setStartKm} size="lg" type={"number"} placeholder="Input vehicle KMs" />
                {/* <Button py={3} title="Login" variant='outline'  _text={{ color: 'white', fontSize: 20 }} onPress={()=>takePhoto()}><MaterialIcons name="cloud-upload" size={22} color="gray">  Image</MaterialIcons></Button> */}
                <Button py={3} variant='outline' _text={{ color: 'white', fontSize: 20 }} onPress={takePhoto}>
                {uploadStatus === 'idle' && <MaterialIcons name="cloud-upload" size={22} color="gray">  Image</MaterialIcons>}
                {uploadStatus === 'uploading' && <ActivityIndicator size="small" color="gray" />}
                {uploadStatus === 'done' && <MaterialIcons name="check" size={22} color="green" />}
                {uploadStatus === 'error' && <MaterialIcons name="error" size={22} color="red" />}
                </Button>
                {
                  ImageUrl ? (
                    <TouchableOpacity onPress={() => setModalVisible(true)} >
                      <Image 
                      source={{ uri: ImageUrl }} 
                      style={{ width: 300, height: 200 }} 
                      alt = 'image not shown'
                    />
                    </TouchableOpacity>
                  ):(
                    null
                  )
                }
                {
                  startkm && vehicle && ImageUrl && tripid ? (
                    <Button title="Login" backgroundColor= {'#004aad'} _text={{ color: 'white', fontSize: 20 }} onPress={()=>{ImageHandle()}}>Start Trip</Button>
                  ) : (
                    <Button opacity={0.5}  disabled={true} title="Login" backgroundColor= {'#004aad'} _text={{ color: 'white', fontSize: 20 }}>Start Trip</Button>
                  )
                }
            </VStack>
            </ScrollView>
            <Center>
          <Image style={{ width: 150, height: 100 }} source={require('../assets/image.png')} alt={'Logo Image'} />
        </Center>
        </Box>
            
        
        </Box>
    </NativeBaseProvider>
  );
}
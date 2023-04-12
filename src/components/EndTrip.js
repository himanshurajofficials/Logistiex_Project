import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {
  NativeBaseProvider,
  Box,
  Image,
  Center,
  VStack,
  Button,
  Icon,
  Input,
  Heading,
  Alert,
  Text,
  Modal,
} from 'native-base';
import {useNavigation} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  ActivityIndicator,
  PermissionsAndroid,
  Pressable,
  SafeAreaView,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {decode} from 'react-native-pure-jwt';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {backendUrl} from '../utils/backendUrl';

export default function EndTrip({navigation, route}) {
  const [vehicle, setVehicle] = useState('');
  const [endkm, setEndkm] = useState('');
  const [startkm, setStartkm] = useState('');
  const [ImageUrl, setImageUrl] = useState('');
  const [tripID, setTripID] = useState('');
  const [userId, setUserId] = useState('');
  const [uploadStatus, setUploadStatus] = useState('idle');
  const [TripValue, setTripValue] = useState('Start Trip');
  const [modalVisible, setModalVisible] = useState(false);
  const [pendingPickup, setPendingPickup] = useState(0);
  const [pendingDelivery, setPendingDelivery] = useState(0);

  const getDataTrip = async () => {
    try {
      const StartEndTrip = await AsyncStorage.getItem('@StartEndTrip');
      if (StartEndTrip !== null) {
        const data = JSON.parse(StartEndTrip);
        setTripValue(data);
        await AsyncStorage.removeItem('@StartEndTrip');
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getDataTrip();
  }, []);

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
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM SellerMainScreenDetails WHERE shipmentAction="Seller Pickup" AND status IS NULL',
        [],
        (tx1, results) => {
          setPendingPickup(results.rows.length);
        },
      );
    });

    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM SellerMainScreenDetails where shipmentAction="Seller Delivery" AND status IS NULL',
        [],
        (tx1, results) => {
          setPendingDelivery(results.rows.length);
        },
      );
    });
  }, []);

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'App needs camera permission',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const createFormData = (photo, body) => {
    const data = new FormData();

    data.append('file', {
      name: photo.fileName,
      type: photo.type,
      uri:
        Platform.OS === 'android'
          ? photo.uri
          : photo.uri.replace('file://', ''),
    });

    Object.keys(body).forEach(key => {
      data.append(key, body[key]);
    });
    return data;
  };

  const takePhoto = async () => {
    setUploadStatus('uploading');
    setImageUrl('');
    let options = {
      mediaType: 'photo',
      quality: 1,
      cameraType: 'back',
      maxWidth: 480,
      maxHeight: 480,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    let isGranted = await requestCameraPermission();
    let result = null;
    if (isGranted) {
      result = await launchCamera(options);
      console.log(result);
    }
    if (result.assets !== undefined) {
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
  };

  const getTripID = async () => {
    try {
      const value = await AsyncStorage.getItem('@TripID');
      if (value !== null) {
        const data = JSON.parse(value);
        setTripID(data);
      }
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    getTripID();
  }, []);
  const storeDataTripValue = async () => {
    try {
      navigation.navigate('StartEndDetails', {tripID: userId + '_' + date});
    } catch (e) {
      console.log(e);
    }
  };

  let current = new Date();
  let tripid = current.toString();
  let time = tripid.match(/\d{2}:\d{2}:\d{2}/)[0];
  let dateStart = 0;
  let dateEnd = tripid.indexOf(
    ' ',
    tripid.indexOf(' ', tripid.indexOf(' ') + 1) + 1,
  );
  let date = dateEnd
    ? tripid.substring(dateStart, dateEnd + 5)
    : 'No match found';
  const ImageHandle = () => {
    (async () => {
      await axios
        .post(backendUrl + 'UserTripInfo/updateUserTripEndDetails', {
          tripID: userId + '_' + date,
          endTime: time,
          endkilometer: endkm,
          endVehicleImageUrl: ImageUrl,
        })
        .then(function (res) {
          console.log(res.data, 'data send successfully');
          storeDataTripValue();
        })
        .catch(function (error) {
          console.log(error);
        });
    })();
  };
  console.log(vehicle);

  useEffect(() => {
    const timer = setTimeout(() => {
      axios
        .get(backendUrl + 'UserTripInfo/getUserTripInfo', {
          params: {
            tripID: userId + '_' + date,
          },
        })
        .then(response => {
          console.log('data', response.data.res_data);
          setVehicle(response.data.res_data.vehicleNumber);
          setStartkm(response.data.res_data.startKilometer);
        })
        .catch(error => {
          console.log(error, 'error');
        });
    }, 1000);
    return () => clearTimeout(timer);
  }, [userId]);

  return (
    <NativeBaseProvider>
      <Box flex={1} bg="#004aad" alignItems="center" pt={'4%'}>
        <Modal
          isOpen={modalVisible}
          onClose={() => setModalVisible(false)}
          size="lg">
          <Modal.Content maxWidth="350">
            <Modal.CloseButton />
            <Modal.Header />
            <Modal.Body>
              <View style={{alignSelf: 'center', marginVertical: 5}}>
                <Image
                  source={{uri: ImageUrl}}
                  style={{width: 400, height: 500}}
                  alt="image not shown"
                />
              </View>
            </Modal.Body>
          </Modal.Content>
        </Modal>
        <Box
          justifyContent="space-between"
          py={10}
          px={6}
          bg="#fff"
          rounded="xl"
          width={'90%'}
          maxWidth="100%"
          _text={{fontWeight: 'medium'}}>
          <VStack space={6}>
            <Input
              disabled
              selectTextOnFocus={false}
              editable={false}
              backgroundColor="gray.300"
              value={vehicle}
              size="lg"
              type={'number'}
              placeholder="Vehicle Number"
            />

            <Input
              selectTextOnFocus={false}
              editable={false}
              disabled
              backgroundColor="gray.300"
              value={startkm}
              size="lg"
              type={'number'}
              placeholder="Start Km"
            />

            <Input
              value={endkm}
              keyboardType="numeric"
              onChangeText={setEndkm}
              size="lg"
              type={'number'}
              placeholder="Input End KMs"
            />
            {/* <Button py={3} variant='outline' title="Login"  _text={{ color: 'white', fontSize: 20 }} onPress={()=>takePhoto()}><MaterialIcons name="cloud-upload" size={22} color="gray">  Image</MaterialIcons></Button> */}
            <Button
              py={3}
              variant="outline"
              _text={{color: 'white', fontSize: 20}}
              onPress={takePhoto}>
              {uploadStatus === 'idle' && (
                <MaterialIcons name="cloud-upload" size={22} color="gray">
                  {' '}
                  Image
                </MaterialIcons>
              )}
              {uploadStatus === 'uploading' && (
                <ActivityIndicator size="small" color="gray" />
              )}
              {uploadStatus === 'done' && (
                <MaterialIcons name="check" size={22} color="green" />
              )}
              {uploadStatus === 'error' && (
                <MaterialIcons name="error" size={22} color="red" />
              )}
            </Button>
            {ImageUrl ? (
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Image
                  source={{uri: ImageUrl}}
                  style={{width: 300, height: 200}}
                  alt="image not shown"
                />
              </TouchableOpacity>
            ) : null}
            {!pendingPickup && !pendingDelivery ? (
              <Button
                backgroundColor="#004aad"
                _text={{color: 'white', fontSize: 20}}
                onPress={() => navigation.navigate('Pending Work')}>
                Pending Work
              </Button>
            ) : endkm && ImageUrl && endkm > startkm ? (
              <Button
                backgroundColor="#004aad"
                _text={{color: 'white', fontSize: 20}}
                onPress={() => ImageHandle()}>
                End Trip
              </Button>
            ) : (
              <Button
                opacity={0.5}
                disabled={true}
                backgroundColor="#004aad"
                _text={{color: 'white', fontSize: 20}}>
                End Trip
              </Button>
            )}
          </VStack>
        </Box>
        <Center>
          <Image
            style={{width: 200, height: 200}}
            source={require('../assets/logo.png')}
            alt={'Logo Image'}
          />
        </Center>
      </Box>
    </NativeBaseProvider>
  );
}

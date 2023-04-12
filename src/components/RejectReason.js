/* eslint-disable prettier/prettier */
import { Container,ArrowForwardIcon, NativeBaseProvider, Box, Image, Center } from 'native-base';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import{StyleSheet,Text,TouchableOpacity,View, ScrollView, TextInput} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GetLocation from 'react-native-get-location';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';

const Reject = ({route}) => {
  const navigation = useNavigation();
  const DriverName = 'https://bked.logistiex.com/ADupdatePrams/getUPFR';
  const [DriverData, setDriverData] = useState([]);
  const [DropDownValue, setDropDownValue] = useState('');
  const [latitude, setLatitude] = useState(0);
  const [longitude , setLongitude] = useState(0);

useEffect(() => {
  const current_location = () => {
    return GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
    })
    .then(latestLocation => {
        console.log('latest location '+JSON.stringify(latestLocation))
        return latestLocation;
    }).then(location => {
        const currentLoc = { latitude: location.latitude, longitude: location.longitude };
        setLatitude(location.latitude);
        setLongitude(location.longitude);
        return currentLoc;
    }).catch(error => {
        RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
            interval: 10000,
            fastInterval: 5000,
        })
        .then(status=>{
            if(status)
                console.log('Location enabled');
        }).catch(err=>{
        })
        return false;
    })
};
current_location();
}, []);

const datadekho = async() => {
  await fetch(DriverName)
  .then((response) => response.json()) 
  .then((json) => {
    setDriverData(json);
  })
  .catch((error) => alert(error)) 
}


const ContinueHandle = () => {
  const getUser = async () => {
    try {
      const savedUser = await AsyncStorage.getItem("user");
      const currentUser = JSON.parse(savedUser);
      await AsyncStorage.setItem("user", JSON.stringify({
        Accepted : 1 - currentUser.Accepted,
        Rejected : 1 + currentUser.Rejected
      }));
        console.log(currentUser);
        } catch (error) {
          console.log(error);
        }
    };
  getUser();
}

const submitForm = () => {
  axios.post('https://bked.logistiex.com/SellerMainScreen/postSPS', {
    clientShipmentReferenceNumber : route.params.barcode,
    feUserID: route.params.userId,
    isAccepted : "false",
    rejectionReason : DropDownValue,
    consignorCode : route.params.consignorCode,
    pickupTime : new Date().toJSON().slice(0,10).replace(/-/g,'/'),
    latitude : latitude,
    longitude : longitude,
    packagingId : "PL00000026",
    packageingStatus : 1,
    PRSNumber : route.params.PRSNumber
  })
    .then(function (response) {
      console.log(response.data, "Data has been pushed");
      ContinueHandle();
      navigation.navigate('ShipmentBarcode');
    })
    .catch(function (error) {
      console.log(error);
    });
}
    
useEffect(() => {
  datadekho();   
}, []);
    
return (
  <NativeBaseProvider>
    <Box flex={1} bg="#fff">
      <TouchableOpacity>
       <View style={styles.normal}>
        <Text style={styles.text}>Reject Reason Code </Text>
       </View>
      </TouchableOpacity>
      <TouchableOpacity >
        <View style={styles.bt3}>
          <Picker
            selectedValue={DropDownValue}
            onValueChange={(value, index) => setDropDownValue(value)}
            mode="dropdown" // Android only
            style={styles.picker} >
          <Picker.Item label="Please select " value="Unknown" />
          {
            DriverData.map((d) => {
            return(
            <Picker.Item value={d.pickupFailureReasonGroupName} label={d.pickupFailureReasonName} key={d.pickupFailureReasonUserID}/>
            )
          })
          }
          </Picker>
        </View>
      </TouchableOpacity >
      <TouchableOpacity style={styles.container}>
        <TouchableOpacity  onPress={() => submitForm()} >
          <View style={styles.container}>
            <View style={styles.btn}>
              <Text style={styles.textbtn} >Submit</Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>navigation.navigate('ShipmentBarcode')}>
          <View style={styles.container}>
            <View style={styles.btn}>
              <Text style={styles.textbtn}>Cancel</Text>
            </View>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
      <Center>
        <Image style={{ width:150, height:150 }} source={require('../assets/image.png')} alt={"Logo Image"}/> 
      </Center>
   </Box>
 </NativeBaseProvider>
);
};

export default Reject;

export const styles = StyleSheet.create({
  normal:{
    fontFamily:'open sans',
    fontWeight:'normal',
    fontSize:20,
    color:'#eee',
    marginTop:27,
    paddingTop:15,
    marginLeft:10,
    marginRight:10,
    paddingBottom:15,
    backgroundColor:'#eee',
    width: 'auto',
    borderRadius:0
  },
  container:{
   flexDirection:'row',
  },
  text:{
    color:'#000',
    fontWeight:'bold',
    fontSize:18,
    textAlign:'center'
  },
  main1:{
    backgroundColor:'#004aad',
    fontFamily:'open sans',
    fontWeight:'normal',
    fontSize:20,
    marginTop:27,
    paddingTop:15,
    marginLeft:10,
    marginRight:10,
    paddingBottom:15,
    width: 'auto',
    borderRadius:20
  },
  textbox1:{
    color:'#fff',
    fontWeight:'bold',
    fontSize:18,
    width:'auto',
    flexDirection: "column",
    textAlign:'center'
  },

  textbtn:{
    alignSelf: 'center',
    color:'#fff',
    fontWeight:'bold',
    fontSize:18
  },
  btn:{
    fontFamily:'open sans',
    fontSize:15,
    lineHeight:10,
    marginTop:80,
    paddingTop:10,
    paddingBottom:10,
    backgroundColor:'#004aad',
    width:100,
    borderRadius:10,
    paddingLeft:0,
    marginLeft:60
  },
  bt3: {
    fontFamily: 'open sans',
    color:'#fff',
    fontWeight: 'bold',
    fontSize: 15,
    lineHeight: 10,
    marginTop: 10,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#004aad',
    width: 'auto',
    borderRadius: 10,
    paddingLeft: 0,
    marginLeft: 10,
    width:'95%'
  },
  picker:{
    color:'white'
  }

  });

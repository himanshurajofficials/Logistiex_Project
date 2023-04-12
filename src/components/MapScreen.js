/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from 'react';
import { Button, Image, TextInput, TouchableOpacity, PermissionsAndroid, StyleSheet, Text, View } from 'react-native';
import {enableLatestRenderer, Marker} from 'react-native-maps';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'; 
import GetLocation from 'react-native-get-location';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';


const MapScreen = ({route}) => {
  enableLatestRenderer();
  const mapRef = useRef(null);
  const [order, setOrder] = useState();
  const [texts, settexts] = useState();
  const [position, setPosition] = useState({
    latitude: route.params.latitude,
    longitude: route.params.longitude,
    latitudeDelta: 1,
    longitudeDelta: 1,
  });


useEffect(() => {
  if(route.params && route.params.latitude && route.params.longitude){
    setPosition({
      latitude : route.params.latitude,
      longitude : route.params.longitude,
      latitudeDelta : 1,
      longitudeDelta : 1
    })
  }
  else if(route.params && route.params.address){
    GetLongitudeFromAddress(route.params.address);
  }
}, []);

useEffect(() => {
  mapRef.current.animateToRegion(position, 3*1000);
},[position]);

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
    return currentLoc;
  }).then(currentLoc => {      
    setPosition({
      latitude: currentLoc.latitude,
      longitude: currentLoc.longitude,
      latitudeDelta: 1,
      longitudeDelta: 1,
    });  
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

const GetLongitudeFromAddress = (address) =>{
  var logLatApi = 'https://maps.googleapis.com/maps/api/geocode/json?address='+address+'&sensor=false&key=AIzaSyCQckZTP5hiP_wozcqIM6IU_9BgOozNJeo';
  var header = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'};
  fetch(
    logLatApi,{
    method : 'GET',
    headers : header
    }
  ).then((response) => response.json())
   .then((responseJson)=>{
      if(responseJson.status ==='OK')
        {
          setPosition({
            latitude: responseJson.results[0].geometry.location.lat,
            longitude: responseJson.results[0].geometry.location.lng,
            latitudeDelta: 1,
            longitudeDelta: 1,
          });
        }
    }).catch(err => console.log(err));
}
return(
  <View >
    <View style={styles.container}>
      <MapView
      provider={PROVIDER_GOOGLE}
      style={styles.map}
      initialRegion={position}
      showsUserLocation={true}
      ref={mapRef}
      showsMyLocationButton={true}
      followsUserLocation={true}
      showsCompass={true}
      scrollEnabled={true}
      zoomEnabled={true}
      pitchEnabled={true}
      rotateEnabled={true}>
      <Marker title='Yor are here' coordinate={position}/>
      </MapView>
    </View>
    <View style={styles.container}>
    <Button title="current location" onPress={current_location} />
    <View style={{marginBottom:550}}>
    <TextInput 
    style={styles.input}
    placeholder={route.params.address}
    onChangeText={text => settexts(text)}/>
    <Button title='search' onPress={() => GetLongitudeFromAddress(texts)} />
    </View>
  </View>
</View>
)};

export default MapScreen;
const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#004aad',
  },
  last: {
    marginTop:"100px"
  },
  input: {
    width:300,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#eee',
  },
  text: {
    color: 'white',
    textAlign: 'center',
    fontSize: 25,
  },
  ImageStyle: {
    height: 150,
    width: 150,
    resizeMode: 'center',
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    height: 700,
    width: 400,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {NativeBaseProvider, Box, Center, VStack, Button, Icon, Input, Heading, Alert, Text, Modal, ScrollView, Stack} from 'native-base';
import { Image, StyleSheet, View } from 'react-native';
import { backendUrl } from '../utils/backendUrl';

export default function StartEndDetails({navigation,route}) {
  const [data, setData] = useState();
  const [printData,setPrintData]=useState([])
  
    useEffect(() => {
        axios
          .get(backendUrl + 'UserTripInfo/getUserTripInfo', {
            params: {
              tripID: route.params.tripID,
            },
          })
          .then(response => {
            console.log('data', response.data);
            setData(response.data);
            setPrintData(response.data.res_data);
          })
          .catch(error => {
            console.log(error, 'error');
          });
    }, []);
    
    return (
      printData ?
      (
        <NativeBaseProvider>
        <ScrollView>
          <Box marginTop={1}>
            <Stack space="2" p="4">
              <Text style={{backgroundColor:'#CCCCCC', fontSize: 16, borderWidth: 1, borderColor: '#004aad', borderRadius: 5, paddingVertical: 15, textAlign:'center', display:'flex', justifyContent:'center', alignItems:'center', color:'black'}}>Start Time - {printData.startTime}</Text>
              <Text style={{backgroundColor:'#CCCCCC', fontSize: 16, borderWidth: 1, borderColor: '#004aad', borderRadius: 5, paddingVertical: 15, textAlign:'center', display:'flex', justifyContent:'center', alignItems:'center', color:'black'}}>Vehicle Number - {printData.vehicleNumber}</Text>
              <Text style={{backgroundColor:'#CCCCCC', fontSize: 16, borderWidth: 1, borderColor: '#004aad', borderRadius: 5, paddingVertical: 15, textAlign:'center', display:'flex', justifyContent:'center', alignItems:'center', color:'black'}}>Start Kilometer - {printData.startKilometer}</Text>
              <Text style={{backgroundColor:'#CCCCCC', fontSize: 16, borderWidth: 1, borderColor: '#004aad', borderRadius: 5, paddingVertical: 15, textAlign:'center', display:'flex', justifyContent:'center', alignItems:'center', color:'black'}}>End Kilometer - {printData.endkilometer}</Text>
            </Stack>
            <View style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}} >
              <Image style={{height:200, width:"90%", borderRadius: 5}} source={{uri : printData.startVehicleImageUrl}} alt="image base" />
              <Text bold position="absolute" color="coolGray.50" top="0" m="4" bgColor='#004aad'>Start vehicle</Text>
              <Image marginTop={15} style={{height:200, width:"90%", borderRadius: 5}} source={{uri : printData.endVehicleImageUrl}} alt="image base" />
              <Text bold position="absolute" color="coolGray.50" top="40" m="20">End vehicle</Text>
            </View>
          </Box>
          <Center>
            <Image style={{ width: 150, height: 100 }} source={require('../assets/image.png')} alt={"Logo Image"} />
          </Center>
        </ScrollView>              
      </NativeBaseProvider>
      ) : (
        <NativeBaseProvider>
          <Text>Loading</Text>
        </NativeBaseProvider>
      )
    );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
  },
  stretch: {
    width: 170,
    height: 200,
    resizeMode: 'stretch',
  },
});
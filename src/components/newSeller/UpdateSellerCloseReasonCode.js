import { NativeBaseProvider, Box, Image, Center, Button, Modal, Input} from 'native-base';
import {StyleSheet, ScrollView, View} from 'react-native';
import {DataTable, Searchbar, Text, Card} from 'react-native-paper';
import {openDatabase} from 'react-native-sqlite-storage';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
const db = openDatabase({name: 'rn_sqlite'});

const UpdateSellerCloseReasonCode = ({route}) => {

    // const [data, setData] = useState([]);
    const [selected,setSelected]=useState('Select Exception Reason');
    const navigation = useNavigation();
    const [showCloseBagModal, setShowCloseBagModal] = useState(false);
    let data = [
        { value: 'Select Exception Reason', label: 'Select Exception Reason' },
        { value: 'Out of Capacity', label: 'Out of Capacity' },
        { value: 'Seller Holiday', label: 'Seller Holiday' },
      ];
    
return (
  <NativeBaseProvider>
    

    <Box flex={1} bg="#fff"  width="auto" maxWidth="100%">
      
      <ScrollView style={styles.homepage} showsVerticalScrollIndicator={true} showsHorizontalScrollIndicator={false}>


      <View style={{width: '100%', flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', marginTop: 20, marginBottom: 20 }}>
            <Button w="100%" size="lg" bg="#D3D3D3" >Close Pickup Reason Code</Button>
          </View>

      <View style={{width: '90%', flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', marginTop: 20 }}>
            <Button w="100%" size="lg" bg="#004aad" >Seller Not Avaiable</Button>
          </View>

          <View style={{width: '90%', flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', marginTop: 20 }}>
            <Button w="100%" size="lg" bg="#004aad" >Address Not Found</Button>
          </View>

          <View style={{width: '90%', flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', marginTop: 20 }}>
            <Button w="100%" size="lg" bg="#004aad" >Shipment Not Ready</Button>
          </View>

          <View style={{width: '90%', flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', marginTop: 20 }}>
            <Button w="100%" size="lg" bg="#004aad" >Could Not Attempt</Button>
          </View>
        
      </ScrollView>
      <View style={{width: '90%', flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', marginTop: 10 }}>
            <Button w="40%" size="lg" bg="#004aad" >Submit</Button>
          </View>
      <Center>
          <Image style={{ width:150, height:150}} source={require('../../assets/image.png')} alt={'Logo Image'} />
      </Center>
    </Box>
    </NativeBaseProvider>
  );
};
export default UpdateSellerCloseReasonCode;
export const styles = StyleSheet.create({

    container112: {
        justifyContent: 'center',
    },
    tableHeader: {
        backgroundColor: '#004aad',
        alignItems: 'flex-start',
        fontFamily: 'open sans',
        fontSize: 15,
        color: 'white',
        margin: 1,
    },
    container222: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
        backgroundColor: 'rgba(0,0,0,0.2 )',
    },
    normal: {
        fontFamily: 'open sans',
        fontWeight: 'normal',
        color: '#eee',
        marginTop: 27,
        paddingTop: 15,
        paddingBottom: 15,
        backgroundColor: '#eee',
        width: 'auto',
        borderRadius: 0,
        alignContent: 'space-between',
    },
    text: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 18,
        justifyContent: 'space-between',
        paddingLeft: 20,
    },
    main: {
        backgroundColor: '#004aad',
        width: 'auto',
        height: 'auto',
        margin: 1,
    },
    textbox: {
        alignItems: 'flex-start',
        fontFamily: 'open sans',
        fontSize: 13,
        color: '#fff',
    },
    homepage: {
        margin: 10,
        // backgroundColor:"blue",
    },
    mainbox: {
        width: '98%',
        height: 40,
        backgroundColor: 'lightblue',
        alignSelf: 'center',
        marginVertical: 15,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.44,
        shadowRadius: 10.32,
        elevation: 1,
    },
    innerup: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: 'blue',
    },
    innerdown: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    fontvalue: {
        fontWeight: '300',
        flex: 1,
        fontFamily: 'open sans',
        justifyContent: 'center',
    },
    fontvalue1: {
        fontWeight: '700',
        marginTop: 10,
        marginLeft: 100,
        marginRight: -10,
    },
    searchbar: {
        width: '95%',
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 1,
        marginLeft: 10,
        marginRight: 10,
    },
    bt1: {
        fontFamily: 'open sans',
        fontSize: 15,
        lineHeight: 0,
        marginTop: 0,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#004aad',
        width: 110,
        borderRadius: 10,
        paddingLeft: 0,
        marginLeft: 15,
        marginVertical: 0,
    },
    bt2: {
        fontFamily: 'open sans',
        fontSize: 15,
        lineHeight: 0,
        marginTop: -45,
        paddingTop: 10,
        paddingBottom: 8,
        backgroundColor: '#004aad',
        width: 110,
        borderRadius: 10,
        paddingLeft: 0,
        marginLeft: 235,
        marginVertical: 0,
    },
    btnText: {
        alignSelf: 'center',
        color: '#fff',
        fontSize: 15,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 0,
    },
});


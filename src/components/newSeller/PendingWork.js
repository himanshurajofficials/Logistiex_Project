import { NativeBaseProvider, Box, Image, Center, Button, Modal, Input, Icon} from 'native-base';
import {StyleSheet, ScrollView, View} from 'react-native';
import {DataTable, Searchbar, Text, Card} from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {openDatabase} from 'react-native-sqlite-storage';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
const db = openDatabase({name: 'rn_sqlite'});
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const PendingWork = ({route}) => {
    const navigation = useNavigation();
    const [pendingPickup, setPendingPickup] = useState(0);
    const [pendingDelivery, setPendingDelivery] = useState(0);
    const [data, setData] = useState([]);
    const [userId, setUserId] = useState('');
    const [DropDownValue, setDropDownValue] = useState(null);
    const [DropDownValue1, setDropDownValue1] = useState(null);
    const [rejectStage, setRejectStage] = useState(null);
    const [CloseData, setCloseData] = useState([]);
    const [CloseDataD, setCloseDataD] = useState([]);
    const [NotAttemptData, setNotAttemptData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible2, setModalVisible2] = useState(false);
    const [modalVisible3, setModalVisible3] = useState(false);
    const [modalVisible4, setModalVisible4] = useState(false);
    const [displayData, setDisplayData] = useState({});
    const [keyword, setKeyword] = useState('');
    const [MM,setMM] = useState(0);
    const getUserId = async () => {
      try {
        const value = await AsyncStorage.getItem('@storage_Key');
        if (value !== null) {
          const data = JSON.parse(value);
          setUserId(data.userId)
        } else {
          setUserId('')
        }
      } catch (e) {
        console.log(e);
      }
    }
    useEffect(() => {
      getUserId();
    }, []);

    const DisplayData = async () => {
      closePickup11();
      closeDelivery();
    };
    
    
    const closePickup11 = () => {
      db.transaction(tx => {
        tx.executeSql('SELECT * FROM ClosePickupReasons', [], (tx1, results) => {
          let temp = [];
          console.log(results.rows.length);
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(results.rows.item(i));
          }
          setCloseData(temp);
        });
      });
    };
    const closeDelivery = () => {
      db.transaction(tx => {
        tx.executeSql('SELECT * FROM CloseDeliveryReasons', [], (tx1, results) => {
          let temp = [];
          console.log(results.rows.length);
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(results.rows.item(i));
          }
          setCloseDataD(temp);
        });
      });
    };
    const DisplayData2 = async () => {
      NotAttemptReasons11();
    };
  
    const NotAttemptReasons11 = () => {
      db.transaction(tx => {
        tx.executeSql('SELECT * FROM NotAttemptReasons', [], (tx1, results) => {
          let temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(results.rows.item(i));
          }
          setNotAttemptData(temp);
        });
      });
    };
  
    useEffect(() => {
      DisplayData();
    }, []);
  
    useEffect(() => {
      DisplayData2();
    }, []);
      useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
          loadDetails();
        });
        return unsubscribe;
      }, [navigation]);
      
      
      const loadDetails = () => {
        db.transaction(tx => {
          tx.executeSql('SELECT * FROM SyncSellerPickUp', [], (tx1, results) => {
            let temp = [];
            var m = 0;
            for (let i = 0; i < results.rows.length; ++i) {
              const newData = {};
              temp.push(results.rows.item(i));
              // var consignorcode=results.rows.item(i).consignorCode;
              var consignorLatitude=results.rows.item(i).consignorLatitude;
    console.log(consignorLatitude);
              db.transaction(tx => {
                db.transaction(tx => {
                  tx.executeSql(
                    'SELECT * FROM SellerMainScreenDetails where shipmentAction="Seller Pickup" AND consignorCode=? AND status IS NULL',
                    [results.rows.item(i).consignorCode],
                    (tx1, results11) => {
                      tx.executeSql(
                        'SELECT * FROM SellerMainScreenDetails where shipmentAction="Seller Delivery" AND consignorCode=? AND status IS NULL',
                        [results.rows.item(i).consignorCode],
                        (tx1, results22) => {
                          setMM(MM + results22.rows.length);
                          newData[results.rows.item(i).consignorCode] = {
                            consignorName: results.rows.item(i).consignorName,
                            consignorLatitude: results.rows.item(i).consignorLatitude,
                            consignorLongitude: results.rows.item(i).consignorLongitude,
                            forward: results11.rows.length,
                            reverse: results22.rows.length,
                          };
                          console.log(newData);
                          if (newData != null) {
                            setDisplayData(prevData => ({
                              ...prevData,
                              ...newData,
                            }));
                          }
                        },
                      );
                    },
                  );
                });
              });
    
            }
            setData(temp);
          });
        });
      };

    useEffect(() => {
        (async () => {
            loadDetails();
        })();
    }, []);

    const displayData11 = Object.keys(displayData)
    .filter(sealID => sealID.toLowerCase().includes(keyword.toLowerCase()))
    .reduce((obj, key) => {
      obj[key] = displayData[key];
      return obj;
    }, {});
          
return (
  <NativeBaseProvider>
    <Box flex={1} bg="#fff"  width="auto" maxWidth="100%">
      <ScrollView style={styles.homepage} showsVerticalScrollIndicator={true} showsHorizontalScrollIndicator={false}>
        <Card>
          <DataTable>
            <DataTable.Header style={{height:'auto', backgroundColor: '#004aad', borderTopLeftRadius: 5, borderTopRightRadius: 5}} >
              <DataTable.Title style={{flex: 1.2}}><Text style={{ textAlign: 'center', color:'white'}}>Seller Name</Text></DataTable.Title>
              <DataTable.Title style={{flex: 1.2}}><Text style={{ textAlign: 'center', color:'white'}}>Pending Pickups</Text></DataTable.Title>
              <DataTable.Title style={{flex: 1.2}}><Text style={{ textAlign: 'center', color:'white'}}>Pending Deliveries</Text></DataTable.Title>
            </DataTable.Header>
            {displayData && data.length > 0 && Object.keys(displayData11).map((consignorCode, index) => (
    (displayData11[consignorCode].forward > 0 || displayData11[consignorCode].reverse > 0) &&
    <View>
      
        <DataTable.Row style={{ height: 'auto', backgroundColor: '#eeeeee', borderBottomWidth: 1, borderWidth: 2, borderColor: 'white'}}>
        <DataTable.Cell style={{ flex: 1.7 }} key={consignorCode}><Text style={styles.fontvalue}>{displayData11[consignorCode].consignorName}</Text></DataTable.Cell>
        <DataTable.Cell style={{ flex: 1, marginRight: 50 }} key={consignorCode}><Text style={styles.fontvalue}>{displayData11[consignorCode].forward}</Text></DataTable.Cell>
        <DataTable.Cell style={{ flex: 1, marginRight: -70 }} key={consignorCode}><Text style={styles.fontvalue}>{displayData11[consignorCode].reverse}</Text></DataTable.Cell>
      </DataTable.Row>
      {displayData11[consignorCode].forward>0  && 
        <Button
          leftIcon={
            <Icon
              color="white"
              as={<MaterialIcons name="close-circle-outline" />}
              size="sm"
            />
          }
          onPress={() => navigation.navigate('NotPicked',{consignorCode:consignorCode, 
            consignorLatitude:displayData11[consignorCode].consignorLatitude,
          consignorLongitude:displayData11[consignorCode].consignorLongitude,
          userId:userId})}
          style={{backgroundColor: '#004aad', width: '90%', marginTop: 10, marginLeft: 20}}
        >
          Close Pickup
        </Button>
      }
      { displayData11[consignorCode].reverse>0 &&
        <Button
          leftIcon={
            <Icon
              color="white"
              as={<MaterialIcons name="close-circle-outline" />}
              size="sm"
            />
          }
          onPress={() => navigation.navigate('NotDelivered',{consignorCode:consignorCode, 
            consignorLatitude:displayData11[consignorCode].consignorLatitude,
          consignorLongitude:displayData11[consignorCode].consignorLongitude,
          userId:userId})}
          style={{backgroundColor: '#004aad', width: '90%', marginTop: 10, marginLeft: 20}}
        >
          Close Delivery
        </Button>
      }
      {/* {displayData11[consignorCode].forward >0 && displayData11[consignorCode].consignorName >0 &&
      <View style={{flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'center', marginTop: 10 }}>
        <Button
          leftIcon={
            <Icon
              color="white"
              as={<MaterialIcons name="close-circle-outline" />}
              size="sm"
            />
          }
          onPress={() => {
            setModalVisible(true); 
          }}
          style={{backgroundColor: '#004aad', width: '48%', marginTop: -10, marginLeft: 20}}
        >
          Close Pickup
        </Button>
        <Button
          leftIcon={
            <Icon
              color="white"
              as={<MaterialIcons name="close-circle-outline" />}
              size="sm"
            />
          }
          onPress={() => {
            setModalVisible3(true); 
          }}
          style={{backgroundColor: '#004aad', width: '48%', marginTop: -10, marginLeft: 20}}
        >
          Close Delivery
        </Button>
      </View>
        
      } */}
    </View>
  ))}
          </DataTable>
        </Card>
      </ScrollView>
      <View style={{width: '90%', flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'center', marginTop: 10 }}>
            <Button w="48%" size="lg" bg="#004aad" onPress={()=>navigation.navigate('Main')}>Dashboard</Button>
            <Button w="48%" size="lg" bg="#004aad" onPress={()=>navigation.navigate('MyTrip')} >Close Trip</Button>
          </View>
      <Center>
          <Image style={{ width:150, height:150}} source={require('../../assets/image.png')} alt={'Logo Image'} />
      </Center>
    </Box>
    </NativeBaseProvider>
  );
};
export default PendingWork;
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


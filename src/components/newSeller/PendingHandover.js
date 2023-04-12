/* eslint-disable prettier/prettier */
import { NativeBaseProvider, Box, Image, Center, Button, Modal, Input} from 'native-base';
import {StyleSheet, ScrollView, View,ToastAndroid} from 'react-native';
import {DataTable, Searchbar, Text, Card} from 'react-native-paper';
import {openDatabase} from 'react-native-sqlite-storage';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
const db = openDatabase({ name: 'rn_sqlite' });
import GetLocation from 'react-native-get-location';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import { backendUrl } from '../../utils/backendUrl';

const PendingHandover = ({route}) => {

    // const [data, setData] = useState([]);
    const [selected,setSelected]=useState('Select Exception Reason');
    const navigation = useNavigation();

    const [data, setData] = useState([]);
    
    const [displayData, setDisplayData] = useState({});
    // const navigation = useNavigation();
  
    const [keyword, setKeyword] = useState('');
    const [expected11, setExpected11] = useState(0);
    const [rejected11, setRejected11] = useState(0);

    const [modalVisible, setModalVisible] = useState(false);
    const [DropDownValue, setDropDownValue] = useState('');
    const [totalPending,setTotalPending] = useState(0);
    const [consignorCode, setConsignorCode] = useState('');
    const [showCloseBagModal, setShowCloseBagModal] = useState(false);
    const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);


  const [userId, setUserID] = useState('');

  const getUserId = async () => {
    try {
      const value = await AsyncStorage.getItem('@storage_Key');
      if (value !== null) {
        const data = JSON.parse(value);
        setUserID(data.userId);
      } else {
        setUserID('');
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getUserId();
  }, []);


  useEffect(() => {
    current_location();
  }, []);

  const current_location = () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 10000,
    })
      .then(location => {
        setLatitude(location.latitude);
        setLongitude(location.longitude);
      })
      .catch(error => {
        RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
          interval: 10000,
          fastInterval: 5000,
        })
          .then(status => {
            if (status) {
              console.log('Location enabled');
            }
          })
          .catch(err => {
            console.log(err);
          });
        console.log('Location Lat long error', error);
      });
  };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
          loadDetails();
          loadDetails112();
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
              // var consignorName=results.rows.item(i).consignorName;
    
              db.transaction(tx => {
                db.transaction(tx => {
                  tx.executeSql(
                    'SELECT * FROM SellerMainScreenDetails where shipmentAction="Seller Delivery" AND consignorCode=? ',
                    [results.rows.item(i).consignorCode],
                    (tx1, results11) => {
                      //    console.log(results11,'1',results11.rows.length);
                      //    var expected=results11.rows.length;
                      tx.executeSql(
                        'SELECT * FROM SellerMainScreenDetails where shipmentAction="Seller Delivery" AND consignorCode=? AND handoverStatus IS  NULL',
                        [results.rows.item(i).consignorCode],
                        (tx1, results22) => {
                          // console.log(results22,'2',results22.rows.length);
                          // var scanned=results.rows.length;
                          newData[results.rows.item(i).consignorCode] = {
                            consignorName: results.rows.item(i).consignorName,
                            expected: results11.rows.length,
                            pending: results22.rows.length,
                          };
                          console.log(newData);
                          if (newData != null) {
                            setDisplayData(prevData => ({
                              ...prevData,
                              ...newData,
                            }));
                          }
                          // if (i === (results.rows.length - 1) && MM + results22.rows.length === 0){
                          //   tx.executeSql('DROP TABLE IF EXISTS closeHandoverBag1', []);
                          //   AsyncStorage.setItem('acceptedItemData11','');}
                        },
                      );
                    },
                  );
                });
              });
    
            }
            // if (MM === 0 && displayData != null){
            //   tx.executeSql('DROP TABLE IF EXISTS closeHandoverBag1', []);
            //   AsyncStorage.setItem('acceptedItemData11','');}
            setData(temp);
          });
        });
      };
    //   useEffect(() => {
    //     loadDetails()
    //   }, [])
    
    
      const displayData11 = Object.keys(displayData)
        .filter(sealID => sealID.toLowerCase().includes(keyword.toLowerCase()))
        .reduce((obj, key) => {
          obj[key] = displayData[key];
          return obj;
        }, {});

    let data11 = [
        { value: 'Out of Capacity', label: 'Out of Capacity' },
        { value: 'Seller Holiday', label: 'Seller Holiday' },
        { value: 'Shipment Not Traceable', label: 'Shipment Not Traceable' },
      ];
      function handleButtonPress(item) {
        setDropDownValue(item);
      }
      const pendingHandover11 = ()=>{
        console.log("ok"+consignorCode,DropDownValue,DropDownValue,
        new Date().valueOf(),
        latitude,
        longitude,
        consignorCode);
        let time11=parseInt(new Date().valueOf(), 10);
        const DropDownValue112=DropDownValue;
        db.transaction(tx => {
          tx.executeSql(
            'SELECT * FROM SellerMainScreenDetails where shipmentAction="Seller Delivery" AND consignorCode=? ',
            [consignorCode],
            (tx1, results111) => {


              axios.post(backendUrl + 'SellerMainScreen/closeHandover', {
                runsheetNo: results111.rows.item(0).runSheetNumber,
                expected: expected11,
                accepted: (expected11-rejected11),
                rejected: rejected11,
                feUserID: userId,
                receivingTime: time11,
                latitude: latitude,
                longitude: longitude,
                consignorCode: consignorCode,
                rejectReason: DropDownValue112,
              })
                .then(response => {
                  console.log('Response close handover:', response.data);
                })
                .catch(error => {
                  console.error('Error:', error);
                });



            },
          );
        });
        db.transaction(tx => {
            tx.executeSql(
              'UPDATE SellerMainScreenDetails SET handoverStatus="pendingHandover" , rejectionReasonL1=?, eventTime=?, latitude=?, longitude=? WHERE shipmentAction="Seller Delivery" AND handoverStatus IS Null And consignorCode=?',
              [DropDownValue,
                time11,
                latitude,
                longitude,
                consignorCode],
              (tx1, results) => {
                let temp = [];
                // console.log(tx1);
                console.log("Not Picked Reason",DropDownValue);
                console.log('Results',results.rowsAffected);
                // console.log(results);
                if (results.rowsAffected > 0) {
                  console.log('notPicked done');

                  loadDetails();
                  loadDetails112();
                } else {
                  console.log('notPicked not done/already done');
                }
                setDropDownValue('');
                // console.log(results.rows.length);
                for (let i = 0; i < results.rows.length; ++i) {
                  temp.push(results.rows.item(i));
                }
                // console.log("Data updated: \n ", JSON.stringify(temp, null, 4));
              },
            );
          });
      }
useEffect(() => {
loadDetails112();
}, []);
      const loadDetails112 = () => {

        db.transaction(tx => {
          tx.executeSql(
            'SELECT * FROM SellerMainScreenDetails where shipmentAction="Seller Delivery"  AND handoverStatus IS NULL',
            [],
            (tx1, results) => {
              setTotalPending(results.rows.length);
            },
          );
        });
       
};
    
return (
  <NativeBaseProvider>
    <Box flex={1} bg="#fff"  width="auto" maxWidth="100%">
      <ScrollView style={styles.homepage} showsVerticalScrollIndicator={true} showsHorizontalScrollIndicator={false}>
        <Card>
          <DataTable>
            <DataTable.Header style={{height:'auto', backgroundColor: '#004aad', borderTopLeftRadius: 5, borderTopRightRadius: 5}} >
              <DataTable.Title style={{flex: 1.2}}><Text style={{ textAlign: 'center', color:'white'}}>Seller Name</Text></DataTable.Title>
              <DataTable.Title style={{flex: 1.2}}><Text style={{ textAlign: 'center', color:'white'}}>Expected Deliveries</Text></DataTable.Title>
              <DataTable.Title style={{flex: 1.2}}><Text style={{ textAlign: 'center', color:'white'}}>Pending Shipments</Text></DataTable.Title>
            </DataTable.Header>
              {/* <DataTable.Row>
                <DataTable.Cell style={{flex: 1.7}}><Text style={styles.fontvalue} >{route.params.consignorName}</Text></DataTable.Cell>
                <DataTable.Cell style={{flex: 1}}><Text style={styles.fontvalue} >{route.params.expected}</Text></DataTable.Cell>
                <DataTable.Cell style={{flex: 1}}><Text style={styles.fontvalue} >{0}</Text></DataTable.Cell>
              </DataTable.Row> */}


{displayData && data.length > 0
                ? Object.keys(displayData11).map((consignorCode, index) =>
                    displayData11[consignorCode].pending > 0 ? (<>
                        <DataTable.Row
                        style={{
                          height: 'auto',
                          backgroundColor: '#eeeeee',
                          borderBottomWidth: 1,
                        }}
                        key={consignorCode}>
                        <DataTable.Cell style={{flex: 1.7}}>
                          <Text style={styles.fontvalue}>
                            {displayData11[consignorCode].consignorName}
                          </Text>
                        </DataTable.Cell>

                        <DataTable.Cell style={{flex: 1, marginRight: 5 }}>
                          <Text style={styles.fontvalue}>
                            {displayData11[consignorCode].expected}
                          </Text>
                        </DataTable.Cell>
                        <DataTable.Cell style={{flex: 1, marginRight: -45}}>
                          <Text style={styles.fontvalue}>
                            {displayData11[consignorCode].pending}
                          </Text>
                        </DataTable.Cell>
                        {/* <MaterialIcons name="check" style={{ fontSize: 30, color: 'green', marginTop: 8 }} /> */}
                      </DataTable.Row>
                      <Button title="Pending Handover" onPress={() =>{setConsignorCode(consignorCode); setExpected11(displayData11[consignorCode].expected);setRejected11(displayData11[consignorCode].pending);setModalVisible(true)}} w="100%" size="lg" bg="gray.300" mb={4} mt={4}>Select Exception Reason</Button>
                      {/* <Modal isOpen={modalVisible} onClose={() => {setModalVisible(false); setDropDownValue('');}} size="lg">
        <Modal.Content maxWidth="350">
          <Modal.CloseButton />
          <Modal.Header>Pending Handover Reason</Modal.Header>
          <Modal.Body>
          {data11.map((d) => (
            <Button key={d.value} flex="1" mt={2}  marginBottom={1.5} marginTop={1.5} title={d.value} style={{backgroundColor: d.value === DropDownValue ? '#6666FF' : '#C8C8C8'}} onPress={() => handleButtonPress(d.value)} >
            <Text style={{color:DropDownValue == d.value ? 'white' : 'black'}}>{d.value}</Text></Button>
            ))}
            <Button flex="1" mt={2} bg="#004aad" marginBottom={1.5} marginTop={1.5} onPress={() => {pendingHandover11(); setModalVisible(false);}} >
            Submit</Button>
          </Modal.Body>
        </Modal.Content>
      </Modal> */}

                      {/* <View>
                      <Picker
                      mode="dropdown"
                      selectedValue={selected}
                      onValueChange={value => setSelected(value)}
                     >
                        {data11.map(item => (
                        <Picker.Item color='black' key={item.value} label={item.label} value={item.value} />
                        ))}
                        </Picker>
                      </View> */}
                      </>
                        // null

                        )
                     : null,
                  )
                : null}
              
              {/* <View>
              <Picker
              mode="dropdown"
              selectedValue={selected}
              onValueChange={value => setSelected(value)}
             >
                {data11.map(item => (
                <Picker.Item color='black' key={item.value} label={item.label} value={item.value} />
                ))}
                </Picker>
              </View> */}
              
          </DataTable>
        </Card>
      </ScrollView>
      <Modal isOpen={modalVisible} onClose={() => {setModalVisible(false); setDropDownValue('');}} size="lg">
        <Modal.Content maxWidth="350">
          <Modal.CloseButton />
          <Modal.Header>Pending Handover Reason</Modal.Header>
          <Modal.Body>
          {data11.map((d) => (
            <Button key={d.value} flex="1" mt={2}  marginBottom={1.5} marginTop={1.5} title={d.value} style={{backgroundColor: d.value === DropDownValue ? '#6666FF' : '#C8C8C8'}} onPress={() => handleButtonPress(d.value)} >
            <Text style={{color:DropDownValue == d.value ? 'white' : 'black'}}>{d.value}</Text></Button>
            ))}
            <Button flex="1" mt={2} bg="#004aad" marginBottom={1.5} marginTop={1.5} onPress={() => {pendingHandover11(); setModalVisible(false);}} >
            Submit</Button>
          </Modal.Body>
        </Modal.Content>
      </Modal>
      <View style={{width: '90%', flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'center', marginTop: 10 }}>

          {totalPending===0 ? <Button w="48%" size="lg" bg="gray.300" onPress={()=>ToastAndroid.show("All shipments scanned",ToastAndroid.SHORT)
    } >Start Scanning</Button>:  <Button w="48%" size="lg" bg="#004aad" onPress={()=>navigation.navigate('HandoverShipmentRTO')}>Start Scanning</Button>}
           {totalPending===0 ? 
           <Button w="48%" size="lg" bg="#004aad" onPress={()=>navigation.navigate('HandOverSummary')} >Close Handover</Button>
        :    <Button w="48%" size="lg" bg="gray.300" onPress={()=>ToastAndroid.show("All shipments not scanned",ToastAndroid.SHORT)
    } >Close Handover</Button>
        }
          </View>
      <Center>
          <Image style={{ width:150, height:150}} source={require('../../assets/image.png')} alt={'Logo Image'} />
      </Center>
    </Box>
    </NativeBaseProvider>
  );
};
export default PendingHandover;
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


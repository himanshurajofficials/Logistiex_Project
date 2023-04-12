/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  NativeBaseProvider,
  Box,
  Image,
  Center,
  Button,
  Modal,
  Input,
} from 'native-base';
import {
  StyleSheet,
  ScrollView,
  View,
  ToastAndroid,
  Vibration,
} from 'react-native';
import {DataTable, Searchbar, Text, Card} from 'react-native-paper';
import {openDatabase} from 'react-native-sqlite-storage';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNBeep from 'react-native-a-beep';
const db = openDatabase({name: 'rn_sqlite'});

const OpenBags = ({route}) => {
  const [data, setData] = useState([]);
  const navigation = useNavigation();
  const [showCloseBagModal, setShowCloseBagModal] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [consignorNames, setconsignorNames] = useState('');
  const [consignorCode, setconsignorCode] = useState('');
  const [NoShipment, setNoShipment] = useState(45);
  const [bagSeal, setBagSeal] = useState('');
  const [totalAccepted, setTotalAccepted] = useState(0);
  const [totalShipment, setTotalShipment] = useState(0);
  const [acceptedItemData, setAcceptedItemData] = useState(
    route.params.allCloseBAgData || {},
  );
  var check = acceptedItemData;
  const currentDate = new Date().toISOString().slice(0, 10);
  const loadDetails = () => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM SyncSellerPickUp', [], (tx1, results) => {
        let temp = [];
        console.log(results.rows.length);
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));
        }
        setData(temp);
        console.log(data[0].ShipmentListArray.split().length, 'data');
      });
    });
  };

  useEffect(() => {
    (async () => {
      loadDetails();
    })();
  }, []);

  // useEffect(() => {
  //        AsyncStorage.setItem('acceptedItemData11',JSON.stringify(acceptedItemData));
  // }, [ acceptedItemData && bagSeal]);

  const searched = keyword1 => c => {
    let f = c.consignorName;
    return f.includes(keyword1);
  };

  const CloseBagFunction = (consignorCode, consignorName) => {
    setShowCloseBagModal(true),
      setNoShipment(45),
      setconsignorCode(consignorCode),
      setconsignorNames(consignorName);
  };

  function CloseBag() {
    console.log(bagId);
    console.log(bagSeal);
    setBagId('');
    setBagIdNo(bagIdNo + 1);
  }

  const onSuccess11 = e => {
    Vibration.vibrate(100);
    RNBeep.beep();
    console.log(e.data, 'sealID');
    // getCategories(e.data);
    setBagSeal(e.data);
  };

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    fetchTableData();
  }, [acceptedItemData]);
  useEffect(() => {
    // const saveAcceptedItemData = async () => {
    // try {
    AsyncStorage.setItem(
      'acceptedItemData11',
      JSON.stringify(acceptedItemData),
    );
    // } catch (error) {
    console.log('aaaa', acceptedItemData);
    // }
    // };

    // saveAcceptedItemData();
  }, [acceptedItemData]);
  const fetchTableData = () => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM closeHandoverBag1', [], (tx, results) => {
        const len = results.rows.length;
        const rows11 = [];

        for (let i = 0; i < len; i++) {
          // const row = results.rows.item(i);
          // const shipmentsCount = JSON.parse(row.acceptedbarcode).length;
          rows11.push({
            consignorName: results.rows.item(i).consignorName,
            shipmentsCount: JSON.parse(results.rows.item(i).AcceptedList)
              .length,
            bagId11: results.rows.item(i).bagId,
          });
        }
        console.log(JSON.stringify(rows11, null, 4));
        setTableData(rows11);
      });
    });
  };
  useEffect(() => {
    fetchTableData();
    console.log('fdfdd11 ', acceptedItemData);
  }, []);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadDetails112();
      // loadAcceptedItemData12();
    });
    return unsubscribe;
  }, [navigation]);
  useEffect(() => {
    loadDetails112();
    // loadAcceptedItemData12();
  }, []);
  // const loadAcceptedItemData12 = async () => {

  //   AsyncStorage.getItem('acceptedItemData11')
  //   .then(data99 => {
  //     // setAcceptedItemData(JSON.parse(data99));
  //     console.log("ghghg11",data99);
  //     console.log("ghghg11",acceptedItemData);
  //   })
  //   .catch(e => {
  //   console.log(e);
  //   });
  // };

  const loadDetails112 = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM SellerMainScreenDetails where shipmentAction="Seller Delivery"  AND handoverStatus IS NOT NULL',
        [],
        (tx1, results) => {
          setTotalAccepted(results.rows.length);
        },
      );
    });

    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM SellerMainScreenDetails where shipmentAction="Seller Delivery" ',
        [],
        (tx1, results) => {
          setTotalShipment(results.rows.length);
        },
      );
    });
  };

  function CloseBag(consCode) {
    var consName = acceptedItemData[consignorCode].consignorName;
    console.log(bagSeal);
    // console.log(acceptedArray);
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM closeHandoverBag1 Where consignorCode=? AND bagDate=? ',
        [consCode, currentDate],
        (tx, results) => {
          console.log(results.rows.length);
          console.log(results);
          tx.executeSql(
            'INSERT INTO closeHandoverBag1 (bagSeal, bagId, bagDate, AcceptedList,status,consignorCode,consignorName) VALUES (?, ?, ?, ?,?,?,?)',
            [
              bagSeal,
              consCode + '-' + currentDate + '-' + (results.rows.length + 1),
              currentDate,
              JSON.stringify(acceptedItemData[consCode].acceptedItems11),
              'pending',
              consCode,
              consName,
            ],
            (tx, results11) => {
              console.log('Row inserted successfully');
              // setAcceptedArray([]);
              // acceptedItemData[consCode] = null;
              setAcceptedItemData(
                Object.fromEntries(
                  Object.entries(acceptedItemData).filter(
                    ([k, v]) => k !== consCode,
                  ),
                ),
              );
              // .then(
              //   AsyncStorage.setItem('acceptedItemData11',JSON.stringify(acceptedItemData))
              // )
              // .catch(e => {
              // console.log(e);
              // });
              // setTimeout(()=> AsyncStorage.setItem('acceptedItemData11',JSON.stringify(acceptedItemData)),1000);
              setBagSeal('');
              console.log(
                ' Data Added to local db successfully Handover closeBag',
              );
              ToastAndroid.show('Bag closed successfully', ToastAndroid.SHORT);
              console.log(results11);
              viewDetailBag();
            },
            error => {
              console.log('Error occurred while inserting a row:', error);
            },
          );
        },
        error => {
          console.log(
            'Error occurred while generating a unique bag ID:',
            error,
          );
        },
      );
    });
  }

  const viewDetailBag = () => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM closeHandoverBag1', [], (tx1, results) => {
        let temp = [];
        console.log(results.rows.length);
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));
        }
        console.log(
          'Data from Local Database Handover Bag: \n ',
          JSON.stringify(temp, null, 4),
        );
      });
    });
  };

  return (
    <NativeBaseProvider>
      <Modal
        isOpen={showCloseBagModal}
        onClose={() => setShowCloseBagModal(false)}
        size="lg">
        <Modal.Content maxWidth="350">
          <Modal.CloseButton />
          <Modal.Header>Close Bag</Modal.Header>
          <Modal.Body>
            <QRCodeScanner
              onRead={onSuccess11}
              reactivate={true}
              // showMarker={true}
              reactivateTimeout={2000}
              flashMode={RNCamera.Constants.FlashMode.off}
              ref={node => {
                this.scanner = node;
              }}
              containerStyle={{height: 116, marginBottom: '55%'}}
              cameraStyle={{
                height: 90,
                marginTop: 95,
                marginBottom: '15%',
                width: 289,
                alignSelf: 'center',
                justifyContent: 'center',
              }}
            />{' '}
            {'\n'}
            <Input
              placeholder="Enter Bag Seal"
              size="md"
              value={bagSeal}
              onChangeText={text => setBagSeal(text)}
              style={{
                width: 290,
                backgroundColor: 'white',
              }}
            />
            {/* {'\n'}
            <Input placeholder="Enter Bag Seal" size="md" onChangeText={(text)=>setBagSeal(text)} /> */}
            <Button
              flex="1"
              mt={2}
              bg="#004aad"
              onPress={() => {
                CloseBag(consignorCode);
                setShowCloseBagModal(false);
              }}>
              Submit
            </Button>
            <View style={{alignItems: 'center', marginTop: 15}}>
              <View
                style={{
                  width: '98%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  borderWidth: 1,
                  borderBottomWidth: 0,
                  borderColor: 'lightgray',
                  borderTopLeftRadius: 5,
                  borderTopRightRadius: 5,
                  padding: 10,
                }}>
                <Text style={{fontSize: 16, fontWeight: '500', color: 'black'}}>
                  Seller Code
                </Text>
                {data && data.length ? (
                  <Text
                    style={{fontSize: 16, fontWeight: '500', color: 'black'}}>
                    {consignorCode}
                  </Text>
                ) : null}
                {/* <Text style={{fontSize: 16, fontWeight: '500', color : 'black'}}>{sellerCode11}</Text> */}
              </View>
              <View
                style={{
                  width: '98%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  borderWidth: 1,
                  borderBottomWidth: 0,
                  borderColor: 'lightgray',
                  padding: 10,
                }}>
                <Text style={{fontSize: 16, fontWeight: '500', color: 'black'}}>
                  Seller Name
                </Text>
                {data && data.length ? (
                  <Text
                    style={{fontSize: 16, fontWeight: '500', color: 'black'}}>
                    {data && consignorCode && acceptedItemData[consignorCode]
                      ? acceptedItemData[consignorCode].consignorName
                      : null}
                  </Text>
                ) : null}
              </View>
              <View
                style={{
                  width: '98%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  borderWidth: 1,
                  borderBottomWidth: 1,
                  borderColor: 'lightgray',
                  borderTopLeftRadius: 5,
                  borderTopRightRadius: 5,
                  padding: 10,
                }}>
                <Text style={{fontSize: 16, fontWeight: '500', color: 'black'}}>
                  Number of Shipments
                </Text>
                {data && data.length ? (
                  <Text
                    style={{fontSize: 16, fontWeight: '500', color: 'black'}}>
                    {data &&
                    consignorCode &&
                    acceptedItemData[consignorCode] &&
                    acceptedItemData[consignorCode].acceptedItems11.length > 0
                      ? acceptedItemData[consignorCode].acceptedItems11.length
                      : null}
                  </Text>
                ) : null}
              </View>
            </View>
          </Modal.Body>
        </Modal.Content>
      </Modal>

      {/* <Modal
        isOpen={showCloseBagModal}
        onClose={() => setShowCloseBagModal(false)}
        size="lg">
        <Modal.Content maxWidth="350">
          <Modal.CloseButton />
          <Modal.Header />
          <Modal.Body>
            <Input
              placeholder="Enter Bag Seal"
              size="md"
              onChangeText={text => setBagSeal(text)}
            />
            <Button
              flex="1"
              mt={2}
              bg="#004aad"
              onPress={() => {
                setShowCloseBagModal(false),
                  navigation.navigate('PendingHandover');
              }}>
              Submit
            </Button>
            <View style={{alignItems: 'center', marginTop: 15}}>
              <View
                style={{
                  width: '98%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  borderWidth: 1,
                  borderBottomWidth: 0,
                  borderColor: 'lightgray',
                  borderTopLeftRadius: 5,
                  borderTopRightRadius: 5,
                  padding: 10,
                }}>
                <Text style={{fontSize: 16, fontWeight: '500'}}>
                  Seller Code
                </Text>
                <Text style={{fontSize: 16, fontWeight: '500'}}>
                  {consignorCode}
                </Text>
              </View>
              <View
                style={{
                  width: '98%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  borderWidth: 1,
                  borderBottomWidth: 0,
                  borderColor: 'lightgray',
                  padding: 10,
                }}>
                <Text style={{fontSize: 16, fontWeight: '500'}}>
                  Seller Name
                </Text>
                <Text style={{fontSize: 16, fontWeight: '500'}}>
                  {consignorNames}
                </Text>
              </View>
              <View
                style={{
                  width: '98%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  borderWidth: 1,
                  borderBottomWidth: 1,
                  borderColor: 'lightgray',
                  borderTopLeftRadius: 5,
                  borderTopRightRadius: 5,
                  padding: 10,
                }}>
                <Text style={{fontSize: 16, fontWeight: '500'}}>
                  Number of Shipments
                </Text>
                <Text style={{fontSize: 16, fontWeight: '500'}}>
                  {NoShipment}
                </Text>
              </View>
            </View>
          </Modal.Body>
        </Modal.Content>
      </Modal> */}

      <Box flex={1} bg="#fff" width="auto" maxWidth="100%">
        <ScrollView
          style={styles.homepage}
          showsVerticalScrollIndicator={true}
          showsHorizontalScrollIndicator={false}>
          <Card>
            <DataTable>
              <DataTable.Header
                style={{
                  height: 'auto',
                  backgroundColor: '#004aad',
                  borderTopLeftRadius: 5,
                  borderTopRightRadius: 5,
                }}>
                <DataTable.Title style={{flex: 1.2}}>
                  <Text style={{textAlign: 'center', color: 'white'}}>
                    Seller Name
                  </Text>
                </DataTable.Title>
                <DataTable.Title style={{flex: 1.2}}>
                  <Text style={{textAlign: 'center', color: 'white'}}>
                    No. of Shipment
                  </Text>
                </DataTable.Title>
                <DataTable.Title style={{flex: 0.8, paddingLeft: 10}}>
                  <Text style={{textAlign: 'center', color: 'white'}}>
                    Bag Status
                  </Text>
                </DataTable.Title>
              </DataTable.Header>
              {acceptedItemData &&
                Object.entries(acceptedItemData).map(([key, value]) => (
                  <DataTable.Row key={key}>
                    <DataTable.Cell style={{flex: 1.7}}>
                      <Text style={styles.fontvalue}>
                        {value.consignorName}
                      </Text>
                    </DataTable.Cell>
                    <DataTable.Cell style={{flex: 1}}>
                      {/* <Text style={styles.fontvalue}>{data[0].ShipmentListArray.split().length}</Text> */}
                      <Text style={styles.fontvalue}>
                        {value.acceptedItems11.length}
                      </Text>
                    </DataTable.Cell>
                    <DataTable.Cell style={{flex: 1}}>
                      <Button
                        // disabled={single.BagOpenClose === 'close' ? true : false}
                        // style={{backgroundColor: single.BagOpenClose === 'close' ? 'grey' : '#004aad', color: '#fff'}}
                        style={{backgroundColor: '#004aad', color: '#fff'}}
                        onPress={() => {
                          setShowCloseBagModal(true);
                          setconsignorCode(key);
                        }}>
                        Close Bag
                      </Button>
                    </DataTable.Cell>
                    {/* <DataTable.Cell style={{flex: 1}}><Button style={{backgroundColor:'#004aad', color:'#fff'}} onPress={
                  () => {navigation.navigate('PendingHandover',{consignorName:single.consignorName,expected:single.ReverseDeliveries})}
                  }>Close Bag</Button></DataTable.Cell> */}
                  </DataTable.Row>
                ))}

              {tableData && tableData.length > 0
                ? tableData.filter(searched(keyword)).map((single, i) => (
                    <DataTable.Row key={single.bagId11}>
                      <DataTable.Cell style={{flex: 1.7}}>
                        <Text style={styles.fontvalue}>
                          {single.consignorName}
                        </Text>
                      </DataTable.Cell>
                      <DataTable.Cell style={{flex: 1}}>
                        {/* <Text style={styles.fontvalue}>{data[0].ShipmentListArray.split().length}</Text> */}
                        <Text style={styles.fontvalue}>
                          {single.shipmentsCount}
                        </Text>
                      </DataTable.Cell>
                      <DataTable.Cell style={{flex: 1}}>
                        <Button
                          // disabled={single.BagOpenClose === 'close' ? true : false}
                          // style={{backgroundColor: single.BagOpenClose === 'close' ? 'grey' : '#004aad', color: '#fff'}}
                          style={{backgroundColor: 'gray', color: '#fff'}}
                          onPress={() => {
                            // navigation.navigate('PendingHandover',{consignorName:single.consignorName,expected:single.ReverseDeliveries});
                            ToastAndroid.show(
                              'Bag already closed',
                              ToastAndroid.SHORT,
                            );
                          }}>
                          Close Bag
                        </Button>
                      </DataTable.Cell>
                      {/* <DataTable.Cell style={{flex: 1}}><Button style={{backgroundColor:'#004aad', color:'#fff'}} onPress={
                  () => {navigation.navigate('PendingHandover',{consignorName:single.consignorName,expected:single.ReverseDeliveries})}
                  }>Close Bag</Button></DataTable.Cell> */}
                    </DataTable.Row>
                  ))
                : null}
            </DataTable>
          </Card>

          {/* {acceptedItemData &&  <View style={{width: '90%', flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'center', marginTop: 10 }}>
            <Button w="48%" size="lg" bg="#004aad" >Start Scanning</Button>
            <Button w="48%" size="lg" bg="#004aad" onPress={()=>navigation.navigate('HandOverSummary')} >Close Handover</Button>
          </View>} */}
        </ScrollView>
        {totalAccepted === totalShipment &&
        totalAccepted + totalShipment > 0 &&
        Object.keys(acceptedItemData).length === 0 ? (
          <View
            style={{
              width: '90%',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignSelf: 'center',
              marginTop: 10,
            }}>
            <Button
              w="48%"
              size="lg"
              bg="gray.300"
              onPress={() => {
                // navigation.navigate('PendingHandover',{consignorName:"single.consignorName",expected:"0"})
                ToastAndroid.show('No Pending Shipments', ToastAndroid.SHORT);
              }}>
              Pending Handover
            </Button>
            <Button
              w="48%"
              size="lg"
              bg="#004aad"
              onPress={() => navigation.navigate('HandOverSummary')}>
              Finish Handover
            </Button>
          </View>
        ) : (
          <View
            style={{
              width: '90%',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignSelf: 'center',
              marginTop: 10,
            }}>
            <Button
              w="48%"
              size="lg"
              bg="#004aad"
              onPress={() => {
                navigation.navigate('PendingHandover', {
                  consignorName: 'consignorName',
                  expected: '0',
                });
              }}>
              Pending Handover
            </Button>
            <Button
              w="48%"
              size="lg"
              bg="gray.300"
              onPress={() => {
                // navigation.navigate('HandOverSummary')
                ToastAndroid.show(
                  'All Shipments Not Scanned',
                  ToastAndroid.SHORT,
                );
              }}>
              Finish Handover
            </Button>
          </View>
        )}
        <Center>
          <Image
            style={{width: 150, height: 150}}
            source={require('../../assets/image.png')}
            alt={'Logo Image'}
          />
        </Center>
      </Box>
    </NativeBaseProvider>
  );
};
export default OpenBags;
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

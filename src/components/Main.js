/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState, Alert} from 'react';
import {
  Text,
  View,
  ScrollView,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import {Fab} from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Icon} from 'native-base';
import Lottie from 'lottie-react-native';
import {ProgressBar} from '@react-native-community/progress-bar-android';
import {
  NativeBaseProvider,
  Box,
  Button,
  Center,
  Image,
  Heading,
} from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {openDatabase} from 'react-native-sqlite-storage';
const db = openDatabase({name: 'rn_sqlite'});
import PieChart from 'react-native-pie-chart';
import {StyleSheet} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import { backendUrl } from '../utils/backendUrl';

export default function Main({navigation, route}) {
  // const userId = route.params.userId;

  const [data, setData] = useState(0);
  // const [data1, setData1] = useState(0);
  // const [data2, setData2] = useState('');

  const [spts, setSpts] = useState(0);
  const [spc, setSpc] = useState(0);
  const [spp, setSpp] = useState(0);
  const [spnp, setSpnp] = useState(0);
  const [spr, setSpr] = useState(0);

  const [shts, setShts] = useState(0);
  const [shc1, setShc1] = useState(0);
  const [shp1, setShp1] = useState(0);
  const [shnp1, setShnp1] = useState(0);
  const [shr1, setShr1] = useState(0);

  const [sdts, setSdts] = useState(0);
  const [spc1, setSpc1] = useState(0);
  const [spp1, setSpp1] = useState(0);
  const [spnp1, setSpnp1] = useState(0);
  const [spr1, setSpr1] = useState(0);
  const [SpARC, setSpARC] = useState(0);
  const [SpARC1, setSpARC1] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading1, setIsLoading1] = useState(false);
  const [tripValue, setTripValue] = useState('Start Trip');
  const [Forward, setForward] = useState(0);
  const [Reverse, setReverse] = useState(0);
  const [id, setId] = useState('');
  const [tripData, setTripData] = useState([]);
  const [loading, setLoading] = useState(true);

  const focus = useIsFocused();
  const getUserId = async () => {
    try {
      const value = await AsyncStorage.getItem('@storage_Key');
      if (value !== null) {
        const data = JSON.parse(value);
        setId(data.userId);
        fetchData(data.userId);
      } else {
        setId('');
      }
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    getUserId();
  }, []);
  let current = new Date();
  let tripid = current.toString();
  let dateStart = 0;
  let dateEnd = tripid.indexOf(
    ' ',
    tripid.indexOf(' ', tripid.indexOf(' ') + 1) + 1,
  );
  let date = dateEnd
    ? tripid.substring(dateStart, dateEnd + 5)
    : 'No match found';

  const fetchData = (id) => {
    if (id) {
      axios
        .get(backendUrl + 'UserTripInfo/getUserTripInfo', {
          params: {
            tripID: id + '_' + date,
          },
        })
        .then(response => {
          setTripData(response.data.res_data);
        })
        .catch(error => {
          console.log(error, 'error');
        });
    }
  };

  useEffect(() => {
    if (focus == true) {
      fetchData(id);
    }
  }, [focus]);
  useEffect(() => {
    if (tripData && tripData.startTime && !tripData.endTime) {
      setTripValue('End Trip');
    } else {
      setTripValue('Start Trip');
    }
  }, [tripData]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadSellerPickupDetails();
      loadHanoverDetails();
      loadSellerDeliveryDetails();
      fetchData(id);
    });
    return unsubscribe;
  }, [navigation]);

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('refresh11');
      if (value === 'refresh') {
        loadSellerPickupDetails();
        loadHanoverDetails();
        loadSellerDeliveryDetails();
        fetchData(id);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const StartValue = setInterval(() => {
      getData();
    }, 100);
    return () => clearInterval(StartValue);
  }, []);

  const loadSellerPickupDetails = async () => {
    setIsLoading(!isLoading);
    // setSpp(1);
    // setSpnp(1);
    // setSpc(1);
    // setSpr(1);
    // await AsyncStorage.setItem('refresh11', 'notrefresh');
    db.transaction(tx => {
      tx.executeSql(
        'SELECT COUNT(DISTINCT consignorCode) as count FROM SellerMainScreenDetails WHERE shipmentAction="Seller Pickup"',
        [],
        (tx1, results) => {
          setSpts(results.rows.item(0).count);
        },
      );
    });
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM SellerMainScreenDetails WHERE shipmentAction="Seller Pickup" AND status IS NULL',
        [],
        (tx1, results) => {
          setSpp(results.rows.length);
        },
      );
    });
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM SellerMainScreenDetails WHERE shipmentAction="Seller Pickup"',
        [],
        (tx1, results) => {
          setForward(results.rows.length);
        },
      );
    });

    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM SellerMainScreenDetails where shipmentAction="Seller Pickup" AND status="accepted"',
        [],
        (tx1, results) => {
          setSpc(results.rows.length);
        },
      );
    });
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM SellerMainScreenDetails where shipmentAction="Seller Pickup" AND status="accepted" OR status="rejected"',
        [],
        (tx1, results) => {
          setSpARC(results.rows.length);
        },
      );
    });
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM SellerMainScreenDetails where shipmentAction="Seller Pickup" AND status="notPicked"',
        [],
        (tx1, results) => {
          let temp = [];
          setSpnp(results.rows.length);
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(results.rows.item(i));
          }
        },
      );
    });

    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM SellerMainScreenDetails where shipmentAction="Seller Pickup" AND status="rejected"',
        [],
        (tx1, results) => {
          setSpr(results.rows.length);
          setIsLoading(false);
        },
      );
    });
    setLoading(false);
  };

  const loadHanoverDetails = async () => {
    setIsLoading(!isLoading);
    // setSpp1(1);
    // setSpnp1(1);
    // setSpc1(1);
    // setSpr1(1);
    await AsyncStorage.setItem('refresh11', 'notrefresh');
    db.transaction(tx => {
      tx.executeSql(
        'SELECT COUNT(DISTINCT consignorCode) as count FROM SellerMainScreenDetails WHERE shipmentAction="Seller Delivery"',
        [],
        (tx1, results) => {
          setShts(results.rows.item(0).count);
        },
      );
    });
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM SellerMainScreenDetails WHERE shipmentAction="Seller Delivery" AND handoverStatus IS NULL',
        [],
        (tx1, results) => {
          setShp1(results.rows.length);
        },
      );
    });
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM SellerMainScreenDetails WHERE shipmentAction="Seller Delivery" AND handoverStatus="pendingHandover"',
        [],
        (tx1, results) => {
          setShnp1(results.rows.length);
        },
      );
    });

    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM SellerMainScreenDetails where shipmentAction="Seller Delivery" AND handoverStatus="accepted" ',
        [],
        (tx1, results) => {
          let temp = [];
          setShc1(results.rows.length);
        },
      );
    });
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM SellerMainScreenDetails where shipmentAction="Seller Delivery" AND  handoverStatus="rejected"',
        [],
        (tx1, results) => {
          setShr1(results.rows.length);
        },
      );
    });
    setLoading(false);
  };

  const loadSellerDeliveryDetails = async () => {
    setIsLoading(!isLoading);
    // setSpp1(1);
    // setSpnp1(1);
    // setSpc1(1);
    // setSpr1(1);
    await AsyncStorage.setItem('refresh11', 'notrefresh');
    db.transaction(tx => {
      tx.executeSql(
        'SELECT COUNT(DISTINCT consignorCode) as count FROM SellerMainScreenDetails WHERE shipmentAction="Seller Delivery"',
        [],
        (tx1, results) => {
          setSdts(results.rows.item(0).count);
        },
      );
    });
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM SellerMainScreenDetails WHERE shipmentAction="Seller Delivery" AND handoverStatus="accepted"',
        [],
        (tx1, results) => {
          setSpp1(results.rows.length);
        },
      );
    });
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM SellerMainScreenDetails WHERE shipmentAction="Seller Delivery"',
        [],
        (tx1, results) => {
          setReverse(results.rows.length);
        },
      );
    });

    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM SellerMainScreenDetails where shipmentAction="Seller Delivery" AND status="accepted" OR  status="tagged"',
        [],
        (tx1, results) => {
          let temp = [];
          setSpc1(results.rows.length);
        },
      );
    });
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM SellerMainScreenDetails where shipmentAction="Seller Delivery" AND status="accepted" OR status="rejected"',
        [],
        (tx1, results) => {
          setSpARC1(results.rows.length);
        },
      );
    });
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM SellerMainScreenDetails where shipmentAction="Seller Delivery" AND status="notDelivered"',
        [],
        (tx1, results) => {
          let temp = [];
          setSpnp1(results.rows.length);
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(results.rows.item(i));
          }
        },
      );
    });

    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM SellerMainScreenDetails where shipmentAction="Seller Delivery" AND status="rejected"',
        [],
        (tx1, results) => {
          setSpr1(results.rows.length);
          setIsLoading(false);
        },
      );
    });
    setLoading(false);
  };

  const value = {
    Accepted: 0,
    Rejected: 0,
  };

  // const createTables = () => {
  //     db.transaction(txn => {
  //         txn.executeSql('DROP TABLE IF EXISTS categories', []);
  //         txn.executeSql('CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY AUTOINCREMENT, clientShipmentReferenceNumber VARCHAR(50), packagingId VARCHAR(50), packagingStatus VARCHAR(50), consignorCode VARCHAR(50), consignorContact VARCHAR(50), PRSNumber VARCHAR(50), ForwardPickups VARCHAR(50), ScanStatus INT(10), UploadStatus INT(10))', [], (sqlTxn, res) => { // console.log("table created successfully");
  //         }, error => {
  //             console.log('error on creating table ' + error.message);
  //         },);
  //     });
  // };

  // const addCategory = (clientShipmentReferenceNumber, packagingId, packagingStatus, consignorCode, consignorContact, PRSNumber, ForwardPickups, ScanStatus, UploadStatus) => {
  //     // console.log(clientShipmentReferenceNumber, packagingId, packagingStatus, consignorCode, consignorContact, PRSNumber, ForwardPickups, ScanStatus, UploadStatus);
  //     if (!clientShipmentReferenceNumber && !packagingId && !packagingStatus && !consignorCode && !consignorContact && !PRSNumber && !ForwardPickups && !ScanStatus && !UploadStatus) { // eslint-disable-next-line no-alert
  //         alert('Enter category');
  //         return false;
  //     }

  //     db.transaction(txn => {
  //         txn.executeSql('INSERT INTO categories (clientShipmentReferenceNumber, packagingId, packagingStatus , consignorCode, consignorContact, PRSNumber, ForwardPickups,ScanStatus,UploadStatus) VALUES (?,?,?,?,?,?,?,?,?)', [
  //             clientShipmentReferenceNumber,
  //             packagingId,
  //             packagingStatus,
  //             consignorCode,
  //             consignorContact,
  //             PRSNumber,
  //             ForwardPickups,
  //             ScanStatus,
  //             UploadStatus,
  //         ], (sqlTxn, res) => {
  //             // console.log('category added successfully');
  //         }, error => {
  //             console.log('error on adding category ' + error.message);
  //         },);
  //     });
  // };

  const storeUser = async () => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(value));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // removeUser();
    storeUser();
  }, []);

  // db.transaction(txn => {
  //     txn.executeSql('DROP TABLE IF EXISTS Sync1', []);
  //     txn.executeSql('CREATE TABLE IF NOT EXISTS Sync1(userId ID VARCHAR(30) PRIMARY KEY  ,consignorPickupsList INT(15), CustomerPickupsList VARCHAR(50))', [], (sqlTxn, res) => {
  //         console.log('table created successfully');
  //     }, error => {
  //         console.log('error on creating table ' + error.message);
  //     },);
  // });

  // db.transaction(txn => {
  //     txn.executeSql('INSERT OR REPLACE INTO Sync1 (userId ,consignorPickupsList , CustomerPickupsList) VALUES (?,?,?)', [
  //         userId, data1, data2,
  //     ], (sqlTxn, res) => {
  //         console.log('Data Added to local db successfully');
  //         console.log(res);
  //         console.log(data1 + ' ' + data2);
  //     }, error => {
  //         console.log('error on adding data ' + error.message);
  //     },);
  // });

  // const viewDetails = () => {
  //     db.transaction((tx) => {
  //         tx.executeSql('SELECT * FROM Sync1 where userId=?', [userId], (tx1, results) => {
  //             let temp = [];
  //             for (let i = 0; i < results.rows.length; ++i) {
  //                 temp.push(results.rows.item(i));
  //                 console.log(results.rows.item(i).consignorPickupsList);
  //                 setData1(results.rows.item(i).consignorPickupsList);
  //                 setData2(results.rows.item(i).CustomerPickupsList);
  //                 ToastAndroid.show('consignorPickupsList :' + results.rows.item(i).consignorPickupsList + '\n' + 'CustomerPickupsList : ' + results.rows.item(i).CustomerPickupsList, ToastAndroid.SHORT);
  //             }
  //             // console.log(temp);
  //             // console.log(tx1);
  //         });
  //     });
  // };

  // useEffect(() => {
  //     createTables();
  //     (async () => {
  //         await axios.get(`https://bked.logistiex.com/SellerMainScreen/getMSD/${
  //             route.params.userId
  //         }`).then((res) => {
  //             setData(res.data.consignorPickupsList);
  //         }, (error) => {
  //             alert(error);
  //         });
  //     })();

  //     (async () => {
  //         await axios.get(shipmentData).then((res) => {
  //             res.data.map(m => {
  //                 axios.get(`https://bked.logistiex.com/SellerMainScreen/getSellerDetails/${
  //                     m.consignorCode
  //                 }`).then((d) => {
  //                     d.data.totalPickups.map((val) => {
  //                         addCategory(val.clientShipmentReferenceNumber, val.packagingId, val.packagingStatus, m.consignorCode, m.consignorContact, m.PRSNumber, m.ForwardPickups, 0, 0);
  //                     });
  //                 });
  //             });

  //         }, (error) => {
  //             alert(error);
  //         });
  //     })();
  // }, []);

  // useEffect(() => {
  //     (async () => {
  //         await axios.get(getData).then((res) => {
  //             setData1(res.data.consignorPickupsList);
  //             setData2(res.data.CustomerPickupsList);
  //             console.log(res.data.CustomerPickupsList);
  //             console.log(res.data.consignorPickupsList);
  //             // createTables();
  //         }, (error) => {
  //             Alert.alert(error);
  //         });
  //     })();
  // }, []);
  const dashboardData = [
    {
      title: 'Seller Pickups',
      totalUsers: spts,
      pendingOrder: spp,
      completedOrder: spc,
      rejectedOrder: spr,
      notPicked: spnp,
    },
    {
      title: 'Seller Deliveries',
      totalUsers: sdts,
      pendingOrder: spp1,
      completedOrder: spc1,
      rejectedOrder: spr1,
      notPicked: spnp1,
    },
    {
      title: 'Seller Handover',
      totalUsers: shts,
      pendingOrder: shp1,
      completedOrder: shc1,
      rejectedOrder: shr1,
      notPicked: shnp1,
    },

    //  {
    //     title: 'Customer Pickups',
    //     totalUsers: 21,
    //     pendingOrder: 23,
    //     completedOrder: 123,
    //     rejectedOrder: 112,
    //     notPicked: 70,
    // }, {
    //     title: 'Customer Deliveries',
    //     totalUsers: 9,
    //     pendingOrder: 200,
    //     completedOrder: 303,
    //     rejectedOrder: 32,
    //     notPicked: 70,
    // },
  ];

  return (
    <NativeBaseProvider>
      {loading ? (
        <ActivityIndicator size="large" color="blue" style={{marginTop: 44}} />
      ) : (
        <Box flex={1} bg="gray.300">
          <ScrollView>
            <Box flex={1} bg="gray.300" p={4}>
              {dashboardData.map((it, index) => {
                if (
                  it.completedOrder !== 0 ||
                  it.pendingOrder !== 0 ||
                  it.notPicked !== 0 ||
                  it.rejectedOrder !== 0
                ) {
                  if (shp1 === 0 && shc1 !== 0) {
                    return it.title === 'Seller Pickups' ||
                      it.title === 'Seller Deliveries' ? (
                      <Box pt={4} mb="6" rounded="md" bg="white" key={index}>
                        <Box
                          w="100%"
                          flexDir="row"
                          justifyContent="space-between"
                          mb={4}
                          px={4}>
                          <Box w="45%">
                            <Heading size="sm" mb={4}>
                              {it.title}
                            </Heading>
                            <PieChart
                              widthAndHeight={120}
                              series={[
                                it.completedOrder,
                                it.pendingOrder,
                                it.notPicked,
                                it.rejectedOrder,
                              ]}
                              sliceColor={[
                                '#4CAF50',
                                '#2196F3',
                                '#FFEB3B',
                                '#F44336',
                              ]}
                              doughnut={true}
                              coverRadius={0.6}
                              coverFill={'#FFF'}
                            />
                          </Box>
                          <View style={{width: '50%'}}>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginBottom: 10,
                              }}>
                              <Heading size="sm">
                                {it.title === 'Seller Pickups' ||
                                it.title === 'Seller Handover'
                                  ? //  || it.title === 'Seller Deliveries'
                                    'Total Sellers'
                                  : 'Total Customers'}
                              </Heading>
                              <Heading size="sm">{it.totalUsers}</Heading>
                            </View>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginTop: 10,
                              }}>
                              <View style={{flexDirection: 'row'}}>
                                <View
                                  style={{
                                    width: 15,
                                    height: 15,
                                    backgroundColor: '#4CAF50',
                                    borderRadius: 100,
                                    marginTop: 4,
                                  }}
                                />
                                <Text
                                  style={{
                                    marginLeft: 10,
                                    fontWeight: '500',
                                    fontSize: 14,
                                    color: 'black',
                                  }}>
                                  Completed
                                </Text>
                              </View>
                              <Text
                                style={{
                                  fontWeight: '500',
                                  fontSize: 14,
                                  color: 'black',
                                }}>
                                {it.completedOrder}
                              </Text>
                            </View>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginTop: 10,
                              }}>
                              <View style={{flexDirection: 'row'}}>
                                <View
                                  style={{
                                    width: 15,
                                    height: 15,
                                    backgroundColor: '#2196F3',
                                    borderRadius: 100,
                                    marginTop: 4,
                                  }}
                                />
                                <Text
                                  style={{
                                    marginLeft: 10,
                                    fontWeight: '500',
                                    fontSize: 14,
                                    color: 'black',
                                  }}>
                                  Pending
                                </Text>
                              </View>
                              <Text
                                style={{
                                  fontWeight: '500',
                                  fontSize: 14,
                                  color: 'black',
                                }}>
                                {it.pendingOrder}
                              </Text>
                            </View>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginTop: 10,
                              }}>
                              <View style={{flexDirection: 'row'}}>
                                <View
                                  style={{
                                    width: 15,
                                    height: 15,
                                    backgroundColor: '#FFEB3B',
                                    borderRadius: 100,
                                    marginTop: 4,
                                  }}
                                />
                                {it.title === 'Seller Handover' ? (
                                  <Text
                                    style={{
                                      marginLeft: 10,
                                      fontWeight: '500',
                                      fontSize: 14,
                                      color: 'black',
                                    }}>
                                    Not Handover
                                  </Text>
                                ) : it.title === 'Seller Deliveries' ? (
                                  <Text
                                    style={{
                                      marginLeft: 10,
                                      fontWeight: '500',
                                      fontSize: 14,
                                      color: 'black',
                                    }}>
                                    Not Delivered
                                  </Text>
                                ) : (
                                  <Text
                                    style={{
                                      marginLeft: 10,
                                      fontWeight: '500',
                                      fontSize: 14,
                                      color: 'black',
                                    }}>
                                    Not Picked
                                  </Text>
                                )}
                              </View>
                              <Text
                                style={{
                                  fontWeight: '500',
                                  fontSize: 14,
                                  color: 'black',
                                }}>
                                {it.notPicked}
                              </Text>
                            </View>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginTop: 10,
                              }}>
                              <View style={{flexDirection: 'row'}}>
                                <View
                                  style={{
                                    width: 15,
                                    height: 15,
                                    backgroundColor: '#F44336',
                                    borderRadius: 100,
                                    marginTop: 4,
                                  }}
                                />
                                <Text
                                  style={{
                                    marginLeft: 10,
                                    fontWeight: '500',
                                    fontSize: 14,
                                    color: 'black',
                                  }}>
                                  Rejected
                                </Text>
                              </View>
                              <Text
                                style={{
                                  fontWeight: '500',
                                  fontSize: 14,
                                  color: 'black',
                                }}>
                                {it.rejectedOrder}
                              </Text>
                            </View>
                          </View>
                        </Box>
                        {it.title === 'Seller Handover' ? (
                          <Button
                            w="100%"
                            size="lg"
                            bg="#004aad"
                            onPress={() =>
                              navigation.navigate('SellerHandover')
                            }>
                            Start Handover
                          </Button>
                        ) : it.title === 'Seller Deliveries' ? (
                          <Button
                            w="100%"
                            size="lg"
                            bg="#004aad"
                            onPress={() =>
                              navigation.navigate('SellerDeliveries', {
                                Forward: Forward,
                                Reverse: Reverse,
                                Trip: tripValue,
                              })
                            }>
                            New Delivery
                          </Button>
                        ) : (
                          <Button
                            w="100%"
                            size="lg"
                            bg="#004aad"
                            onPress={() =>
                              navigation.navigate('NewSellerPickup', {
                                Forward: Forward,
                                Reverse: Reverse,
                                Trip: tripValue,
                                userId: id,
                              })
                            }>
                            New Pickup
                          </Button>
                        )}
                      </Box>
                    ) : null;
                  } else {
                    return it.title === 'Seller Pickups' ||
                      it.title === 'Seller Handover' ? (
                      <Box pt={4} mb="6" rounded="md" bg="white" key={index}>
                        <Box
                          w="100%"
                          flexDir="row"
                          justifyContent="space-between"
                          mb={4}
                          px={4}>
                          <Box w="45%">
                            <Heading size="sm" mb={4}>
                              {it.title}
                            </Heading>
                            <PieChart
                              widthAndHeight={120}
                              series={[
                                it.completedOrder,
                                it.pendingOrder,
                                it.notPicked,
                                it.rejectedOrder,
                              ]}
                              sliceColor={[
                                '#4CAF50',
                                '#2196F3',
                                '#FFEB3B',
                                '#F44336',
                              ]}
                              doughnut={true}
                              coverRadius={0.6}
                              coverFill={'#FFF'}
                            />
                          </Box>
                          <View style={{width: '50%'}}>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginBottom: 10,
                              }}>
                              <Heading size="sm">
                                {it.title === 'Seller Pickups' ||
                                it.title === 'Seller Handover'
                                  ? //  || it.title === 'Seller Deliveries'
                                    'Total Sellers'
                                  : 'Total Customers'}
                              </Heading>
                              <Heading size="sm">{it.totalUsers}</Heading>
                            </View>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginTop: 10,
                              }}>
                              <View style={{flexDirection: 'row'}}>
                                <View
                                  style={{
                                    width: 15,
                                    height: 15,
                                    backgroundColor: '#4CAF50',
                                    borderRadius: 100,
                                    marginTop: 4,
                                  }}
                                />
                                <Text
                                  style={{
                                    marginLeft: 10,
                                    fontWeight: '500',
                                    fontSize: 14,
                                    color: 'black',
                                  }}>
                                  Completed
                                </Text>
                              </View>
                              <Text
                                style={{
                                  fontWeight: '500',
                                  fontSize: 14,
                                  color: 'black',
                                }}>
                                {it.completedOrder}
                              </Text>
                            </View>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginTop: 10,
                              }}>
                              <View style={{flexDirection: 'row'}}>
                                <View
                                  style={{
                                    width: 15,
                                    height: 15,
                                    backgroundColor: '#2196F3',
                                    borderRadius: 100,
                                    marginTop: 4,
                                  }}
                                />
                                <Text
                                  style={{
                                    marginLeft: 10,
                                    fontWeight: '500',
                                    fontSize: 14,
                                    color: 'black',
                                  }}>
                                  Pending
                                </Text>
                              </View>
                              <Text
                                style={{
                                  fontWeight: '500',
                                  fontSize: 14,
                                  color: 'black',
                                }}>
                                {it.pendingOrder}
                              </Text>
                            </View>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginTop: 10,
                              }}>
                              <View style={{flexDirection: 'row'}}>
                                <View
                                  style={{
                                    width: 15,
                                    height: 15,
                                    backgroundColor: '#FFEB3B',
                                    borderRadius: 100,
                                    marginTop: 4,
                                  }}
                                />
                                {it.title === 'Seller Handover' ? (
                                  <Text
                                    style={{
                                      marginLeft: 10,
                                      fontWeight: '500',
                                      fontSize: 14,
                                      color: 'black',
                                    }}>
                                    Not Handover
                                  </Text>
                                ) : it.title === 'Seller Deliveries' ? (
                                  <Text
                                    style={{
                                      marginLeft: 10,
                                      fontWeight: '500',
                                      fontSize: 14,
                                      color: 'black',
                                    }}>
                                    Not Delivered
                                  </Text>
                                ) : (
                                  <Text
                                    style={{
                                      marginLeft: 10,
                                      fontWeight: '500',
                                      fontSize: 14,
                                      color: 'black',
                                    }}>
                                    Not Picked
                                  </Text>
                                )}
                              </View>
                              <Text
                                style={{
                                  fontWeight: '500',
                                  fontSize: 14,
                                  color: 'black',
                                }}>
                                {it.notPicked}
                              </Text>
                            </View>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                marginTop: 10,
                              }}>
                              <View style={{flexDirection: 'row'}}>
                                <View
                                  style={{
                                    width: 15,
                                    height: 15,
                                    backgroundColor: '#F44336',
                                    borderRadius: 100,
                                    marginTop: 4,
                                  }}
                                />
                                <Text
                                  style={{
                                    marginLeft: 10,
                                    fontWeight: '500',
                                    fontSize: 14,
                                    color: 'black',
                                  }}>
                                  Rejected
                                </Text>
                              </View>
                              <Text
                                style={{
                                  fontWeight: '500',
                                  fontSize: 14,
                                  color: 'black',
                                }}>
                                {it.rejectedOrder}
                              </Text>
                            </View>
                          </View>
                        </Box>
                        {it.title === 'Seller Handover' ? (
                          <Button
                            w="100%"
                            size="lg"
                            bg="#004aad"
                            onPress={() =>
                              navigation.navigate('SellerHandover')
                            }>
                            Start Handover
                          </Button>
                        ) : it.title === 'Seller Deliveries' ? (
                          <Button
                            w="100%"
                            size="lg"
                            bg="#004aad"
                            onPress={() =>
                              navigation.navigate('SellerDeliveries', {
                                Forward: Forward,
                                Reverse: Reverse,
                                Trip: tripValue,
                              })
                            }>
                            New Delivery
                          </Button>
                        ) : (
                          <Button
                            w="100%"
                            size="lg"
                            bg="#004aad"
                            onPress={() =>
                              navigation.navigate('NewSellerPickup', {
                                Forward: Forward,
                                Reverse: Reverse,
                                Trip: tripValue,
                                userId: id,
                              })
                            }>
                            New Pickup
                          </Button>
                        )}
                      </Box>
                    ) : null;
                  }
                } else {
                  return (
                    // <Box pt={4} mb="6" rounded="md" bg="white" key={index}>
                    //   <Box
                    //     w="100%"
                    //     flexDir="row"
                    //             justifyContent="space-between"
                    //             mb={4}
                    //             px={4}>
                    //             <Box w="45%">
                    //               <Heading size="sm" mb={4}>
                    //                 {it.title}
                    //               </Heading>
                    //               <Center>
                    //                 {/* <Text style={{color:'black'}}>No assignment for {it.title} </Text> */}
                    //                 <Image
                    //                   style={{width: 80, height: 80}}
                    //                   source={require('../assets/noDataAvailable.jpg')}
                    //                   alt={'No data Image'}
                    //                 />
                    //               </Center>
                    //             </Box>
                    //             <View style={{width: '50%'}}>
                    //               <View
                    //                 style={{
                    //                   flexDirection: 'row',
                    //                   justifyContent: 'space-between',
                    //                   marginBottom: 10,
                    //                 }}>
                    //                 <Heading size="sm">
                    //                   {it.title === 'Seller Pickups' ||
                    //                   it.title === 'Seller Deliveries'
                    //                     ? 'Total Sellers'
                    //                     : 'Total Customers'}
                    //                 </Heading>
                    //                 <Heading size="sm">{it.totalUsers}</Heading>
                    //               </View>
                    //               <View
                    //                 style={{
                    //                   flexDirection: 'row',
                    //                   justifyContent: 'space-between',
                    //                   marginTop: 10,
                    //                 }}>
                    //                 <View style={{flexDirection: 'row'}}>
                    //                   <View
                    //                     style={{
                    //                       width: 15,
                    //                       height: 15,
                    //                       backgroundColor: '#4CAF50',
                    //                       borderRadius: 100,
                    //                       marginTop: 4,
                    //                     }}
                    //                   />
                    //                   <Text
                    //                     style={{
                    //                       marginLeft: 10,
                    //                       fontWeight: '500',
                    //                       fontSize: 14,
                    //                       color: 'black',
                    //                     }}>
                    //                     Completed
                    //                   </Text>
                    //                 </View>
                    //                 <Text
                    //                   style={{
                    //                     fontWeight: '500',
                    //                     fontSize: 14,
                    //                     color: 'black',
                    //                   }}>
                    //                   {it.completedOrder}
                    //                 </Text>
                    //               </View>
                    //               <View
                    //                 style={{
                    //                   flexDirection: 'row',
                    //                   justifyContent: 'space-between',
                    //                   marginTop: 10,
                    //                 }}>
                    //                 <View style={{flexDirection: 'row'}}>
                    //                   <View
                    //                     style={{
                    //                       width: 15,
                    //                       height: 15,
                    //                       backgroundColor: '#2196F3',
                    //                       borderRadius: 100,
                    //                       marginTop: 4,
                    //                     }}
                    //                   />
                    //                   <Text
                    //                     style={{
                    //                       marginLeft: 10,
                    //                       fontWeight: '500',
                    //                       fontSize: 14,
                    //                       color: 'black',
                    //                     }}>
                    //                     Pending
                    //                   </Text>
                    //                 </View>
                    //                 <Text
                    //                   style={{
                    //                     fontWeight: '500',
                    //                     fontSize: 14,
                    //                     color: 'black',
                    //                   }}>
                    //                   {it.pendingOrder}
                    //                 </Text>
                    //               </View>
                    //               <View
                    //                 style={{
                    //                   flexDirection: 'row',
                    //                   justifyContent: 'space-between',
                    //                   marginTop: 10,
                    //                 }}>
                    //                 <View style={{flexDirection: 'row'}}>
                    //                   <View
                    //                     style={{
                    //                       width: 15,
                    //                       height: 15,
                    //                       backgroundColor: '#FFEB3B',
                    //                       borderRadius: 100,
                    //                       marginTop: 4,
                    //                     }}
                    //                   />
                    //                   {it.title === 'Seller Deliveries' ? (
                    //                     <Text
                    //                       style={{
                    //                         marginLeft: 10,
                    //                         fontWeight: '500',
                    //                         fontSize: 14,
                    //                         color: 'black',
                    //                       }}>
                    //                       Not Delivered
                    //                     </Text>
                    //                   ) : (
                    //                     <Text
                    //                       style={{
                    //                         marginLeft: 10,
                    //                         fontWeight: '500',
                    //                         fontSize: 14,
                    //                         color: 'black',
                    //                       }}>
                    //                       Not Picked
                    //                     </Text>
                    //                   )}
                    //                 </View>
                    //                 <Text
                    //                   style={{
                    //                     fontWeight: '500',
                    //                     fontSize: 14,
                    //                     color: 'black',
                    //                   }}>
                    //                   {it.notPicked}
                    //                 </Text>
                    //               </View>
                    //               <View
                    //                 style={{
                    //                   flexDirection: 'row',
                    //                   justifyContent: 'space-between',
                    //                   marginTop: 10,
                    //                 }}>
                    //                 <View style={{flexDirection: 'row'}}>
                    //                   <View
                    //                     style={{
                    //                       width: 15,
                    //                       height: 15,
                    //                       backgroundColor: '#F44336',
                    //                       borderRadius: 100,
                    //                       marginTop: 4,
                    //                     }}
                    //                   />
                    //                   <Text
                    //                     style={{
                    //                       marginLeft: 10,
                    //                       fontWeight: '500',
                    //                       fontSize: 14,
                    //                       color: 'black',
                    //                     }}>
                    //                     Rejected
                    //                   </Text>
                    //                 </View>
                    //                 <Text
                    //                   style={{
                    //                     fontWeight: '500',
                    //                     fontSize: 14,
                    //                     color: 'black',
                    //                   }}>
                    //                   {it.rejectedOrder}
                    //                 </Text>
                    //               </View>
                    //             </View>
                    //           </Box>

                    // </Box>
                    null
                  );
                }
              })}
              {/* {(dashboardData[1].completedOrder!=0 || dashboardData[1].pendingOrder!=0 || dashboardData[1].notPicked!=0 || dashboardData[1].rejectedOrder!=0) ?
        <Button w="100%" size="lg" bg="#004aad" onPress={()=>navigation.navigate('SellerHandover')}>Start Handover</Button>
        :
        null} */}
              <Button
                variant="outline"
                onPress={() => {
                  navigation.navigate('MyTrip', {userId: id});
                }}
                mt={4}
                style={{color: '#004aad', borderColor: '#004aad'}}>
                <Text style={{color: '#004aad'}}>{tripValue}</Text>
              </Button>
              {/* <Fab onPress={()=>{navigation.navigate('MyTrip', {userId: id})}} position="absolute" size="sm" style={{backgroundColor: '#004aad'}} label={<Text style={{color: 'white', fontSize: 16}} >{tripValue}</Text>} /> */}
              {/* <Button w="100%" size="lg" bg="#004aad" mt={-5} onPress={()=>navigation.navigate('SellerHandover')}>Seller Handover</Button> */}
              {/* <Button w="100%" size="lg" bg="#004aad" onPress={()=>navigation.navigate('SellerHandover')}>Start Handover</Button> */}
              <Center>
                <Image
                  style={{width: 150, height: 100}}
                  source={require('../assets/image.png')}
                  alt={'Logo Image'}
                />
              </Center>
            </Box>
          </ScrollView>
          {/* <Fab onPress={()=>sync11()} position="absolute" size="sm" style={{backgroundColor: '#004aad'}} icon={<Icon color="white" as={<MaterialIcons name="sync" />} size="sm" />} /> */}
          {isLoading ? (
            <View
              style={[
                StyleSheet.absoluteFillObject,
                {
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 1,
                  backgroundColor: 'rgba(0,0,0,0.65)',
                },
              ]}>
              <Text style={{color: 'white'}}>Loading...</Text>
              <Lottie
                source={require('../assets/loading11.json')}
                autoPlay
                loop
                speed={1}
                //   progress={animationProgress.current}
              />
              <ProgressBar width={70} />
            </View>
          ) : null}
        </Box>
      )}
    </NativeBaseProvider>
  );
}

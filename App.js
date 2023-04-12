/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import 'react-native-gesture-handler';
import {
  NativeBaseProvider,
  Box,
  Text,
  Image,
  Avatar,
  Heading,
  Button,
  Select,
  Divider,
  Center,
} from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  NavigationContainer,
  DrawerActions,
  useIsFocused,
} from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Login from './src/components/Login';
import Main from './src/components/Main';
import NewSellerPickup from './src/components/newSeller/NewSellerPickup';
import SellerHandover from './src/components/newSeller/SellerHandover';
import HandoverShipment from './src/components/newSeller/HandoverShipment';
import OpenBags from './src/components/newSeller/OpenBags';
import PendingHandover from './src/components/newSeller/PendingHandover';
import NotPicked from './src/components/newSeller/NotPicked';
import NotDelivered from './src/components/newSeller/notDelivered';
import PendingWork from './src/components/newSeller/PendingWork';
import HandOverSummary from './src/components/newSeller/HandOverSummary';
import NewSellerSelection from './src/components/newSeller/NewSellerSelection';
import ShipmentBarcode from './src/components/newSeller/ShipmentBarcode';
import SellerDeliveries from './src/components/newSeller/SellerDeliveries';
import SellerHandoverSelection from './src/components/newSeller/SellerHandoverSelection';
import ScanShipment from './src/components/newSeller/ScanShipment';
import CollectPOD from './src/components/newSeller/CollectPOD';
import Dispatch from './src/components/newSeller/Dispatch';
import MapScreen from './src/components/MapScreen';
import Reject from './src/components/RejectReason';
import POD from './src/components/newSeller/POD';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  ToastAndroid,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import {Badge} from 'react-native-paper';
import Lottie from 'lottie-react-native';
import {ProgressBar} from '@react-native-community/progress-bar-android';
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import {openDatabase} from 'react-native-sqlite-storage';
import NewSellerAdditionNotification from './src/components/NewSellerAdditionNotification';
import StartEndDetails from './src/components/StartEndDetails';
import SellerSelection from './src/components/newSeller/SellerSelection';
import UpdateSellerCloseReasonCode from './src/components/newSeller/UpdateSellerCloseReasonCode';
import CloseReasonCode from './src/components/newSeller/CloseReasonCode';
import ReturnHandoverRejectionTag from './src/components/newSeller/ReturnHandoverRejectionTag';
import HandoverShipmentRTO from './src/components/newSeller/HandoverShipmentRTO';
import {LogBox} from 'react-native';
import MyTrip from './src/components/MyTrip';
import { backendUrl } from './src/utils/backendUrl';
const db = openDatabase({name: 'rn_sqlite'});

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
function StackNavigators({navigation}) {
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState('');
  const [data, setData] = useState([]);
  const [isLogin, setIsLogin] = useState(false);
  const [lastSyncTime11, setLastSyncTime] = useState('');
  const [scannedStatus, SetScannedStatus] = useState(0);
  let m = 0;
  useEffect(() => {
    requestPermissions();
  }, []);
  const requestPermissions = async () => {
    try {
      const cameraPermission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'This app needs access to your camera.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (cameraPermission !== PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Camera permission denied');
      }

      const storagePermission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'This app needs access to your storage.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (storagePermission !== PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Storage permission denied');
      }

      const locationPermission = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to your location.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (locationPermission !== PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Location permission denied');
      }
    } catch (error) {
      console.warn(error);
    }
  };

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@storage_Key');
      // console.log(value);
      if (value !== null) {
        const data = JSON.parse(value);
        setUserId(data.userId);
        Login_Data_load();
        if (!isLogin){
          setIsLogin(true);
          Login_Data_load();
        }
      } else {
        setUserId(' ');
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    // This useEffect  is use to hide warnings in mobile screen .
    // LogBox.ignoreLogs(['Warning: Each child in a list should have a unique "key" prop.']);
    LogBox.ignoreAllLogs(true);
  }, []);

  useEffect(() => {
    const StartValue = setInterval(() => {
      getData();
    }, 1000);
    return () => clearInterval(StartValue);
  }, []);

  useEffect(() => {
    (async () => {
      if (userId) {
        pull_API_Data();
      } else {
        navigation.navigate('Login');
      }
    })();
  }, [userId]);

  // Sync button function
  const pull_API_Data = () => {
    console.log('api pull');
    loadAPI_Data1();
    loadAPI_Data2();
    loadAPI_Data3();
    loadAPI_Data4();
    loadAPI_Data5();
    loadAPI_Data6();
    loadAPI_DataCD();
    createTableBag1();
  };

  useEffect(() => {
    if (userId !== null) {
      setTimeout(() => {
        Login_Data_load();
      }, 10);
    }
  }, [userId]);

  useEffect(() => {
    if (userId !== null) {
      AsyncStorage.getItem('lastSyncTime112')
        .then(data11 => {
          setLastSyncTime(data11);
        })
        .catch(e => {
          console.log(e);
        });
    }
  }, [userId]);

  const Login_Data_load = () => {
    // console.log('Login Data Load called');
    AsyncStorage.getItem('apiDataLoaded')
      .then(data11 => {
        // console.log( 'Api Data Loaded value : ',data11);
        setIsLogin(data11);
        if (data11 === 'false') {
          console.log('1st time call');
          pull_API_Data();
          AsyncStorage.setItem('apiDataLoaded', 'true');
          // return;
        }
      })
      .catch(e => {
        console.log(e);
      });
    AsyncStorage.getItem('lastSyncTime112')
      .then(data11 => {
        setLastSyncTime(data11);
      })
      .catch(e => {
        console.log(e);
      });
  };
  // console.log(userId);
  async function postSPSCalling(row) {
    console.log('===========row=========', {
      clientShipmentReferenceNumber: row.clientShipmentReferenceNumber,
      awbNo: row.awbNo,
      clientRefId: row.clientRefId,
      expectedPackagingId: row.packagingId,
      packagingId: row.packagingId,
      courierCode: row.courierCode,
      consignorCode: row.consignorCode,
      packagingAction: row.packagingAction,
      runsheetNo: row.runSheetNumber,
      shipmentAction: row.shipmentAction,
      feUserID: userId,
      rejectionReasonL1: row.rejectionReasonL1,
      rejectionReasonL2: row.rejectionReasonL2
        ? row.rejectionReasonL2
        : row.rejectionReasonL1,
      rejectionStage: 1,
      bagId: row.bagId,
      eventTime: parseInt(row.eventTime),
      latitude: parseFloat(row.latitude),
      longitude: parseFloat(row.longitude),
      packagingStatus: 1,
      scanStatus:
        row.status == 'accepted' ? 1 : row.status == 'rejected' ? 2 : 0,
    });
    await axios
      .post(backendUrl + 'SellerMainScreen/postSPS', {
        clientShipmentReferenceNumber: row.clientShipmentReferenceNumber,
        awbNo: row.awbNo,
        clientRefId: row.clientRefId,
        expectedPackagingId: row.packagingId,
        packagingId: row.packagingId,
        courierCode: row.courierCode,
        consignorCode: row.consignorCode,
        packagingAction: row.packagingAction,
        runsheetNo: row.runSheetNumber,
        shipmentAction: row.shipmentAction,
        feUserID: userId,
        rejectionReasonL1: row.rejectionReasonL1,
        rejectionReasonL2: row.rejectionReasonL2
          ? row.rejectionReasonL2
          : row.rejectionReasonL1,
        rejectionStage: 1,
        bagId: row.bagId,
        eventTime: parseInt(row.eventTime),
        latitude: parseFloat(row.latitude),
        longitude: parseFloat(row.longitude),
        packagingStatus: 1,
        scanStatus:
          row.status == 'accepted' ? 1 : row.status == 'rejected' ? 2 : 0,
      })
      .then(response => {
        console.log('sync Successfully pushed');
        console.log(response);
        db.transaction(tx => {
          tx.executeSql(
            'UPDATE SellerMainScreenDetails SET syncStatus="done" WHERE clientShipmentReferenceNumber = ?',
            [row.clientShipmentReferenceNumber],
            (tx1, results) => {
              let temp = [];
              console.log(
                '===========Local Sync Status Results==========',
                results.rowsAffected,
              );
              if (results.rowsAffected > 0) {
                console.log('Sync status done in localDB');
              } else {
                console.log(
                  'Sync Status not changed in localDB or already synced',
                );
              }
            },
          );
        });
      })
      .catch(error => {
        setIsLoading(false);
        console.log('sync error', {error});
      });
  }

  async function postSPS(data) {
    await data.map(row => {
      postSPSCalling(row);
    });
    pull_API_Data();
  }

  const push_Data = () => {
    console.log(
      'push data function',
      new Date().toJSON().slice(0, 10).replace(/-/g, '/'),
    );

    Login_Data_load();

    var date = new Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var time = hours + ':' + minutes + ' ' + ampm;
    var datetime = 'Last Sync\n' + hours + ':' + minutes + ' ' + ampm;
    setLastSyncTime(datetime);
    AsyncStorage.setItem('lastSyncTime112', datetime);

    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM SellerMainScreenDetails WHERE status IS NOT Null AND syncStatus IS Null',
        [],
        (tx1, results) => {
          if (results.rows.length > 0) {
            ToastAndroid.show('Synchronizing data...', ToastAndroid.SHORT);
            let temp = [];
            for (let i = 0; i < results.rows.length; ++i) {
              temp.push(results.rows.item(i));
            }
            postSPS(temp);
            setIsLoading(false);
            ToastAndroid.show(
              'Synchronizing data finished',
              ToastAndroid.SHORT,
            );
          } else {
            console.log('Only Pulling Data.No data to push...');
            pull_API_Data();
          }
        },
      );
    });
  };

  const sync11 = () => {
    NetInfo.fetch().then(state => {
      if (state.isConnected && state.isInternetReachable) {
        push_Data();
      } else {
        ToastAndroid.show('You are Offline!', ToastAndroid.SHORT);
      }
    });
  };

  /*              Press (Ctrl + k + 2) keys together for better API tables view in App.js (VSCode) */

  // Table 1
  const createTables1 = () => {
    db.transaction(txn => {
      txn.executeSql('DROP TABLE IF EXISTS SyncSellerPickUp', []);
      txn.executeSql(
        `CREATE TABLE IF NOT EXISTS SyncSellerPickUp( consignorCode ID VARCHAR(200) PRIMARY KEY ,userId VARCHAR(100), 
            consignorName VARCHAR(200),consignorAddress1 VARCHAR(200),consignorAddress2 VARCHAR(200),consignorCity VARCHAR(200),consignorPincode,consignorLatitude INT(20),consignorLongitude DECIMAL(20,10),consignorContact VARCHAR(200),ReverseDeliveries INT(20),runSheetNumber VARCHAR(200),ForwardPickups INT(20), BagOpenClose11 VARCHAR(200), ShipmentListArray VARCHAR(800),contactPersonName VARCHAR(100),otpSubmitted VARCHAR(50),otpSubmittedDelivery VARCHAR(50))`,
        [],
        (sqlTxn, res) => {
          // console.log("table created successfully1212");
          // loadAPI_Data();
        },
        error => {
          console.log('error on creating table ' + error.message);
        },
      );
    });
  };
  const loadAPI_Data1 = () => {
    setIsLoading(!isLoading);
    createTables1();
    (async () => {
      await axios
        .get(backendUrl + `SellerMainScreen/consignorslist/${userId}`)
        .then(
          res => {
            console.log('API 1 OK: ' + res.data.data.length);
            // console.log(res);
            for (let i = 0; i < res.data.data.length; i++) {
              // let m21 = JSON.stringify(res.data[i].consignorAddress, null, 4);
              db.transaction(txn => {
                txn.executeSql(
                  'INSERT OR REPLACE INTO SyncSellerPickUp( contactPersonName,consignorCode ,userId ,consignorName,consignorAddress1,consignorAddress2,consignorCity,consignorPincode,consignorLatitude,consignorLongitude,consignorContact,ReverseDeliveries,runSheetNumber,ForwardPickups,BagOpenClose11, ShipmentListArray,otpSubmitted,otpSubmittedDelivery) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                  [
                    res.data.data[i].contactPersonName,
                    res.data.data[i].consignorCode,
                    userId,
                    res.data.data[i].consignorName,
                    res.data.data[i].consignorAddress1,
                    res.data.data[i].consignorAddress2,
                    res.data.data[i].consignorCity,
                    res.data.data[i].consignorPincode,
                    res.data.data[i].consignorLatitude,
                    res.data.data[i].consignorLongitude,
                    res.data.data[i].consignorContact,
                    res.data.data[i].ReverseDeliveries,
                    res.data.data[i].runsheetNo,
                    res.data.data[i].ForwardPickups,
                    'true',
                    ' ',
                    'false',
                    'false',
                  ],
                  (sqlTxn, _res) => {
                    console.log('\n Data Added to local db successfully1212');
                    // console.log(res);
                  },
                  error => {
                    console.log(
                      'error on loading  data from api SellerMainScreen/consignorslist/' +
                        error.message,
                    );
                  },
                );
              });
            }
            viewDetails1();
            m++;
            // console.log('value of m1 '+m);
            AsyncStorage.setItem('load11', 'notload');
            setIsLoading(false);
          },
          error => {
            console.log(
              'error api SellerMainScreen/consignorslist/',
              error,
            );
          },
        );
    })();
  };
  const viewDetails1 = () => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM SyncSellerPickUp', [], (tx1, results) => {
        let temp = [];
        // console.log(results.rows.length);
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));

          console.log(results.rows.item(i).contactPersonName);
          // var address121 = results.rows.item(i).consignorAddress;
          // var address_json = JSON.parse(address121);
          // console.log(typeof (address_json));
          // console.log("Address from local db : " + address_json.consignorAddress1 + " " + address_json.consignorAddress2);
          // ToastAndroid.show('consignorName:' + results.rows.item(i).consignorName + "\n" + 'PRSNumber : ' + results.rows.item(i).PRSNumber, ToastAndroid.SHORT);
        }
        if (m === 7) {
          ToastAndroid.show('Sync Successful', ToastAndroid.SHORT);
          setIsLoading(false);
          setIsLogin(true);
          AsyncStorage.setItem('apiDataLoaded', 'true');
          console.log('All ' + m + ' APIs loaded successfully ');
          m = 0;

          AsyncStorage.setItem('refresh11', 'refresh');
        } else {
          console.log('Only ' + m + ' APIs loaded out of 7 ');
        }
        // m++;
        // ToastAndroid.show("Sync Successful",ToastAndroid.SHORT);
        // console.log('Data from Local Database : \n ', JSON.stringify(temp, null, 4));
        // console.log('data loaded API 1',temp);
        // console.log('Table1 DB OK:', temp.length);
      });
    });
  };

  // Table 2
  const createTables2 = () => {
    db.transaction(txn => {
      txn.executeSql('DROP TABLE IF EXISTS SellerMainScreenDetails', []);
      txn.executeSql(
        `CREATE TABLE IF NOT EXISTS SellerMainScreenDetails( 
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          clientShipmentReferenceNumber VARCHAR(200),
          clientRefId VARCHAR(200),
          awbNo VARCHAR(200),
          courierCode VARCHAR(200),
          consignorCode VARCHAR(200),
          packagingStatus VARCHAR(200),
          packagingId VARCHAR(200),
          runSheetNumber VARCHAR(200),
          shipmentStatus VARCHAR(200),
          shipmentAction VARCHAR(200),
          rejectionReasonL1 VARCHAR(200),
          rejectionReasonL2 VARCHAR(200),
          rejectionStage VARCHAR(200),
          eventTime VARCHAR(200),
          status VARCHAR(200),
          handoverStatus VARCHAR(200),
          syncStatus VARCHAR(200),
          syncHandoverStatus VARCHAR(200),
          latitude VARCHAR(200),
          longitude VARCHAR(200),
          bagId VARCHAR(200),
          packagingAction VARCHAR(200)
          )`,
        [],
        (sqlTxn, res) => {
          console.log('table created successfully SellerMainScreenDetails');
          // loadAPI_Data();
        },
        error => {
          console.log('error on creating table ' + error.message);
        },
      );
    });
  };

  const loadAPI_Data2 = () => {
    // setIsLoading(!isLoading);
    (async () => {
      await axios
        .get(
          backendUrl +
            `SellerMainScreen/workload/${userId}`,
        )
        .then(
          res => {
            createTables2();
            console.log('API 2 OK: ' + res.data.data.length);
            for (let i = 0; i < res.data.data.length; i++) {
              //console.log(res.data.data[i].shipmentStatus);
              db.transaction(txn => {
                txn.executeSql(
                  `INSERT OR REPLACE INTO SellerMainScreenDetails( 
                  clientShipmentReferenceNumber,
                  clientRefId,
                  awbNo,
                  courierCode,
                  consignorCode,
                  packagingStatus,
                  packagingId,
                  runSheetNumber,
                  shipmentStatus,
                  shipmentAction,
                  rejectionReasonL1,
                  rejectionReasonL2,
                  rejectionStage,
                  eventTime,
                  status,
                  handoverStatus,
                  syncStatus,
                  syncHandoverStatus,
                  bagId,
                  packagingAction
                ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                  [
                    res.data.data[i].clientShipmentReferenceNumber,
                    res.data.data[i].clientRefId,
                    res.data.data[i].awbNo,
                    res.data.data[i].courierCode,
                    res.data.data[i].consignorCode,
                    res.data.data[i].packagingStatus,
                    res.data.data[i].expectedPackagingId,
                    res.data.data[i].runsheetNo,
                    res.data.data[i].shipmentStatus,
                    res.data.data[i].shipmentAction,
                    '',
                    '',
                    0,
                    res.data.data[i].actionTime,
                    res.data.data[i].shipmentStatus == 'PUS' ||
                    res.data.data[i].shipmentStatus == 'PUC' ||
                    res.data.data[i].shipmentStatus == 'DLR' ||
                    res.data.data[i].shipmentStatus == 'RDS'
                      ? 'accepted'
                      : res.data.data[i].shipmentStatus == 'PUR' ||
                        res.data.data[i].shipmentStatus == 'RDR' ||
                        res.data.data[i].shipmentStatus == 'UDU' ||
                        res.data.data[i].shipmentStatus == 'PUF'
                      ? 'rejected'
                      : null,
                    // null,
                    null,
                    null,
                    null,
                    '',
                    res.data.data[i].packagingAction
                  ],
                  (sqlTxn, _res) => {
                    // console.log(`\n Data Added to local db successfully`);
                    // console.log(res);
                  },
                  error => {
                    console.log('error on adding data ' + error.message);
                  },
                );
              });
            }
            m++;
            // console.log('value of m2 '+m);
            // setIsLoading(false);
          },
          error => {
            console.log(error);
          },
        );
    })();
  };

  // Table 3
  const createTables3 = () => {
    db.transaction(txn => {
      txn.executeSql('DROP TABLE IF EXISTS ShipmentRejectReasons', []);
      txn.executeSql(
        'CREATE TABLE IF NOT EXISTS ShipmentRejectReasons(_id ID VARCHAR(100) PRIMARY KEY ,shipmentExceptionReasonID VARCHAR(200),shipmentExceptionReasonName VARCHAR(200),shipmentExceptionReasonUserID VARCHAR(200),disable VARCHAR(20),createdAt VARCHAR(200),updatedAt VARCHAR(200),__v INT(10))',
        [],
        (sqlTxn, res) => {
          // console.log('table 3 created successfully');
          // loadAPI_Data();
        },
        error => {
          console.log('error on creating table ' + error.message);
        },
      );
    });
  };
  const loadAPI_Data3 = () => {
    // setIsLoading(!isLoading);
    createTables3();
    (async () => {
      await axios.get(backendUrl + 'ADupdatePrams/getUSER').then(
        res => {
          // console.log('Table3 API OK: ' + res.data.length);
          // console.log(res.data);
          for (let i = 0; i < res.data.length; i++) {
            db.transaction(txn => {
              txn.executeSql(
                'INSERT OR REPLACE INTO ShipmentRejectReasons( _id,shipmentExceptionReasonID,shipmentExceptionReasonName,shipmentExceptionReasonUserID,disable,createdAt,updatedAt,__v) VALUES (?,?,?,?,?,?,?,?)',
                [
                  res.data[i]._id,
                  res.data[i].shipmentExceptionReasonID,
                  res.data[i].shipmentExceptionReasonName,
                  res.data[i].shipmentExceptionReasonUserID,
                  res.data[i].disable,
                  res.data[i].createdAt,
                  res.data[i].updatedAt,
                  res.data[i].__v,
                ],
                (sqlTxn, _res) => {
                  // console.log('\n Data Added to local db 3 ');
                  // console.log(_res);
                },
                error => {
                  console.log('error on adding data ' + error.message);
                },
              );
            });
          }
          m++;
          // console.log('value of m3 '+m);
          // viewDetails3();
          // setIsLoading(false);
        },
        error => {
          console.log(error);
        },
      );
    })();
  };
  const viewDetails3 = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM ShipmentRejectReasons',
        [],
        (tx1, results) => {
          // let temp = [];
          // console.log(results.rows.length);
          // for (let i = 0; i < results.rows.length; ++i) {
          //     temp.push(results.rows.item(i));
          // }
          // m++;
          // ToastAndroid.show('Sync Successful3', ToastAndroid.SHORT);
          // console.log('Data from Local Database 3: \n ', JSON.stringify(temp, null, 4),);
          // console.log('Table3 DB OK:', temp.length);
        },
      );
    });
  };

  // Table 4
  const createTables4 = () => {
    db.transaction(txn => {
      txn.executeSql('DROP TABLE IF EXISTS ClosePickupReasons', []);
      txn.executeSql(
        'CREATE TABLE IF NOT EXISTS ClosePickupReasons( _id ID VARCHAR(100) PRIMARY KEY,pickupFailureReasonID VARCHAR(50),pickupFailureReasonName VARCHAR(200),pickupFailureReasonUserID VARCHAR(50),pickupFailureReasonActiveStatus VARCHAR(20),pickupFailureReasonGroupID VARCHAR(50),pickupFailureReasonGeoFence VARCHAR(20),pickupFailureReasonOTPenable VARCHAR(20),pickupFailureReasonCallMandatory VARCHAR(20),pickupFailureReasonPickupDateEnable VARCHAR(20),pickupFailureReasonGroupName VARCHAR(200),disable VARCHAR(20),createdAt VARCHAR(200),updatedAt VARCHAR(200),__v INT(10))',
        [],
        (sqlTxn, res) => {
          // console.log('table 4 created successfully');
          // loadAPI_Data();
        },
        error => {
          console.log('error on creating table ' + error.message);
        },
      );
    });
  };
  const createTablesCD = () => {
    db.transaction(txn => {
      txn.executeSql('DROP TABLE IF EXISTS CloseDeliveryReasons', []);
      txn.executeSql(
        'CREATE TABLE IF NOT EXISTS CloseDeliveryReasons( _id ID VARCHAR(100) PRIMARY KEY,deliveryFailureReasonID VARCHAR(50),deliveryFailureReasonName VARCHAR(200),deliveryFailureReasonUserID VARCHAR(50),deliveryFailureReasonActiveStatus VARCHAR(20),deliveryFailureReasonGroupID VARCHAR(50),deliveryFailureReasonGeoFence VARCHAR(20),deliveryFailureReasonOTPenable VARCHAR(20),deliveryFailureReasonCallMandatory VARCHAR(20),deliveryFailureReasonDeliveryDateEnable VARCHAR(20),deliveryFailureReasonGroupName VARCHAR(200),disable VARCHAR(20),createdAt VARCHAR(200),updatedAt VARCHAR(200),__v INT(10))',
        [],
        (sqlTxn, res) => {
          // console.log('table 4 created successfully');
          // loadAPI_Data();
        },
        error => {
          console.log('error on creating table ' + error.message);
        },
      );
    });
  };
  const loadAPI_Data4 = () => {
    // setIsLoading(!isLoading);
    createTables4();
    (async () => {
      await axios.get(backendUrl + 'ADupdatePrams/getUPFR').then(
        res => {
          // console.log('Table4 API OK: ' + res.data.length);
          // console.log(res.data);
          for (let i = 0; i < res.data.length; i++) {
            db.transaction(txn => {
              txn.executeSql(
                `INSERT OR REPLACE INTO ClosePickupReasons( _id,pickupFailureReasonID,pickupFailureReasonName,pickupFailureReasonUserID,pickupFailureReasonActiveStatus,pickupFailureReasonGroupID,pickupFailureReasonGeoFence,pickupFailureReasonOTPenable,pickupFailureReasonCallMandatory,pickupFailureReasonPickupDateEnable,pickupFailureReasonGroupName,disable,createdAt,updatedAt,__v
                    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                [
                  res.data[i]._id,
                  res.data[i].pickupFailureReasonID,
                  res.data[i].pickupFailureReasonName,
                  res.data[i].pickupFailureReasonUserID,
                  res.data[i].pickupFailureReasonActiveStatus,
                  res.data[i].pickupFailureReasonGroupID,
                  res.data[i].pickupFailureReasonGeoFence,
                  res.data[i].pickupFailureReasonOTPenable,
                  res.data[i].pickupFailureReasonCallMandatory,
                  res.data[i].pickupFailureReasonPickupDateEnable,
                  res.data[i].pickupFailureReasonGroupName,
                  res.data[i].disable,
                  res.data[i].createdAt,
                  res.data[i].updatedAt,
                  res.data[i].__v,
                ],
                (sqlTxn, _res) => {
                  // console.log('\n Data Added to local db 4 ');
                  // console.log(res);
                },
                error => {
                  console.log('error on adding data ' + error.message);
                },
              );
            });
          }
          m++;
          // console.log('value of m4 '+m);

          // viewDetails4();
          // setIsLoading(false);
        },
        error => {
          console.log(error);
        },
      );
    })();
  };
  const loadAPI_DataCD = () => {
    // setIsLoading(!isLoading);
    createTablesCD();
    (async () => {
      await axios.get(backendUrl + 'ADupdatePrams/getUDFR').then(
        res => {
          // console.log('Table4 API OK: ' + res.data.length);
          // console.log(res.data);
          for (let i = 0; i < res.data.length; i++) {
            db.transaction(txn => {
              txn.executeSql(
                `INSERT OR REPLACE INTO CloseDeliveryReasons( _id,deliveryFailureReasonID,deliveryFailureReasonName,deliveryFailureReasonUserID,deliveryFailureReasonActiveStatus,deliveryFailureReasonGroupID,deliveryFailureReasonGeoFence,deliveryFailureReasonOTPenable,deliveryFailureReasonCallMandatory,deliveryFailureReasonDeliveryDateEnable,deliveryFailureReasonGroupName,disable,createdAt,updatedAt,__v
                  ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                [
                  res.data[i]._id,
                  res.data[i].deliveryFailureReasonID,
                  res.data[i].deliveryFailureReasonName,
                  res.data[i].deliveryFailureReasonUserID,
                  res.data[i].deliveryFailureReasonActiveStatus,
                  res.data[i].deliveryFailureReasonGroupID,
                  res.data[i].deliveryFailureReasonGeoFence,
                  res.data[i].deliveryFailureReasonOTPenable,
                  res.data[i].deliveryFailureReasonCallMandatory,
                  res.data[i].deliveryFailureReasonDeliveryDateEnable,
                  res.data[i].deliveryFailureReasonGroupName,
                  res.data[i].disable,
                  res.data[i].createdAt,
                  res.data[i].updatedAt,
                  res.data[i].__v,
                ],
                (sqlTxn, _res) => {
                  // console.log('\n Data Added to local db 4 ');
                  // console.log(res);
                },
                error => {
                  console.log('error on adding data ' + error.message);
                },
              );
            });
          }
          m++;
          // console.log('value of m4 '+m);

          // viewDetails4();
          // setIsLoading(false);
        },
        error => {
          console.log(error);
        },
      );
    })();
  };
  const viewDetails4 = () => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM ClosePickupReasons', [], (tx1, results) => {
        // let temp = [];
        // console.log(results.rows.length);
        // for (let i = 0; i < results.rows.length; ++i) {
        //     temp.push(results.rows.item(i));
        // }
        // ToastAndroid.show('Sync Successful4', ToastAndroid.SHORT);
        // console.log('Data from Local Database 4: \n ', JSON.stringify(temp, null, 4),);
        // console.log('Data from Local Database 4: \n ',temp);
        // m++;
        // console.log('Table4 DB OK:', temp.length);
      });
    });
  };

  // Table 5
  const createTables5 = () => {
    db.transaction(txn => {
      txn.executeSql('DROP TABLE IF EXISTS NotAttemptReasons', []);
      txn.executeSql(
        'CREATE TABLE IF NOT EXISTS NotAttemptReasons(_id ID VARCHAR(200) PRIMARY KEY,reasonID VARCHAR(200),reasonName VARCHAR(200),reasonUserID VARCHAR(200),disable VARCHAR(200),createdAt VARCHAR(200),updatedAt VARCHAR(200),__v INT(10))',
        [],
        (sqlTxn, res) => {
          // console.log('table 5 created successfully');
          // loadAPI_Data();
        },
        error => {
          console.log('error on creating table ' + error.message);
        },
      );
    });
  };
  const loadAPI_Data5 = () => {
    // setIsLoading(!isLoading);
    createTables5();
    (async () => {
      await axios.get(backendUrl + 'ADupdatePrams/getNotAttemptedReasons').then(
        res => {
          // console.log('Table5 API OK:' , res.data.data.length);
          // console.log(res.data);
          for (let i = 0; i < res.data.data.length; i++) {
            db.transaction(txn => {
              txn.executeSql(
                `INSERT OR REPLACE INTO NotAttemptReasons(_id,reasonID,reasonName,reasonUserID,disable,createdAt,updatedAt,__v
                          ) VALUES (?,?,?,?,?,?,?,?)`,
                [
                  res.data.data[i]._id,
                  res.data.data[i].reasonID,
                  res.data.data[i].reasonName,
                  res.data.data[i].reasonUserID,
                  res.data.data[i].disable,
                  res.data.data[i].createdAt,
                  res.data.data[i].updatedAt,
                  res.data.data[i].__v,
                ],
                (sqlTxn, _res) => {
                  // console.log('\n Data Added to local db 5');
                  // console.log(res);
                },
                error => {
                  console.log('error on adding data ' + error.message);
                },
              );
            });
          }
          m++;
          // console.log('value of m5 '+m);

          // viewDetails5();
          // setIsLoading(false);
        },
        error => {
          console.log(error);
        },
      );
    })();
  };
  const viewDetails5 = () => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM NotAttemptReasons', [], (tx1, results) => {
        // let temp = [];
        // // console.log(results.rows.length);
        // for (let i = 0; i < results.rows.length; ++i) {
        //     temp.push(results.rows.item(i));
        // }
        // m++;
        // ToastAndroid.show("Sync Successful",ToastAndroid.SHORT);
        // console.log('Data from Local Database 5: \n ', temp);
        // console.log('Table 5 DB OK:', temp.length);
      });
    });
  };

  // Table 6
  const createTables6 = () => {
    db.transaction(txn => {
      txn.executeSql('DROP TABLE IF EXISTS PartialCloseReasons', []);
      txn.executeSql(
        'CREATE TABLE IF NOT EXISTS PartialCloseReasons(_id ID VARCHAR(200) PRIMARY KEY,reasonID VARCHAR(200),reasonName VARCHAR(200),reasonUserID VARCHAR(200),disable VARCHAR(200),createdAt VARCHAR(200),updatedAt VARCHAR(200),__v INT(10))',
        [],
        (sqlTxn, res) => {
          // console.log('table 6 created successfully');
          // loadAPI_Data();
        },
        error => {
          console.log('error on creating table ' + error.message);
        },
      );
    });
  };
  const createTableBag1 = () => {
    AsyncStorage.setItem('acceptedItemData11', '');
    db.transaction(tx => {
      tx.executeSql('DROP TABLE IF EXISTS closeHandoverBag1', []);
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS closeHandoverBag1 (bagSeal TEXT , bagId TEXT PRIMARY KEY, bagDate TEXT, AcceptedList TEXT,status TEXT,consignorCode Text,consignorName Text)',
        [],
        (tx, results) => {
          console.log('Table created successfully');
        },
        error => {
          console.log('Error occurred while creating the table:', error);
        },
      );
    });
  };
  const loadAPI_Data6 = () => {
    // setIsLoading(!isLoading);
    createTables6();
    (async () => {
      await axios
        .get(backendUrl + 'ADupdateprams/getPartialClosureReasons')
        .then(
          res => {
            // console.log('Table6 API OK: ' + res.data.data.length);
            // console.log(res.data);
            for (let i = 0; i < res.data.data.length; i++) {
              db.transaction(txn => {
                txn.executeSql(
                  `INSERT OR REPLACE INTO PartialCloseReasons(_id,reasonID,reasonName,reasonUserID,disable,createdAt,updatedAt,__v
                          ) VALUES (?,?,?,?,?,?,?,?)`,
                  [
                    res.data.data[i]._id,
                    res.data.data[i].reasonID,
                    res.data.data[i].reasonName,
                    res.data.data[i].reasonUserID,
                    res.data.data[i].disable,
                    res.data.data[i].createdAt,
                    res.data.data[i].updatedAt,
                    res.data.data[i].__v,
                  ],
                  (sqlTxn, _res) => {
                    // console.log('\n Data Added to local db 6 ');
                    // console.log(res);
                  },
                  error => {
                    console.log('error on adding data ' + error.message);
                  },
                );
              });
            }
            m++;
            // console.log('value of m6 '+m);

            viewDetails6();
            // setIsLoading(false);
          },
          error => {
            console.log(error);
          },
        );
    })();
  };
  const viewDetails6 = () => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM PartialCloseReasons', [], (tx1, results) => {
        // let temp = [];
        // // console.log(results.rows.length);
        // for (let i = 0; i < results.rows.length; ++i) {
        //     temp.push(results.rows.item(i));
        // }
        // m++;
        // if (m <= 6){
        //   // ToastAndroid.show('Sync Successful',ToastAndroid.SHORT);
        //   console.log('Waiting for ' + ( 7 - m ) + ' API to load. Plz wait...');
        //   // m = 0;
        // }
        //  else {
        //   console.log('Only ' + m + ' APIs loaded out of 6 ');
        // }
        // console.log('Data from Local Database 6 : \n ', temp);
        // console.log('Table6 DB OK:', temp.length);
      });
    });
  };

  const DisplayData = () => {
    axios
      .get(
        backendUrl +
          `SellerMainScreen/getadditionalwork/${userId}`,
      )
      .then(res => {
        setData(res.data);
        // console.log('dataDisplay', res.data);
      })
      .catch(error => {
        // console.log('Error Msg:', error);
      });
  };

  useEffect(() => {
    DisplayData();
  }, [userId]);

  return (
    <NativeBaseProvider>
      <Stack.Navigator
        initialRouteName={'Main'}
        key={'Main'}
        screenOptions={{
          headerStyle: {
            backgroundColor: '#004aad',
            // elevation: 0,
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
            // alignSelf: 'center',
          },
        }}>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            header: () => null,
          }}
        />
        <Stack.Screen
          name="SellerSelection"
          component={SellerSelection}
          options={{
            headerTitle: props => (
              <NativeBaseProvider>
                <Heading style={{color: 'white'}} size="md">
                  Notification
                </Heading>
              </NativeBaseProvider>
            ),
            headerLeft: () => (
              <MaterialIcons
                name="menu"
                style={{fontSize: 30, marginLeft: 10, color: 'white'}}
                onPress={() => navigation.toggleDrawer()}
              />
            ),
          }}
        />

        <Stack.Screen
          name="CloseReasonCode"
          component={CloseReasonCode}
          options={{
            headerTitle: props => (
              <NativeBaseProvider>
                <Heading style={{color: 'white'}} size="md">
                  Notification
                </Heading>
              </NativeBaseProvider>
            ),
            headerLeft: () => (
              <MaterialIcons
                name="menu"
                style={{fontSize: 30, marginLeft: 10, color: 'white'}}
                onPress={() => navigation.toggleDrawer()}
              />
            ),
          }}
        />

        <Stack.Screen
          name="UpdateSellerCloseReasonCode"
          component={UpdateSellerCloseReasonCode}
          options={{
            headerTitle: props => (
              <NativeBaseProvider>
                <Heading style={{color: 'white'}} size="md">
                  Notification
                </Heading>
              </NativeBaseProvider>
            ),
            headerLeft: () => (
              <MaterialIcons
                name="menu"
                style={{fontSize: 30, marginLeft: 10, color: 'white'}}
                onPress={() => navigation.toggleDrawer()}
              />
            ),
          }}
        />

        <Stack.Screen
          name="ReturnHandoverRejectionTag"
          component={ReturnHandoverRejectionTag}
          options={{
            headerTitle: props => (
              <NativeBaseProvider>
                <Heading style={{color: 'white'}} size="md">
                  Notification
                </Heading>
              </NativeBaseProvider>
            ),
            headerLeft: () => (
              <MaterialIcons
                name="menu"
                style={{fontSize: 30, marginLeft: 10, color: 'white'}}
                onPress={() => navigation.toggleDrawer()}
              />
            ),
          }}
        />

        <Stack.Screen
          name="Main"
          component={Main}
          options={{
            headerTitle: props => (
              <NativeBaseProvider>
                <Heading style={{color: 'white'}} size="md">
                  Dashboard
                </Heading>
              </NativeBaseProvider>
            ),
            headerLeft: () => (
              <MaterialIcons
                name="menu"
                style={{fontSize: 30, marginLeft: 10, color: 'white'}}
                onPress={() => {
                  // console.log('dashboard menu clicked');
                  navigation.dispatch(DrawerActions.openDrawer());
                }}
              />
            ),
            headerRight: () => (
              <View style={{flexDirection: 'row', marginRight: 10}}>
                <Text style={{fontSize: 12, color: 'white'}}>
                  {lastSyncTime11}
                </Text>
                <TouchableOpacity
                  style={{marginRight: 15}}
                  onPress={() => {
                    sync11();
                  }}>
                  <MaterialIcons
                    name="sync"
                    style={{fontSize: 30, color: 'white', marginTop: 5}}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('NewSellerAdditionNotification');
                    // navigation.dispatch(DrawerActions.openDrawer());
                  }}>
                  <MaterialIcons
                    name="bell-outline"
                    style={{
                      fontSize: 30,
                      color: 'white',
                      marginRight: 5,
                      marginTop: 5,
                    }}
                  />
                  {data.length ? (
                    <Badge
                      style={{
                        position: 'absolute',
                        fontSize: 15,
                        borderColor: 'white',
                        borderWidth: 1,
                      }}>
                      {data.length}
                    </Badge>
                  ) : null}
                </TouchableOpacity>
              </View>
            ),
          }}
        />

        <Stack.Screen
          name="NewSellerPickup"
          component={NewSellerPickup}
          options={{
            headerTitle: props => (
              <NativeBaseProvider>
                <Heading style={{color: 'white'}} size="md">
                  Seller Pickups
                </Heading>
              </NativeBaseProvider>
            ),
            headerLeft: () => (
              <MaterialIcons
                name="menu"
                style={{fontSize: 30, marginLeft: 10, color: 'white'}}
                onPress={() => navigation.toggleDrawer()}
              />
            ),
            headerRight: () => (
              <View style={{flexDirection: 'row', marginRight: 10}}>
                <Text style={{fontSize: 12, color: 'white'}}>
                  {lastSyncTime11}
                </Text>
                <TouchableOpacity
                  style={{marginRight: 15}}
                  onPress={() => {
                    sync11();
                  }}>
                  <MaterialIcons
                    name="sync"
                    style={{fontSize: 30, color: 'white', marginTop: 5}}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('NewSellerAdditionNotification');
                    // navigation.dispatch(DrawerActions.openDrawer());
                  }}>
                  <MaterialIcons
                    name="bell-outline"
                    style={{
                      fontSize: 30,
                      color: 'white',
                      marginRight: 5,
                      marginTop: 5,
                    }}
                  />
                  {data.length ? (
                    <Badge
                      style={{
                        position: 'absolute',
                        fontSize: 15,
                        borderColor: 'white',
                        borderWidth: 1,
                      }}>
                      {data.length}
                    </Badge>
                  ) : null}
                </TouchableOpacity>
              </View>
            ),
            //  headerRight: () => (
            //         <NativeBaseProvider>
            //       {/* //     <Button  leftIcon={<Icon as={MaterialIcons} name="sync" size="sm" />} > Sync</Button> */}
            //       <Button leftIcon={<Icon as={MaterialIcons} name="sync" size="sm" color="white" />}onPress={() => sync11()
            //     }
            //       style={{
            //         marginTop:8.5,marginBottom:8, marginLeft: 10,marginRight:12,backgroundColor: '#004aad',width:30,height:38,alignSelf: 'center',
            //         borderRadius: 10,
            // }}
            // title="sync" name='Sync' ></Button>
            //       </NativeBaseProvider>
            //       )
          }}
        />
        <Stack.Screen
          name="SellerHandover"
          component={SellerHandover}
          options={{
            headerTitle: props => (
              <NativeBaseProvider>
                <Heading style={{color: 'white'}} size="md">
                  Seller Handover
                </Heading>
              </NativeBaseProvider>
            ),
            headerLeft: () => (
              <MaterialIcons
                name="menu"
                style={{fontSize: 30, marginLeft: 10, color: 'white'}}
                onPress={() => navigation.toggleDrawer()}
              />
            ),
            headerRight: () => (
              <View style={{flexDirection: 'row', marginRight: 10}}>
                <Text style={{fontSize: 12, color: 'white'}}>
                  {lastSyncTime11}
                </Text>
                <TouchableOpacity
                  style={{marginRight: 15}}
                  onPress={() => {
                    sync11();
                  }}>
                  <MaterialIcons
                    name="sync"
                    style={{fontSize: 30, color: 'white', marginTop: 5}}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('NewSellerAdditionNotification');
                  }}>
                  <MaterialIcons
                    name="bell-outline"
                    style={{
                      fontSize: 30,
                      color: 'white',
                      marginRight: 5,
                      marginTop: 5,
                    }}
                  />
                  {data.length ? (
                    <Badge
                      style={{
                        position: 'absolute',
                        fontSize: 15,
                        borderColor: 'white',
                        borderWidth: 1,
                      }}>
                      {data.length}
                    </Badge>
                  ) : null}
                </TouchableOpacity>
              </View>
            ),
          }}
        />
        <Stack.Screen
          name="HandoverShipment"
          component={HandoverShipment}
          options={{
            headerTitle: props => (
              <NativeBaseProvider>
                <Heading style={{color: 'white'}} size="md">
                  Shipment
                </Heading>
              </NativeBaseProvider>
            ),
            headerLeft: () => (
              <MaterialIcons
                name="menu"
                style={{fontSize: 30, marginLeft: 10, color: 'white'}}
                onPress={() => navigation.toggleDrawer()}
              />
            ),
            headerRight: () => (
              <View style={{flexDirection: 'row', marginRight: 10}}>
                <Text style={{fontSize: 12, color: 'white'}}>
                  {lastSyncTime11}
                </Text>
                <TouchableOpacity
                  style={{marginRight: 15}}
                  onPress={() => {
                    sync11();
                  }}>
                  <MaterialIcons
                    name="sync"
                    style={{fontSize: 30, color: 'white', marginTop: 5}}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('NewSellerAdditionNotification');
                  }}>
                  <MaterialIcons
                    name="bell-outline"
                    style={{
                      fontSize: 30,
                      color: 'white',
                      marginRight: 5,
                      marginTop: 5,
                    }}
                  />
                  {data.length ? (
                    <Badge
                      style={{
                        position: 'absolute',
                        fontSize: 15,
                        borderColor: 'white',
                        borderWidth: 1,
                      }}>
                      {data.length}
                    </Badge>
                  ) : null}
                </TouchableOpacity>
              </View>
            ),
          }}
        />
        <Stack.Screen
          name="OpenBags"
          component={OpenBags}
          options={{
            headerTitle: props => (
              <NativeBaseProvider>
                <Heading style={{color: 'white'}} size="md">
                  Open Bags
                </Heading>
              </NativeBaseProvider>
            ),
            headerLeft: () => (
              <MaterialIcons
                name="menu"
                style={{fontSize: 30, marginLeft: 10, color: 'white'}}
                onPress={() => navigation.toggleDrawer()}
              />
            ),
            headerRight: () => (
              <View style={{flexDirection: 'row', marginRight: 10}}>
                <Text style={{fontSize: 12, color: 'white'}}>
                  {lastSyncTime11}
                </Text>
                <TouchableOpacity
                  style={{marginRight: 15}}
                  onPress={() => {
                    sync11();
                  }}>
                  <MaterialIcons
                    name="sync"
                    style={{fontSize: 30, color: 'white', marginTop: 5}}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('NewSellerAdditionNotification');
                  }}>
                  <MaterialIcons
                    name="bell-outline"
                    style={{
                      fontSize: 30,
                      color: 'white',
                      marginRight: 5,
                      marginTop: 5,
                    }}
                  />
                  {data.length ? (
                    <Badge
                      style={{
                        position: 'absolute',
                        fontSize: 15,
                        borderColor: 'white',
                        borderWidth: 1,
                      }}>
                      {data.length}
                    </Badge>
                  ) : null}
                </TouchableOpacity>
              </View>
            ),
          }}
        />
        <Stack.Screen
          name="PendingHandover"
          component={PendingHandover}
          options={{
            headerTitle: props => (
              <NativeBaseProvider>
                <Heading style={{color: 'white'}} size="md">
                  Pending Handover
                </Heading>
              </NativeBaseProvider>
            ),
            headerLeft: () => (
              <MaterialIcons
                name="menu"
                style={{fontSize: 30, marginLeft: 10, color: 'white'}}
                onPress={() => navigation.toggleDrawer()}
              />
            ),
            headerRight: () => (
              <View style={{flexDirection: 'row', marginRight: 10}}>
                <Text style={{fontSize: 12, color: 'white'}}>
                  {lastSyncTime11}
                </Text>
                <TouchableOpacity
                  style={{marginRight: 15}}
                  onPress={() => {
                    sync11();
                  }}>
                  <MaterialIcons
                    name="sync"
                    style={{fontSize: 30, color: 'white', marginTop: 5}}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('NewSellerAdditionNotification');
                  }}>
                  <MaterialIcons
                    name="bell-outline"
                    style={{
                      fontSize: 30,
                      color: 'white',
                      marginRight: 5,
                      marginTop: 5,
                    }}
                  />
                  {data.length ? (
                    <Badge
                      style={{
                        position: 'absolute',
                        fontSize: 15,
                        borderColor: 'white',
                        borderWidth: 1,
                      }}>
                      {data.length}
                    </Badge>
                  ) : null}
                </TouchableOpacity>
              </View>
            ),
          }}
        />
        <Stack.Screen
          name="PendingWork"
          component={PendingWork}
          options={{
            headerTitle: props => (
              <NativeBaseProvider>
                <Heading style={{color: 'white'}} size="md">
                  Pending Work
                </Heading>
              </NativeBaseProvider>
            ),
            headerLeft: () => (
              <MaterialIcons
                name="menu"
                style={{fontSize: 30, marginLeft: 10, color: 'white'}}
                onPress={() => navigation.toggleDrawer()}
              />
            ),
            headerRight: () => (
              <View style={{flexDirection: 'row', marginRight: 10}}>
                <Text style={{fontSize: 12, color: 'white'}}>
                  {lastSyncTime11}
                </Text>
                <TouchableOpacity
                  style={{marginRight: 15}}
                  onPress={() => {
                    sync11();
                  }}>
                  <MaterialIcons
                    name="sync"
                    style={{fontSize: 30, color: 'white', marginTop: 5}}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('NewSellerAdditionNotification');
                  }}>
                  <MaterialIcons
                    name="bell-outline"
                    style={{
                      fontSize: 30,
                      color: 'white',
                      marginRight: 5,
                      marginTop: 5,
                    }}
                  />
                  {data.length ? (
                    <Badge
                      style={{
                        position: 'absolute',
                        fontSize: 15,
                        borderColor: 'white',
                        borderWidth: 1,
                      }}>
                      {data.length}
                    </Badge>
                  ) : null}
                </TouchableOpacity>
              </View>
            ),
          }}
        />
        <Stack.Screen
          name="NotPicked"
          component={NotPicked}
          options={{
            headerTitle: props => (
              <NativeBaseProvider>
                <Heading style={{color: 'white'}} size="md">
                  Pending Work
                </Heading>
              </NativeBaseProvider>
            ),
            headerLeft: () => (
              <MaterialIcons
                name="menu"
                style={{fontSize: 30, marginLeft: 10, color: 'white'}}
                onPress={() => navigation.toggleDrawer()}
              />
            ),
            headerRight: () => (
              <View style={{flexDirection: 'row', marginRight: 10}}>
                <Text style={{fontSize: 12, color: 'white'}}>
                  {lastSyncTime11}
                </Text>
                <TouchableOpacity
                  style={{marginRight: 15}}
                  onPress={() => {
                    sync11();
                  }}>
                  <MaterialIcons
                    name="sync"
                    style={{fontSize: 30, color: 'white', marginTop: 5}}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('NewSellerAdditionNotification');
                  }}>
                  <MaterialIcons
                    name="bell-outline"
                    style={{
                      fontSize: 30,
                      color: 'white',
                      marginRight: 5,
                      marginTop: 5,
                    }}
                  />
                  {data.length ? (
                    <Badge
                      style={{
                        position: 'absolute',
                        fontSize: 15,
                        borderColor: 'white',
                        borderWidth: 1,
                      }}>
                      {data.length}
                    </Badge>
                  ) : null}
                </TouchableOpacity>
              </View>
            ),
          }}
        />
        <Stack.Screen
          name="NotDelivered"
          component={NotDelivered}
          options={{
            headerTitle: props => (
              <NativeBaseProvider>
                <Heading style={{color: 'white'}} size="md">
                  Pending Work
                </Heading>
              </NativeBaseProvider>
            ),
            headerLeft: () => (
              <MaterialIcons
                name="menu"
                style={{fontSize: 30, marginLeft: 10, color: 'white'}}
                onPress={() => navigation.toggleDrawer()}
              />
            ),
            headerRight: () => (
              <View style={{flexDirection: 'row', marginRight: 10}}>
                <Text style={{fontSize: 12, color: 'white'}}>
                  {lastSyncTime11}
                </Text>
                <TouchableOpacity
                  style={{marginRight: 15}}
                  onPress={() => {
                    sync11();
                  }}>
                  <MaterialIcons
                    name="sync"
                    style={{fontSize: 30, color: 'white', marginTop: 5}}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('NewSellerAdditionNotification');
                  }}>
                  <MaterialIcons
                    name="bell-outline"
                    style={{
                      fontSize: 30,
                      color: 'white',
                      marginRight: 5,
                      marginTop: 5,
                    }}
                  />
                  {data.length ? (
                    <Badge
                      style={{
                        position: 'absolute',
                        fontSize: 15,
                        borderColor: 'white',
                        borderWidth: 1,
                      }}>
                      {data.length}
                    </Badge>
                  ) : null}
                </TouchableOpacity>
              </View>
            ),
          }}
        />
        <Stack.Screen
          name="HandOverSummary"
          component={HandOverSummary}
          options={{
            headerTitle: props => (
              <NativeBaseProvider>
                <Heading style={{color: 'white'}} size="md">
                  Handover Summary
                </Heading>
              </NativeBaseProvider>
            ),
            headerLeft: () => (
              <MaterialIcons
                name="menu"
                style={{fontSize: 30, marginLeft: 10, color: 'white'}}
                onPress={() => navigation.toggleDrawer()}
              />
            ),
            headerRight: () => (
              <View style={{flexDirection: 'row', marginRight: 10}}>
                <Text style={{fontSize: 12, color: 'white'}}>
                  {lastSyncTime11}
                </Text>
                <TouchableOpacity
                  style={{marginRight: 15}}
                  onPress={() => {
                    sync11();
                  }}>
                  <MaterialIcons
                    name="sync"
                    style={{fontSize: 30, color: 'white', marginTop: 5}}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('NewSellerAdditionNotification');
                  }}>
                  <MaterialIcons
                    name="bell-outline"
                    style={{
                      fontSize: 30,
                      color: 'white',
                      marginRight: 5,
                      marginTop: 5,
                    }}
                  />
                  {data.length ? (
                    <Badge
                      style={{
                        position: 'absolute',
                        fontSize: 15,
                        borderColor: 'white',
                        borderWidth: 1,
                      }}>
                      {data.length}
                    </Badge>
                  ) : null}
                </TouchableOpacity>
              </View>
            ),
          }}
        />

        <Stack.Screen
          name="HandoverShipmentRTO"
          component={HandoverShipmentRTO}
          options={{
            headerTitle: props => (
              <NativeBaseProvider>
                <Heading style={{color: 'white'}} size="md">
                  Handover Scan
                </Heading>
              </NativeBaseProvider>
            ),
            headerLeft: () => (
              <MaterialIcons
                name="menu"
                style={{fontSize: 30, marginLeft: 10, color: 'white'}}
                onPress={() => navigation.toggleDrawer()}
              />
            ),
            headerRight: () => (
              <View style={{flexDirection: 'row', marginRight: 10}}>
                <Text style={{fontSize: 12, color: 'white'}}>
                  {lastSyncTime11}
                </Text>
                <TouchableOpacity
                  style={{marginRight: 15}}
                  onPress={() => {
                    sync11();
                  }}>
                  <MaterialIcons
                    name="sync"
                    style={{fontSize: 30, color: 'white', marginTop: 5}}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('NewSellerAdditionNotification');
                  }}>
                  <MaterialIcons
                    name="bell-outline"
                    style={{
                      fontSize: 30,
                      color: 'white',
                      marginRight: 5,
                      marginTop: 5,
                    }}
                  />
                  {data.length ? (
                    <Badge
                      style={{
                        position: 'absolute',
                        fontSize: 15,
                        borderColor: 'white',
                        borderWidth: 1,
                      }}>
                      {data.length}
                    </Badge>
                  ) : null}
                </TouchableOpacity>
              </View>
            ),
          }}
        />

        <Stack.Screen
          name="NewSellerSelection"
          component={NewSellerSelection}
          options={{
            headerTitle: props => (
              <NativeBaseProvider>
                <Heading style={{color: 'white'}} size="md">
                  Seller Summary
                </Heading>
              </NativeBaseProvider>
            ),
            headerLeft: () => (
              <MaterialIcons
                name="menu"
                style={{fontSize: 30, marginLeft: 10, color: 'white'}}
                onPress={() => navigation.toggleDrawer()}
              />
            ),
            headerRight: () => (
              <View style={{flexDirection: 'row', marginRight: 10}}>
                <Text style={{fontSize: 12, color: 'white'}}>
                  {lastSyncTime11}
                </Text>
                <TouchableOpacity
                  style={{marginRight: 15}}
                  onPress={() => {
                    sync11();
                  }}>
                  <MaterialIcons
                    name="sync"
                    style={{fontSize: 30, color: 'white', marginTop: 5}}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('NewSellerAdditionNotification');
                  }}>
                  <MaterialIcons
                    name="bell-outline"
                    style={{
                      fontSize: 30,
                      color: 'white',
                      marginRight: 5,
                      marginTop: 5,
                    }}
                  />
                  {data.length ? (
                    <Badge
                      style={{
                        position: 'absolute',
                        fontSize: 15,
                        borderColor: 'white',
                        borderWidth: 1,
                      }}>
                      {data.length}
                    </Badge>
                  ) : null}
                </TouchableOpacity>
              </View>
            ),
          }}
        />

        <Stack.Screen
          name="ShipmentBarcode"
          component={ShipmentBarcode}
          options={{
            headerTitle: props => (
              <NativeBaseProvider>
                <Heading style={{color: 'white'}} size="md">
                  Scan Products
                </Heading>
              </NativeBaseProvider>
            ),
            headerLeft: () => (
              <MaterialIcons
                name="menu"
                style={{fontSize: 30, marginLeft: 10, color: 'white'}}
                onPress={() => navigation.toggleDrawer()}
              />
            ),
            headerRight: () => (
              <View style={{flexDirection: 'row', marginRight: 10}}>
                <Text style={{fontSize: 12, color: 'white'}}>
                  {lastSyncTime11}
                </Text>
                <TouchableOpacity
                  style={{marginRight: 15}}
                  onPress={() => {
                    sync11();
                  }}>
                  <MaterialIcons
                    name="sync"
                    style={{fontSize: 30, color: 'white', marginTop: 5}}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('NewSellerAdditionNotification');
                  }}>
                  <MaterialIcons
                    name="bell-outline"
                    style={{
                      fontSize: 30,
                      color: 'white',
                      marginRight: 5,
                      marginTop: 5,
                    }}
                  />
                  {data.length ? (
                    <Badge
                      style={{
                        position: 'absolute',
                        fontSize: 15,
                        borderColor: 'white',
                        borderWidth: 1,
                      }}>
                      {data.length}
                    </Badge>
                  ) : null}
                </TouchableOpacity>
              </View>
            ),
          }}
        />
        <Stack.Screen
          name="SellerDeliveries"
          component={SellerDeliveries}
          options={{
            headerTitle: props => (
              <NativeBaseProvider>
                <Heading style={{color: 'white'}} size="md">
                  Seller Deliveries
                </Heading>
              </NativeBaseProvider>
            ),
            headerLeft: () => (
              <MaterialIcons
                name="menu"
                style={{fontSize: 30, marginLeft: 10, color: 'white'}}
                onPress={() => navigation.toggleDrawer()}
              />
            ),
            headerRight: () => (
              <View style={{flexDirection: 'row', marginRight: 10}}>
                <Text style={{fontSize: 12, color: 'white'}}>
                  {lastSyncTime11}
                </Text>
                <TouchableOpacity
                  style={{marginRight: 15}}
                  onPress={() => {
                    sync11();
                  }}>
                  <MaterialIcons
                    name="sync"
                    style={{fontSize: 30, color: 'white', marginTop: 5}}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('NewSellerAdditionNotification');
                  }}>
                  <MaterialIcons
                    name="bell-outline"
                    style={{
                      fontSize: 30,
                      color: 'white',
                      marginRight: 5,
                      marginTop: 5,
                    }}
                  />
                  {data.length ? (
                    <Badge
                      style={{
                        position: 'absolute',
                        fontSize: 15,
                        borderColor: 'white',
                        borderWidth: 1,
                      }}>
                      {data.length}
                    </Badge>
                  ) : null}
                </TouchableOpacity>
              </View>
            ),
          }}
        />
        <Stack.Screen
          name="SellerHandoverSelection"
          component={SellerHandoverSelection}
          options={{
            headerTitle: props => (
              <NativeBaseProvider>
                <Heading style={{color: 'white'}} size="md">
                  Seller Handover
                </Heading>
              </NativeBaseProvider>
            ),
            headerLeft: () => (
              <MaterialIcons
                name="menu"
                style={{fontSize: 30, marginLeft: 10, color: 'white'}}
                onPress={() => navigation.toggleDrawer()}
              />
            ),
            headerRight: () => (
              <View style={{flexDirection: 'row', marginRight: 10}}>
                <Text style={{fontSize: 12, color: 'white'}}>
                  {lastSyncTime11}
                </Text>
                <TouchableOpacity
                  style={{marginRight: 15}}
                  onPress={() => {
                    sync11();
                  }}>
                  <MaterialIcons
                    name="sync"
                    style={{fontSize: 30, color: 'white', marginTop: 5}}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('NewSellerAdditionNotification');
                  }}>
                  <MaterialIcons
                    name="bell-outline"
                    style={{
                      fontSize: 30,
                      color: 'white',
                      marginRight: 5,
                      marginTop: 5,
                    }}
                  />
                  {data.length ? (
                    <Badge
                      style={{
                        position: 'absolute',
                        fontSize: 15,
                        borderColor: 'white',
                        borderWidth: 1,
                      }}>
                      {data.length}
                    </Badge>
                  ) : null}
                </TouchableOpacity>
              </View>
            ),
          }}
        />
        <Stack.Screen
          name="ScanShipment"
          component={ScanShipment}
          options={{
            headerTitle: props => (
              <NativeBaseProvider>
                <Heading style={{color: 'white'}} size="md">
                  Scan Shipment
                </Heading>
              </NativeBaseProvider>
            ),
            headerLeft: () => (
              <MaterialIcons
                name="menu"
                style={{fontSize: 30, marginLeft: 10, color: 'white'}}
                onPress={() => navigation.toggleDrawer()}
              />
            ),
            headerRight: () => (
              <View style={{flexDirection: 'row', marginRight: 10}}>
                <Text style={{fontSize: 12, color: 'white'}}>
                  {lastSyncTime11}
                </Text>
                <TouchableOpacity
                  style={{marginRight: 15}}
                  onPress={() => {
                    sync11();
                  }}>
                  <MaterialIcons
                    name="sync"
                    style={{fontSize: 30, color: 'white', marginTop: 5}}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('NewSellerAdditionNotification');
                  }}>
                  <MaterialIcons
                    name="bell-outline"
                    style={{
                      fontSize: 30,
                      color: 'white',
                      marginRight: 5,
                      marginTop: 5,
                    }}
                  />
                  {data.length ? (
                    <Badge
                      style={{
                        position: 'absolute',
                        fontSize: 15,
                        borderColor: 'white',
                        borderWidth: 1,
                      }}>
                      {data.length}
                    </Badge>
                  ) : null}
                </TouchableOpacity>
              </View>
            ),
          }}
        />
        <Stack.Screen
          name="CollectPOD"
          component={CollectPOD}
          options={{
            headerTitle: props => (
              <NativeBaseProvider>
                <Heading style={{color: 'white'}} size="md">
                  Seller Deliveries
                </Heading>
              </NativeBaseProvider>
            ),
            headerLeft: () => (
              <MaterialIcons
                name="menu"
                style={{fontSize: 30, marginLeft: 10, color: 'white'}}
                onPress={() => navigation.toggleDrawer()}
              />
            ),
            headerRight: () => (
              <View style={{flexDirection: 'row', marginRight: 10}}>
                {/* <Text style={{fontSize: 12, color: 'white'}}>{lastSyncTime11}</Text>
                <TouchableOpacity
                  style={{marginRight: 15}}
                  onPress={() => {
                    sync11();
                  }}>
                  <MaterialIcons
                    name="sync"
                    style={{fontSize: 30, color: 'white',marginTop:5}}
                  />
                </TouchableOpacity> */}
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('NewSellerAdditionNotification');
                  }}>
                  <MaterialIcons
                    name="bell-outline"
                    style={{
                      fontSize: 30,
                      color: 'white',
                      marginRight: 5,
                      marginTop: 5,
                    }}
                  />
                  {data.length ? (
                    <Badge
                      style={{
                        position: 'absolute',
                        fontSize: 15,
                        borderColor: 'white',
                        borderWidth: 1,
                      }}>
                      {data.length}
                    </Badge>
                  ) : null}
                </TouchableOpacity>
              </View>
            ),
          }}
        />
        <Stack.Screen
          name="Dispatch"
          component={Dispatch}
          options={{
            headerTitle: props => (
              <NativeBaseProvider>
                <Heading style={{color: 'white'}} size="md">
                  Bag to Dispatch
                </Heading>
              </NativeBaseProvider>
            ),
            headerLeft: () => (
              <MaterialIcons
                name="menu"
                style={{fontSize: 30, marginLeft: 10, color: 'white'}}
                onPress={() => navigation.toggleDrawer()}
              />
            ),
          }}
        />

        <Stack.Screen
          name="MapScreen"
          component={MapScreen}
          options={{
            headerTitle: props => (
              <NativeBaseProvider>
                <Heading style={{color: 'white'}} size="md">
                  Map Navigation
                </Heading>
              </NativeBaseProvider>
            ),
            headerLeft: () => (
              <MaterialIcons
                name="menu"
                style={{fontSize: 30, marginLeft: 10, color: 'white'}}
                onPress={() => navigation.toggleDrawer()}
              />
            ),
            headerRight: () => (
              <View style={{flexDirection: 'row', marginRight: 10}}>
                {/* <TouchableOpacity
                  style={{marginRight: 15}}
                  onPress={() => {
                    sync11();
                  }}>
                  <MaterialIcons
                    name="sync"
                    style={{fontSize: 30, color: 'white'}}
                  /> */}
                {/* </TouchableOpacity> */}
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('NewSellerAdditionNotification');
                  }}>
                  <MaterialIcons
                    name="bell-outline"
                    style={{fontSize: 30, color: 'white', marginRight: 5}}
                  />
                  {data.length ? (
                    <Badge
                      style={{
                        position: 'absolute',
                        fontSize: 15,
                        borderColor: 'white',
                        borderWidth: 1,
                      }}>
                      {data.length}
                    </Badge>
                  ) : null}
                </TouchableOpacity>
              </View>
            ),
          }}
        />

        <Stack.Screen
          name="reject"
          component={Reject}
          options={{
            header: () => null,
          }}
        />

        <Stack.Screen
          name="POD"
          component={POD}
          options={{
            headerTitle: props => (
              <NativeBaseProvider>
                <Heading style={{color: 'white'}} size="md">
                  Pickup Summary
                </Heading>
              </NativeBaseProvider>
            ),
            headerLeft: () => (
              <MaterialIcons
                name="menu"
                style={{fontSize: 30, marginLeft: 10, color: 'white'}}
                onPress={() => navigation.toggleDrawer()}
              />
            ),
          }}
        />

        <Stack.Screen
          name="MyTrip"
          component={MyTrip}
          options={{
            headerTitle: props => (
              <NativeBaseProvider>
                <Heading style={{color: 'white'}} size="md">
                  My Trip
                </Heading>
              </NativeBaseProvider>
            ),
            headerLeft: () => (
              <MaterialIcons
                name="menu"
                style={{fontSize: 30, marginLeft: 10, color: 'white'}}
                onPress={() => navigation.toggleDrawer()}
              />
            ),
          }}
        />

        <Stack.Screen
          name="StartEndDetails"
          component={StartEndDetails}
          options={{
            headerTitle: props => (
              <NativeBaseProvider>
                <Heading style={{color: 'white'}} size="md">
                  Trip Details
                </Heading>
              </NativeBaseProvider>
            ),
            headerLeft: () => (
              <MaterialIcons
                name="menu"
                style={{fontSize: 30, marginLeft: 10, color: 'white'}}
                onPress={() => navigation.toggleDrawer()}
              />
            ),
          }}
        />

        <Stack.Screen
          name="NewSellerAdditionNotification"
          component={NewSellerAdditionNotification}
          options={{
            headerTitle: props => (
              <NativeBaseProvider>
                <Heading style={{color: 'white'}} size="md">
                  Notification
                </Heading>
              </NativeBaseProvider>
            ),
            headerLeft: () => (
              <MaterialIcons
                name="menu"
                style={{fontSize: 30, marginLeft: 10, color: 'white'}}
                onPress={() => navigation.toggleDrawer()}
              />
            ),
          }}
        />
      </Stack.Navigator>

      {isLoading && userId && userId.length > 0 && isLogin ? (
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
          <Text style={{color: 'white'}}>Syncing Data. Please Wait...</Text>
          <Lottie
            source={require('./src/assets/loading11.json')}
            autoPlay
            loop
            speed={1}
          />
          <ProgressBar width={70} />
        </View>
      ) : null}
    </NativeBaseProvider>
  );
}
function CustomDrawerContent({navigation}) {
  const [language, setLanguage] = useState('');
  const [email, SetEmail] = useState('');
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@storage_Key');
      if (value !== null) {
        const data = JSON.parse(value);
        setName(data.UserName);
        SetEmail(data.UserEmail);
        setId(data.userId);
      } else {
        setName('');
        SetEmail('');
        setId('');
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const StartValue = setInterval(() => {
      getData();
    }, 1000);
    return () => clearInterval(StartValue);
  }, []);

  const LogoutHandle = async () => {
    try {
      await AsyncStorage.removeItem('@storage_Key');
      // await AsyncStorage.removeItem('@StartEndTrip');
    } catch (e) {
      console.log(e);
    }
    try {
      await AsyncStorage.multiRemove(await AsyncStorage.getAllKeys());
      console.log('AsyncStorage cleared successfully!');
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
    }

    db.transaction(tx => {
      tx.executeSql(
        'SELECT name FROM sqlite_master WHERE type=\'table\' AND name NOT LIKE \'sqlite_%\'',
        [],
        (tx1, result) => {


          console.log(result);
          let i = 0;
          for ( i = 0; i < result.rows.length; i++) {
            const tableName = result.rows.item(i).name;
            console.log(tableName);
            tx.executeSql(`DROP TABLE IF EXISTS ${tableName}`);
          }
          if (i === result.rows.length){
            console.log('SQlite DB cleared successfully!');
          }


        },
      );
    });

  };
  return (
    <NativeBaseProvider>
      {email ? (
        <Box pt={4} px={4} key={'extra' + email}>
          <Avatar bg="#004aad" alignSelf="center" size="xl">
            <MaterialIcons
              name="account"
              style={{fontSize: 60, color: 'white'}}
            />
          </Avatar>
          <Heading alignSelf="center" mt={2}>
            {name}
          </Heading>
          <Text alignSelf="center">{email}</Text>
          <Button
            onPress={() => {
              LogoutHandle();

              navigation.dispatch(
                CommonActions.reset({
                  index: 1,
                  routes: [
                    { name: 'Login' },
                    // {
                    //   name: 'Profile',
                    //   params: { user: 'jane' },
                    // },
                  ],
                })
              );
             
              // navigation.navigate('Login');
              navigation.closeDrawer();
            }}
            mt={2}
            style={{backgroundColor: '#004aad'}}>
            Logout
          </Button>
        </Box>
      ) : (
        <Box pt={4} px={4}>
          <Button
            onPress={() => {
              navigation.dispatch(
                CommonActions.reset({
                  index: 1,
                  routes: [
                    { name: 'Login' },
                    // {
                    //   name: 'Profile',
                    //   params: { user: 'jane' },
                    // },
                  ],
                })
              );
              // navigation.navigate('Login');
              navigation.closeDrawer();
            }}
            mt={2}
            style={{backgroundColor: '#004aad'}}>
            Login
          </Button>
        </Box>
      )}
      {email ? (
        <View>
          <Divider my="4" />
          <Box px={4}>
            <Button
              variant="outline"
              onPress={() => {
                navigation.navigate('Main');
                navigation.closeDrawer();
              }}
              style={{color: '#004aad', borderColor: '#004aad'}}>
              <Text style={{color: '#004aad'}}>Home</Text>
            </Button>
            <Button
              variant="outline"
              onPress={() => {
                navigation.navigate('MyTrip', {userId: id});
                navigation.closeDrawer();
              }}
              mt={4}
              style={{color: '#004aad', borderColor: '#004aad'}}>
              <Text style={{color: '#004aad'}}>My Trip</Text>
            </Button>
          </Box>
        </View>
      ) : null}
      <Divider my="4" />
      <Box px={4}>
        <Select
          selectedValue={language}
          minWidth="200"
          accessibilityLabel="Choose Language"
          placeholder="Choose Language"
          _selectedItem={{bg: '#004aad', color: 'white'}}
          mt={0}
          onValueChange={itemValue => setLanguage(itemValue)}>
          <Select.Item label="English (EN)" value="English" />
          <Select.Item label="Hindi (HI)" value="Hindi" />
          <Select.Item label="Marathi (MT)" value="Marathi" />
          <Select.Item label="Urdu (UD)" value="Urdu" />
          <Select.Item label="Telgu (TG)" value="Telgu" />
          <Select.Item label="Tamil (TL)" value="Tamil" />
        </Select>
      </Box>
      <Center style={{bottom: 0, position: 'absolute', left: '15%'}}>
        <Image
          style={{width: 200, height: 150}}
          source={require('./src/assets/image.png')}
          alt={'Logo Image'}
        />
      </Center>
    </NativeBaseProvider>
  );
}

export default function App({navigation}) {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="home"
        key={'home'}
        drawerContent={props => <CustomDrawerContent {...props} />}>
        <Drawer.Screen
          name="home"
          component={StackNavigators}
          options={{
            header: () => null,
          }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

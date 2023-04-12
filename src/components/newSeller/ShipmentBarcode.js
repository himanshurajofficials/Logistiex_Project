/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  NativeBaseProvider,
  Image,
  Box,
  Fab,
  Icon,
  Button,
  Modal,
  Input,
} from 'native-base';
import React, {useEffect, useState, useRef} from 'react';
import axios from 'axios';
import {
  Text,
  View,
  ScrollView,
  Vibration,
  ToastAndroid,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
} from 'react-native';
import Sound from 'react-native-sound';
import HapticFeedback from 'react-native-haptic-feedback';
import {Center} from 'native-base';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import {openDatabase} from 'react-native-sqlite-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import NetInfo from '@react-native-community/netinfo';
import RNBeep from 'react-native-a-beep';
import {Picker} from '@react-native-picker/picker';
import GetLocation from 'react-native-get-location';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import OTPTextInput from 'react-native-otp-textinput';

import dingReject11 from '../../assets/rejected_sound.mp3';

import dingAccept11 from '../../assets/beep_accepted.mp3';
import { backendUrl } from '../../utils/backendUrl';
const db = openDatabase({
  name: 'rn_sqlite',
});

const ShipmentBarcode = ({route}) => {
  const [expected, setExpected] = useState(0);
  const [newaccepted, setnewAccepted] = useState(0);
  const [newrejected, setnewRejected] = useState(0);
  const [newNotPicked, setNewNotPicked] = useState(0);
  const [barcode, setBarcode] = useState('');
  const [packagingAction, setPackagingAction] = useState(0);
  const [len, setLen] = useState(0);
  const [DropDownValue, setDropDownValue] = useState('');
  const [rejectedData, setRejectedData] = useState([]);
  const [acceptedArray, setAcceptedArray] = useState([]);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  const [sellerLatitude, setSellerLatitude] = useState(0);
  const [sellerLongitude, setSellerLongitude] = useState(0);

  const [modalVisible, setModalVisible] = useState(false);
  const [bagId, setBagId] = useState('');
  const [bagIdNo, setBagIdNo] = useState(1);
  const [showCloseBagModal, setShowCloseBagModal] = useState(false);
  const [showCloseBagModal11, setShowCloseBagModal11] = useState(false);
  const [showCloseBagModal12, setShowCloseBagModal12] = useState(false);
  const [showModal, setModal] = useState(false);
  const [showModal1, setModal1] = useState(false);
  const [bagSeal, setBagSeal] = useState('');
  const [check11, setCheck11] = useState(0);
  const [pdCheck, setPDCheck] = useState(false);
  const [expectedPackagingId, setExpectedPackaging] = useState('');

  const buttonColor = acceptedArray.length === 0 ? 'gray.300' : '#004aad';

  const buttonColorRejected = check11 === 0 ? 'gray.300' : '#004aad';
  var otpInput = useRef(null);
  const [name, setName] = useState('');
  const [inputOtp, setInputOtp] = useState('');
  const [mobileNumber, setMobileNumber] = useState(route.params.phone);
  const [showModal11, setShowModal11] = useState(false);
  const [modalVisible11, setModalVisible11] = useState(false);
  const [DropDownValue11, setDropDownValue11] = useState('');
  const [PartialCloseData, setPartialCloseData] = useState([]);
  const [closeBagColor, setCloseBagColor] = useState('gray.300');
  const [showQRCodeModal, setShowQRCodeModal] = useState(true);

  const currentDate = new Date().toISOString().slice(0, 10);
  let serialNo = 0;


const [text11,setText11] = useState('');
const [text12,setText12] = useState('');
    const buttonColor11 = text11.length === 1 ? '#004aad' : 'white';
    const [isPressed, setIsPressed] = useState(false);

  const [scanned, setScanned] = useState(true);
  const scannerRef = useRef(null);

  // const acceptSound = new Sound('accept.mp3', Sound.MAIN_BUNDLE);
  // const rejectSound = new Sound('reject.mp3', Sound.MAIN_BUNDLE);


  // useEffect(() => {
  //   // Get the current location of the device
  //   Geolocation.getCurrentPosition(
  //     position => {
  //       setCurrentLocation({ lat: position.coords.latitude, long: position.coords.longitude });
  //     },
  //     error => console.log(error),
  //     { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
  //   );
  // }, []);

  // Calculate the distance between the two locations using the Haversine formula
  const calculateDistance = (lat1, long1, lat2, long2) => {
    const R = 6371; // radius of the earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((long2 - long1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c * 1000;
    console.log('Distance between seller and pickup is ' + d + ' meters and ' + d / 1000 + ' Km' ); // distance in meters
    return d;
  };

  // Check if the current location is within 100 meters of the seller location
  const isWithin100Meters = (cLatitude,cLongitude) => {
    console.log(cLatitude,cLongitude,sellerLatitude,
      sellerLongitude,);
    const distance = calculateDistance(
      cLatitude,
      cLongitude,
      sellerLatitude,
      sellerLongitude,
    );
    // return distance <= 100;
    return distance;

  };

  // Handle the action based on the geofencing logic
  const handleRejectAction = () => {

    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 10000,
    })
      .then(location => {
        console.log('lat long updating ');
        setLatitude(location.latitude);
        setLongitude(location.longitude);
        let m = isWithin100Meters(location.latitude,location.longitude);
        if (m <= 100) {
          rejectDetails2();
        } else {

          Alert.alert('Shipment cannot be rejected',  Math.floor(m) < 1000 ? 'You are currently ' + Math.floor(m) + ' meters away from the seller.' : 'You are currently ' + Math.floor(m) / 1000 + ' Km away from the seller.', [

            {
              text: 'Cancel reject',
              onPress: () =>{ console.log('Cancel Pressed'); setDropDownValue('');},
              style: 'cancel',
            },{
              text: 'Retry',
              onPress: () => handleRejectAction(),
            },
          ]);
        }



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

  const vibrateDevice = (type) => {
    const options = {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    };
    HapticFeedback.trigger(type, options);
  };

  const reloadScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.reactivate();
    }
  };

  const sellerLatLongLoad = ()=>{
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM SyncSellerPickUp where  consignorCode=? ',
        [route.params.consignorCode],
        (tx1, results) => {
          console.log(results);
          setSellerLatitude(results.rows.item(0).consignorLatitude);
          setSellerLongitude(results.rows.item(0).consignorLongitude);
        },
      );
    });

  };


  Sound.setCategory('Playback');

var dingAccept = new Sound(dingAccept11, error => {
  if (error) {
    console.log('failed to load the sound', error);
    return;
  }
  // if loaded successfully
  // console.log(
  //   'duration in seconds: ' +
  //     dingAccept.getDuration() +
  //     'number of channels: ' +
  //     dingAccept.getNumberOfChannels(),
  // );
});

  useEffect(() => {
    dingAccept.setVolume(1);
    return () => {
      dingAccept.release();
    };
  }, []);

  var dingReject = new Sound(dingReject11, error => {
    if (error) {
      console.log('failed to load the sound', error);
      return;
    }
    // if loaded successfully
    // console.log(
    //   'duration in seconds: ' +
    //   dingReject.getDuration() +
    //     'number of channels: ' +
    //     dingReject.getNumberOfChannels(),
    // );
  });

    useEffect(() => {
      dingReject.setVolume(1);
      return () => {
        dingReject.release();
      };
    }, []);

  useEffect(() => {
    reloadScanner();
    sellerLatLongLoad();
    // Sound.setCategory('Playback');
  }, []);
  const DisplayData11 = async () => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM PartialCloseReasons', [], (tx1, results) => {
        let temp = [];
        // console.log(results.rows.length);
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));
        }
        // console.log('Data from Local Database partialClosure : \n ', temp);
        setPartialCloseData(temp);
        // console.log('Table6 DB OK:', temp.length);
      });
    });
  };
  useEffect(() => {
    DisplayData11();
    check121();
  }, []);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      displayDataSPScan();
      check121();
    sellerLatLongLoad();
      Sound.setCategory('Playback');
    });
    return unsubscribe;
  }, [navigation]);
  // useEffect(() => {
  //   partialClose112();
  // }, []);

  const check121 = ()=>{
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM closeBag1 WHERE  consignorCode=? And status="scanPending"',
        [route.params.consignorCode],
        (tx1, results) => {
          if (results.rows.length > 0){
          setPDCheck(true);
          } else {
            setPDCheck(false);
          }
        },
      );
    });
  };
  const displayDataSPScan = async () => {

    // db.transaction(tx => {
    //   tx.executeSql(
    //     'SELECT * FROM closeBag1 WHERE  consignorCode=? And status="scanPending"',
    //     [route.params.consignorCode],
    //     (tx1, results) => {
    //       if(results.rows.length>0){
    //       setPDCheck(true);
    //       }else{
    //         setPDCheck(false);
    //       }
    //     },
    //   );
    // });

    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM SellerMainScreenDetails where shipmentAction="Seller Pickup" AND consignorCode=?  AND status="accepted"',
        [route.params.consignorCode],
        (tx1, results) => {
          setnewAccepted(results.rows.length);
        },
      );
    });
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM SellerMainScreenDetails where shipmentAction="Seller Pickup" AND consignorCode=? AND status="notPicked"',
        [route.params.consignorCode],
        (tx1, results) => {
          setNewNotPicked(results.rows.length);
        },
      );
    });
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM SellerMainScreenDetails where shipmentAction="Seller Pickup" AND consignorCode=? AND status="rejected"',
        [route.params.consignorCode],
        (tx1, results) => {
          setnewRejected(results.rows.length);
        },
      );
    });
  };

  const partialClose112 = () => {
    console.log('partialClose popup shown11');

    if (newaccepted + newrejected === route.params.Forward) {
      console.log(newaccepted);
      // sendSmsOtp();
      navigation.navigate('POD', {
        Forward: route.params.Forward,
        accepted: newaccepted,
        rejected: newrejected,
        notPicked: newNotPicked,
        phone: route.params.phone,
        userId: route.params.userId,
        DropDownValue: DropDownValue11,
        consignorCode: route.params.consignorCode,
        contactPersonName: route.params.contactPersonName,
        runsheetno: route.params.PRSNumber,
        latitude: latitude,
        longitude: longitude,
      });
    } else {
      setDropDownValue11('');
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM closeBag1 WHERE  consignorCode=? And status="scanPending"',
          [route.params.consignorCode],
          (tx1, results) => {
            if (results.rows.length > 0){
            setPDCheck(true);
            setModalVisible11(true);
            } else {
              setPDCheck(false);
               setModalVisible11(true);
            }
          },
        );
      });
      // setModalVisible11(true);
    }
  };

  // const clearText = () => {
  //   otpInput.current.clear();
  // }

  // const setText = () => {
  //   otpInput.current.setValue("1234");
  // }

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

  const sendSmsOtp = async () => {
    console.log(mobileNumber);
    const response = await axios
      .post(backendUrl + 'SMS/msg', {
        mobileNumber: mobileNumber,
      })
      .then(setShowModal11(true))
      .catch(err => console.log('OTP not send'));
    // if (response.status === 200) {
    //   setShowModal11(true);
    // }
    // else {
    //   console.log('Otp not send', response);
    // }
  };

  function handleButtonPress11(item) {
    console.log('partial button 121' + item);
    if (item === 'PCR1') {
      setDropDownValue11('');
      setModalVisible11(false);
      navigation.navigate('Dispatch', {
        consignorCode: route.params.consignorCode,
      });
    }
    setDropDownValue11(item);
    // setModalVisible11(false);
  }

  function validateOTP() {
    axios
      .post(backendUrl + 'SMS/OTPValidate', {
        mobileNumber: mobileNumber,
        otp: inputOtp,
      })
      .then(response => {
        if (response.data.return) {
          // submitForm11();
          setInputOtp('');
          setShowModal11(false);
          ToastAndroid.show('Submit successful', ToastAndroid.SHORT);
          navigation.navigate('Main', {
            userId: route.params.userId,
          });
        } else {
          alert('Invalid OTP, please try again !!');
        }
      })
      .catch(error => {
        alert('Invalid OTP, please try again !!');
        console.log(error);
      });
  }

  // useEffect(() => {
  //   setBagId();
  // }, [bagId]);

  // useEffect(() => {
  //       updateDetails2();
  //       console.log("fdfdd "+barcode);
  // });

  function CloseBagEndScan() {
    partialClose112();
    console.log(bagSeal);
    console.log(acceptedArray);
    let date = new Date().getDate();
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();
    let date11 = date + '' + month + '' + year;
    // console.log(route.params.userId + date11 + bagIdNo);
    let bagId11 = route.params.userId + date11 + bagIdNo;
    setBagId(route.params.userId + date11 + bagIdNo);
    console.log(bagId);

    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM closeBag1 ',
        [],
        (tx, results) => {
          console.log(results.rows.length);
          serialNo = results.rows.length + 1;
          const bagID =
            route.params.userId + currentDate + (results.rows.length + 1);
          console.log(bagID);
          console.log(results);
          tx.executeSql(
            'INSERT INTO closeBag1 (bagSeal, bagId, bagDate, AcceptedList,status,consignorCode) VALUES (?, ?, ?, ?,?,?)',
            [
              bagSeal,
              route.params.userId +
                '-' +
                currentDate +
                '-' +
                (results.rows.length + 1),
              currentDate,
              JSON.stringify(acceptedArray),
              'scanPending',
              route.params.consignorCode,
            ],
            (tx, results11) => {
              console.log('Row inserted successfully');
              setBagIdNo(bagIdNo + 1);
              setAcceptedArray([]);
              setBagSeal('');
              console.log('\n Data Added to local db successfully closeBag');
              ToastAndroid.show('Bag closed successfully', ToastAndroid.SHORT);
              console.log(results11);
              setBarcode('');
              setPDCheck(true);
              setCheck11(0);
              setText11('');
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

  function CloseBag() {
    console.log(bagSeal);
    console.log(acceptedArray);
    let date = new Date().getDate();
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();
    let date11 = date + '' + month + '' + year;
    // console.log(route.params.userId + date11 + bagIdNo);
    let bagId11 = route.params.userId + date11 + bagIdNo;
    setBagId(route.params.userId + date11 + bagIdNo);
    console.log(bagId);

    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM closeBag1 ',
        [],
        (tx, results) => {
          console.log(results.rows.length);
          serialNo = results.rows.length + 1;
          const bagID =
            route.params.userId + currentDate + (results.rows.length + 1);
          console.log(bagID);
          console.log(results);

          tx.executeSql(
            'INSERT INTO closeBag1 (bagSeal, bagId, bagDate, AcceptedList,status,consignorCode) VALUES (?, ?, ?, ?,?,?)',
            [
              bagSeal,
              route.params.userId +
                '-' +
                currentDate +
                '-' +
                (results.rows.length + 1),
              currentDate,
              JSON.stringify(acceptedArray),
              'scanPending',
              route.params.consignorCode,
            ],
            (tx, results11) => {
              console.log('Row inserted successfully');
              setBagIdNo(bagIdNo + 1);
              setAcceptedArray([]);
              setBagSeal('');
              console.log('\n Data Added to local db successfully closeBag');
              ToastAndroid.show('Bag closed successfully', ToastAndroid.SHORT);
              console.log(results11);
              setBarcode('');
              setPDCheck(true);
                setText11('');
                setCheck11(0);
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
      tx.executeSql('SELECT * FROM closeBag1', [], (tx1, results) => {
        let temp = [];
        console.log(results.rows.length);
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));
        }
        // ToastAndroid.show("Sync Successful",ToastAndroid.SHORT);
        console.log(
          'Data from Local Database : \n ',
          JSON.stringify(temp, null, 4),
        );
        // console.log('Table1 DB OK:', temp.length);
      });
    });
  };
  useEffect(() => {
    createTableBag1();
  }, []);

  const createTableBag1 = () => {
    db.transaction(tx => {
      // tx.executeSql('DROP TABLE IF EXISTS closeBag1', []);
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS closeBag1 (bagSeal TEXT PRIMARY KEY, bagId TEXT, bagDate TEXT, AcceptedList TEXT,status TEXT,consignorCode Text)',
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
  const updateDetails2 = () => {
    console.log('scan ' + barcode.toString());
    setAcceptedArray([...acceptedArray, barcode.toString()]);
    console.log(acceptedArray);
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE SellerMainScreenDetails SET status="accepted", eventTime=?, latitude=?, longitude=? WHERE  consignorCode=? AND (awbNo=? OR clientRefId=? OR clientShipmentReferenceNumber=?) ',
        [
          new Date().valueOf(),
          latitude,
          longitude,
          route.params.consignorCode,
          barcode,
          barcode,
          barcode,
        ],
        (tx1, results) => {
          let temp = [];
          console.log('Results', results.rowsAffected);

          if (results.rowsAffected > 0) {
            console.log(barcode + 'accepted');
            Vibration.vibrate(200);
            dingAccept.play(success => {
              if (success) {
                // Vibration.vibrate(800);
                console.log('successfully finished playing');
              } else {
                console.log('playback failed due to audio decoding errors');
              }
            });
            displayDataSPScan();
            // ToastAndroid.show(barcode + ' Accepted',ToastAndroid.SHORT);
          } else {
            console.log(barcode + 'not accepted');
          }
          console.log(results.rows.length);
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(results.rows.item(i));
          }
          // console.log("Data updated: \n ", JSON.stringify(temp, null, 4));
          // viewDetails2();
        },
      );
    });
  };

  const barcodeCheck11 = () => {
    db.transaction(tx => {
      tx.executeSql(
        'Select * FROM SellerMainScreenDetails WHERE status IS NOT NULL AND (awbNo=? OR clientRefId=? OR clientShipmentReferenceNumber=?)',
        [barcode, barcode, barcode],
        (tx1, results) => {
          console.log('Results121', results.rows.length);
          console.log(barcode);
          if (results.rows.length === 0) {
            ToastAndroid.show('Scanning wrong product', ToastAndroid.SHORT);
          } else {
            ToastAndroid.show(barcode + ' already scanned', ToastAndroid.SHORT);
          }
        },
      );
    });
  };

    const rejectDetails2 = () => {
      console.log('scan 45456');
var barcode11 = barcode;
      if (packagingAction == 0){
        db.transaction((tx) => {
          tx.executeSql('UPDATE SellerMainScreenDetails SET status="rejected" ,rejectionReasonL1=?  WHERE status="accepted" AND consignorCode=? AND (awbNo=? OR clientRefId=? OR clientShipmentReferenceNumber=?) ', [DropDownValue,route.params.consignorCode, barcode11,barcode11,barcode11], (tx1, results) => {
            let temp = [];
            console.log('Rejected Reason : ', DropDownValue);
            console.log('Results', results.rowsAffected);
            console.log(results);
            if (results.rowsAffected > 0) {
              // ContinueHandle11();
              console.log(barcode11 + 'rejected');
              ToastAndroid.show(barcode11 + ' Rejected', ToastAndroid.SHORT);
              setCheck11(0);
              // Vibration.vibrate(100);
              Vibration.vibrate(200);
              dingAccept.play(success => {
                if (success) {
                  // Vibration.vibrate(800);
                  console.log('successfully finished playing');
                } else {
                  console.log('playback failed due to audio decoding errors');
                }
              });

              setDropDownValue('');
              console.log(acceptedArray);
              const newArray = acceptedArray.filter(item => item !== barcode11);
              console.log(newArray);
              setAcceptedArray(newArray);
              setBarcode('');
              displayDataSPScan();
            } else {
              console.log(barcode11 + 'failed to reject item locally');
            }
            console.log(results.rows.length);
            for (let i = 0; i < results.rows.length; ++i) {
              temp.push(results.rows.item(i));
            }
            // console.log("Data updated: \n ", JSON.stringify(temp, null, 4));
            // viewDetailsR2();
          },
        );
      });
      }
      else {
        db.transaction((tx) => {
          tx.executeSql('UPDATE SellerMainScreenDetails SET status="rejected" ,rejectionReasonL1=?  WHERE consignorCode=? AND (awbNo=? OR clientRefId=? OR clientShipmentReferenceNumber=?) ', [DropDownValue,route.params.consignorCode, barcode11,barcode11,barcode11], (tx1, results) => {
            let temp = [];
            console.log('Rejected Reason : ', DropDownValue);
            console.log('Results', results.rowsAffected);
            console.log(results);
            if (results.rowsAffected > 0) {
              // ContinueHandle11();
              console.log(barcode11 + 'rejected');
              ToastAndroid.show(barcode11 + ' Rejected', ToastAndroid.SHORT);
              setCheck11(0);
              // Vibration.vibrate(100);
              Vibration.vibrate(200);
              dingAccept.play(success => {
                if (success) {
                  // Vibration.vibrate(800);
                  console.log('successfully finished playing');
                } else {
                  console.log('playback failed due to audio decoding errors');
                }
              });
              setDropDownValue('');
              setBarcode('');
              displayDataSPScan();
              setExpectedPackaging('');
            }
            for (let i = 0; i < results.rows.length; ++i) {
              temp.push(results.rows.item(i));
            }
          },
        );
      });
      }
  };

  const viewDetails2 = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM SellerMainScreenDetails where status = "accepted"',
        [],
        (tx1, results) => {
          let temp = [];
          console.log(results.rows.length);
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(results.rows.item(i));
            console.log('barcode ' + results.rows.item(i).awbNo);
          }
          // ToastAndroid.show('Sync Successful',ToastAndroid.SHORT);
          console.log(
            'Data from Local Database : \n ',
            JSON.stringify(temp, null, 4),
          );
        },
      );
    });
  };
  const viewDetailsR2 = () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM SellerMainScreenDetails where status = "rejected"',
        [],
        (tx1, results) => {
          let temp = [];
          console.log(results.rows.length);
          // setnewRejected(results.rows.length);
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(results.rows.item(i));
            console.log('barcode ' + results.rows.item(i).awbNo);
          }
          // ToastAndroid.show('Sync Successful',ToastAndroid.SHORT);
          console.log(
            'Data from Local Database : \n ',
            JSON.stringify(temp, null, 4),
          );
        },
      );
    });
  };
  const partialClose = () => {
    setDropDownValue11('');
  };

  const getCategories = (data) => {
    db.transaction(txn => {
      txn.executeSql(
        'SELECT * FROM SellerMainScreenDetails WHERE status IS NULL AND shipmentAction="Seller Pickup" AND  consignorCode=? AND (awbNo=? OR clientRefId=? OR clientShipmentReferenceNumber = ?)',
        [route.params.consignorCode, data, data, data],
        (sqlTxn, res) => {
          // console.log('categories retrieved successfully', res.rows.length);
          console.log('ok1111', data);
          console.log(data, data, data);
          setLen(res.rows.length);
          setBarcode(data);
          if (!res.rows.length) {
            // alert('You are scanning wrong product, Please check.');
            console.log(data);
            console.log('ok2222', data);
            // barcodeCheck11();
            db.transaction(tx => {
              console.log('ok3333', data);
              tx.executeSql(
                'Select * FROM SellerMainScreenDetails WHERE status IS NOT NULL And shipmentAction="Seller Pickup" And consignorCode=? AND (awbNo=? OR clientRefId=? OR clientShipmentReferenceNumber=?)',
                [route.params.consignorCode, data, data, data],
                (tx1, results) => {
                  console.log('Results121', results.rows.length);
                  console.log('ok4444', data);

                  console.log(data);
                  if (results.rows.length === 0) {
                    ToastAndroid.show(
                      'Scanning wrong product',
                      ToastAndroid.SHORT,
                    );
                    setCheck11(0);
                    Vibration.vibrate(800);
                    dingReject.play(success => {
                      if (success) {

                        console.log('successfully finished playing');
                      } else {
                        console.log('playback failed due to audio decoding errors');
                      }
                    });
                    setBarcode('');
                  } else {
                    ToastAndroid.show(data + ' already scanned',ToastAndroid.SHORT);
                    Vibration.vibrate(800);
                    setCheck11(0);
                    dingReject.play(success => {
                      if (success) {

                        console.log('successfully finished playing');
                      } else {
                        console.log('playback failed due to audio decoding errors');
                      }
                    });
                    setBarcode('');

                  }
                },
              );
            });
          }
        },
        error => {
          console.log('error on getting categories ' + error.message);
        },
      );
    });
    if (packagingAction != 0 && packagingAction != 1 && barcode){
      setShowCloseBagModal12(true);
    }
    if (packagingAction == 1){
      handlepackaging();
    }
  };
  console.log(text11);
  // const fetchData = async () => {
  //   const tx = await db.transaction();
  //   const result = await tx.executeSql(
  //     'SELECT * FROM SellerMainScreenDetails where awbNo="XB-NaNNaNNaN16104" OR clientRefId="1679740804375" OR clientShipmentReferenceNumber="D59uuyd7M"',
  //     [],
  //   );
  //   let temp = [];
  //         console.log(result.rows.length);
  //         for (let i = 0; i < result.rows.length; ++i) {
  //           temp.push(result.rows.item(i));
  //         }
  //         setPackagingAction(temp[0].packagingAction);
  // };

  // useEffect(() => {
  //   const unsubscribe = navigation.addListener('focus', fetchData);
  //   return unsubscribe;
  // }, [navigation]);
  const displayData = async () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM SellerMainScreenDetails where awbNo=? OR clientRefId=? OR clientShipmentReferenceNumber=?',
        [text11,text11,text11],
        (tx1, results) => {
          // ToastAndroid.show("Loading...", ToastAndroid.SHORT);
          let temp = [];
          console.log(results.rows.length);
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(results.rows.item(i));
          }
          setPackagingAction(temp[0].packagingAction);
        },
      );
    });
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      displayData();
    });
    return unsubscribe;
  }, [navigation]);
  useEffect(() => {
    (async () => {
        displayData();
    })();
}, [text11]);

console.log('pa',packagingAction);
  const updateCategories = data => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE SellerMainScreenDetails set status=? where clientShipmentReferenceNumber=?',
        ['accepted', data],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
        },
      );
    });
  };

    const updateCategories1 = (data) => {
      db.transaction((tx) => {
        tx.executeSql(
          'UPDATE categories set ScanStatus=?, UploadStatus=? where clientShipmentReferenceNumber=?',
          [1, 1, data],
          (tx, results) => {
            console.log('Results', results.rowsAffected);
          }
        );
      });
    };
    const handlepackaging = ()=>{
      db.transaction(tx => {
        tx.executeSql(
          'UPDATE SellerMainScreenDetails SET eventTime=?, latitude=?, longitude=? WHERE  consignorCode=? AND (awbNo=? OR clientRefId=? OR clientShipmentReferenceNumber=?) ',
          [
            new Date().valueOf(),
            latitude,
            longitude,
            route.params.consignorCode,
            barcode,
            barcode,
            barcode,
          ],
          (tx1, results) => {
            let temp = [];
            console.log('Results', results.rowsAffected);

            if (results.rowsAffected > 0) {
              Vibration.vibrate(200);
              ToastAndroid.show(barcode + ' Saved', ToastAndroid.SHORT);
              dingAccept.play(success => {
                if (success) {
                  // Vibration.vibrate(800);
                  console.log('successfully finished playing');
                } else {
                  console.log('playback failed due to audio decoding errors');
                }
              });
            } else {
              console.log(barcode + 'not updated');
            }
            console.log(results.rows.length);
            for (let i = 0; i < results.rows.length; ++i) {
              temp.push(results.rows.item(i));
            }
          },
        );
      });

    };
    const onSuccess = e => {
      console.log(e.data, 'barcode');
      setBarcode(e.data);
      setText11(e.data);
      getCategories(e.data);
    };
    const onSuccess11 = e => {
      // Vibration.vibrate(100);
      // RNBeep.beep();
      Vibration.vibrate(100);
      dingAccept.play(success => {
        if (success) {

          console.log('successfully finished playing');
        } else {
          console.log('playback failed due to audio decoding errors');
        }
      });
      console.log(e.data, 'sealID');
      // getCategories(e.data);
      setBagSeal(e.data);
    };
    const onSuccess12 = e => {
      // Vibration.vibrate(100);
      // RNBeep.beep();
      Vibration.vibrate(100);
      dingAccept.play(success => {
        if (success) {

          console.log('successfully finished playing');
        } else {
          console.log('playback failed due to audio decoding errors');
        }
      });
      console.log(e.data, 'ExpectedPackagingID');
      // getCategories(e.data);
      setExpectedPackaging(e.data);
    };
    const onSucessThroughButton = (data21)=>{
      console.log(data21, 'barcode');
      setBarcode(data21);
      getCategories(data21);
    };

  useEffect(() => {
    if (len) {
      if (packagingAction == 0){
      setCheck11(1);
      ToastAndroid.show(barcode + ' Accepted', ToastAndroid.SHORT);
      updateDetails2();
      displayDataSPScan();
      setLen(false);
      }
    }
  }, [len]);

  const displaydata = async () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM ShipmentRejectReasons',
        [],
        (tx1, results) => {
          let temp = [];
          // console.log(results.rows.length);
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(results.rows.item(i));
          }
          // ToastAndroid.show('Sync Successful3', ToastAndroid.SHORT);
          setRejectedData(temp);

          // console.log('Data from Local Database reject reasons: \n ', JSON.stringify(temp, null, 4),);
          // console.log('Table3 DB OK:', temp.length);
        },
      );
    });
  };
  const navigation = useNavigation();
  const [count, setcount] = useState(0);

  useEffect(() => {
    displaydata();
  }, []);

  function handleButtonPress(item) {
    setDropDownValue(item);
  }

  return (
    <NativeBaseProvider>
      <Modal
        w="100%"
        isOpen={showModal11}
        onClose={() => setShowModal11(false)}>
        <Modal.Content w="100%" bg={'#eee'}>
          <Modal.CloseButton />
          <Modal.Body w="100%">
            <Modal.Header>Enter the OTP</Modal.Header>
            <OTPTextInput
              ref={e => (otpInput = e)}
              inputCount={6}
              handleTextChange={e => setInputOtp(e)}
            />
            <Box flexDir="row" justifyContent="space-between" mt={3}>
              <Button w="40%" bg="gray.500" onPress={() => sendSmsOtp()}>
                Resend
              </Button>
              <Button w="40%" bg="#004aad" onPress={() => validateOTP()}>
                Submit
              </Button>
            </Box>
          </Modal.Body>
        </Modal.Content>
      </Modal>
      <Modal
        isOpen={modalVisible11}
        onClose={() => {
          setModalVisible11(false);
          setDropDownValue11('');
        }}
        size="lg">
        <Modal.Content maxWidth="350">
          <Modal.CloseButton />
          <Modal.Header>Partial Close Reason</Modal.Header>
          <Modal.Body>
            {PartialCloseData &&
              PartialCloseData.map((d, index) =>
                 !pdCheck && d.reasonName === 'Partial Dispatch' ? (
                  <Button
                    h="12"
                    paddingBottom={5}
                    key={d.reasonID}
                    flex="1"
                    mt={2}
                    marginBottom={1.4}
                    marginTop={1.4}
                    style={{
                      backgroundColor:
                        d.reasonID === DropDownValue11 ? '#6666FF' : '#C8C8C8',
                      opacity: 0.4,
                    }}
                    title={d.reasonName} onPress={() => ToastAndroid.show('No bags for dispatch',ToastAndroid.SHORT)} >
                    {' '}
                    {/* onPress={() => ToastAndroid.show("No bags for dispatch",ToastAndroid.SHORT)}  */}
                    <Text
                      style={{
                        color:
                          d.reasonID === DropDownValue11 ? 'white' : 'black',
                        alignContent: 'center',
                        paddingTop: -5,
                      }}>
                      {' '}
                      {d.reasonName}{' '}
                    </Text>
                  </Button>
                ) : (
                  <Button
                    h="12"
                    paddingBottom={5}
                    key={d.reasonID}
                    flex="1"
                    mt={2}
                    marginBottom={1.4}
                    marginTop={1.4}
                    style={{
                      backgroundColor:
                        d.reasonID === DropDownValue11 ? '#6666FF' : '#C8C8C8',
                    }}
                    title={d.reasonName}
                    onPress={() => handleButtonPress11(d.reasonID)}>
                    {' '}
                    <Text
                      style={{
                        color:
                          d.reasonID === DropDownValue11 ? 'white' : 'black',
                        alignContent: 'center',
                        paddingTop: -5,
                      }}>
                      {' '}
                      {d.reasonName}{' '}
                    </Text>
                  </Button>
                ),
              )}

            <Button
              flex="1"
              mt={2}
              bg="#004aad"
              marginBottom={1.5}
              marginTop={1.5}
              onPress={() => {
                partialClose();
                setModalVisible11(false);
                console.log(latitude, longitude);
                navigation.navigate('POD', {
                  Forward: route.params.Forward,
                  accepted: newaccepted,
                  rejected: newrejected,
                  notPicked: newNotPicked,
                  phone: route.params.phone,
                  userId: route.params.userId,
                  consignorCode: route.params.consignorCode,
                  DropDownValue: DropDownValue11,
                  contactPersonName: route.params.contactPersonName,
                  runsheetno: route.params.PRSNumber,
                  latitude: latitude,
                  longitude: longitude,
                });
              }}>
              Submit
            </Button>
          </Modal.Body>
        </Modal.Content>
      </Modal>
      <View style={{backgroundColor: 'white', flex: 1, paddingTop: 30}}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Center>
            <Input
              mx="3"
              mt={4}
              placeholder="Receiver Name"
              w="90%"
              bg="gray.200"
              size="lg"
              value={name}
              onChangeText={e => setName(e)}
            />
            <Input
              mx="3"
              my={4}
              placeholder="Mobile Number"
              w="90%"
              bg="gray.200"
              size="lg"
              value={mobileNumber}
              onChangeText={e => setMobileNumber(e)}
            />
            <Button
              w="90%"
              size="lg"
              style={{backgroundColor: '#004aad', color: '#fff'}}
              title="Submit"
              onPress={() => sendSmsOtp()}>
              Submit
            </Button>
            <Button
              w="90%"
              mt={2}
              size="lg"
              style={{backgroundColor: '#004aad', color: '#fff'}}
              title="Submit"
              onPress={() => setModalVisible11(true)}>
              Partial Close
            </Button>
          </Center>
          <Center>
            <Image
              style={{width: 150, height: 150}}
              source={require('../../assets/image.png')}
              alt={'Logo Image'}
            />
          </Center>
        </ScrollView>
      </View>
      <Modal
        isOpen={showCloseBagModal11}
        onClose={() => {
          setShowCloseBagModal11(false);
          reloadScanner();
          setScanned(true);
        }}
        size="lg">
        <Modal.Content maxWidth="350">
          <Modal.CloseButton />
          <Modal.Header>Close Bag</Modal.Header>
          <Modal.Body>
            {showCloseBagModal11 && (
              <QRCodeScanner
                onRead={onSuccess11}
                reactivate={true}
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
              />
            )}
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
            <Button
              flex="1"
              mt={2}
              bg="#004aad"
              onPress={() => {
                CloseBagEndScan();
                setShowCloseBagModal11(false);
              }}>
              Submit
            </Button>
          </Modal.Body>
        </Modal.Content>
      </Modal>
      <Modal
        isOpen={showCloseBagModal12}
        onClose={() => {
          setShowCloseBagModal12(false);
          setExpectedPackaging('');
          reloadScanner();
          setScanned(true);
        }}
        size="lg">
        <Modal.Content maxWidth="350">
          <Modal.CloseButton />
          <Modal.Header>Packaging ID</Modal.Header>
          <Modal.Body>
            {showCloseBagModal12 && (
              <QRCodeScanner
                onRead={onSuccess12}
                reactivate={true}
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
              />
            )}
            {'\n'}
            <Input
              placeholder="Enter Packaging ID"
              size="md"
              value={expectedPackagingId}
              onChangeText={text => setExpectedPackaging(text)}
              style={{
                width: 290,
                backgroundColor: 'white',
              }}
            />
            {expectedPackagingId.length ?
            <Button
            flex="1"
            mt={2}
            bg="#004aad"
            onPress={() => {
              if (packagingAction == 2) {
                setModal(true);
                setShowCloseBagModal12(false);
              } else if (packagingAction == 3) {
                setModal1(true);
                setShowCloseBagModal12(false);
              } else {
                setShowCloseBagModal12(false);
                setExpectedPackaging('');
              }
            }}>
            Submit
          </Button>
          :
          <Button
              flex="1"
              mt={2}
              bg="gray.300"
              >
              Submit
            </Button>
            }
          </Modal.Body>
        </Modal.Content>
      </Modal>

      <Modal
        isOpen={showCloseBagModal}
        onClose={() => {
          setShowCloseBagModal(false);
          setShowQRCodeModal(true);
          reloadScanner();
        }}
        size="lg">
        <Modal.Content maxWidth="350">
          <Modal.CloseButton />
          <Modal.Header>Close Bag</Modal.Header>
          <Modal.Body>
            <QRCodeScanner
              onRead={onSuccess11}
              reactivate={true}
              reactivateTimeout={2000}
              flashMode={RNCamera.Constants.FlashMode.off}
              containerStyle={{height: 116, marginBottom: '55%'}}
              cameraStyle={{
                height: 90,
                marginTop: 95,
                marginBottom: '15%',
                width: 289,
                alignSelf: 'center',
                justifyContent: 'center',
              }}
            />
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
            <Button
              flex="1"
              mt={2}
              bg="#004aad"
              onPress={() => {
                CloseBag(), setShowCloseBagModal(false);
              }}>
              Submit
            </Button>
          </Modal.Body>
        </Modal.Content>
      </Modal>
      <Modal
        isOpen={showModal}
        onClose={() => {
          setModal(false);
        }}
        size="lg">
        <Modal.Content maxWidth="350">
          <Modal.CloseButton />
          <Modal.Header>Accept Shipment</Modal.Header>
          <Modal.Body>
            <Text>Mismatch Packaging ID</Text>
            <Button
              flex="1"
              mt={2}
              bg="#004aad"
              onPress={() => {
                setCheck11(1);
                ToastAndroid.show(barcode + ' Accepted', ToastAndroid.SHORT);
                updateDetails2();
                displayDataSPScan();
                setLen(false);
                setModal(false);
                setExpectedPackaging('');
              }}>
              Accept Anyway
            </Button>
          </Modal.Body>
        </Modal.Content>
      </Modal>
      <Modal
        isOpen={showModal1}
        onClose={() => {
          setModal1(false);
        }}
        size="lg">
        <Modal.Content maxWidth="350">
          <Modal.CloseButton />
          <Modal.Header>Reject Shipment</Modal.Header>
          <Modal.Body>
            <Text>Mismatch Packaging ID</Text>
            <Button
              flex="1"
              mt={2}
              bg="#004aad"
              onPress={() => {
              setModal1(false);
              setModalVisible(true);
              }}>
              Reject Shipment
            </Button>
          </Modal.Body>
        </Modal.Content>
      </Modal>

      <Modal
        isOpen={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setDropDownValue('');
        }}
        size="lg">
        <Modal.Content maxWidth="350">
          <Modal.CloseButton />
          <Modal.Header>Reject Reason</Modal.Header>
          <Modal.Body>
            {rejectedData.map(d => (
              <Button
                key={d.shipmentExceptionReasonID}
                flex="1"
                mt={2}
                marginBottom={1.5}
                marginTop={1.5}
                title={d.shipmentExceptionReasonName}
                style={{
                  backgroundColor:
                    d.shipmentExceptionReasonID === DropDownValue
                      ? '#6666FF'
                      : '#C8C8C8',
                }}
                onPress={() => handleButtonPress(d.shipmentExceptionReasonID)}>
                <Text
                  style={{
                    color:
                      DropDownValue == d.shipmentExceptionReasonID
                        ? 'white'
                        : 'black',
                  }}>
                  {d.shipmentExceptionReasonName}
                </Text>
              </Button>
            ))}
            <Button
              flex="1"
              mt={2}
              bg="#004aad"
              marginBottom={1.5}
              marginTop={1.5}
              onPress={() => {
                // rejectDetails2();
                handleRejectAction();
                setModalVisible(false);
              }}>
              Submit
            </Button>
          </Modal.Body>
        </Modal.Content>
      </Modal>

      <ScrollView
        style={{paddingTop: 20, paddingBottom: 50}}
        showsVerticalScrollIndicator={false}>
        {(!showCloseBagModal || !showCloseBagModal12) && scanned && (
          <QRCodeScanner
            onRead={onSuccess}
            reactivate={true}
            reactivateTimeout={3000}
            ref={scannerRef}
            flashMode={RNCamera.Constants.FlashMode.off}
            containerStyle={{
              width: '100%',
              alignSelf: 'center',
              backgroundColor: 'white',
            }}
            cameraStyle={{width: '90%', alignSelf: 'center'}}
            topContent={
              <View>
                <Text>Scan your Shipments </Text>
              </View>
            }
          />
        )}
        <View>
          <Center />
        </View>
        <View>
          <View style={{backgroundColor: 'white'}}>
            <View style={{alignItems: 'center', marginTop: 15}}>
              <View style={{backgroundColor: 'lightgrey', padding:0, flexDirection: 'row', justifyContent: 'space-between', width: '90%', borderRadius: 10, flex:1}}>
              <Input placeholder="Shipment ID"  value={text11} onChangeText={(text)=>{ setText11(text);}}  style={{
              fontSize: 18, fontWeight: '500', width: 320, backgroundColor:'lightgrey'}} />
<TouchableOpacity style={{flex:1,backgroundColor:'lightgrey',paddingTop:8}} onPress={()=>onSucessThroughButton(text11)}>
  <Center>

  <MaterialIcons name="send" size={30} color="#004aad" />
  </Center>
</TouchableOpacity>

{/* <MaterialIcons name="send" size={30} color="green" /> */}


{/* <Button flex="1" mt={2} bg={buttonColor11} onPress={() => { }}>Submit</Button>
                <Text style={{fontSize: 18, fontWeight: '500'}}>shipment ID: </Text>
                {/* <MaterialIcons name="send" size={24} color={onPress ? 'black' : 'gray'} /> */}
                {/* <Text style={{fontSize: 18, fontWeight: '500'}}>{barcode}</Text> */}
                {/* <View style={{ flex: 1,
                alignItems: 'center',
                justifyContent: 'center',}}>
                <TextInput
                style={styles.textInput}
                placeholder="Enter shipment ID"
                value={barcode}
                onChangeText={(text) => setBarcode(text)}
                />
              <View style={styles.infoContainer}>
            <View style={styles.info}>
            <Text style={styles.label}>shipment ID: </Text>
            <Text style={styles.value}>{barcode}</Text>
        </View> */}
                {/* </View> */}
              </View>
              {packagingAction == 0 || packagingAction == 2 ?
              <Button
              title="Reject Shipment"
              onPress={() =>{ check11 === 0 ? ToastAndroid.show('No Shipment to Reject',ToastAndroid.SHORT) : setModalVisible(true);}}
              w="90%"
              size="lg"
              bg={buttonColorRejected}
              mb={4}
              mt={4}>
              Reject Shipment
            </Button>
            : null
              }
              <View
                style={{
                  width: '90%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  borderWidth: 1,
                  borderBottomWidth: 0,
                  borderColor: 'lightgray',
                  borderTopLeftRadius: 5,
                  borderTopRightRadius: 5,
                  padding: 10,
                }}>
                <Text style={{fontSize: 18, fontWeight: '500'}}>Expected</Text>
                <Text style={{fontSize: 18, fontWeight: '500'}}>
                  {route.params.Forward}
                </Text>
              </View>
              <View
                style={{
                  width: '90%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  borderWidth: 1,
                  borderBottomWidth: 0,
                  borderColor: 'lightgray',
                  padding: 10,
                }}>
                <Text style={{fontSize: 18, fontWeight: '500'}}>Accepted</Text>
                <Text style={{fontSize: 18, fontWeight: '500'}}>
                  {newaccepted}
                </Text>
              </View>
              <View
                style={{
                  width: '90%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  borderWidth: 1,
                  borderBottomWidth: 0,
                  borderColor: 'lightgray',
                  padding: 10,
                }}>
                <Text style={{fontSize: 18, fontWeight: '500'}}>Rejected</Text>
                <Text style={{fontSize: 18, fontWeight: '500'}}>
                  {newrejected}
                </Text>
              </View>
              <View
                style={{
                  width: '90%',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  borderWidth: 1,
                  borderColor: 'lightgray',
                  borderBottomLeftRadius: 5,
                  borderBottomRightRadius: 5,
                  padding: 10,
                }}>
                <Text style={{fontSize: 18, fontWeight: '500'}}>
                  Not Picked
                </Text>
                <Text style={{fontSize: 18, fontWeight: '500'}}>
                  {newNotPicked}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              width: '90%',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignSelf: 'center',
              marginTop: 10,
            }}>
            <Button
              onPress={() => {
                if (newaccepted === 0) {
                  partialClose112();
                } else {
                  if (acceptedArray.length !== 0) {
                    setShowCloseBagModal11(true);
                  } else {
                    partialClose112();
                  }
                }
              }}
              w="48%"
              size="lg"
              bg="#004aad">
              End Scan
            </Button>

            <Button
              w="48%"
              size="lg"
              bg={buttonColor}
              onPress={() => {
                if (acceptedArray.length === 0) {
                  ToastAndroid.show('Bag is Empty', ToastAndroid.SHORT);
                } else {
                  setShowCloseBagModal(true);
                }
              }}>
              Close bag
            </Button>
          </View>
          <Center>
            <Image
              style={{
                width: 150,
                height: 100,
              }}
              source={require('../../assets/image.png')}
              alt={'Logo Image'}
            />
          </Center>
        </View>
      </ScrollView>
    </NativeBaseProvider>
  );
};

export default ShipmentBarcode;

export const styles = StyleSheet.create({
  textInput: {
    height: 40,
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  infoContainer: {
    marginTop: 10,
    width: '90%',
  },
  info: {
    backgroundColor: 'lightgray',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 5,
  },
  label: {
    fontSize: 18,
    fontWeight: '500',
  },
  value: {
    fontSize: 18,
    fontWeight: '500',
  },
  normal: {
    fontFamily: 'open sans',
    fontWeight: 'normal',
    fontSize: 20,
    color: '#eee',
    marginTop: 27,
    paddingTop: 15,
    marginLeft: 10,
    marginRight: 10,
    paddingBottom: 15,
    backgroundColor: '#eee',
    width: 'auto',
    borderRadius: 0,
  },
  container: {
    flexDirection: 'row',
  },
  text: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
  main1: {
    backgroundColor: '#004aad',
    fontFamily: 'open sans',
    fontWeight: 'normal',
    fontSize: 20,
    marginTop: 27,
    paddingTop: 15,
    marginLeft: 10,
    marginRight: 10,
    paddingBottom: 15,
    width: 'auto',
    borderRadius: 20,
  },
  textbox1: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    width: 'auto',
    flexDirection: 'column',
    textAlign: 'center',
  },

  textbtn: {
    alignSelf: 'center',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  btn: {
    fontFamily: 'open sans',
    fontSize: 15,
    lineHeight: 10,
    marginTop: 80,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#004aad',
    width: 100,
    borderRadius: 10,
    paddingLeft: 0,
    marginLeft: 60,
  },
  bt3: {
    fontFamily: 'open sans',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    lineHeight: 10,
    marginTop: 10,
    backgroundColor: '#004aad',
    width: 'auto',
    borderRadius: 10,
    paddingLeft: 0,
    marginLeft: 10,
    marginRight: 15,
    // width:'95%',
    // marginTop:60,
  },
  picker: {
    color: 'white',
  },
  pickerItem: {
    fontSize: 20,
    height: 50,
    color: '#ffffff',
    backgroundColor: '#2196f3',
    textAlign: 'center',
    margin: 10,
    borderRadius: 10,
  },
  modalContent: {
    flex: 0.57,
    justifyContent: 'center',
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 20,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    marginLeft: 28,
    marginTop: 175,
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 100,
    margin: 5.5,
    color: 'rgba(0,0,0,1)',
    alignContent: 'center',
  },

  containerText: {
    paddingLeft: 30,
    color: '#000',
    fontSize: 15,
  },
  otp: {
    backgroundColor: '#004aad',
    color: '#000',
    marginTop: 5,
    borderRadius: 10,
  },
});

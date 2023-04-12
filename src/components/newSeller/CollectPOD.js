/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  ArrowForwardIcon,
  NativeBaseProvider,
  Box,
  Image,
  Center,
  Input,
  Modal,
  Heading,
  VStack,
  Alert,
} from 'native-base';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  TextInput,
  ToastAndroid,
} from 'react-native';
import axios from 'axios';
import {HStack, Button} from 'native-base';
import React, {useState, useEffect, useRef} from 'react';
import {useNavigation} from '@react-navigation/native';
import OTPTextInput from 'react-native-otp-textinput';

import {openDatabase} from 'react-native-sqlite-storage';
import { backendUrl } from '../../utils/backendUrl';

const db = openDatabase({
  name: 'rn_sqlite',
});
const CollectPOD = ({route}) => {
  var otpInput = useRef(null);
  const navigation = useNavigation();
  const [name, setName] = useState(route.params.contactPersonName);
  const [inputOtp, setInputOtp] = useState('');
  const [mobileNumber, setMobileNumber] = useState(route.params.phone);
  const [showModal11, setShowModal11] = useState(false);
  const [DropDownValue11, setDropDownValue11] = useState(null);
  const [PartialCloseData, setPartialCloseData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState(0);
  const [runsheetNo, setRunsheetNo] = useState('');
  const [timer, setTimer] = useState(60);
  const [newaccepted, setnewAccepted] = useState(
    route.params.accepted + route.params.tagged,
  );
  const [newrejected, setnewRejected] = useState(route.params.rejected);
  const [newNotDelivered, setNewNotDelivered] = useState(
    route.params.notDelivered,
  );
  const [acceptedArray, setAcceptedArray] = useState([]);
  const [rejectedArray, setRejectedArray] = useState([]);
  const [notDeliveredArray, setNotDeliveredArray] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (timer > 0) {
        setTimer(timer - 1);
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [timer]);
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
    // await fetch(PartialClose)
    // .then((response) => response.json())
    // .then((json) => {
    //   setPartialCloseData(json);
    // })
    // .catch((error) => alert(error))
  };
  useEffect(() => {
    DisplayData11();
  }, []);

  const clearText = () => {
    otpInput.current.clear();
  };

  const setText = () => {
    otpInput.current.setValue('1234');
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      displayDataSPScan();
    });
    return unsubscribe;
  }, [navigation]);

  const displayDataSPScan = async () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM SellerMainScreenDetails where shipmentAction="Seller Delivery" AND consignorCode=? AND (status="accepted" OR status="tagged")',
        [route.params.consignorCode],
        (tx1, results) => {
          setnewAccepted(results.rows.length);
          let temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(results.rows.item(i).clientShipmentReferenceNumber);
          }
          setAcceptedArray(temp);
        },
      );
    });
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM SellerMainScreenDetails where shipmentAction="Seller Delivery" AND consignorCode=? AND status is NULL',
        [route.params.consignorCode],
        (tx1, results) => {
          setNewNotDelivered(results.rows.length);
          let temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(results.rows.item(i).clientShipmentReferenceNumber);
          }
          setNotDeliveredArray(temp);
        },
      );
    });

    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM SellerMainScreenDetails where shipmentAction="Seller Delivery" AND consignorCode=? AND status="rejected"',
        [route.params.consignorCode],
        (tx1, results) => {
          setnewRejected(results.rows.length);
          let temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(results.rows.item(i).clientShipmentReferenceNumber);
          }
          setRejectedArray(temp);
        },
      );
    });
  };

  const submitForm11 = () => {
    console.log('=======post rd delivery====', {
      runsheetNo: runsheetNo,
      expected: route.params.Forward,
      accepted: newaccepted,
      rejected: newrejected,
      nothandedOver: newNotDelivered,
      feUserID: route.params.userId,
      receivingTime: new Date().valueOf(),
      latitude: route.params.latitude,
      longitude: route.params.longitude,
      receiverMobileNo: mobileNumber,
      receiverName: name,
      consignorAction: 'Seller Delivery',
      consignorCode: route.params.consignorCode,
      acceptedShipments: acceptedArray,
      rejectedShipments: rejectedArray,
      nothandedOverShipments: notDeliveredArray,
    });
    axios
      .post(backendUrl + 'SellerMainScreen/postRD', {
        runsheetNo: runsheetNo,
        expected: route.params.Forward,
        accepted: newaccepted,
        rejected: newrejected,
        nothandedOver: newNotDelivered,
        feUserID: route.params.userId,
        receivingTime: new Date().valueOf(),
        latitude: route.params.latitude,
        longitude: route.params.longitude,
        receiverMobileNo: mobileNumber,
        receiverName: name,
        consignorAction: 'Seller Delivery',
        consignorCode: route.params.consignorCode,
        acceptedShipments: acceptedArray,
        rejectedShipments: rejectedArray,
        nothandedOverShipments: notDeliveredArray,
      })
      .then(function (response) {
        console.log('POST RD Data Submitted', response.data);
        alert('Your Data has submitted');
        navigation.navigate('Main');
      })
      .catch(function (error) {
        console.log(error.response.data);
      });
  };

  const sendSmsOtp = async () => {
    const response = await axios
      .post(backendUrl + 'SMS/msg', {
        mobileNumber: mobileNumber,
      })
      .then(setShowModal11(true))
      .catch(err => console.log('OTP not send'));
  };

  function handleButtonPress11(item) {
    // if(item=='Partial Dispatch'){
    //   navigation.navigate('Dispatch');
    // }
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
          // alert("OTP Submitted Successfully")
          setMessage(1);
          submitForm11();
          setInputOtp('');
          setShowModal11(false);


          db.transaction(tx => {
            tx.executeSql(
              'UPDATE SyncSellerPickUp  SET otpSubmittedDelivery="true" WHERE consignorCode=? ',
              [route.params.consignorCode],
              (tx1, results) => {
                // console.log('Results', results.rowsAffected);
                // console.log(results);
                if (results.rowsAffected > 0) {
                  console.log('otp status updated seller delivery in seller table ');
                } else {
                  console.log('opt status not updated in seller delivery in local table');
                }
                // console.log(results.rows.length);
              },
            );
          });

          db.transaction(tx => {
            tx.executeSql(
              'UPDATE SellerMainScreenDetails SET status="notDelivered" , rejectionReasonL1=? WHERE shipmentAction="Seller Delivery" AND status IS Null And consignorCode=?',
              [
                route.params.DropDownValue,
                new Date().valueOf(),
                route.params.latitude,
                route.params.longitude,
                route.params.consignorCode,
              ],
              (tx1, results) => {
                if (results.rowsAffected > 0) {
                  ToastAndroid.show(
                    'Partial Closed Successfully',
                    ToastAndroid.SHORT,
                  );
                } else {
                  console.log('failed to add notPicked item locally');
                }
              },
            );
          });
        } else {
          alert('Invalid OTP, please try again !!');
          setMessage(2);
        }
      })
      .catch(error => {
        // alert('Invalid OTP, please try again !!');
        setMessage(2);
        console.log(error);
      });
  }
  const displayData = async () => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM SellerMainScreenDetails where shipmentAction="Seller Delivery" AND consignorCode=? ',
        [route.params.consignorCode],
        (tx1, results) => {
          // ToastAndroid.show("Loading...", ToastAndroid.SHORT);
          let temp = [];
          console.log(results.rows.length);
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(results.rows.item(i));
          }
          setRunsheetNo(temp[0].runSheetNumber);
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

  return (
    <NativeBaseProvider>
     {/* 
     <Modal
        w="100%"
        isOpen={showModal11}
        onClose={() => {
          setShowModal11(false);
          setTimer(60);
        }}>
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
              {timer ? (
                <Button w="40%" bg="gray.500">
                  <Text style={{color: 'white'}}>{timer}s</Text>
                </Button>
              ) : (
                <Button
                  w="40%"
                  bg="gray.500"
                  onPress={() => {
                    sendSmsOtp();
                    setTimer(60);
                  }}>
                  Resend
                </Button>
              )}
              <Button w="40%" bg="gray.500" onPress={()=>sendSmsOtp()}>Resend</Button> 
              <Button w="40%" bg="#004aad" onPress={() => validateOTP()}>
                Submit
              </Button>
            </Box>
          </Modal.Body>
        </Modal.Content>
      </Modal>*/}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Content backgroundColor={message === 1 ? '#dcfce7' : '#fee2e2'}>
          <Modal.CloseButton />
          <Modal.Body>
            <Alert w="100%" status={message === 1 ? 'success' : 'error'}>
              <VStack space={1} flexShrink={1} w="100%" alignItems="center">
                <Alert.Icon size="4xl" />
                <Text my={3} fontSize="md" fontWeight="medium">
                  {message === 1
                    ? 'OTP Submitted Successfully'
                    : 'Invalid OTP, please try again !!'}
                </Text>
              </VStack>
            </Alert>
          </Modal.Body>
        </Modal.Content>
      </Modal>

      <View style={{backgroundColor: 'white', flex: 1, paddingTop: 30}}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{alignItems: 'center', marginTop: 15}}>
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
                {route.params.accepted}
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
                {route.params.rejected}
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
              <Text style={{fontSize: 18, fontWeight: '500'}}>Tagged</Text>
              <Text style={{fontSize: 18, fontWeight: '500'}}>
                {route.params.tagged}
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
                Not Handed Over
              </Text>
              <Text style={{fontSize: 18, fontWeight: '500'}}>
                {newNotDelivered}
              </Text>
            </View>
          </View>
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

{!showModal11?<Button
              w="90%"
              size="lg"
              style={{backgroundColor: '#004aad', color: '#fff'}}
              title="Submit"
              onPress={() => {sendSmsOtp();setShowModal11(true);setTimer(60);}}>
              Send OTP
            </Button>: timer ? (
              
                <Button w="90%" size="lg" bg="gray.500">
                  <Text style={{color: 'white', fontSize:16.5}}>Resend OTP in {timer}sec</Text>
                </Button>
              ) : (
                <Button
                  w="90%" size="lg"
                  bg="gray.500"
                  onPress={() => {
                    sendSmsOtp();
                    setTimer(60);
                  }}>
                  Resend
                </Button>
              )}

            { showModal11? 
            <>
             <Center>
              <View style={{
    flexDirection: 'row',
    justifyContent: 'center',
  }}>
    {/* <Center> */}
 <OTPTextInput 
        handleTextChange={e => setInputOtp(e)}
        inputCount={6} 
        tintColor="#004aad" 
        offTintColor="gray" 
        containerStyle={{
          marginTop: 4,
          padding:10,
          // size:20
        }}
        textInputStyle={{
          backgroundColor: '#F5F5F5',
          borderRadius: 10,
          borderWidth: 1,
          borderColor: '#BDBDBD',
          padding: 10,
        }}
        // secureTextEntry={!showPassword}
        keyboardType="number-pad"
        onBackspace={() => console.log('back')}
      />

</View>
</Center>

              <Button
                w="90%" size="lg"
                bg="#004aad"
                onPress={() => {
                  validateOTP();
                }}>
                Verify OTP
              </Button>
            {/* </Box> */}
            </>:null}

            {/* <Button
              w="90%"
              size="lg"
              style={{
                backgroundColor: '#004aad',
                color: '#fff',
                marginBottom: 10,
              }}
              title="Generate"
              onPress={() => {
                setShowModal11(true);
                sendSmsOtp();
              }}>
              Generate OTP
            </Button> */}
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
    </NativeBaseProvider>
  );
};

export default CollectPOD;

export const styles = StyleSheet.create({
  normal: {
    fontFamily: 'open sans',
    fontWeight: 'normal',
    color: '#eee',
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#eee',
    width: 'auto',
    borderRadius: 0,
  },

  text: {
    paddingLeft: 20,
    color: '#000',
    fontWeight: 'normal',
    fontSize: 18,
  },
  container: {
    flex: 1,
    fontFamily: 'open sans',
    fontWeight: 'normal',
    color: '#eee',
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 'auto',
    borderWidth: 1,
    borderColor: '#eee',
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

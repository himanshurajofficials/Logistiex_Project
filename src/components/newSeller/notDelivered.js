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
import GetLocation from 'react-native-get-location';
import { backendUrl } from '../../utils/backendUrl';

const NotDelivered = ({route}) => {
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
    const [modalVisible, setModalVisible] = useState(true);
    const [modalVisible2, setModalVisible2] = useState(false);
    const [modalVisible3, setModalVisible3] = useState(false);
    const [modalVisible4, setModalVisible4] = useState(false);
    const [displayData, setDisplayData] = useState({});
    const [keyword, setKeyword] = useState('');
    const [MM,setMM] = useState(0);
    const [rejectionCode, setRejectionCode]=useState("")
    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);
  
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
    const DisplayData = async () => {
      closeDelivery();
    };
    const NotDelivered = () => {
      AsyncStorage.setItem('refresh11', 'refresh');
      db.transaction(tx => {
        tx.executeSql(
          'UPDATE SellerMainScreenDetails SET status="notDelivered" , rejectionReasonL1=? WHERE shipmentAction="Seller Delivery" AND status IS Null And consignorCode=?',
          [rejectionCode, 
            new Date().valueOf(),
            latitude,
            longitude,
            route.params.consignorCode],
          (tx1, results) => {
            let temp = [];
            console.log(results.rows.length);
            for (let i = 0; i < results.rows.length; ++i) {
              temp.push(results.rows.item(i));
            }
          },
        );
      });
      axios
        .post(backendUrl + 'SellerMainScreen/attemptFailed', {
          consignorCode: route.params.consignorCode,
          rejectionReason: rejectionCode,
          feUserID: route.params.userId,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          eventTime: new Date().valueOf(),
          rejectionStage: 1,
        })
        .then(function (response) {
          console.log(response.data);
        })
        .catch(function (error) {
          console.log(error);
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
      
      
      function handleButtonPress(item,item2) {
        if (item == 'Could Not Attempt') {
          setModalVisible2(true);
          setModalVisible(false);
        } else {
          setDropDownValue(item);
          setRejectionCode(item2);
          setRejectStage("L1")
        }
      }
      function handleButtonPress2(item,item2) {
        setDropDownValue1(item);
        setRejectionCode(item2)
        setRejectStage("L2")
      }
      
return (
  <NativeBaseProvider>
    <Modal
            isOpen={modalVisible}
            onClose={() => {{navigation.navigate('PendingWork')}; setDropDownValue('');}}
            width="100%">
            <Modal.Content maxWidth="100%">
              <Modal.CloseButton />
              <Modal.Header>Close Delivery Reason Code</Modal.Header>
              <Modal.Body>
              {CloseDataD.map((d, index) => (
                  <Button
                    key={d.deliveryFailureReasonID}
                    flex="1"
                    mt={2}
                    marginBottom={1.5}
                    marginTop={1.5}
                    style={{
                      backgroundColor:
                        d.deliveryFailureReasonName === DropDownValue
                          ? '#6666FF'
                          : '#C8C8C8',
                    }}
                    title={d.deliveryFailureReasonName}
                    onPress={() =>
                      handleButtonPress(d.deliveryFailureReasonName,d.deliveryFailureReasonID)
                    }>
                    <Text
                      style={{
                        color:
                          DropDownValue == d.deliveryFailureReasonName
                            ? 'white'
                            : 'black',
                      }}>
                      {d.deliveryFailureReasonName}
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
                    NotDelivered();
                    navigation.navigate('PendingWork');
                  }}>
                  Submit
                </Button>
              </Modal.Body>
            </Modal.Content>
          </Modal>
          <Modal
            isOpen={modalVisible2}
            onClose={() => {{navigation.navigate('PendingWork')}; setDropDownValue1('');}}
            size="lg">
            <Modal.Content maxWidth="350">
              <Modal.CloseButton />
              <Modal.Header>Could Not Attempt Reason</Modal.Header>
              <Modal.Body>
                {NotAttemptData &&
                  NotAttemptData.map((d, index) => (
                    <Button
                      key={d._id}
                      flex="1"
                      mt={2}
                      marginBottom={1.5}
                      marginTop={1.5}
                      style={{
                        backgroundColor:
                          d.reasonName === DropDownValue1
                            ? '#6666FF'
                            : '#C8C8C8',
                      }}
                      title={d.reasonName}
                      onPress={() => handleButtonPress2(d.reasonName, d.reasonID)}>
                      <Text
                        style={{
                          color:
                            d.reasonName == DropDownValue1 ? 'white' : 'black',
                        }}>
                        {d.reasonName}
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
                    NotDelivered();
                    navigation.navigate('PendingWork');
                  }}>
                  Submit
                </Button>
                <Button
                  flex="1"
                  mt={2}
                  bg="#004aad"
                  marginBottom={1.5}
                  marginTop={1.5}
                  onPress={() => {
                    setModalVisible(true), setModalVisible2(false);
                  }}>
                  Back
                </Button>
              </Modal.Body>
            </Modal.Content>
          </Modal>
    <Box flex={1} bg="#fff"  width="auto" maxWidth="100%">
      <ScrollView style={styles.homepage} showsVerticalScrollIndicator={true} showsHorizontalScrollIndicator={false}>
        <Card>
          {/* <DataTable>
            <DataTable.Header style={{height:'auto', backgroundColor: '#004aad', borderTopLeftRadius: 5, borderTopRightRadius: 5}} >
              <DataTable.Title style={{flex: 1.2}}><Text style={{ textAlign: 'center', color:'white'}}>Seller Name</Text></DataTable.Title>
              <DataTable.Title style={{flex: 1.2}}><Text style={{ textAlign: 'center', color:'white'}}>Pending Pickups</Text></DataTable.Title>
              <DataTable.Title style={{flex: 1.2}}><Text style={{ textAlign: 'center', color:'white'}}>Pending Deliveries</Text></DataTable.Title>
            </DataTable.Header> */}
            {/* {displayData && data.length > 0 && Object.keys(displayData11).map((consignorCode, index) => (
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
          onPress={() => navigation.navigate('NotPicked',{consignorCode:consignor[0]})}
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
          onPress={() => {
            setModalVisible3(true); 
          }}
          style={{backgroundColor: '#004aad', width: '90%', marginTop: 10, marginLeft: 20}}
        >
          Close Delivery
        </Button>
      } */}
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
    {/* </View>
  ))}
          </DataTable> */}
        </Card>
      </ScrollView>
      {/* <View style={{width: '90%', flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'center', marginTop: 10 }}>
            <Button w="48%" size="lg" bg="#004aad" onPress={()=>navigation.navigate('Main')}>Dashboard</Button>
            <Button w="48%" size="lg" bg="#004aad" onPress={()=>navigation.navigate('MyTrip')} >Close Trip</Button>
          </View>
      <Center>
          <Image style={{ width:150, height:150}} source={require('../../assets/image.png')} alt={'Logo Image'} />
      </Center> */}
    </Box>
    </NativeBaseProvider>
  );
};
export default NotDelivered;
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


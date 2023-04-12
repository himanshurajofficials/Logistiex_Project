/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Container, Header, Content, Item, Input,Modal, Icon, Button, NativeBaseProvider, Center, Image} from 'native-base';
import axios from 'axios';
import {Text,View, ScrollView, Vibration, ToastAndroid,TouchableOpacity,StyleSheet, PermissionsAndroid} from 'react-native';
import {Searchbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import { openDatabase } from 'react-native-sqlite-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import RNBeep from 'react-native-a-beep';
const db = openDatabase({
  name: 'rn_sqlite',
});

const Dispatch = ({route}) => {
    const [keyword, setKeyword] = useState('');
    const [eligibleBags, setEligibleBags] = useState(0);
    const [scanned, setScanned] = useState(0);
    const [pending,setPending] = useState(0);
    const [bagSeal, setBagSeal] = useState('');
    const [showCloseBagModal11, setShowCloseBagModal11] = useState(false);

    const navigation = useNavigation();
    // const onSuccess = e => {
    //     console.log(e.data, 'barcode');
    //     // getCategories(e.data);
    //     // setBarcode(e.data);
    //   }


    const [sealIDList, setSealIDList] = useState([]);
    const [sealIDData, setSealIDData] = useState({});


    useEffect(() => {
      showList();
    }, [sealIDList]);

    const showList = ()=>{
      console.log('showlist called',sealIDList+""+sealIDList.length);
      if (sealIDList.length > 0) {
        const newData = {};
        sealIDList.map(sealID => {
          console.log(sealID +'sealID in show list ');
          //  sealID = 'SI001004';
          db.transaction(tx => {
            tx.executeSql(
              'SELECT bagId, AcceptedList FROM closeBag1 WHERE consignorCode=? AND bagSeal = ? And status="Scanned"',
              [route.params.consignorCode,sealID],
              (tx, results) => {
                console.log(results);
                if (results.rows.length > 0) {
                  const row = results.rows.item(0);
                  console.log(JSON.parse(row.AcceptedList)+" ",row.bagId);
                  newData[sealID] = {
                    bagID: row.bagId,
                    acceptedItemsCount: JSON.parse(row.AcceptedList).length,
                  };
                  console.log('Data retrieved successfully for sealID:', sealID);
                }
                else {
                  // newData[sealID] = {
                  //   bagID: '',
                  //   acceptedItemsCount: 0,
                  // };
                  console.log('No data found for sealID:', sealID);
                }
                setSealIDData(prevData => ({...prevData, ...newData}));
              },
              error => {
                console.log('Error occurred while retrieving data:', error);
              },
            );
          });
        });
      }
    };
   

      const requestCameraPermission = async () => {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: 'Camera Permission',
              message: 'App needs camera permission',
            },
          );
          // If CAMERA Permission is granted
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (err) {
          console.warn(err);
          return false;
        }
      };
      const onSuccess11 = e => {
        Vibration.vibrate(100);
        RNBeep.beep();
        console.log(e.data, 'sealID');
        // getCategories(e.data);
        setBagSeal(e.data);
      };

      useEffect(() => {
          displayDataSPScan();
      }, [scanned]);

      const updateBags = () => {
        console.log('dispatch 45456');
        db.transaction((tx) => {
          tx.executeSql('UPDATE closeBag1 SET status="dispatched"  WHERE status="Scanned" AND consignorCode=?  ', [route.params.consignorCode], (tx1, results) => {
            if (results.rowsAffected > 0) {
              ToastAndroid.show('Bags Dispatch Successfully',ToastAndroid.SHORT);
              console.log('Bags Dispatch');
  
            } else {
              console.log('failed to dispatch bags ');
            }
          },
        );
      });
    };

      const displayDataSPScan = async () => {
        console.log('consignor code' + route.params.consignorCode);
        db.transaction(tx => {
          tx.executeSql(
            'SELECT * FROM closeBag1 WHERE  consignorCode=? And status <> "dispatched"',
            [route.params.consignorCode],
            (tx1, results) => {
              setEligibleBags(results.rows.length);
              // setPending(results.rows.length - scanned);
            },
          );
        });
        db.transaction(tx => {
          tx.executeSql(
            'SELECT * FROM closeBag1 WHERE  consignorCode=? And status="scanPending"',
            [route.params.consignorCode],
            (tx1, results) => {
              setPending(results.rows.length);
            },
          );
        });
        db.transaction(tx => {
          tx.executeSql(
            'SELECT * FROM closeBag1 WHERE  consignorCode=? And status="Scanned"',
            [route.params.consignorCode],
            (tx1, results) => {
              setScanned(results.rows.length);
            },
          );
        });
        db.transaction(tx => {
          tx.executeSql(
            'SELECT bagSeal FROM  closeBag1 WHERE  consignorCode=? And status="Scanned"',
            [route.params.consignorCode],
            (tx, results) => {
              const newSealIds = [];
    
              for (let i = 0; i < results.rows.length; i++) {
                const row = results.rows.item(i);
                if (!sealIDList.includes(row.bagSeal)) {
                  newSealIds.push(row.bagSeal);
                }
              }
    
              // Update the state with the new array of sealids
              setSealIDList(prevSealIds => [...prevSealIds, ...newSealIds]);
            },
            error => {
              console.error('Error fetching bagSeal:', error);
            }
          );
        });
      };

      const getCategories = (data) => {

        db.transaction(txn => {
          txn.executeSql(
            'SELECT * FROM closeBag1 WHERE  consignorCode=? AND bagSeal=? AND status="Scanned" ',
            [route.params.consignorCode,bagSeal],
            (sqlTxn, res) => {
              console.log(bagSeal + '' + data + '',res.rows);
              if (res.rows.length > 0) {
                console.log(data);
                ToastAndroid.show(bagSeal+' Already Scanned',ToastAndroid.SHORT);
               
              } else {
                db.transaction(txn => {
                  txn.executeSql(
                    'SELECT * FROM closeBag1 WHERE  consignorCode=? AND bagSeal=? AND status="scanPending" ',
                    [route.params.consignorCode,bagSeal],
                    (sqlTxn, res) => {
                      console.log(bagSeal + '' + data + '',res.rows);
                      if (res.rows.length > 0) {
                        console.log(data);
                        db.transaction((tx) => {
                          tx.executeSql('UPDATE closeBag1 SET status="Scanned" WHERE bagSeal=? And consignorCode=?', [bagSeal,route.params.consignorCode], (tx1, results) => {
                            // let temp = [];
                            if (results.rowsAffected > 0) {
                              setScanned(scanned + 1);
                              setSealIDList([...sealIDList, data]);
                              ToastAndroid.show('Bag Seal Accepted',ToastAndroid.SHORT);
                              // setTimeout(()=>{
        
                              //   console.log('ok2222',sealIDList);
                              //   showList();},1000);
                            }
                            //  else {
                            //   console.log('failed to add notPicked item locally');
                            // }
                            console.log(results.rows.length);
                            // for (let i = 0; i < results.rows.length; ++i) {
                            //   temp.push(results.rows.item(i));
                            // }
                            // console.log("Data updated: \n ", JSON.stringify(temp, null, 4));
                          });
                        });
                        // setScanned(scanned+1);
                        // setSealIDList([...sealIDList, data]);
                        // ToastAndroid.show("Bag Seal Accepted",ToastAndroid.SHORT);
                        // console.log('ok2222',sealIDList);
                        // showList();
                      } else {
                        ToastAndroid.show('Invalid Bag Seal',ToastAndroid.SHORT);
        
                      }
                    },
                    error => {
                      console.log('error on getting categories ' + error.message);
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


        // db.transaction(txn => {
        //   txn.executeSql(
        //     'SELECT * FROM closeBag1 WHERE  consignorCode=? AND bagSeal=? AND status="scanPending" ',
        //     [route.params.consignorCode,bagSeal],
        //     (sqlTxn, res) => {
        //       console.log(bagSeal + '' + data + '',res.rows);
        //       if (res.rows.length > 0) {
        //         console.log(data);
        //         db.transaction((tx) => {
        //           tx.executeSql('UPDATE closeBag1 SET status="Scanned" WHERE bagSeal=? And consignorCode=?', [bagSeal,route.params.consignorCode], (tx1, results) => {
        //             // let temp = [];
        //             if (results.rowsAffected > 0) {
        //               setScanned(scanned + 1);
        //               setSealIDList([...sealIDList, data]);
        //               ToastAndroid.show('Bag Seal Accepted',ToastAndroid.SHORT);
        //               setTimeout(()=>{

        //                 console.log('ok2222',sealIDList);
        //                 showList();},1000);
        //             }
        //             //  else {
        //             //   console.log('failed to add notPicked item locally');
        //             // }
        //             console.log(results.rows.length);
        //             // for (let i = 0; i < results.rows.length; ++i) {
        //             //   temp.push(results.rows.item(i));
        //             // }
        //             // console.log("Data updated: \n ", JSON.stringify(temp, null, 4));
        //           });
        //         });
        //         // setScanned(scanned+1);
        //         // setSealIDList([...sealIDList, data]);
        //         // ToastAndroid.show("Bag Seal Accepted",ToastAndroid.SHORT);
        //         // console.log('ok2222',sealIDList);
        //         // showList();
        //       } else {
        //         ToastAndroid.show('Invalid Bag Seal',ToastAndroid.SHORT);

        //       }
        //     },
        //     error => {
        //       console.log('error on getting categories ' + error.message);
        //     },
        //   );
        // });
      };


      // const CloseBagScan = async ()=> {

      // }

      const sealIDData11 = Object.keys(sealIDData)
      .filter((sealID) => sealID.toLowerCase().includes(keyword.toLowerCase()))
      .reduce((obj, key) => {
        obj[key] = sealIDData[key];
        return obj;
      }, {});

      const openCamera = async()=>{
        let options = {
            mediaType:'photo',
            quality:1,
            cameraType:'back',
            maxWidth : 480,
            maxHeight : 480,
            storageOptions: {
              skipBackup: true,
              path: 'images',
            },
        };
        let isGranted = await requestCameraPermission();
        let result = null;
        if (isGranted){
            result = await launchCamera(options);
            console.log(result);
        }

    };

  return (
    <NativeBaseProvider>
      <View style={{backgroundColor:'white'}}>
        <Text style={{fontSize:20, marginTop:10, textAlign:'center',fontWeight:'500'}}>List of Bags to Dispatch</Text>
        {/* <View style={styles.container}> */}
        <Searchbar
        placeholder="Search Bag Seal ID"
        onChangeText={(e) => setKeyword(e)}
        value={keyword}
        style={{width:'90%', backgroundColor:'#E0E0E0',marginLeft:22,marginTop:10}}
       />
       </View>
      {/* <Button style={{backgroundColor:"#E0E0E0"}} onPress={()=>{openCamera()}} leftIcon={<Icon color="white" as={<MaterialIcons name="camera" />} size="sm"  style={styles.cameraIcon} />}> */}
      {/* </Button> */}
      {/* </View> */}
      <View style={{backgroundColor: 'white', flex: 1, paddingTop: 20}}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{alignItems: 'center'}}>
            <View style={{width: '90%', flexDirection: 'row', justifyContent: 'space-between', borderWidth: 1, borderBottomWidth: 0, borderColor: 'lightgray', borderTopLeftRadius: 5, borderTopRightRadius: 5, padding: 10}}>
              <Text style={{fontSize: 16, fontWeight: '500'}}>Eligible Bags</Text>
              <Text style={{fontSize: 16, fontWeight: '500'}}>{eligibleBags}</Text>
            </View>
            <View style={{width: '90%', flexDirection: 'row', justifyContent: 'space-between', borderWidth: 1, borderBottomWidth: 0, borderColor: 'lightgray', padding: 10}}>
              <Text style={{fontSize: 16, fontWeight: '500'}}>Scanned</Text>
              <Text style={{fontSize: 16, fontWeight: '500'}}>{scanned}</Text>
            </View>
            <View style={{width: '90%', flexDirection: 'row', justifyContent: 'space-between', borderWidth: 1, borderBottomWidth: 1, borderColor: 'lightgray', padding: 10}}>
              <Text style={{fontSize: 16, fontWeight: '500'}}>Pending</Text>
              <Text style={{fontSize: 16, fontWeight: '500'}}>{pending}</Text>
            </View>
          </View>
          <ScrollView  showsVerticalScrollIndicator={true}>
          <View style={{alignItems: 'center', marginTop:20, marginBottom:35}}>
            <View style={{width: '90%', flexDirection: 'row', justifyContent: 'space-between', borderWidth: 1, borderBottomWidth: 0, borderColor: 'lightgray', borderTopLeftRadius: 5, borderTopRightRadius: 5, padding: 10}}>
              <Text style={{fontSize: 16, fontWeight: 'bold'}}>Bag ID</Text>
              <Text style={{fontSize: 16, fontWeight: 'bold'}}>Shipments</Text>
            </View>
            {/* <View style={{width: '90%', flexDirection: 'row', justifyContent: 'space-between', borderWidth: 1, borderBottomWidth: 1, borderColor: 'lightgray', padding: 10}}> */}

            {Object.keys(sealIDData11).map((sealID, index) => (
          <View key={index} style={{width: '90%', flexDirection: 'row', justifyContent: 'space-between', borderWidth: 1, borderBottomWidth: 1, borderColor: 'lightgray', padding: 10}}>
            <Text style={{fontSize: 16, fontWeight: '500'}}>{sealIDData11[sealID].bagID}</Text>
            <Text style={{fontSize: 16, fontWeight: '500'}}>{sealIDData11[sealID].acceptedItemsCount}</Text>
          </View>
        ))}
              {/* <Text style={{fontSize: 16, fontWeight: '500'}}>0</Text> */}
              {/* <Text style={{fontSize: 16, fontWeight: '500'}}>0</Text> */}
            {/* </View> */}
          </View>
          </ScrollView>
          <View style={{width: '90%', flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'center', marginTop: 10 }}>
            {/* <Center> */}

            <Button  w="45%" size="lg" style={{backgroundColor:'#004aad', color:'#fff'}}  title="Dispatch" onPress={()=>{updateBags();navigation.goBack();}}>Dispatch</Button>
            {/* </Center> */}
            <Button  w="45%" size="lg" style={{backgroundColor:'#004aad', color:'#fff'}}  title="Scan" onPress={()=>{setShowCloseBagModal11(true);}}>Scan</Button>
          </View>
          <Modal isOpen={showCloseBagModal11} onClose={() => { setShowCloseBagModal11(false);}} size="lg">
        <Modal.Content maxWidth="350">
          <Modal.CloseButton />
          <Modal.Header>Bag Seal Scanner</Modal.Header>
          <Modal.Body>
                {/* <ScrollView style={{paddingTop: 20, paddingBottom: 50}} showsVerticalScrollIndicator={false}> */}
        <QRCodeScanner
          onRead={onSuccess11}
          reactivate={true}
          // showMarker={true}
          reactivateTimeout={2000}
          flashMode={RNCamera.Constants.FlashMode.off}
          ref={(node) => { this.scanner = node; }}
          containerStyle={{ height:116,marginBottom:'55%' }}
          cameraStyle={{ height: 90, marginTop: 95,marginBottom:'15%', width: 289, alignSelf: 'center', justifyContent: 'center' }}
        />
            {'\n'}
            <Input placeholder="Enter Bag Seal" size="md" value={bagSeal} onChangeText={(text)=>setBagSeal(text)}  style={{

             width: 290,
          backgroundColor:'white',
          }} />
            <Button flex="1" mt={2} bg="#004aad" onPress={() => {setShowCloseBagModal11(false);  getCategories(bagSeal);}}>Submit</Button>
          </Modal.Body>
        </Modal.Content>
      </Modal>

          <Center>
            <Image style={{ width:150, height:150 }} source={require('../../assets/image.png')} alt={'Logo Image'} />
          </Center>
        </ScrollView>
      </View>
    </NativeBaseProvider>
  );
};

export default Dispatch;

export const styles = StyleSheet.create({
    cameraIcon: {
        color: '#000',
        fontSize: 25,
      },
      container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E0E0E0',
        margin:15,
      },
  });

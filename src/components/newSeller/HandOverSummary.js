/* eslint-disable prettier/prettier */
import { NativeBaseProvider, Box, Image, Center, Button, Modal, Input} from 'native-base';
import {StyleSheet, ScrollView, View} from 'react-native';
import {DataTable, Searchbar, Text, Card} from 'react-native-paper';
import {openDatabase} from 'react-native-sqlite-storage';
import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
const db = openDatabase({name: 'rn_sqlite'});

const HandOverSummary = ({route}) => {

    const [data, setData] = useState([]);
    
  const [displayData, setDisplayData] = useState({});
  const navigation = useNavigation();

  const [keyword, setKeyword] = useState('');
//     const loadDetails = () => { // setIsLoading(!isLoading);
//       db.transaction((tx) => {
//           tx.executeSql('SELECT * FROM SyncSellerPickUp', [], (tx1, results) => { // ToastAndroid.show("Loading...", ToastAndroid.SHORT);
//               let temp = [];
//               console.log(results.rows.length);
//               for (let i = 0; i < results.rows.length; ++i) {
//                   temp.push(results.rows.item(i));
//               }
//               setData(temp);
//           });
//       });
//   };
//   useEffect(() => {
//       (async () => {
//           loadDetails();
//       })();
//   }, [data]);
//   const searched = (keyword1) => (c) => {
//     let f = c.consignorName;
//     return (f.includes(keyword1));
// };
  
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
          // var consignorName=results.rows.item(i).consignorName;

          db.transaction(tx => {
            db.transaction(tx => {
              tx.executeSql(
                'SELECT * FROM SellerMainScreenDetails where shipmentAction="Seller Delivery" AND consignorCode=? ',
                [results.rows.item(i).consignorCode],
                (tx1, results11) => {
                  tx.executeSql(
                    'SELECT * FROM SellerMainScreenDetails where shipmentAction="Seller Delivery" AND consignorCode=? AND handoverStatus ="accepted"',
                    [results.rows.item(i).consignorCode],
                    (tx1, results22) => {

                        db.transaction(tx => {
                            tx.executeSql('SELECT * FROM closeHandoverBag1 where consignorCode=? ', [results.rows.item(i).consignorCode], (tx1, results33) => {

                                newData[results.rows.item(i).consignorCode] = {
                                    consignorName: results.rows.item(i).consignorName,
                                    bags: results33.rows.length,
                                    scanned: results22.rows.length,
                                  };
                                  console.log(newData);
                                  if (newData != null) {
                                    setDisplayData(prevData => ({
                                      ...prevData,
                                      ...newData,
                                    }));
                                  }

                            //   let temp = [];
                            //   console.log(results.rows.length);
                            //   for (let i = 0; i < results.rows.length; ++i) {
                            //     temp.push(results.rows.item(i));
                            //   }
                            //   console.log(
                            //     'Data from Local Database Handover Bag: \n ',
                            //     JSON.stringify(temp, null, 4),
                            //   );
                            });
                          });

                    //   newData[results.rows.item(i).consignorCode] = {
                    //     consignorName: results.rows.item(i).consignorName,
                    //     bags: results33.rows.length,
                    //     scanned: results22.rows.length,
                    //   };
                    //   console.log(newData);
                    //   if (newData != null) {
                    //     setDisplayData(prevData => ({
                    //       ...prevData,
                    //       ...newData,
                    //     }));
                    //   }
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
//   useEffect(() => {
//     loadDetails()
//   }, [])


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
              <DataTable.Title style={{flex: 1.2}}><Text style={{ textAlign: 'center', color:'white'}}>No. of Shipments</Text></DataTable.Title>
              <DataTable.Title style={{flex: 1.2}}><Text style={{ textAlign: 'center', color:'white'}}>No. of Bags</Text></DataTable.Title>
            </DataTable.Header>
 
            {displayData && data.length > 0
                ? Object.keys(displayData11).map((consignorCode, index) =>
                    // displayData11[consignorCode].scanned >= 0 && 
                    displayData11[consignorCode].scanned+ displayData11[consignorCode].bags!==0 ? (
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
                            {displayData11[consignorCode].scanned}
                          </Text>
                        </DataTable.Cell>
                        <DataTable.Cell style={{flex: 1, marginRight: -45}}>
                          <Text style={styles.fontvalue}>
                            {displayData11[consignorCode].bags}
                          </Text>
                        </DataTable.Cell>
                        {/* <MaterialIcons name="check" style={{ fontSize: 30, color: 'green', marginTop: 8 }} /> */}
                      </DataTable.Row>
                        // null

                        )
                     : null,
                  )
                : null}
            {/* {data && data.length > 0 ?
            data.map((single, i) => (
              <DataTable.Row >
                <DataTable.Cell style={{flex: 1.7}}><Text style={styles.fontvalue} >{single.consignorName}</Text></DataTable.Cell>
                <DataTable.Cell style={{flex: 1}}><Text style={styles.fontvalue} >{0}</Text></DataTable.Cell>
                <DataTable.Cell style={{flex: 1}}><Text style={styles.fontvalue} >{0}</Text></DataTable.Cell>
              </DataTable.Row>
            )): null} */}
          </DataTable>
        </Card>
      </ScrollView>
      <Center>
            <Button w="48%" size="lg" bg="#004aad" onPress={()=>navigation.popToTop()}> HomeScreen</Button>
      </Center>
      <Center>
          <Image style={{ width:150, height:150}} source={require('../../assets/image.png')} alt={'Logo Image'} />
      </Center>
    </Box>
    </NativeBaseProvider>
  );
};
export default HandOverSummary;
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


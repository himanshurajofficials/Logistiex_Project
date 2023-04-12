import React, { useEffect, useState } from 'react';
import { Image, Center, NativeBaseProvider, Fab, Icon, Button, Box, Heading, Modal } from 'native-base';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, TextInput, getPick, Alert, TouchableWithoutFeedbackBase, ToastAndroid } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import PieChart from 'react-native-pie-chart';

const SellerSelection = ({ route }) => {
    const [barcodeValue, setBarcodeValue] = useState("");
    
    const [acc, setAcc] = useState(0);
    const [pending, setPending] = useState(0);
    const [reject, setReject] = useState(0);
    const [data, setData] = useState([]);
    const [order, setOrder] = useState([]);
    const [newdata, setnewdata] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [phone, setPhone] = useState(0);
    const [type, setType] = useState('');
    const [DropDownValue, setDropDownValue] = useState(null);
    const [CloseData, setCloseData] = useState([]);
    const [NotAttemptData, setNotAttemptData] = useState([]);
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible2, setModalVisible2] = useState(false);



    return (
        <NativeBaseProvider >
            <View>
                
                

                <View style={{ width: '100%', justifyContent: 'center', flexDirection: 'row', marginTop: 30 }}>
                    <PieChart
                        widthAndHeight={160}
                        series={[pending, acc]}
                        sliceColor={['#F44336', '#4CAF50']}
                        doughnut={true}
                        coverRadius={0.6}
                        coverFill={'#FFF'}
                    />
                </View>
                <View style={{ flexDirection: 'row', width: '85%', marginTop: 30, marginBottom: 10, alignSelf: 'center', justifyContent: 'space-between' }}>
                    <View style={{ backgroundColor: '#4CAF50', width: '48%', padding: 10, borderRadius: 10 }}><Text style={{ color: 'white', alignSelf: 'center' }}>{acc}</Text></View>
                    <View style={{ backgroundColor: '#F44336', width: '48%', padding: 10, borderRadius: 10 }}><Text style={{ color: 'white', alignSelf: 'center' }}>{pending}</Text></View>
                </View>
                <View style={styles.containter}>
                    <ScrollView style={styles.homepage} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                        <ScrollView>
                            <View style={styles.containter}>
                                <View style={styles.mainbox}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, paddingTop: 15 }}>
                                        <Text style={{ fontWeight: '500', fontSize: 18, color: 'black' }}>Seller Name</Text>
                                        <Text style={{ fontWeight: '500', fontSize: 18, color: 'gray' }}>{}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, paddingTop: 15, paddingBottom: 15 }}>
                                        <Text style={{ fontWeight: '500', fontSize: 18, color: 'black' }}>Address</Text>
                                        <Text style={{ fontWeight: '500', fontSize: 14, color: 'gray' }}>{type}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, paddingTop: 15, paddingBottom: 15, borderTopColor: 'lightgray', borderTopWidth: 1 }}>
                                        <View style={styles.outer1}><Text style={{ color: '#6DB1E1', fontWeight: '700' }} >Call Seller</Text></View>
                                        <TouchableOpacity onPress={() => {}}
                                        >
                                            <View style={styles.outer1}><Text style={{ color: '#6DB1E1', fontWeight: '700' }}>Get Direction</Text></View>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </ScrollView>
                        <View style={{ flexDirection: 'row', width: '92%', justifyContent: 'space-between', marginTop: 10, alignSelf: 'center' }}>
                            <Button leftIcon={<Icon color="white" as={<MaterialIcons name="close-circle-outline" />} size="sm" />} onPress={() => setModalVisible(true)} style={{ backgroundColor: '#004aad', width: '48%' }}>
                                Close Pickup
                            </Button>
                            <Button style={{ backgroundColor: '#004aad', width: '50%', alignSelf: 'center' }} leftIcon={<Icon color="white" as={<MaterialIcons name="barcode-scan" />} size="sm" />}

                            >
                                Scan
                            </Button>
                        </View>
                    </ScrollView>
                </View>
                <Center>
                    <Image style={{ nwidth: 150, height: 150 }} source={require('../../assets/image.png')} alt={"Logo Image"} />
                </Center>
            </View>

        </NativeBaseProvider>
    );
};

export default SellerSelection;
export const styles = StyleSheet.create({

    scanbtn: {
        width: 140,
        height: 50,
        color: 'white',
        borderBottomColor: 'red',
        borderBottomWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
    },
    scanbtn2: {
        width: 140,
        height: 50,
        color: 'white',
        borderBottomColor: 'green',
        borderBottomWidth: 2,
        // color:'white',
        marginLeft: 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
    },
    iconbar: {
        marginTop: 10,
        marginLeft: 30,
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        // backgroundColor:'green'
    },
    containter: {
        marginTop: 0,
        marginVertical: 0,
        alignSelf: 'center',
    },
    searchbar: {
        width: 280
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
        borderRadius: 0
    },
    text: {
        paddingLeft: 30,
        color: '#000',
        fontWeight: 'bold',
        fontSize: 18
    },
    text1: {
        alignSelf: 'center',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18
    },
    bt1: {
        fontFamily: 'open sans',
        fontSize: 15,
        lineHeight: 10,
        marginTop: 30,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#004aad',
        width: 100,
        borderRadius: 10,
        paddingLeft: 0,
        marginLeft: 0
    },
    bt2: {
        fontFamily: 'open sans',
        fontSize: 15,
        lineHeight: 10,
        marginTop: -44,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#004aad',
        width: 100,
        borderRadius: 10,
        paddingLeft: 0,
        marginLeft: 110
    },
    bt3: {
        fontFamily: 'open sans',
        color: '#000',
        fontWeight: 'bold',
        fontSize: 15,
        lineHeight: 10,
        marginTop: -44,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#004aad',
        width: 100,
        borderRadius: 10,
        paddingLeft: 0,
        marginLeft: 220
    },
    // containter:{
    //   marginTop:30,
    //   marginVertical:0,
    //   alignSelf:'center',
    // },
    mainbox: {
        width: 340,
        height: 'auto',
        backgroundColor: 'white',
        alignSelf: 'center',
        marginVertical: 20,
        borderRadius: 5,
        shadowColor: "#000",
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
        justifyContent: 'space-around',
        padding: 10,
    },
    innerdown: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10
    },
    outerdown: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 15,
        borderTopWidth: 2,
        borderColor: '#F4F4F4',
    },
    outer1: {
        paddingLeft: 10,
        paddingRight: 10
    },
    fontvalue: {
        padding: 10,
        fontWeight: '700',
        color: "black"
    },
    container69: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 250
    },
    gauge: {
        position: 'absolute',
        width: 100,
        height: 160,
        alignItems: 'center',
        justifyContent: 'center',
    },
    gaugeText: {
        backgroundColor: 'transparent',
        color: '#000',
        fontSize: 24,
    },
    modalContent: {
        flex: 0.7,
        justifyContent: 'center',
        height: '50%',
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
        color: 'rgba(0,0,0,1)'
    },
});

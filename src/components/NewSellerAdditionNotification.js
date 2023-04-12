import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NativeBaseProvider, Box, Center, VStack, Button, Icon, Input, Heading, Alert, Text, Modal, ScrollView, AspectRatio, Stack, HStack, Divider, Fab } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image, StyleSheet, View } from 'react-native';
import { convertAbsoluteToRem } from 'native-base/lib/typescript/theme/tools';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { backendUrl } from '../utils/backendUrl';

export default function NewSellerAdditionNotification(route) {

  const [vehicle, setVehicle] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState(0);
  const [data, setData] = useState([]);
  const [printData, setPrintData] = useState();
  const [loginClicked, setLoginClicked] = useState(false);
  const navigation = useNavigation();
  const [userId, setUserId] = useState('');
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@storage_Key');
      if (value) {
        const { userId } = JSON.parse(value);
        setUserId(userId);
        if (userId) {
          DisplayData();
        } else {
          console.log("User ID is not defined in the storage value");
        }
      } else {
        console.log("No value found in storage for key '@storage_Key'");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const DisplayData = () => {
    axios
      .get(backendUrl + `SellerMainScreen/getadditionalwork/${userId}`)
      .then(res => {
        setData(res.data);
      })
      .catch(error => {
        console.log('Error Msg:', error);
      });
  };
  useEffect(() => {
    DisplayData();
  }, [userId]);
  // console.log('Data:',data);

  const AcceptHandler = async () => {
    console.log('df')
    axios
      .post(backendUrl + 'SellerMainScreen/acceptworkload', {
        consignorCode: data.consignorCode,
        feUserId: userId,
      })
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      });
  }

  const RejectHandler = async () => {
    console.log('df')
    axios
      .post(backendUrl + 'SellerMainScreen/rejectworkload', {
        consignorCode: data.consignorCode,
        feUserId: userId,
      })
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      });
  }



  return (
    <NativeBaseProvider>
      <ScrollView>
        <Box flex={1} bg="coolGray.100" p={4}>
          {(data) && data.length &&
            data.map((d, i) => {
              return (
                <Box key={i} width='100%' marginBottom='5' alignItems="center">
                  <Box width='100%' rounded="lg" overflow="hidden" borderColor="coolGray.100" borderWidth="1" _dark={{
                    borderColor: "coolGray.600",
                    backgroundColor: "white"
                  }} _web={{
                    shadow: 2,
                    borderWidth: 0
                  }} _light={{
                    backgroundColor: "white"
                  }}>
                    <Stack p="4" space={3}>
                      <HStack alignItems="center" space={4} justifyContent="space-between">
                        <HStack alignItems="center">
                          <Text color="black" _dark={{
                            color: "gray.400"
                          }} fontWeight="400">
                            {d.consignorName}   {d.consignorCode}
                          </Text>
                        </HStack>
                        <HStack alignItems="center">
                          <Text color="black" _dark={{
                            color: "gray.400"
                          }} fontWeight="400">
                            {d.ForwardPickups}/{d.ReverseDeliveries}
                          </Text>
                        </HStack>
                      </HStack>
                      <Divider my="1" _light={{
                        bg: "muted.200"
                      }} _dark={{
                        bg: "muted.50"
                      }} />
                      <Stack space={2}>
                        <Text fontSize="sm" _light={{
                          color: "black"
                        }} _dark={{
                          color: "black"
                        }} fontWeight="500" ml="-0.5" mt="-1">
                          Address of seller {"\n"}
                          {d.consignorAddress1} {d.consignorAddress2}{"\n"}
                          {d.consignorCity} - {d.consignorPincode}

                        </Text>
                      </Stack>
                      <Divider my="1" _light={{
                        bg: "muted.200"
                      }} _dark={{
                        bg: "muted.50"
                      }} />
                      <HStack alignItems="center" space={4} justifyContent="space-between">
                        <HStack alignItems="center">
                          <TouchableOpacity onPress={() => RejectHandler()} >
                            <Button style={{ backgroundColor: '#FF2E2E' }} _dark={{
                              color: "red.200"
                            }} fontWeight="400">
                              Reject
                            </Button>
                          </TouchableOpacity>
                        </HStack>
                        <HStack alignItems="center">
                          <TouchableOpacity onPress={() => AcceptHandler()} >
                            <Button style={{ backgroundColor: '#004aad' }} _dark={{
                              color: "blue.200"
                            }} fontWeight="400">
                              Accept
                            </Button>
                          </TouchableOpacity>
                        </HStack>
                      </HStack>
                    </Stack>
                  </Box>
                </Box>
              )
            })
          }

          {
            data.length <= 0 && (
              <Box  width='100%' marginBottom='5' alignItems="center">
                <Box width='100%' rounded="lg" overflow="hidden" borderColor="coolGray.100" borderWidth="1" _dark={{
                  borderColor: "coolGray.600",
                  backgroundColor: "white"
                }} _web={{
                  shadow: 2,
                  borderWidth: 0
                }} _light={{
                  backgroundColor: "white"
                }}>
                  <Stack p="4" space={3}>
                    <HStack alignItems="center" space={4} justifyContent="space-between">
                      <HStack alignItems="center">
                        <Text color="black" _dark={{
                          color: "gray.400"
                        }} fontWeight="400">
                          No Notification 
                        </Text>
                      </HStack>
                    </HStack>
                  </Stack>
                </Box>
              </Box>
            )
          }
          <Center>
            <Image style={{ width: 150, height: 100 }} source={require('../assets/image.png')} alt={"Logo Image"} />
          </Center>
        </Box>
      </ScrollView>



    </NativeBaseProvider>
  );
}

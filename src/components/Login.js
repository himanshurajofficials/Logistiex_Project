/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {NativeBaseProvider, Box, Image, Center, VStack, Button, Icon, Input, Heading, Alert, Text, Modal } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Pressable,Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { backendUrl } from '../utils/backendUrl';
import { BackHandler } from 'react-native';
export default function Login() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState(0);
  const [loginClicked, setLoginClicked] = useState(false);
  const navigation = useNavigation();

  const storeData = async(data) => {
    try {
      const jsonValue = JSON.stringify(data);
      await AsyncStorage.setItem('@storage_Key', jsonValue);
      await AsyncStorage.setItem('apiDataLoaded', 'false');
      var date = new Date();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var time = hours + ':' + minutes + ' ' + ampm;
        var datetime = 'Last Sync\n' + hours + ':' + minutes + ' ' + ampm;
        console.log(datetime);
        AsyncStorage.setItem('lastSyncTime112', datetime);
    } catch (e) {
      console.log(e);
    }
  };
 
  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@storage_Key');
      if (value !== null) {
        const data = JSON.parse(value);
        // await AsyncStorage.setItem('apiDataLoaded', 'false');
        navigation.navigate('Main', {
          userId : data.userId,
        });
 
      }
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackButtonPress
    );
 
    return () => backHandler.remove();
  }, []);

  const handleBackButtonPress = () => {
    BackHandler.exitApp();
    return true; // Prevent default behavior (going back to previous screen)
  };

  useEffect(() => {
    getData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = async() => {
    setLoginClicked(true);
    await axios
      .post(backendUrl + 'Login/login', {email: email, password: password})
      .then(
        async response => {
          setLoginClicked(false);
          setMessage(1);
          setShowModal(true);
          await storeData({
            UserName:
              response.data.userDetails.userFirstName +
              ' ' +
              response.data.userDetails.userLastName,
            UserEmail: response.data.userDetails.userPersonalEmailId,
            userId: response.data.userDetails.userId,
          });
          setTimeout(() => {
            setShowModal(false);
            navigation.navigate('Main', {
              userId: response.data.userDetails.userId,
            });
          }, 100);
        },
        error => {
          console.log(error);
          setLoginClicked(false);
          setMessage(2);
          setShowModal(true);
        },
      );
  };

  return (
    <NativeBaseProvider>
      <Box flex={1} bg="#004aad" alignItems="center" pt={'40%'}>
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <Modal.Content backgroundColor={message === 1 ? '#dcfce7' : '#fee2e2'}>
            <Modal.CloseButton />
            <Modal.Body>
              <Alert w="100%" status={message === 1 ? 'success' : 'error'}>
                <VStack space={1} flexShrink={1} w="100%" alignItems="center">
                  <Alert.Icon size="4xl" />
                  <Text my={3} fontSize="md" fontWeight="medium">{message === 1 ? 'Successfully logged in' : 'Incorrect username or password'}</Text>
                </VStack>
              </Alert>
            </Modal.Body>
          </Modal.Content>
        </Modal> 
        <Box justifyContent="space-between" py={10} px={6} bg="#fff" rounded="xl" width={'90%'} maxWidth="100%" _text={{fontWeight: 'medium'}}>
          <VStack space={6}>
            <Center>
              <Heading>Sign in</Heading>
            </Center>
            <Input value={email} onChangeText={setEmail} size="lg" InputLeftElement={<Icon as={<MaterialIcons name="email-outline" />} size={6} ml="2" color="muted.400" />} placeholder="Enter your email" />
            <Input value={password} onChangeText={setPassword} size="lg" InputLeftElement={<Icon as={<MaterialIcons name="lock-outline" />} size={6} ml="2" color="muted.400" />} type={show ? 'text' : 'password'} InputRightElement={<Pressable onPress={() => setShow(!show)}><Icon as={<MaterialIcons name={show ? 'eye' : 'eye-off'} />} size={6} mr="2" color="muted.400" /></Pressable>} placeholder="Password" />
            {loginClicked ?
              <Button isLoading isLoadingText="Login" title="Login" backgroundColor="#004aad" _text={{ color: 'white', fontSize: 20 }}>LOGIN</Button>
            :
              <Button title="Login" backgroundColor="#004aad" _text={{ color: 'white', fontSize: 20 }} onPress={()=>handleLogin()}>LOGIN</Button>
            }
          </VStack>
        </Box>
        <Center>
          <Image style={{ width: 200, height: 200 }} source={require('../assets/logo.png')} alt={'Logo Image'} />
        </Center>
      </Box>
    </NativeBaseProvider>
  );
}

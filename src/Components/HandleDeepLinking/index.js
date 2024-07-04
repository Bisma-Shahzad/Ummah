import React, {useEffect} from 'react';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import {useNavigation} from '@react-navigation/native';

export default HandleDeepLinking = () => {
  const {navigate} = useNavigation();

  const handleDynamicLinks = async link => {
    // console.log('Foreground link handling:', link);
    // let productId = link.url.split('=').pop();
    // // console.log('productId:', productId);
    // navigate('ChatScreen');
    console.log('Foreground link handling:', link);
    // let chatID = link.url.split('=').pop();
    // console.log('productId:', chatID);
    // navigate('ChatScreen', {userToken: chatID});
  };

  useEffect(() => {
    const unsubscribe = dynamicLinks().onLink(handleDynamicLinks);
    return () => unsubscribe();
  }, []);

  return null;
};

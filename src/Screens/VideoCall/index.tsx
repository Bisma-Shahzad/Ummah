import React, {useEffect, useState} from 'react';
import AgoraUIKit from 'agora-rn-uikit';
import {Text} from 'react-native-paper';
import {
  AppState,
  BackHandler,
  PermissionsAndroid,
  Platform,
  Pressable,
  View,
} from 'react-native';
import {RtcRole, RtcTokenBuilder} from 'agora-access-token';
import {Loader} from '../../Components/ReusableComponent/Loader';
import Toast from 'react-native-toast-message';
import database from '@react-native-firebase/database';
import {CallConnecting} from '../../Components/ReusableComponent/CallConnecting';

type CallDataType = {
  callerId: number;
  id: string;
  recieverId: number;
};

type VideoCallProps = {
  setVideoCalling: React.Dispatch<React.SetStateAction<boolean>>;
  onCallEnd?: () => void;
  callData?: CallDataType; // Replace YourCallDataType with the actual type/interface for callData
};

const VideoCall: React.FC<VideoCallProps> = ({
  setVideoCalling,
  onCallEnd,
  callData,
}) => {
  const [videoCall, setVideoCall] = useState(false);
  const [connectionData, setConnectionData] = useState();

  console.log('callData on videocallaaaaaaa', callData?.callerId);

  // const getAgoraCredentials = async () => {
  //   const response = await fetch(
  //     'http://192.168.18.192:3000/api/agora-credentials?userId=1&channelName=Vieolling',
  //   );
  //   const data = await response.json();
  //   console.log('data: ', data);
  //   setConnectionData(data);
  //   setVideoCall(true);
  // };

  const getAgoraCredentials = async () => {
    try {
      // Example values, replace with actual logic to get userId and channelName
      const userId = callData?.callerId; // This should be dynamically set based on the logged-in user
      const channelName = callData?.id; // This could also be dynamic or static based on your use case

      const url = `https://react-native-agora-backend-server.vercel.app/api/agora-credentials?userId=${userId}&channelName=${channelName}`;
      const response = await fetch(url);
      const data = await response.json();

      if (response.ok && data.token) {
        setConnectionData(data);
        setVideoCall(true);
      } else {
        // Handle any errors or unauthorized access
        console.error(
          'Failed to get Agora credentials:',
          data.error || 'Unknown Error',
        );
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Unable to join video call. Please try again.',
        });
      }
    } catch (error) {
      console.error('Error fetching Agora credentials:', error);
      Toast.show({
        type: 'error',
        text1: 'Network Error',
        text2:
          'Unable to connect to the server. Please check your internet connection and try again.',
      });
    }
  };

  async function requestCameraAndAudioPermission() {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);
      if (
        granted['android.permission.RECORD_AUDIO'] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.CAMERA'] ===
          PermissionsAndroid.RESULTS.GRANTED
      ) {
        console.log('You can use the cameras & mic');
      } else {
        console.log('Permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  }

  useEffect(() => {
    requestCameraAndAudioPermission();
    getAgoraCredentials();
  }, []);

  useEffect(() => {
    // ... (existing code)

    const callEndListener = database()
      .ref(`videocall/${callData?.id}`)
      .on('value', snapshot => {
        const callEndData = snapshot.val();

        if (!callEndData) {
          // The video call data is deleted, end the call
          setVideoCalling(false);
          if (onCallEnd) {
            onCallEnd();
            Toast.show({
              type: 'error',
              text1: 'Call Ended',
              // text2: 'Call Ended',
              visibilityTime: 3000,
              position: 'top',
              autoHide: true,
              topOffset: 80,
            });
          }
        }
      });

    return () => {
      // Cleanup the listener when the component is unmounted
      database().ref(`videocall/${callData?.id}`).off('value', callEndListener);
    };
  }, [callData]);

  const rtcCallbacks = {
    EndCall: () => {
      setVideoCalling(false);
      if (onCallEnd) {
        onCallEnd();
        Toast.show({
          type: 'success',
          text1: 'Call Ended',
          // text2: 'Call Ended',
          visibilityTime: 3000,
          position: 'top',
          autoHide: true,
          topOffset: 80,
        });
      }
    },
  };

  useEffect(() => {
    const appStateListener = AppState.addEventListener(
      'change',
      nextAppState => {
        if (nextAppState === 'background') {
        }
        // else if (nextAppState ===''){}
        else {
          //  || nextAppState === 'inactive'
          // Yahaan aap call end karne ka logic implement karen
          // Example ke liye:
          setVideoCalling(false); // Assuming yeh function call ko end karta hai
          if (onCallEnd) {
            onCallEnd();
          }
        }
      },
    );

    return () => {
      appStateListener.remove();
    };
  }, []);

  return videoCall && connectionData !== 'undefined' ? (
    <AgoraUIKit connectionData={connectionData} rtcCallbacks={rtcCallbacks} />
  ) : (
    // <Loader />
    <CallConnecting />
  );
};

export default VideoCall;

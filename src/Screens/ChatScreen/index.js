import {
  FlatList,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  AppState,
  Share,
} from 'react-native';
import Head from '../../Components/ReusableComponent/Head';
import ButtonComp from '../../Components/ReusableComponent/Button';
import {SuccessModal} from '../../Components/ReusableComponent/SuccessModal';
import SafeArea from '../../Components/ReusableComponent/Safearea';
import {useCallback, useEffect, useRef, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import Heading from '../../Components/ReusableComponent/Heading';
import LinearGradient from 'react-native-linear-gradient';
import {TextInput} from 'react-native-paper';
import {sendTextMessage} from '../../Utils/Actions/chatActions';
import {useSelector} from 'react-redux';
import database from '@react-native-firebase/database';
import {Loader} from '../../Components/ReusableComponent/Loader';
import VideoCall from '../VideoCall';
import app from '../../Firebase/firebaseConfig';
import {
  generateLink,
  sendFCMNotification,
} from '../../Utils/NotificationFunction';
import Toast from 'react-native-toast-message';

export const ChatScreen = ({route}) => {
  // console.log('route.params: ', route.params);
  const userToken = route.params.userToken;
  const Navigation = useNavigation();
  const [secondModal, setSecondModal] = useState(false);
  const [messageText, setMessageText] = useState('');
  const AuthReducer = useSelector(state => state.AuthReducer.userData.token);
  const AuthReducerId = useSelector(
    state => state.AuthReducer.userData.user.id,
  );
  const AuthReducerData = useSelector(state => state.AuthReducer.userData);
  const [myMessages, setMyMessages] = useState([]);
  const [userMessages, setUserMessages] = useState([]);
  const [otherUserMessages, setOtherUserMessages] = useState([]);
  const [allMessages, setAllMessages] = useState([]);
  const loggedInUser = AuthReducer?.user;
  const [userBio, setUserBio] = useState([]);
  const [myBio, setMyBio] = useState([]);
  const [loader, setloader] = useState(false);
  const [videoCalling, setVideoCalling] = useState(false);
  const [videoCallingData, setVideoCallingData] = useState();
  const mergedMessages = [...userMessages, ...otherUserMessages];
  const sortedMergedMessages = mergedMessages.sort(
    (a, b) => new Date(a.sentAt) - new Date(b.sentAt),
  );
  const flatListRef = useRef();
  // console.log('userBio', userBio.fcmToken);
  // console.log(
  //   'videoCallingaaaaaaaa',
  //   AuthReducerData.user.profile.display_name,
  // );

  useEffect(() => {
    setloader(true);
    // Scroll to the end of the FlatList whenever sortedMergedMessages changes
    // flatListRef.current.scrollToEnd({animated: true});
    setloader(false);
  }, [sortedMergedMessages]);

  // console.log('sortedMergedMessages', sortedMergedMessages);

  useEffect(() => {
    setloader(true);
    const messageData = database().ref(
      `messages/${AuthReducerId}/${userToken}`,
    );
    messageData.on('value', async snapshot => {
      const userMsg = snapshot.val();
      // console.log('mymsg', userMsg);
      if (userMsg) {
        const sortedMessages = Object.values(userMsg).sort(
          (a, b) => new Date(a.sentAt) - new Date(b.sentAt),
        );
        setUserMessages(sortedMessages);
      }
    });

    const userProfile = database().ref(`users/${userToken}`);
    userProfile.once('value', async snapshot => {
      const userPro = snapshot.val();
      setUserBio(userPro);
    });

    setloader(false);
  }, [userToken, AuthReducer]);

  // console.log('userMessages', userMessages)

  const sendMessage = useCallback(async () => {
    try {
      const newMessage = {
        sentBy: AuthReducerId,
        sentAt: new Date().toISOString(),
        message: messageText,
      };
      setUserMessages(prevMessages => [...prevMessages, newMessage]);

      setMessageText('');
      // console.log('newMessage', newMessage);
      // console.log('messageText', messageText);
      await sendTextMessage(userToken, AuthReducerId, messageText);

      //Send Notification

      // console.log('AuthReducerId: ', AuthReducerId);

      const getLink = await generateLink(AuthReducerId);
      try {
      } catch (error) {
        console.log('Sharing Error:', error);
      }
      const recipientToken = userBio?.fcmToken;
      const title = AuthReducerData.user.profile.display_name;
      const body = messageText;
      const link = getLink;

      console.log('link: ', link);

      sendFCMNotification(recipientToken, title, body, link)
        .then(result => {
          // Handle success
          console.log('Notification sent successfully:', result);
        })
        .catch(error => {
          // Handle error
          console.error('Error sending notification:', error);
        });
    } catch (error) {
      console.log(error);
    }
  }, [messageText, AuthReducerId, userToken]);

  const renderItem = ({item}) => {
    const messageTime = new Date(item.sentAt).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    return (
      <>
        <View style={{marginHorizontal: '1%', flex: 1}}>
          {item.sentBy === userToken ? (
            <View style={{marginTop: 30}}>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                {
                  userBio.profileImage ? (
                    <Image
                      source={{
                        uri: `https://nextgenbulliontool.com${userBio?.profileImage}`,
                      }}
                      style={{
                        backgroundColor: 'red',
                        marginTop: -30,
                        width: 37,
                        height: 37,
                        borderRadius: 20,
                        borderWidth: 1,
                        borderColor: 'rgba(0, 0, 0, 0.1)',
                      }}
                    />
                  ) : null
                  // (
                  //   <Image
                  //     source={require('../../Assets/Images/myprofile.png')}
                  //     style={{marginTop: -30}}
                  //   />
                  // )
                }

                <View>
                  <LinearGradient
                    colors={['#0B105C', '#407BFF']}
                    start={{x: 2, y: 0}}
                    end={{x: 0, y: 1}}
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: 230,
                      borderRadius: 7,
                      borderColor: 'white',
                      borderWidth: 3,
                    }}>
                    <Heading
                      // Stylefont={'normal'}

                      Heading={item.text}
                      color={'rgba(255, 255, 255, 1)'}
                      Fontsize={13}
                      width={220}
                      txtAlign={'left'}
                      p={10}
                      lh={18}
                    />
                  </LinearGradient>
                </View>
              </View>
              <Heading
                Heading={messageTime}
                color={'rgba(156, 156, 156, 1)'}
                Fontsize={12}
                txtAlign={'right'}
                mr={123}
              />
            </View>
          ) : (
            <View style={{marginTop: 30}}>
              <View
                style={{
                  flexDirection: 'row',
                  marginRight: 20,
                }}>
                <View
                  style={{
                    flex: 1,
                    marginLeft: 100,
                    alignItems: 'right',
                    borderRadius: 7,
                    // borderColor: 'white',
                    borderWidth: 3,
                    borderColor:
                      Platform.OS === 'ios'
                        ? 'rgba(0, 0, 0, 0.1)'
                        : 'rgba(0, 0, 0, 0.12)',
                    // elevation: 12,
                  }}>
                  <Heading
                    Fontsize={13}
                    width={220}
                    txtAlign={'left'}
                    p={10}
                    lh={18}
                    Heading={item.text}
                    color={'rgba(156, 156, 156, 1)'}
                  />
                </View>

                <Image
                  source={{
                    uri: `https://nextgenbulliontool.com${AuthReducerData?.user?.profile?.profile_pic}`,
                  }}
                  style={{
                    marginTop: -30,
                    width: 37,
                    height: 37,
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: 'rgba(0, 0, 0, 0.1)',
                  }}
                />
              </View>
              <Heading
                Heading={messageTime}
                color={'rgba(156, 156, 156, 1)'}
                Fontsize={12}
                ml={100}
                mt={3}
                mb={5}
              />
            </View>
          )}
        </View>
      </>
    );
  };

  const handleVideoCallPress = async () => {
    try {
      // Check if the receiver is busy
      const busySnapshot = await database().ref('videocall').once('value');

      const videoCalls = busySnapshot.val();

      if (videoCalls) {
        // Check if userToken is present as callerId or recieverId in any of the video calls
        const isBusy = Object.values(videoCalls).some(
          call => call.callerId === userToken || call.recieverId === userToken,
        );

        if (isBusy) {
          // Check if AuthReducerId is present as callerId or recieverId in any of the video calls
          const isBusyWithAuthUser = Object.values(videoCalls).some(
            call =>
              call.callerId === AuthReducerId ||
              call.recieverId === AuthReducerId,
          );

          if (isBusyWithAuthUser) {
            // console.log(
            //   'User is busy with Auth user. Cannot initiate video call.',
            // );
            const existingCall = Object.values(videoCalls).find(
              call =>
                call.callerId === AuthReducerId ||
                call.recieverId === AuthReducerId,
            );

            // setVideoCallingData(existingCall);
            // setVideoCalling(true);

            // Sending Notification of video call to other user
            const recipientToken = userBio?.fcmToken;
            const title = AuthReducerData.user.profile.display_name;
            const body = 'Video Calling';

            sendFCMNotification(recipientToken, title, body)
              .then(result => {
                // Handle success
                console.log('Notification sent successfully:', result);
              })
              .catch(error => {
                // Handle error
                console.error('Error sending notification:', error);
              });
            // Sending Notification of video call to other user

            // return;
          } else {
            Toast.show({
              type: 'error',
              text1: 'User is busy on another call',
              // text2: 'Call Ended',
              visibilityTime: 3000,
              position: 'top',
              autoHide: true,
              topOffset: 80,
            });
            console.log('User is busy. Cannot initiate video call.');
            // return;
          }
          // Display a message to the user indicating that the receiver is busy
        }
      } else {
        // If the receiver is not busy, initiate the video call
        // setVideoCalling(true);

        // Generate a unique ID for the video call session
        const videoCallId = database().ref('videocall').push().key;

        const messageData = {
          id: videoCallId, // Adding the generated ID inside messageData
          callerId: AuthReducerId,
          recieverId: userToken,
        };

        // console.log('messageData111111', messageData);

        // const messageRef = database()
        //   .ref(`videocall/${videoCallId}`)
        //   .set(messageData)
        //   .then(async () => {
        //     // Retrieve the complete data
        //     const snapshot = await database()
        //       .ref(`videocall/${videoCallId}`)
        //       .once('value');
        //     const completeData = snapshot.val();
        //     console.log('Video call initiated', completeData);
        //     setVideoCallingData(completeData);
        //     setVideoCalling(true);
        //   })
        //   .catch(err => console.log('Video call initiation failed'));

        // Sending Notification of video call to other user
        const recipientToken = userBio?.fcmToken;
        const title = AuthReducerData.user.profile.display_name;
        const body = 'Video Calling';

        sendFCMNotification(recipientToken, title, body)
          .then(result => {
            // Handle success
            console.log('Notification sent successfully:', result);
          })
          .catch(error => {
            // Handle error
            console.error('Error sending notification:', error);
          });
        // Sending Notification of video call to other user
      }
    } catch (error) {
      console.error('Error handling video call press:', error);
    }
  };

  const handleVideoCallEnd = () => {
    // This function will be called when the video call ends
    console.log('Video call endedjjjjjjjjjjj');
    // Add any additional logic you need here
    const messagesRef = app.database().ref(`videocall`);
    messagesRef
      .child(`${videoCallingData.id}`)
      .remove()
      .then(() => {
        console.log(`Messages for user  removed successfully`);
      })
      .catch(error => {
        console.error(`Error removing messages for user `, error);
      });
  };

  return (
    <>
      <SafeArea>
        {loader ? (
          <Loader />
        ) : videoCalling ? (
          <VideoCall
            setVideoCalling={setVideoCalling}
            onCallEnd={handleVideoCallEnd}
            callData={videoCallingData}
          />
        ) : (
          <View
            style={{
              flex: 1,
            }}>
            <View style={{backgroundColor: 'white'}}>
              <Head
                head={
                  userBio.is_active ? userBio.display_name : 'No User Found'
                }
                // backName={backNames}
                videoCalling={userBio.is_active ? true : false}
                onVideoCallPress={handleVideoCallPress} // Pass the callback function to the child component
              />
            </View>

            <KeyboardAvoidingView
              style={{flex: 1, marginBottom: 5}}
              behavior={Platform.OS === 'ios' ? 'padding' : null}
              // keyboardVerticalOffset={65}
            >
              <FlatList
                data={Object.values(sortedMergedMessages)}
                renderItem={renderItem}
                contentContainerStyle={{flexGrow: 1}}
                showsVerticalScrollIndicator={false}
                ref={flatListRef}
                onContentSizeChange={() => {
                  flatListRef.current.scrollToEnd({animated: true});
                }}
                // style={{ paddingTop: 40 }}
              />
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderColor: 'rgba(11, 16, 92, 0.5)',
                  borderWidth: 1,
                  backgroundColor: 'white',
                  width: '90%',
                  borderRadius: 20,
                  height: 48,
                  shadowColor: '#000',
                  shadowOffset: {width: 0, height: 2},
                  shadowOpacity: 0.5,
                  shadowRadius: 4,
                  elevation: 5,
                  marginLeft: 18,
                  // marginBottom: 45,
                }}>
                <TextInput
                  value={messageText}
                  onChangeText={text => setMessageText(text)}
                  placeholder="Type message"
                  style={{
                    flex: 1,
                    backgroundColor: 'transparent',
                    color: 'black',
                    fontStyle: 'italic',
                    fontSize: 12,
                  }}
                  placeholderTextColor={'rgba(102, 112, 128, 1)'}
                  activeUnderlineColor={'transparent'}
                  underlineColorAndroid={'transparent'}
                  underlineColor={'transparent'}
                  editable={userBio.is_active ? true : false}
                  placeholderStyle={{fontStyle: 'italic'}}
                  onSubmitEditing={sendMessage}
                />
                {/* <Image
                    source={require('../../Assets/Images/sendLocation.png')}
                    style={{marginRight: 10}}
                  /> */}

                <TouchableOpacity
                  onPress={userBio.is_active ? sendMessage : null}>
                  <Image
                    source={require('../../Assets/Images/sendmessage.png')}
                    style={{
                      width: 46,
                      height: 76,
                      marginRight: 1,
                      marginTop: 2,
                    }}
                  />
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </View>
        )}
      </SafeArea>
    </>
  );
};

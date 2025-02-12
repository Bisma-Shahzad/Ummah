import React, {useEffect, useState} from 'react';
import {
  LogBox,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import StackNavigator from './src/Navigators/Stack';
import {Provider, useDispatch, useSelector} from 'react-redux';
import {Store} from './src/Store';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import {
  getFcmToken,
  registerListenerWithFCM,
} from './src/Utils/PushNotification';

// import {getFcmToken, registerListenerWithFCM} from './src/utils/fcmHelper';

// import {
//   NotificationServices,
//   requestUserPermission,
// } from './src/Utils/PushNotification.js';

const App = () => {
  // useEffect(() => {
  //   requestUserPermission();
  //   NotificationServices();
  // }, []);

  useEffect(() => {
    getFcmToken();
  }, []);

  useEffect(() => {
    const unsubscribe = registerListenerWithFCM();
    return unsubscribe;
  }, []);

  // const Navigation = useNavigation();

  LogBox.ignoreLogs([
    "ViewPropTypes will be removed from React Native. Migrate to ViewPropTypes exported from 'deprecated-react-native-prop-types",
    'ColorPropType will be removed',
    'Failed prop type',
    'VirtualizedLists should never be nested',
  ]);
  // const {navigate} = useNavigation();

  LogBox.ignoreAllLogs();
  return (
    <GestureHandlerRootView style={styles.container}>
      <Provider store={Store}>
        <PaperProvider>
          <StackNavigator />
          <Toast />
        </PaperProvider>
      </Provider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;

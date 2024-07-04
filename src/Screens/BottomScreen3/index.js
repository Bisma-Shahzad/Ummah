import {
  ActivityIndicator,
  Image,
  Pressable,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import {sendFCMNotification} from '../../Utils/NotificationFunction';

export default BottomScreen3 = ({route}) => {
  const productId = 1;
  const [productData, setProductData] = useState({});
  const [loading, setLoading] = useState(true);

  const getSingleProduct = async () => {
    try {
      const result = await axios.get(
        `https://dummyjson.com/products/${productId}`,
      );
      const data = result.data;
      setProductData(data);
      setLoading(false);
    } catch (error) {
      console.log('Error:', error);
    }
  };
  console.log('data from state:', productData);
  useEffect(() => {
    getSingleProduct();
  }, []);

  const generateLink = async () => {
    try {
      const link = await dynamicLinks().buildShortLink(
        {
          link: `https://deplinkingboiler.page.link/naxz?productId=${productId}`,
          domainUriPrefix: 'https://deplinkingboiler.page.link',
          android: {
            packageName: 'com.boilerplate',
          },
          ios: {
            appStoreId: '123456789',
            bundleId: 'com.deepLinkingProjectBundleId',
          },
        },
        dynamicLinks.ShortLinkType.DEFAULT,
      );
      console.log('link:', link);
      return link;
    } catch (error) {
      console.log('Generating Link Error:', error);
    }
  };

  const shareProduct = async () => {
    const getLink = await generateLink();
    try {
      Share.share({
        message: getLink,
      });
    } catch (error) {
      console.log('Sharing Error:', error);
    }
    const recipientToken =
    // 'ca8c87bISDGnKqUPINAmTn:APA91bGQbXG7Xnt_tKJgA_IJAtJmZ7y9XkQZhDTB_EBChr0YDH2E5bFaBw_enoo5_MNySMuJTcWDldWpH0SWHTs7Iutu7Bwcei64w7s7dprPAF83yMSmniWAc9vL4-gQ6jXZPkTQWlKG'
      'cfg6IoCXcEPPk0TzRjfyKR:APA91bGsrNXlKp5WY2btazmUs2Q53yuCWqjmEqDAM3RLeghHX2u9BKY-2wiii7G3URd_g2hsIVjrx0_RWEyQa_dMeesmlYNhC8Zw6u5cvAv1edUahMf2BFBeFoyaAeex0qqoIdJoYTH_'; // Example token
    const title = 'New Message';
    const body = 'You have a new message!';
    const link = getLink

    sendFCMNotification(recipientToken, title, body, link)
      .then(result => {
        // Handle success
        console.log('Notification sent successfully:', result);
      })
      .catch(error => {
        // Handle error
        console.error('Error sending notification:', error);
      });
  };

  return (
    <>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <View style={styles.container}>
          <View style={styles.flatStyle}>
            <Image
              style={styles.imgStyle}
              source={{uri: productData?.thumbnail}}
            />
            <View style={styles.bodyStyle}>
              <View style={styles.innerBox}>
                <Text style={styles.textTitle}>{productData?.brand}</Text>
                <Text style={styles.textStyle}>{productData?.price}$</Text>
              </View>
              <Text>{productData?.description}</Text>
            </View>
            <View style={styles.footer}>
              <Pressable onPress={shareProduct} style={styles.btn}>
                <Text style={styles.btnTitle}>Share Product</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  imgStyle: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  bodyStyle: {
    justifyContent: 'space-between',
    marginVertical: 10,
    marginHorizontal: 20,
  },
  innerBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  textStyle: {
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    marginVertical: 20,
    marginHorizontal: 20,
  },
  btn: {
    backgroundColor: '#797ee630',
    padding: 20,
    borderRadius: 10,
  },
  btnTitle: {
    color: '#797ee6',
    fontSize: 20,
    textAlign: 'center',
  },
});

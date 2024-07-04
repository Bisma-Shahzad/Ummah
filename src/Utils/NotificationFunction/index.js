import dynamicLinks from '@react-native-firebase/dynamic-links';

export async function generateLink(chatId) {
  try {
    const link = await dynamicLinks().buildShortLink(
      {
        link: `https://deplinkingboiler.page.link/naxz?chatId=${chatId}`,
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
}

export async function sendFCMNotification(token, title, body, link) {
  const myHeaders = new Headers();
  myHeaders.append(
    'Authorization',
    'key=AAAArMWEFH8:APA91bHxrCd0wVD8q5xfYq6mo_yhcQRgTyS0fGi9TYQ8ns6YtY-q3t0eEDZ3JDgHaSvi-xCPOvRggpcUnb_5kilcuIBpom83SrNxgd8csMKrMYwowRRo0OMCvtNElq45xAshtIc0GKFs',
  ); // Replace YOUR_SERVER_KEY with your actual server key
  myHeaders.append('Content-Type', 'application/json');

  const raw = JSON.stringify({
    to: token, // Recipient's device token
    notification: {
      title: title, // Notification title
      body: body, // Notification body
    },
    data: {
      link: link, // Correctly placing data object at the same level as notification
      Checking_Screen:"qdydhuwdhu"
    },
  });

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  try {
    const response = await fetch(
      'https://fcm.googleapis.com/fcm/send',
      requestOptions,
    );
    const result = await response.text();
    console.log('result of sending notiofocation',result);
    return result;
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error; // Or handle error as needed
  }
}

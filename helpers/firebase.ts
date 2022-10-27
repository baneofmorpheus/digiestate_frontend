// import { initializeApp, getApps, getApp, FirebaseOptions } from 'firebase/app';
import firebase from 'firebase/app';
import 'firebase/messaging';
// import { getMessaging, getToken, onMessage } from 'firebase/messaging';
// import localforage from 'localforage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_APIKEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_APP_ID,
};

!firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();
// const app = !firebase.getApps().length ? initializeApp(firebaseConfig) : getApp();
// const messaging = getMessaging(app);
let messaging: any;

if (process.browser) {
  messaging = firebase.messaging();
}
// const retrieveDeviceToken = async () => {
//   console.log('retrieving token');

//   return getToken(messaging, {
//     vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
//   })
//     .then((currentToken) => {
//       if (currentToken) {
//         console.log('current token for client: ', currentToken);
//         return currentToken;
//       } else {
//         console.log(
//           'No registration token available. Request permission to generate one.'
//         );
//       }
//     })
//     .catch((err) => {
//       console.log('An error occurred while retrieving token. ', err);
//       // catch error while creating client token
//     });
// };

const retrieveToken = async () => {
  try {
    console.log('retreving');

    const currentToken = await messaging.getToken({
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    });

    if (currentToken) {
      console.log('token');
      console.log(currentToken);

      return currentToken;
    }

    return await requestPermission();
  } catch (error) {
    console.log('error retrieving token');
    console.log(error);
  }
};

const requestPermission = async () => {
  console.log('Requesting permission...');
  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      console.log('Notification permission granted.');
      return;
    }
    console.log('permission not granted');
  });
};

export { messaging, retrieveToken };

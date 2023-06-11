importScripts('https://www.gstatic.com/firebasejs/8.3.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.3.2/firebase-messaging.js');

const firebaseConfig = {
  authDomain: '',
  databaseURL: '',
  storageBucket: '',
  messagingSenderId: '1085005472195',
  projectId: 'digi-estate',
  appId: '1:1085005472195:web:e352fc39fb2b26071d9d76',
  apiKey: 'AIzaSyDvIT4sOKBVSkHIwHcI5dGILOyf42KdOmM',
};
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler((payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  );
  const notificationTitle = 'Background Message Title';
  const notificationOptions = {
    body: 'Background Message body.',
    icon: '/firebase-logo.png',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

importScripts('https://www.gstatic.com/firebasejs/8.3.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.3.2/firebase-messaging.js');

const firebaseConfig = {
  authDomain: '',
  databaseURL: '',
  storageBucket: '',
  messagingSenderId: '71945458919',
  projectId: 'dclapp',
  appId: '1:71945458919:web:43d9bea25770ee4271be42',
  apiKey: 'AIzaSyB2OZp2voeswWjhwx9aEgL1X4VnKbgZg98',
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

importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js')

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: 'AIzaSyBoerRSJJZjUnWLHOY6rNhEC5lmY8PMoPM',
  authDomain: 'kmp-agency.firebaseapp.com',
  databaseURL: 'https://kmp-agency.firebaseio.com',
  projectId: 'kmp-agency',
  storageBucket: 'kmp-agency.firebasestorage.app',
  messagingSenderId: '389833259199',
  appId: '1:389833259199:web:3cabe1313dc857cc1dae0a',
  measurementId: 'G-1P0TC3E2SD',
})

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging()

console.log(messaging)

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload)
  // Customize notification here
  const notificationTitle = 'Background Message Title'
  const notificationOptions = {
    body: 'Background Message body.',
    icon: '/firebase-logo.png',
  }

  self.registration.showNotification(notificationTitle, notificationOptions)
})

messaging.onMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload)
  // Customize notification here
  const notificationTitle = 'Background Message Title'
  const notificationOptions = {
    body: 'Background Message body.',
    icon: '/firebase-logo.png',
  }

  self.registration.showNotification(notificationTitle, notificationOptions)
})

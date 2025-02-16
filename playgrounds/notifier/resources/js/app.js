import { initializeApp } from 'firebase/app'
import { getMessaging, getToken } from 'firebase/messaging'
import { getAuth, signInAnonymously } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyBoerRSJJZjUnWLHOY6rNhEC5lmY8PMoPM',
  authDomain: 'kmp-agency.firebaseapp.com',
  databaseURL: 'https://kmp-agency.firebaseio.com',
  projectId: 'kmp-agency',
  storageBucket: 'kmp-agency.firebasestorage.app',
  messagingSenderId: '389833259199',
  appId: '1:389833259199:web:3cabe1313dc857cc1dae0a',
  measurementId: 'G-1P0TC3E2SD',
}

const app = initializeApp(firebaseConfig)
const messaging = getMessaging(app)

async function requestPermission() {
  const permission = await Notification.requestPermission()

  console.log(permission)

  try {
    const token = await getToken(messaging)

    console.log(token)
  } catch {}
}

requestPermission()

console.log(messaging)

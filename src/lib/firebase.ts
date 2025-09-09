// src/lib/firebase.ts
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD5NdNhtd5YtgPRRbbX5bBBNUz-PyxgBOo",
  authDomain: "vibeverse-nk9c7.firebaseapp.com",
  projectId: "vibeverse-nk9c7",
  storageBucket: "vibeverse-nk9c7.appspot.com",
  messagingSenderId: "736300805535",
  appId: "1:736300805535:web:d55daebffbf44f3d2261aa"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const firestore = getFirestore(app);
const googleAuthProvider = new GoogleAuthProvider();

export { app, auth, firestore, googleAuthProvider };

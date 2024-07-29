// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth , createUserWithEmailAndPassword,signOut as firebaseSignOut, signInWithEmailAndPassword} from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyD79JQmfViTnd4173oGoPRyawAe3-TQR1c',
  authDomain: 'payment-30401.firebaseapp.com',
  projectId: 'payment-30401',
  storageBucket: 'payment-30401.appspot.com',
  messagingSenderId: '1093260208309',
  appId: "1:1093260208309:web:c559ef8424e9a685ebf6fc",
  measurementId: "G-B6MWC2M61H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword ,firebaseSignOut as signOut };

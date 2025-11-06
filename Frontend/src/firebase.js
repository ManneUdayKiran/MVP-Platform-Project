// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";




const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDsj-7HJoJk7ev0-Pot-Xq31J9wT66mKtM",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "prompt-to-product-75d41.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "prompt-to-product-75d41",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "prompt-to-product-75d41.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1013696606676",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1013696606676:web:816605aefca1cc4e896641",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-FHVNXVNRCL"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export const provider = new GoogleAuthProvider();

export { auth,db };

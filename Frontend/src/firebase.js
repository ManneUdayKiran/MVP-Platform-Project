// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";




const firebaseConfig = {
  apiKey: "AIzaSyDsj-7HJoJk7ev0-Pot-Xq31J9wT66mKtM",
  authDomain: "prompt-to-product-75d41.firebaseapp.com",
  projectId: "prompt-to-product-75d41",
  storageBucket: "prompt-to-product-75d41.firebasestorage.app",
  messagingSenderId: "1013696606676",
  appId: "1:1013696606676:web:816605aefca1cc4e896641",
  measurementId: "G-FHVNXVNRCL"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export const provider = new GoogleAuthProvider();

export { auth,db };

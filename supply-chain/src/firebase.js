// firebase.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDpmILAMo1F8bwN-Qlh8__1VvOozQ9zrfE",
  authDomain: "supply-chain-8011d.firebaseapp.com",
  projectId: "supply-chain-8011d",
  storageBucket: "supply-chain-8011d.firebasestorage.app",
  messagingSenderId: "58061519693",
  appId: "1:58061519693:web:0560278cf9ef2c171f9504",
  measurementId: "G-JJ4WMP2SJ7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app); // Firebase Authentication
const db = getFirestore(app); // Firestore Database

export { auth, db, createUserWithEmailAndPassword, signInWithEmailAndPassword };

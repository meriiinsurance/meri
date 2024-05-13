// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  // apiKey: "AIzaSyBGKyyFQA37tfRMPEvFW1jMB_T2ZubvBJc",
  // authDomain: "meri-db.firebaseapp.com",
  // projectId: "meri-db",
  // storageBucket: "meri-db.appspot.com",
  // messagingSenderId: "372446182743",
  // appId: "1:372446182743:web:ba2172b18e0735e0061212"
  apiKey: "AIzaSyCjLuuY2w_IEvxYsA0Z0jgpbuJH_Vz3W-Y",
  authDomain: "meri-db-8b635.firebaseapp.com",
  projectId: "meri-db-8b635",
  storageBucket: "meri-db-8b635.appspot.com",
  messagingSenderId: "800584748972",
  appId: "1:800584748972:web:9a90b07a13eac605cd7409"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const storage = getStorage(app)
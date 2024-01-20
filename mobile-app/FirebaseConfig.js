import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBHHNYrpq7YCgtra7xdJ64GiZjuEMqqQo0",
  authDomain: "culinary-app-c840f.firebaseapp.com",
  projectId: "culinary-app-c840f",
  storageBucket: "culinary-app-c840f.appspot.com",
  messagingSenderId: "579680025656",
  appId: "1:579680025656:web:5ee1379115690e85573acd",
  measurementId: "G-TBX8LD92GF"
};


export const FIREBASE_APP = initializeApp(firebaseConfig);

export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB=getFirestore(FIREBASE_APP);

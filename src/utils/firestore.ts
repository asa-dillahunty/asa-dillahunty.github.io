// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAn_Nl2_z_w3p-CVu_VyQS1Qad-sOJe8zE",
  authDomain: "portfolio-asa.firebaseapp.com",
  databaseURL: "https://portfolio-asa-default-rtdb.firebaseio.com",
  projectId: "portfolio-asa",
  storageBucket: "portfolio-asa.firebasestorage.app",
  messagingSenderId: "95224014436",
  appId: "1:95224014436:web:d25d1a2de01ee1368ba171",
  measurementId: "G-96CHPQ87S9",
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseDb = getFirestore(firebaseApp);

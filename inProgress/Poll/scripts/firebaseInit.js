// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDjg_14yk4KIgOC5OsMKx9FyhE7z_j0NvA",
    authDomain: "acm-sign-in.firebaseapp.com",
    projectId: "acm-sign-in",
    storageBucket: "acm-sign-in.appspot.com",
    messagingSenderId: "996812970276",
    appId: "1:996812970276:web:1d683372e7b3b8402abbb1",
    measurementId: "G-JWSWFLL02E"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

var db = firebase.firestore();
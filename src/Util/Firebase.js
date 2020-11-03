import firebase from 'firebase';
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyA35wnkTg88bVWSIm2m6spPFPZFpOnQMIo",
    authDomain: "projeto01-c3177.firebaseapp.com",
    databaseURL: "https://projeto01-c3177.firebaseio.com",
    projectId: "projeto01-c3177",
    storageBucket: "gs://projeto01-c3177.appspot.com/",
    messagingSenderId: "402659991888",
    appId: "1:402659991888:web:f8a9ca69712c781e534c55"
  };
  
  // Initialize Firebase
  export const firebaseApp = firebase.initializeApp(firebaseConfig);
  export const firebaseStorage = firebase.storage();

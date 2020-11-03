import firebase from 'firebase/app';
import "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyA35wnkTg88bVWSIm2m6spPFPZFpOnQMIo",
    authDomain: "projeto01-c3177.firebaseapp.com",
    databaseURL: "https://projeto01-c3177.firebaseio.com",
    projectId: "projeto01-c3177",
    storageBucket: "projeto01-c3177.appspot.com",
    messagingSenderId: "402659991888",
    appId: "1:402659991888:web:f8a9ca69712c781e534c55"
  };
  
  // Initialize Firebase
  const firebaseImpl = firebase.initializeApp(firebaseConfig);

  export default firebaseImpl;
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore"



const firebaseConfig={
    apiKey: "AIzaSyCuRpm5FAQe6237RUlu9qz_PdmPjlyfhZY",
    authDomain: "shopping-app-95c22.firebaseapp.com",
    projectId: "shopping-app-95c22",
    storageBucket: "shopping-app-95c22.appspot.com",
    messagingSenderId: "162000973398",
    appId: "1:162000973398:web:4d5c236c8184a9968dd5f7",
    measurementId: "G-7N10HDSK9M"
}

if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
}

export {firebase};
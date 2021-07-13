import firebase from "firebase/app"

import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

const isBrowser = () => typeof window !== 'undefined'
var firebaseConfig = {
    apiKey: "AIzaSyChuCNh8Fl4Dc5TdOGa-LJDsRxSwNcz4Aw",
    authDomain: "suite-sale.firebaseapp.com",
    projectId: "suite-sale",
    storageBucket: "suite-sale.appspot.com",
    messagingSenderId: "1003066460606",
    appId: "1:1003066460606:web:0a9c3b91ab17f9a01dd1ef",
    measurementId: "G-QJZ817GHCW"
};

// Initialize Firebase
if (typeof window !== 'undefined') {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    } else {
        firebase.app(); // if already initialized, use that one
    }
} 

//firebase.analytics()

const auth = isBrowser() ? firebase?.auth() : null
const firestore = isBrowser() ? firebase?.firestore() : null
const imgStorage = isBrowser() ? firebase?.storage().ref() : null

export { firebase, auth, firestore, imgStorage }
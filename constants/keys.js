import firebase from "firebase";
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyD6kbx8Ddo98FIq-b8HSk4dg2UQKIxAk8U",
    authDomain: "doradoapp-fc9d5.firebaseapp.com",
    projectId: "doradoapp-fc9d5",
    storageBucket: "doradoapp-fc9d5.appspot.com",
    messagingSenderId: "435858723410",
    appId: "1:435858723410:web:712fcd4ec74bcb3553858b"
};
// Initialize Firebase
const fire = firebase.initializeApp(firebaseConfig);
// const firebase_analtytics = firebase.analytics();
const auth = fire.auth()

const store = fire.firestore()

const storage = fire.storage()

export { auth, store, storage }
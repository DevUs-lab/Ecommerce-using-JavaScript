// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBfiA-mCSnbxtKUcbSdLDMs3hxBkaGc3XY",
    authDomain: "umair-303811.firebaseapp.com",
    projectId: "umair-303811",
    storageBucket: "umair-303811.firebasestorage.app",
    messagingSenderId: "242121755427",
    appId: "1:242121755427:web:57fd4ee6b3e208f8ec9a96",
    measurementId: "G-RTQYNNXBVE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(app);
export { auth };
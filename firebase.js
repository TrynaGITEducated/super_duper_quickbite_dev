// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCPRwzVFh-L4Fxu6t2DZZG6Aj-5zNIuElg",
  authDomain: "quickbite-65615.firebaseapp.com",
  projectId: "quickbite-65615",
  storageBucket: "quickbite-65615.firebasestorage.app",
  messagingSenderId: "508332275616",
  appId: "1:508332275616:web:00a54847defcfa1338d6c5",
  measurementId: "G-6B5JTMQPSL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
//export store and auth
export const auth = getAuth(app);
export const db = getFirestore(app);
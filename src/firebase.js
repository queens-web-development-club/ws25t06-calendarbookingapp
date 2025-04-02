// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBuo8-hqSitKhmH_w1c6GQHeViAKLejaVs",
  authDomain: "calendar-booking-app-bd292.firebaseapp.com",
  projectId: "calendar-booking-app-bd292",
  storageBucket: "calendar-booking-app-bd292.firebasestorage.app",
  messagingSenderId: "822283712129",
  appId: "1:822283712129:web:815727836cccf9ea9fbf80",
  measurementId: "G-LY6TWQHJTR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// exports
export const auth = getAuth(app);           // Firebase Auth
export const db = getFirestore(app);        // Firestore Database

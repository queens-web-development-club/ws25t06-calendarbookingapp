import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

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

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;

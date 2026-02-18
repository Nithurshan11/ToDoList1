// Firebase configuration and initialization (npm package)
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAaXz1HgM1L7MMJQJMvT4YHKtWnrHNSWdw",
  authDomain: "todolist-7fdb3.firebaseapp.com",
  projectId: "todolist-7fdb3",
  storageBucket: "todolist-7fdb3.firebasestorage.app",
  messagingSenderId: "864899649559",
  appId: "1:864899649559:web:e2c97f0b553978ff21cc52",
  measurementId: "G-T31JSNRNZM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Get Firebase app instance
export const getFirebaseApp = () => app;

// Get Firebase Analytics instance
export const getFirebaseAnalytics = () => {
  if (typeof window !== "undefined") {
    return getAnalytics(app);
  }
  return null;
};

// Export config for reference
export { firebaseConfig };

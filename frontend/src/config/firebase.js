// Firebase configuration and initialization
// Firebase is initialized in index.html, but we can access it here for convenience

// Get Firebase app instance (initialized in index.html)
export const getFirebaseApp = () => {
  if (typeof window !== 'undefined' && window.firebaseApp) {
    return window.firebaseApp;
  }
  throw new Error('Firebase app not initialized. Make sure index.html loads Firebase scripts.');
};

// Get Firebase Analytics instance
export const getFirebaseAnalytics = () => {
  if (typeof window !== 'undefined' && window.firebaseAnalytics) {
    return window.firebaseAnalytics;
  }
  throw new Error('Firebase Analytics not initialized.');
};

// Firebase configuration (for reference)
export const firebaseConfig = {
  apiKey: "AIzaSyAaXz1HgM1L7MMJQJMvT4YHKtWnrHNSWdw",
  authDomain: "todolist-7fdb3.firebaseapp.com",
  projectId: "todolist-7fdb3",
  storageBucket: "todolist-7fdb3.firebasestorage.app",
  messagingSenderId: "864899649559",
  appId: "1:864899649559:web:e2c97f0b553978ff21cc52",
  measurementId: "G-T31JSNRNZM"
};

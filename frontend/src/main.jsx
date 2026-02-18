// --- Firebase Setup Start ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-analytics.js";

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
const analytics = getAnalytics(app);
// --- Firebase Setup End ---

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import "./styles/global.css";
import "./styles/theme.css";
import "./styles/responsive.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// --- PASTE YOUR REAL KEYS HERE ---
const firebaseConfig = {
  apiKey: "AIzaSyDDxvHDsY0VY32hwM9ICjs1ECmO2NIhJW4",
  authDomain: "geniotech-4597e.firebaseapp.com",
  projectId: "geniotech-4597e",
  storageBucket: "geniotech-4597e.firebasestorage.app",
  messagingSenderId: "540242140076",
  appId: "1:540242140076:web:7bd8e81958ad23f1a7b809",
  measurementId: "G-G77SRHE1CT"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the database and auth tools
export const db = getFirestore(app);
export const auth = getAuth(app);
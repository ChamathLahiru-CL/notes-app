// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBJyHY6iv9PgPWI6W7achXa7yukvVbfNhA",
  authDomain: "notes-app-77ba5.firebaseapp.com",
  projectId: "notes-app-77ba5",
  storageBucket: "notes-app-77ba5.firebasestorage.app",
  messagingSenderId: "390961554378",
  appId: "1:390961554378:web:ba652b66761aeed7312533",
  measurementId: "G-0DW0WPHS1M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Analytics (optional)
const analytics = getAnalytics(app);

export default app;
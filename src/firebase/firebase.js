// Firebase initialization with provided project config
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration (provided)
const firebaseConfig = {
  apiKey: "AIzaSyAtuByhdZdRQMLp6Q_0XP63ViyMXk-fREc",
  authDomain: "finalassessment-97e68.firebaseapp.com",
  projectId: "finalassessment-97e68",
  storageBucket: "finalassessment-97e68.firebasestorage.app",
  messagingSenderId: "320728999303",
  appId: "1:320728999303:web:ac89fbf59bec95fb765f22",
  measurementId: "G-XLWSCC9374"
};

const app = initializeApp(firebaseConfig);

// Initialize analytics only where available (web). Wrap in try/catch so
// running in React Native (native) doesn't crash.
try {
  // getAnalytics requires a supported environment (browser)
  // This will throw on native runtime, which we catch and ignore.
  getAnalytics(app);
} catch (e) {
  // Analytics not available in this runtime — that's fine for mobile.
}

// Exports used across the app
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

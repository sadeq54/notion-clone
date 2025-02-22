
import { initializeApp , getApp , getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA2kLjrv5Vm2yVEJ7c6XXNsgwgMoOpA8ew",
  authDomain: "notion-clone-3a937.firebaseapp.com",
  projectId: "notion-clone-3a937",
  storageBucket: "notion-clone-3a937.firebasestorage.app",
  messagingSenderId: "1041739193817",
  appId: "1:1041739193817:web:c5cddec03150e8d7f28dc8"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db };

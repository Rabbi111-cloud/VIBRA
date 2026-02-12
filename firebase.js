import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCLk_Pv-O6WrRzOYDy1Zaro0aK2shFHWvI",
  authDomain: "vibra-f702b.firebaseapp.com",
  projectId: "vibra-f702b",
  storageBucket: "vibra-f702b.firebasestorage.app",
  messagingSenderId: "271011180074",
  appId: "1:271011180074:web:74d9b10175e963c9465d53"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

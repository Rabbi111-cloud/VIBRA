import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// 🔥 Firebase config (safe to expose)
const firebaseConfig = {
  apiKey: "AIzaSyAyVDmWsEtImAjPY8-5bcFhSkm-4j5dv1U",
  authDomain: "vibra-7146c.firebaseapp.com",
  projectId: "vibra-7146c",
  storageBucket: "vibra-7146c.firebasestorage.app",
  messagingSenderId: "482860500023",
  appId: "1:482860500023:web:3951e78e73d7d2a1d32bb2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const email = document.getElementById("email");
const password = document.getElementById("password");
const msg = document.getElementById("authMsg");

document.getElementById("loginBtn").onclick = () => {
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then(() => window.location.href = "dashboard.html")
    .catch(() => msg.textContent = "Please sign up first.");
};

document.getElementById("signupBtn").onclick = () => {
  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then(() => {
      msg.textContent = "Signup successful! Please login.";
    })
    .catch(err => msg.textContent = err.message);
};

// If already logged in → skip login page
onAuthStateChanged(auth, user => {
  if (user) window.location.href = "dashboard.html";
});

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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
const db = getFirestore(app);

const channelsEl = document.getElementById("channels");
const messagesEl = document.getElementById("messages");
const input = document.getElementById("messageInput");

let currentChannel = "general";

// 🔐 Protect dashboard
onAuthStateChanged(auth, user => {
  if (!user) window.location.href = "index.html";
});

// 📌 DEFAULT CHANNEL (auto-created)
channelsEl.innerHTML = `<li class="active"># general</li>`;

// 💬 Load messages per channel
const q = query(
  collection(db, "channels", currentChannel, "messages"),
  orderBy("createdAt")
);

onSnapshot(q, snapshot => {
  messagesEl.innerHTML = "";
  snapshot.forEach(doc => {
    const msg = doc.data();
    messagesEl.innerHTML += `
      <div class="bubble">
        <strong>${msg.email}</strong>
        <p>${msg.text}</p>
      </div>
    `;
  });
});

// 📤 Send message
document.getElementById("sendBtn").onclick = async () => {
  if (!input.value.trim()) return;

  await addDoc(
    collection(db, "channels", currentChannel, "messages"),
    {
      text: input.value,
      email: auth.currentUser.email,
      createdAt: serverTimestamp()
    }
  );

  input.value = "";
};

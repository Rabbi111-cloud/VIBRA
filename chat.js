// Firebase config same as script.js
const firebaseConfig = {
  apiKey: "AIzaSyAyVDmWsEtImAjPY8-5bcFhSkm-4j5dv1U",
  authDomain: "vibra-7146c.firebaseapp.com",
  projectId: "vibra-7146c",
  storageBucket: "vibra-7146c.firebasestorage.app",
  messagingSenderId: "482860500023",
  appId: "1:482860500023:web:3951e78e73d7d2a1d32bb2"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Redirect if not logged in
auth.onAuthStateChanged(user => {
  if (!user) {
    window.location.href = "index.html";
  }
});

// Logout
document.getElementById("logout-btn").addEventListener("click", () => {
  auth.signOut().then(() => window.location.href = "index.html");
});

// Chat form
const chatForm = document.getElementById("chat-form");
const chatBox = document.getElementById("chat-box");

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = document.getElementById("chat-msg").value;
  if(msg.trim() === "") return;

  // Save message to Firestore (placeholder)
  db.collection("messages").add({
    text: msg,
    user: auth.currentUser.email,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });

  document.getElementById("chat-msg").value = "";
});

// Listen for new messages
db.collection("messages").orderBy("timestamp")
  .onSnapshot(snapshot => {
    chatBox.innerHTML = "";
    snapshot.forEach(doc => {
      const m = doc.data();
      chatBox.innerHTML += `<p><strong>${m.user}:</strong> ${m.text}</p>`;
    });
    chatBox.scrollTop = chatBox.scrollHeight;
  });

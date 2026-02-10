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

const chatBox = document.getElementById("chat-box");
const chatForm = document.getElementById("chat-form");

// Redirect to login if not signed in
auth.onAuthStateChanged(user => {
  if (!user) {
    window.location.href = "login.html";
  }
});

// Logout
document.getElementById("logout-btn").addEventListener("click", () => {
  auth.signOut().then(() => window.location.href = "login.html");
});

// Send message
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = document.getElementById("chat-msg").value.trim();
  if (!msg) return;

  db.collection("messages").add({
    text: msg,
    user: auth.currentUser.email,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });

  document.getElementById("chat-msg").value = "";
});

// Listen for real-time messages
db.collection("messages").orderBy("timestamp")
  .onSnapshot(snapshot => {
    chatBox.innerHTML = "";
    snapshot.forEach(doc => {
      const m = doc.data();
      const msgDiv = document.createElement("p");
      msgDiv.innerHTML = `<strong>${m.user}:</strong> ${m.text}`;
      chatBox.appendChild(msgDiv);
    });
    chatBox.scrollTop = chatBox.scrollHeight;
  });

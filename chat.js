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
const userEmailDisplay = document.getElementById("user-email");

// Redirect if not logged in
auth.onAuthStateChanged(user => {
  if (!user) window.location.href = "login.html";
  else userEmailDisplay.textContent = user.email;
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

// Display messages with bubbles
db.collection("messages").orderBy("timestamp")
  .onSnapshot(snapshot => {
    chatBox.innerHTML = "";
    snapshot.forEach(doc => {
      const m = doc.data();
      const msgDiv = document.createElement("div");
      msgDiv.classList.add("max-w-xs", "p-3", "rounded-xl", "break-words");

      if (m.user === auth.currentUser.email) {
        msgDiv.classList.add("bg-blue-600", "self-end", "text-white");
      } else {
        msgDiv.classList.add("bg-gray-700", "self-start", "text-gray-200");
      }

      msgDiv.innerHTML = `<strong>${m.user.split('@')[0]}:</strong> ${m.text}`;
      chatBox.appendChild(msgDiv);
    });
    chatBox.scrollTop = chatBox.scrollHeight;
  });

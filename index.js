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

const dashboardView = document.getElementById("dashboard-view");
const chatView = document.getElementById("chat-view");

const chatBox = document.getElementById("chat-box");
const chatForm = document.getElementById("chat-form");
const userEmailDisplay = document.getElementById("user-email");
const userEmailDisplayChat = document.getElementById("user-email-chat");

let currentChannel = "general";
let userSignupTime; // Timestamp to filter messages for new users

// Redirect to login if not signed in
auth.onAuthStateChanged(async user => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  // Show user email
  userEmailDisplay.textContent = user.email;
  userEmailDisplayChat.textContent = user.email;

  // Save the user's signup time
  userSignupTime = firebase.firestore.Timestamp.fromDate(new Date(user.metadata.creationTime));

  // Load online users
  loadOnlineUsers();
});

// Logout buttons
document.getElementById("logout-btn").addEventListener("click", () => auth.signOut().then(() => window.location.href = "login.html"));
document.getElementById("logout-btn-chat").addEventListener("click", () => auth.signOut().then(() => window.location.href = "login.html"));

// Setup channel click for dashboard and chat sidebar
function setupChannelClick(listId) {
  const channels = document.getElementById(listId).querySelectorAll("li");
  channels.forEach(li => {
    li.addEventListener("click", () => {
      currentChannel = li.textContent.replace("# ", "");
      document.getElementById("channel-name").textContent = li.textContent;

      // Swap views: hide dashboard, show chat
      dashboardView.classList.add("hidden");
      chatView.classList.remove("hidden");

      // Load messages for this channel
      loadMessages();
    });
  });
}

// Set up channel click for both sidebars
setupChannelClick("channels-list");
setupChannelClick("channels-list-chat");

// Send message with AI sentiment check
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const msg = document.getElementById("chat-msg").value.trim();
  if (!msg) return;

  // AI sentiment placeholder
  const toxicWords = ["badword1", "badword2"];
  const isToxic = toxicWords.some(word => msg.toLowerCase().includes(word));

  await db.collection("messages").add({
    text: msg,
    user: auth.currentUser.email,
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    sentiment: isToxic ? "toxic" : "safe",
    channel: currentChannel
  });

  document.getElementById("chat-msg").value = "";
});

// Load messages per channel (Option B: only messages after user signup)
function loadMessages() {
  chatBox.innerHTML = "";

  db.collection("messages")
    .where("channel", "==", currentChannel)
    .where("timestamp", ">=", userSignupTime) // Only messages after signup
    .orderBy("timestamp")
    .onSnapshot(snapshot => {
      chatBox.innerHTML = "";
      snapshot.forEach(doc => {
        const m = doc.data();
        const msgDiv = document.createElement("div");
        msgDiv.classList.add("max-w-xs", "p-3", "rounded-xl", "break-words", "hover:shadow-lg", "transition", "duration-200");

        if (m.user === auth.currentUser.email) {
          msgDiv.classList.add("bg-blue-600", "self-end", "text-white");
        } else {
          msgDiv.classList.add("bg-gray-700", "self-start", "text-gray-200");
        }

        const sentimentColor = m.sentiment === "toxic" ? "text-red-400" : "text-green-400";
        const timestamp = m.timestamp ? new Date(m.timestamp.seconds * 1000).toLocaleTimeString() : "";

        msgDiv.innerHTML = `<strong>${m.user.split("@")[0]}:</strong> ${m.text}
          <div class="text-xs ${sentimentColor} mt-1">${m.sentiment.toUpperCase()} • ${timestamp}</div>`;
        chatBox.appendChild(msgDiv);
      });
      chatBox.scrollTop = chatBox.scrollHeight;
    });
}

// Load online users (simple placeholder: all users who sent a message)
function loadOnlineUsers() {
  db.collection("messages")
    .get()
    .then(snapshot => {
      const users = new Set();
      snapshot.forEach(doc => users.add(doc.data().user));
      const usersList = document.getElementById("users-list");
      const usersListChat = document.getElementById("users-list-chat");
      usersList.innerHTML = "";
      usersListChat.innerHTML = "";
      users.forEach(u => {
        const li = document.createElement("li");
        li.textContent = u.split("@")[0];
        usersList.appendChild(li.cloneNode(true));
        usersListChat.appendChild(li.cloneNode(true));
      });
    });
}

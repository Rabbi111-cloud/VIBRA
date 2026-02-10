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

// =====================
// ELEMENTS
// =====================
const dashboardView = document.getElementById("dashboard-view");
const chatView = document.getElementById("chat-view");

const chatBox = document.getElementById("chat-box");
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-msg");

const userEmailDisplay = document.getElementById("user-email");
const userEmailDisplayChat = document.getElementById("user-email-chat");
const statusEl = document.getElementById("status");

const channelsList = document.getElementById("channels-list");
const channelsListChat = document.getElementById("channels-list-chat");

let currentChannel = null;
let userSignupTime;

const typingRef = db.collection("typingStatus");

// =====================
// CHANNEL DEFINITIONS
// =====================
const CHANNELS = ["general", "ai-sentiment", "random"];

// =====================
// AUTH
// =====================
auth.onAuthStateChanged(async user => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  userEmailDisplay.textContent = user.email;
  userEmailDisplayChat.textContent = user.email;

  userSignupTime = firebase.firestore.Timestamp.fromDate(
    new Date(user.metadata.creationTime)
  );

  await db.collection("onlineUsers").doc(user.uid).set({
    email: user.email,
    lastActive: firebase.firestore.FieldValue.serverTimestamp()
  });

  renderChannels();      // ✅ THIS FIXES IT
  listenForOnlineUsers();
});

// =====================
// LOGOUT
// =====================
document.getElementById("logout-btn").onclick =
document.getElementById("logout-btn-chat").onclick = () =>
  auth.signOut().then(() => window.location.href = "login.html");

// =====================
// RENDER CHANNELS (KEY FIX)
// =====================
function renderChannels() {
  channelsList.innerHTML = "";
  channelsListChat.innerHTML = "";

  CHANNELS.forEach(channel => {
    const li1 = createChannelItem(channel);
    const li2 = createChannelItem(channel);

    channelsList.appendChild(li1);
    channelsListChat.appendChild(li2);
  });
}

function createChannelItem(channel) {
  const li = document.createElement("li");
  li.textContent = `# ${channel}`;
  li.className =
    "px-3 py-2 rounded hover:bg-gray-700 cursor-pointer";

  li.onclick = () => enterChannel(channel);
  return li;
}

// =====================
// ENTER CHANNEL
// =====================
function enterChannel(channel) {
  currentChannel = channel;
  document.getElementById("channel-name").textContent = `# ${channel}`;

  dashboardView.classList.add("hidden");
  chatView.classList.remove("hidden");

  loadMessages();
}

// =====================
// SEND MESSAGE
// =====================
chatForm.addEventListener("submit", async e => {
  e.preventDefault();
  if (!chatInput.value.trim()) return;

  const toxicWords = ["badword1", "badword2"];
  const isToxic = toxicWords.some(w =>
    chatInput.value.toLowerCase().includes(w)
  );

  await db.collection("messages").add({
    text: chatInput.value,
    user: auth.currentUser.email,
    channel: currentChannel,
    sentiment: isToxic ? "toxic" : "safe",
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });

  chatInput.value = "";
});

// =====================
// LOAD MESSAGES (OPTION B)
// =====================
function loadMessages() {
  chatBox.innerHTML = "";

  db.collection("messages")
    .where("channel", "==", currentChannel)
    .where("timestamp", ">=", userSignupTime)
    .orderBy("timestamp")
    .onSnapshot(snapshot => {
      chatBox.innerHTML = "";

      snapshot.forEach(doc => {
        const m = doc.data();
        const div = document.createElement("div");

        div.className =
          "max-w-xs p-3 rounded-xl break-words transition";

        div.classList.add(
          m.user === auth.currentUser.email
            ? "bg-blue-600 self-end text-white"
            : "bg-gray-700 self-start text-gray-200"
        );

        div.innerHTML = `
          <strong>${m.user.split("@")[0]}</strong>: ${m.text}
          <div class="text-xs mt-1 ${
            m.sentiment === "toxic"
              ? "text-red-400"
              : "text-green-400"
          }">
            ${m.sentiment.toUpperCase()}
          </div>
        `;

        chatBox.appendChild(div);
      });

      chatBox.scrollTop = chatBox.scrollHeight;
    });
}

// =====================
// ONLINE USERS
// =====================
function listenForOnlineUsers() {
  db.collection("onlineUsers").onSnapshot(snapshot => {
    const users = [...snapshot.docs].map(d =>
      d.data().email.split("@")[0]
    );

    ["users-list", "users-list-chat"].forEach(id => {
      const ul = document.getElementById(id);
      ul.innerHTML = "";
      users.forEach(u => {
        const li = document.createElement("li");
        li.textContent = u;
        ul.appendChild(li);
      });
    });
  });
}

// =====================
// TYPING INDICATOR
// =====================
chatInput.addEventListener("input", () => {
  if (!currentChannel) return;

  typingRef.doc(currentChannel).set({
    [auth.currentUser.uid]: chatInput.value.length > 0
  }, { merge: true });
});

typingRef.onSnapshot(snapshot => {
  if (!currentChannel) return;
  const doc = snapshot.docs.find(d => d.id === currentChannel);
  if (!doc) return;

  const typing = Object.values(doc.data() || {}).some(v => v);
  statusEl.textContent = typing ? "Someone is typing..." : "Online";
});

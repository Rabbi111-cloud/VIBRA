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
const channelName = document.getElementById("channel-name");
const channelsList = document.getElementById("channels-list").querySelectorAll("li");

// Redirect to login if not signed in
auth.onAuthStateChanged(user => {
  if (!user) window.location.href = "login.html";
  else userEmailDisplay.textContent = user.email;
});

// Logout
document.getElementById("logout-btn").addEventListener("click", () => {
  auth.signOut().then(() => window.location.href = "login.html");
});

// Current channel
let currentChannel = "general";

// Click channel to switch
channelsList.forEach(li => {
  li.addEventListener("click", () => {
    channelsList.forEach(el => el.classList.remove("active-channel"));
    li.classList.add("active-channel");
    currentChannel = li.textContent.replace("# ","");
    channelName.textContent = li.textContent;
    loadMessages();
  });
});

// Send message with AI sentiment check (placeholder)
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const msg = document.getElementById("chat-msg").value.trim();
  if (!msg) return;

  const toxicWords = ["badword1","badword2"];
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

// Load messages per channel
function loadMessages() {
  chatBox.innerHTML = "";
  db.collection("messages")
    .where("channel","==",currentChannel)
    .orderBy("timestamp")
    .onSnapshot(snapshot => {
      chatBox.innerHTML = "";
      snapshot.forEach(doc => {
        const m = doc.data();
        const msgDiv = document.createElement("div");
        msgDiv.classList.add("max-w-xs","p-3","rounded-xl","break-words","hover:shadow-lg","transition","duration-200");

        if(m.user === auth.currentUser.email){
          msgDiv.classList.add("bg-blue-600","self-end","text-white");
        }else{
          msgDiv.classList.add("bg-gray-700","self-start","text-gray-200");
        }

        const sentimentColor = m.sentiment==="toxic"?"text-red-400":"text-green-400";
        const timestamp = m.timestamp ? new Date(m.timestamp.seconds*1000).toLocaleTimeString() : "";

        msgDiv.innerHTML = `<strong>${m.user.split("@")[0]}:</strong> ${m.text}
          <div class="text-xs ${sentimentColor} mt-1">${m.sentiment.toUpperCase()} • ${timestamp}</div>`;
        chatBox.appendChild(msgDiv);
      });
      chatBox.scrollTop = chatBox.scrollHeight;
    });
}

// Initially load messages
loadMessages();

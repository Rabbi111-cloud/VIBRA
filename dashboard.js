const PROJECT_ID = "vibra-7146c";

const token = localStorage.getItem("token");
const email = localStorage.getItem("email");

if (!token) {
  window.location.href = "index.html";
}

const messagesEl = document.getElementById("messages");

// LOAD MESSAGES
fetch(
  `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/channels/general/messages`,
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
)
  .then(res => res.json())
  .then(data => {
    if (!data.documents) return;

    messagesEl.innerHTML = "";
    data.documents.forEach(doc => {
      const f = doc.fields;
      messagesEl.innerHTML += `
        <div class="bubble">
          <strong>${f.email.stringValue}</strong>
          <p>${f.text.stringValue}</p>
        </div>
      `;
    });
  });

// SEND MESSAGE
function send() {
  const text = document.getElementById("text").value.trim();
  if (!text) return;

  fetch(
    `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/channels/general/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        fields: {
          text: { stringValue: text },
          email: { stringValue: email }
        }
      })
    }
  ).then(() => location.reload());
}

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

const loginForm = document.getElementById("login-form");
const loginMsg = document.getElementById("login-msg");

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      window.location.href = "chat.html";
    })
    .catch((error) => {
      if(error.code === "auth/user-not-found"){
        loginMsg.textContent = "No account found. Please sign up first.";
      } else if(error.code === "auth/wrong-password"){
        loginMsg.textContent = "Incorrect password.";
      } else {
        loginMsg.textContent = error.message;
      }
      loginMsg.style.color = "red";
    });
});

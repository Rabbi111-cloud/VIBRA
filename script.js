// Your Firebase config (replace with your Firebase project values)
const firebaseConfig = {
  apiKey: "AIzaSyAyVDmWsEtImAjPY8-5bcFhSkm-4j5dv1U",
  authDomain: "vibra-7146c.firebaseapp.com",
  projectId: "vibra-7146c",
  storageBucket: "vibra-7146c.firebasestorage.app",
  messagingSenderId: "482860500023",
  appId: "1:482860500023:web:3951e78e73d7d2a1d32bb2"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Handle form submission
const authForm = document.getElementById("auth-form");
const authMsg = document.getElementById("auth-msg");

authForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Try signing in first
  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      authMsg.textContent = `Signed in as ${userCredential.user.email}`;
      authMsg.style.color = "lightgreen";
      // Redirect to chat page later
    })
    .catch((error) => {
      // If sign-in fails, try to register
      if(error.code === "auth/user-not-found") {
        auth.createUserWithEmailAndPassword(email, password)
          .then((userCredential) => {
            authMsg.textContent = `Registered & signed in as ${userCredential.user.email}`;
            authMsg.style.color = "lightgreen";
            // Redirect to chat page later
          })
          .catch((err) => {
            authMsg.textContent = err.message;
            authMsg.style.color = "red";
          });
      } else {
        authMsg.textContent = error.message;
        authMsg.style.color = "red";
      }
    });
});

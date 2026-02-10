const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

const signupForm = document.getElementById("signup-form");
const signupMsg = document.getElementById("signup-msg");

signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.createUserWithEmailAndPassword(email, password)
    .then(() => {
      signupMsg.textContent = "Account created successfully! Redirecting to login...";
      signupMsg.style.color = "lightgreen";
      setTimeout(() => {
        window.location.href = "login.html";
      }, 1500);
    })
    .catch((error) => {
      signupMsg.textContent = error.message;
      signupMsg.style.color = "red";
    });
});

const API_KEY = "AIzaSyAyVDmWsEtImAjPY8-5bcFhSkm-4j5dv1U";

const emailEl = document.getElementById("email");
const passwordEl = document.getElementById("password");
const msg = document.getElementById("msg");

function signup() {
  fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: emailEl.value,
        password: passwordEl.value,
        returnSecureToken: true
      })
    }
  )
    .then(res => res.json())
    .then(data => {
      if (data.error) throw data.error;
      msg.style.color = "lime";
      msg.textContent = "Signup successful. Please login.";
    })
    .catch(err => {
      msg.style.color = "red";
      msg.textContent = err.message;
    });
}

function login() {
  fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: emailEl.value,
        password: passwordEl.value,
        returnSecureToken: true
      })
    }
  )
    .then(res => res.json())
    .then(data => {
      if (data.error) throw data.error;

      localStorage.setItem("token", data.idToken);
      localStorage.setItem("email", data.email);

      window.location.href = "dashboard.html";
    })
    .catch(() => {
      msg.style.color = "red";
      msg.textContent = "Invalid login. Please sign up first.";
    });
}

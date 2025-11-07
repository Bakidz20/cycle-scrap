// login.js
import { auth } from "./firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

const loginForm = document.querySelector("form");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.querySelector("#email").value.trim();
  const password = document.querySelector("#password").value.trim();

  try {
    // Firebase login
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Success message
    alert(`Welcome back, ${user.email}!`);
    console.log("Logged in user:", user);

    // Redirect to dashboard or home page
    window.location.href = "/index.html"; 
  } catch (error) {
    console.error("Login error:", error.message);

    if (error.code === "auth/invalid-credential") {
      alert("Invalid email or password.");
    } else if (error.code === "auth/user-not-found") {
      alert("No account found with this email.");
    } else if (error.code === "auth/wrong-password") {
      alert("Incorrect password.");
    } else {
      alert("Error: " + error.message);
    }
  }
});

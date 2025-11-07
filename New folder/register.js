// register.js
import { auth } from "./firebase.js";
import { createUserWithEmailAndPassword, updateProfile } 
  from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

const registerForm = document.querySelector("form");

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Get form field values
  const firstName = document.querySelector("#first-name").value.trim();
  const lastName = document.querySelector("#last-name").value.trim();
  const email = document.querySelector("#email").value.trim();
  const password = document.querySelector("#password").value.trim();
  const confirmPassword = document.querySelector("#confirm-password").value.trim();

  // Check if passwords match
  if (password !== confirmPassword) {
    alert("⚠️ Passwords do not match!");
    return;
  }

  try {
    // Create user with Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Optionally update user profile with full name
    await updateProfile(user, {
      displayName: `${firstName} ${lastName}`
    });

    alert("✅ Account created successfully!");
    window.location.href = "login.html";
  } catch (error) {
    alert("❌ Error: " + error.message);
  }
});

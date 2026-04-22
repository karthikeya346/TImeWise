import { auth, provider } from "../scripts/firebase.js";
import { registerUser, checkRegistration } from "../scripts/db.js";
import { initAuthGuard } from "../scripts/authGuard.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  signOut,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Initialize Centralized Auth Guard
initAuthGuard();

window.onload = () => {

const nameInput = document.getElementById("nameInput");
const email = document.getElementById("emailInput");
const password = document.getElementById("passwordInput");
const confirm = document.getElementById("confirmPassword");
const msg = document.getElementById("message");

/* UI HELPERS */
function showMessage(text, type="error") {
  msg.className = "message " + type;
  msg.style.display = "block";
  msg.innerText = text;
  setLoading(false);
}

function setLoading(isLoading) {
  let overlay = document.getElementById("loadingOverlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "loadingOverlay";
    overlay.className = "loading-overlay";
    overlay.innerHTML = '<div class="spinner"></div><p style="font-weight: 500; letter-spacing: 1px;">Processing...</p>';
    document.body.appendChild(overlay);
  }
  overlay.style.display = isLoading ? "flex" : "none";
}

function mapError(code) {
  switch (code) {
    case 'auth/invalid-email': return 'Invalid email format.';
    case 'auth/user-not-found': return 'No account found with this email.';
    case 'auth/wrong-password': return 'Incorrect password.';
    case 'auth/invalid-credential': return 'Invalid email or password.';
    case 'auth/email-already-in-use': return 'Email is already registered.';
    case 'auth/weak-password': return 'Password must be at least 6 characters.';
    default: return 'Authentication failed. Please try again.';
  }
}

/* LOGIN */
window.login = async function () {
  if (!email.value.includes("@")) return showMessage("Invalid email format.");
  if (!password.value) return showMessage("Please enter your password.");

  setLoading(true);
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    // Redirect handled by authGuard.js
  } catch (err) {
    showMessage(mapError(err.code));
  }
};

/* SIGNUP */
window.signup = async function () {
  if (!nameInput.value) return showMessage("Enter your name.");
  if (!email.value.includes("@")) return showMessage("Invalid email format.");
  if (password.value.length < 6) return showMessage("Password must be at least 6 characters.");
  if (password.value !== confirm.value) return showMessage("Passwords do not match.");

  setLoading(true);
  try {
    const userCred = await createUserWithEmailAndPassword(auth, email.value, password.value);

    await updateProfile(userCred.user, {
      displayName: nameInput.value
    });

    // Register user in RTDB
    await registerUser(userCred.user.uid, {
      name: nameInput.value,
      email: email.value
    });

    await signOut(auth);
    setLoading(false);
    showMessage("Account created. Please login.", "success");
    setTimeout(() => { window.location.href = "login.html"; }, 1500);

  } catch (err) {
    showMessage(mapError(err.code));
  }
};

/* GOOGLE LOGIN */
window.googleLogin = async function () {
  setLoading(true);
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const isRegistered = await checkRegistration(user.uid);

    if (isRegistered) {
      window.location.href = "../pages/home/home.html";
    } else {
      // ✅ FIX: auto register instead of logout
      await registerUser(user.uid, {
        name: user.displayName || "User",
        email: user.email
      });

      window.location.href = "../pages/home/home.html";
    }

  } catch (error) {
    console.error("Google login error:", error);
    showMessage("Google login failed.");
  } finally {
    setLoading(false);
  }
};
/* FORGOT PASSWORD */
window.forgotPassword = function () {
  if (!email.value) return showMessage("Enter your email first.");
  setLoading(true);
  sendPasswordResetEmail(auth, email.value)
    .then(() => showMessage("Reset email sent.", "success"))
    .catch((err) => showMessage(mapError(err.code)));
};

/* UI TOGGLES */
window.togglePassword = function () {
  password.type = password.type === "password" ? "text" : "password";
};

/* THEME SYSTEM */
function applyTheme() {
  const theme = localStorage.getItem("theme") || "light";
  if (theme === "dark") document.documentElement.setAttribute("data-theme", "dark");
  else document.documentElement.removeAttribute("data-theme");
  
  const btn = document.querySelector(".theme-btn");
  if (btn) btn.innerText = theme === "dark" ? "☀️" : "🌙";
}

applyTheme();

window.toggleTheme = function () {
  const current = localStorage.getItem("theme") || "light";
  const target = current === "light" ? "dark" : "light";
  localStorage.setItem("theme", target);
  applyTheme();
};

};

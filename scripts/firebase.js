import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBXvCgc5qtDXBXldsqgXqI8nxhObZO9_B0",
  authDomain: "timewise444.firebaseapp.com",
  projectId: "timewise444",
  storageBucket: "timewise444.appspot.com",
  messagingSenderId: "545063216098",
  appId: "1:545063216098:web:3d122c29b068fbb2d90fbb",
  // Testing multiple likely default URLs for Realtime Database
  databaseURL: "https://timewise444-default-rtdb.asia-southeast1.firebasedatabase.app"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const rtdb = getDatabase(app);
const db = getFirestore(app);

// Simple connection check
import { ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
onValue(ref(rtdb, '.info/connected'), (snap) => {
  if (snap.val() === true) console.log("RTDB Connected Successfully");
  else console.warn("RTDB Disconnected - Check Database URL or Region");
});

export { auth, provider, rtdb, db };

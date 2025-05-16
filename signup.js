// signup.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-analytics.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBhgFL9kmRQ61RLeq4HqIGimNxoDxCGBHo",
  authDomain: "mathwiz-3b54e.firebaseapp.com",
  projectId: "mathwiz-3b54e",
  storageBucket: "mathwiz-3b54e.appspot.com", // fixed .app to .com
  messagingSenderId: "560429917669",
  appId: "1:560429917669:web:401d368b83adc51802fb0c",
  measurementId: "G-4Z3NRDN21N"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
getAnalytics(app);

// Sign-up logic
document.getElementById('signUpBtn')?.addEventListener('click', async (event) => {
  event.preventDefault();

  const username = document.querySelector('input[name="username"]').value.trim();
  const email = document.querySelector('input[name="email"]').value.trim();
  const password = document.querySelector('input[name="password"]').value;
  const confirmPassword = document.querySelector('input[name="confirm-password"]').value;

  if (!username || !email || !password || !confirmPassword) {
    alert("All fields are required.");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save username in Firestore (optional but recommended)
    await setDoc(doc(db, "users", user.uid), {
      username: username,
      email: email
    });

    // Store locally for session/profile use
    localStorage.setItem("currentUsername", username);
    localStorage.setItem("currentUserEmail", email);

    alert("Account created successfully!");
    window.location.href = "Main Menu.html";
  } catch (error) {
    alert("Error: " + error.message);
  }
});

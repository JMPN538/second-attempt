// login.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBhgFL9kmRQ61RLeq4HqIGimNxoDxCGBHo",
  authDomain: "mathwiz-3b54e.firebaseapp.com",
  projectId: "mathwiz-3b54e",
  storageBucket: "mathwiz-3b54e.appspot.com",
  messagingSenderId: "560429917669",
  appId: "1:560429917669:web:401d368b83adc51802fb0c",
  measurementId: "G-4Z3NRDN21N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Login handler
async function handleLogin(event) {
  event.preventDefault();

  const email = document.querySelector('input[name="email"]').value.trim();
  const password = document.querySelector('input[name="password"]').value;

  try {
    // Sign in user using Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Fetch user details from Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));
    const userData = userDoc.exists() ? userDoc.data() : null;

    if (userData) {
      // Optionally cache username if you need it across pages
      localStorage.setItem("currentUsername", userData.username);
      localStorage.setItem("currentUserEmail", userData.email);
    }

    // Redirect after successful login
    window.location.href = "HomePageWithUser.html";
  } catch (error) {
    console.error("Login failed:", error);
    document.getElementById('errorMessage').style.display = 'block';
  }
}

// Add event listener
document.getElementById('loginButton')?.addEventListener('click', handleLogin);

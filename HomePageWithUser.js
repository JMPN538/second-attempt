// HomePageWithUser.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js";
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

window.onload = function () {
  const userNameElement = document.getElementById("user-name");
  const logoutLink = document.getElementById("logout-link");

  // Check if user is logged in
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userData = userDoc.exists() ? userDoc.data() : null;

        const username = userData?.username || "User";
        userNameElement.textContent = `Welcome, ${username}`;
        logoutLink.style.display = "inline";

        logoutLink.addEventListener("click", async (e) => {
          e.preventDefault();
          await signOut(auth);
          window.location.href = "Home.html"; // Send to non-user version of homepage
        });
      } catch (err) {
        console.error("Failed to load user data:", err);
        userNameElement.textContent = "Welcome, User";
        logoutLink.style.display = "none";
      }
    } else {
      userNameElement.textContent = "Welcome, Guest!";
      logoutLink.style.display = "none";
    }
  });
};

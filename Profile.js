// Load profile info and stats on page load
function loadProfile() {
  const username = localStorage.getItem("currentUsername") || localStorage.getItem("userName") || "Guest";
  const email = localStorage.getItem("currentUserEmail") || "Not Provided";

  localStorage.setItem("currentUsername", username);
  localStorage.setItem("userName", username);

  document.getElementById("profileUsername").textContent = username;
  document.getElementById("profileEmail").textContent = email;
  document.getElementById("profilePassword").textContent = "********";

  document.getElementById("usernameInput").value = username;
  document.getElementById("emailInput").value = email;
  document.getElementById("passwordInput").value = "";

  loadStats(username);        // Your existing Bubble Math Game stats loader
  loadSprintStats(username);  // Load sprint stats for math sprint game
}

// Load Bubble Math Game stats for the current user (existing code, unchanged)
function loadStats(username) {
  const stats = JSON.parse(localStorage.getItem("usersStats") || "{}");
  const defaultStats = { wins: 0, losses: 0, bestTime: -1, matchesPlayed: 0 };
  const userStats = stats[username] || {
    easy: { ...defaultStats },
    intermediate: { ...defaultStats },
    hard: { ...defaultStats },
  };

  ["easy", "intermediate", "hard"].forEach(level => {
    const stat = userStats[level] || defaultStats;
    const wins = stat.wins || 0;
    const losses = stat.losses || 0;
    const matches = (typeof stat.matchesPlayed === "number" && stat.matchesPlayed >= 0) ? stat.matchesPlayed : (wins + losses);
    const bestTime = (typeof stat.bestTime === "number") ? stat.bestTime : -1;
    const winRate = matches > 0 ? `${Math.round((wins / matches) * 100)}%` : "N/A";

    document.getElementById(`${level}MatchesPlayed`).textContent = matches;
    document.getElementById(`${level}WinRate`).textContent = winRate;
    document.getElementById(`${level}BestTime`).textContent = bestTime > 0 ? formatTime(bestTime) : "N/A";
  });
}

// Load Math Sprint stats for current user (games played + high score only)
function loadSprintStats(username) {
  const sprintStats = JSON.parse(localStorage.getItem("sprintStats") || "{}");
  const userSprintStats = sprintStats[username] || { gamesPlayed: 0, highScore: 0 };

  document.getElementById("sprintGamesPlayed").textContent = userSprintStats.gamesPlayed;
  document.getElementById("sprintHighScore").textContent = userSprintStats.highScore;
}

// Save Math Sprint stats to localStorage (update games played and high score)
function saveSprintStats(username, newGamesPlayed, newHighScore) {
  const sprintStats = JSON.parse(localStorage.getItem("sprintStats") || "{}");
  sprintStats[username] = {
    gamesPlayed: newGamesPlayed,
    highScore: newHighScore
  };
  localStorage.setItem("sprintStats", JSON.stringify(sprintStats));
}

// Toggle edit mode for a field (Username, Email, Password)
function toggleEdit(field) {
  const span = document.getElementById(`profile${field}`);
  const input = document.getElementById(`${field.toLowerCase()}Input`);
  const btn = document.getElementById(`edit${field}Btn`);

  if (btn.textContent === "Edit") {
    input.value = (field === "Password") ? "" : span.textContent;
    span.style.display = "none";
    input.style.display = "inline-block";
    btn.textContent = "Save";
    input.focus();
  } else {
    const newValue = input.value.trim();

    if (field === "Email" && newValue && !validateEmail(newValue)) {
      alert("Please enter a valid email address.");
      input.focus();
      return;
    }

    if (field === "Username" && newValue === "") {
      alert("Username cannot be empty.");
      input.focus();
      return;
    }

    if (field === "Password") {
      if (newValue === "") {
        span.textContent = "********";
      } else {
        span.textContent = "********";
        saveProfileField(field, newValue);
      }
    } else {
      span.textContent = newValue || (field === "Username" ? "Guest" : "Not Provided");
      saveProfileField(field, newValue);
    }

    span.style.display = "inline-block";
    input.style.display = "none";
    btn.textContent = "Edit";
  }
}

// Save updated profile field in users array and localStorage
function saveProfileField(field, value) {
  let users = JSON.parse(localStorage.getItem('users')) || [];
  const currentUsername = localStorage.getItem('currentUsername');

  const userIndex = users.findIndex(user => user.username === currentUsername);
  if (userIndex === -1) {
    console.error("User not found in users array");
    return;
  }

  switch(field) {
    case "Username":
      if (value) {
        users[userIndex].username = value;
        localStorage.setItem("currentUsername", value);
        localStorage.setItem("userName", value);
      }
      break;
    case "Email":
      if (value) {
        users[userIndex].email = value;
        localStorage.setItem("currentUserEmail", value);
      }
      break;
    case "Password":
      if (value) {
        users[userIndex].password = value;
        localStorage.setItem("currentUserPassword", value);
      }
      break;
  }

  localStorage.setItem('users', JSON.stringify(users));
}

// Basic email format validation
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Delete sprint stats when user deletes account
function deleteSprintStatsForUser(username) {
  const sprintStats = JSON.parse(localStorage.getItem("sprintStats") || "{}");
  if (sprintStats[username]) {
    delete sprintStats[username];
    localStorage.setItem("sprintStats", JSON.stringify(sprintStats));
  }
}

// Delete account button handler (includes sprint stats deletion)
function setupDeleteAccountButton() {
  const deleteBtn = document.getElementById("deleteAccountBtn");
  if (!deleteBtn) return;

  deleteBtn.addEventListener("click", () => {
    const username = localStorage.getItem("currentUsername") || localStorage.getItem("userName");
    if (!username) {
      alert("No user is currently logged in.");
      return;
    }

    if (confirm("Are you sure you want to delete your account? This cannot be undone.")) {
      // Remove user stats (your existing logic - keep as is)
      let stats = JSON.parse(localStorage.getItem("usersStats") || "{}");
      if (stats[username]) {
        delete stats[username];
        localStorage.setItem("usersStats", JSON.stringify(stats));
      }

      // Remove sprint stats
      deleteSprintStatsForUser(username);

      // Remove user from users array
      let users = JSON.parse(localStorage.getItem('users')) || [];
      users = users.filter(user => user.username !== username);
      localStorage.setItem('users', JSON.stringify(users));

      // Clear current user info
      localStorage.removeItem("currentUsername");
      localStorage.removeItem("currentUserEmail");
      localStorage.removeItem("currentUserPassword");

      alert("Your account has been deleted.");
      window.location.href = "Login.html";
    }
  });
}

// Format seconds to mm:ss
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// Setup event listeners for edit buttons
function setupEditButtons() {
  ["Username", "Email", "Password"].forEach(field => {
    const btn = document.getElementById(`edit${field}Btn`);
    btn.addEventListener("click", () => toggleEdit(field));
  });
}

// Initialize everything on page load
document.addEventListener("DOMContentLoaded", () => {
  loadProfile();
  setupEditButtons();
  setupDeleteAccountButton();
});

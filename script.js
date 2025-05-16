const gameArea = document.getElementById("bubbleGameArea");
const targetDisplay = document.getElementById("targetDisplay");
const scoreDisplay = document.getElementById("scoreDisplay");

let target = 0;
let score = 0;
let gameInterval;
let timerInterval;
let level = 1;
let timeLeft = 30;

function startGame() {
  level = parseInt(document.getElementById("difficulty").value);
  score = 0;
  updateScoreDisplay();
  startLevel(level);
}

function startLevel(lvl) {
  clearInterval(gameInterval);
  clearInterval(timerInterval);
  score = 0;
  updateScoreDisplay();
  gameArea.innerHTML = "";

  timeLeft = lvl === 1 ? 60 : lvl === 2 ? 45 : 30;
  updateTimer();

  const timer = document.createElement("div");
  timer.id = "timer";
  timer.style.color = "white";
  timer.style.padding = "10px";
  timer.innerText = `Time Left: ${timeLeft}`;
  gameArea.appendChild(timer);

  target = generateTargetNumber(lvl);
  targetDisplay.textContent = `Target: ${target}`;

  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimer();
    if (timeLeft <= 0) endGame(false);
  }, 1000);

  const spawnRate = lvl === 1 ? 1000 : lvl === 2 ? 500 : 250;

  gameInterval = setInterval(() => {
    const bubble = createBubble(lvl);
    gameArea.appendChild(bubble);
  }, spawnRate);
}

function updateTimer() {
  const timer = document.getElementById("timer");
  if (timer) timer.innerText = `Time Left: ${timeLeft}`;
}

function updateScoreDisplay() {
  scoreDisplay.textContent = `Current Total: ${score}`;
}

function generateTargetNumber(lvl) {
  if (lvl === 1) return Math.floor(Math.random() * 30) + 20;
  if (lvl === 2) return Math.floor(Math.random() * 50) + 40;
  if (lvl === 3) return Math.floor(Math.random() * 80) + 60;
  return 0;
}

function createBubble(level) {
  const bubble = document.createElement("div");
  bubble.classList.add("bubble");
  bubble.style.left = `${Math.random() * 90}%`;

  let value;
  if (level === 1) {
    value = Math.floor(Math.random() * 9) + 1;
  } else if (level === 2) {
    value = Math.random() < 0.5
      ? Math.floor(Math.random() * 9) + 1
      : Math.floor(Math.random() * 90) + 10;
  } else {
    const rand = Math.random();
    value = rand < 0.33
      ? Math.floor(Math.random() * 9) + 1
      : rand < 0.66
      ? Math.floor(Math.random() * 90) + 10
      : Math.floor(Math.random() * 900) + 100;
  }

  bubble.textContent = value;
  bubble.onclick = () => {
    score += value;
    updateScoreDisplay();
    bubble.remove();
    checkWinCondition();
  };

  const fallTime = level === 1 ? 5 : level === 2 ? 2.5 : 2;
  bubble.style.animation = `fall ${fallTime}s linear forwards`;
  setTimeout(() => bubble.remove(), fallTime * 1000);

  return bubble;
}

function checkWinCondition() {
  if (score > target) endGame(false);
  else if (score === target) endGame(true);
}

function endGame(win) {
  clearInterval(gameInterval);
  clearInterval(timerInterval);
  gameArea.innerHTML = "";

  const resultMsg = document.createElement("div");
  resultMsg.style.color = win ? "lightgreen" : "red";
  resultMsg.style.fontSize = "24px";
  resultMsg.style.marginTop = "50px";
  resultMsg.textContent = win ? "🎉 You Win!" : "💥 Game Over!";
  gameArea.appendChild(resultMsg);

  updateUserStats(win);
}

// --------- Updated function to update stats including matchesPlayed ---------
function updateUserStats(win) {
  const username = localStorage.getItem("currentUsername");
  if (!username) return; // No user logged in, do nothing

  const difficultySelect = document.getElementById("difficulty");
  const level = difficultySelect ? parseInt(difficultySelect.value) : 1;
  const levelKey = level === 1 ? "easy" : level === 2 ? "intermediate" : "hard";

  // Get current stats or initialize with matchesPlayed
  const stats = JSON.parse(localStorage.getItem("usersStats") || "{}");
  if (!stats[username]) {
    stats[username] = {
      easy: { wins: 0, losses: 0, bestTime: 0, matchesPlayed: 0 },
      intermediate: { wins: 0, losses: 0, bestTime: 0, matchesPlayed: 0 },
      hard: { wins: 0, losses: 0, bestTime: 0, matchesPlayed: 0 },
    };
  }

  const userStats = stats[username][levelKey];

  // Increment matches played every game
  userStats.matchesPlayed = (userStats.matchesPlayed || 0) + 1;

  if (win) {
    userStats.wins = (userStats.wins || 0) + 1;

    // Calculate elapsed time based on how much time was left
    const totalTime = level === 1 ? 60 : level === 2 ? 45 : 30;
    const elapsedTime = totalTime - timeLeft;

    // Update bestTime if elapsedTime is better or first win
    if (userStats.bestTime === 0 || elapsedTime < userStats.bestTime) {
      userStats.bestTime = elapsedTime;
    }
  } else {
    userStats.losses = (userStats.losses || 0) + 1;
  }

  // Save updated stats
  localStorage.setItem("usersStats", JSON.stringify(stats));
}

// Show logged in user name and logout link (optional)
window.addEventListener('DOMContentLoaded', () => {
  const userNameSpan = document.getElementById('user-name');
  const logoutLink = document.getElementById('logout-link');
  const storedUsername = localStorage.getItem('currentUsername');

  if (storedUsername) {
    if(userNameSpan) userNameSpan.textContent = `Welcome, ${storedUsername}!`;
    if(logoutLink) logoutLink.style.display = 'inline';
  } else {
    if(userNameSpan) userNameSpan.textContent = "Welcome, Guest!";
    if(logoutLink) logoutLink.style.display = 'none';
  }

  if(logoutLink) {
    logoutLink.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('currentUsername');
      localStorage.removeItem('currentUserEmail');
      window.location.href = 'Home.html';
    });
  }
});

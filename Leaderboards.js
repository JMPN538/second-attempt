// leaderboard.js

// Format seconds to mm:ss string (for Bubble Math bestTime)
function formatTime(sec) {
  if (!sec || sec === -1 || sec === Infinity) return "N/A";
  const m = Math.floor(sec / 60).toString().padStart(2, "0");
  const s = (sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

// Compute win rate string
function computeWinRate(wins, losses) {
  const total = wins + losses;
  if (total === 0) return "N/A";
  return Math.round((wins / total) * 100) + "%";
}

// Load Bubble Math stats from userStats localStorage
function loadUserStats() {
  return JSON.parse(localStorage.getItem("usersStats") || "{}");
}

// Load Math Sprint stats from sprintStats localStorage
function loadSprintStats() {
  return JSON.parse(localStorage.getItem("sprintStats") || "{}");
}

// Populate Bubble Math leaderboard table
function populateBubbleTable(tbodyId, userStatsForLevel) {
  const tbody = document.getElementById(tbodyId);
  tbody.innerHTML = "";

  // userStatsForLevel: array of objects { username, wins, losses, bestTime }

  if (!userStatsForLevel.length) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="4" style="text-align:center; color:#aaa;">No data yet</td>`;
    tbody.appendChild(tr);
    return;
  }

  userStatsForLevel.forEach((player, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${player.username}</td>
      <td>${formatTime(player.bestTime)}</td>
      <td>${computeWinRate(player.wins, player.losses)}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Populate Math Sprint leaderboard table
function populateSprintTable(tbodyId, sprintStatsList) {
  const tbody = document.getElementById(tbodyId);
  tbody.innerHTML = "";

  if (!sprintStatsList.length) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="3" style="text-align:center; color:#aaa;">No data yet</td>`;
    tbody.appendChild(tr);
    return;
  }

  sprintStatsList.forEach((player, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${player.username}</td>
      <td>${player.highScore}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Initialize all leaderboards on page load
function initLeaderboards() {
  const userStats = loadUserStats();

  // Prepare Bubble Math data per level by extracting username, wins, losses, bestTime
  function prepareLevelData(level) {
    const players = [];
    for (const username in userStats) {
      if (userStats[username][level]) {
        const stats = userStats[username][level];
        players.push({
          username,
          wins: stats.wins || 0,
          losses: stats.losses || 0,
          bestTime: (typeof stats.bestTime === "number") ? stats.bestTime : -1,
        });
      }
    }
    // Sort by bestTime ascending, treating -1 as worst
    players.sort((a, b) => {
      if (a.bestTime === -1) return 1;
      if (b.bestTime === -1) return -1;
      return a.bestTime - b.bestTime;
    });
    return players.slice(0, 10); // top 10
  }

  populateBubbleTable("bubble-easy-body", prepareLevelData("easy"));
  populateBubbleTable("bubble-intermediate-body", prepareLevelData("intermediate"));
  populateBubbleTable("bubble-hard-body", prepareLevelData("hard"));

  // Load sprint stats and prepare sorted list by highScore descending
  const sprintStats = loadSprintStats();
  const sprintPlayers = [];
  for (const username in sprintStats) {
    sprintPlayers.push({
      username,
      highScore: sprintStats[username].highScore || 0,
    });
  }
  sprintPlayers.sort((a, b) => b.highScore - a.highScore);
  const topSprintPlayers = sprintPlayers.slice(0, 10);

  populateSprintTable("sprint-leaderboard-body", topSprintPlayers);
}

// Call init on window load
window.onload = initLeaderboards;

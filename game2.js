let timer;
let time = 20;
let score = 0;
let highScore = 0;
let playCount = 0;

const username = localStorage.getItem('currentUsername') || 'Guest';

function loadStats() {
    const statsStr = localStorage.getItem('sprintStats');
    if (statsStr) {
        const allStats = JSON.parse(statsStr);
        if (allStats[username]) {
            highScore = allStats[username].highScore || 0;
            playCount = allStats[username].gamesPlayed || 0;
        }
    }
    updateStatsDisplay();
}

function saveStats() {
    let allStats = {};
    const statsStr = localStorage.getItem('sprintStats');
    if (statsStr) {
        allStats = JSON.parse(statsStr);
    }
    allStats[username] = {
        highScore: highScore,
        gamesPlayed: playCount,
    };
    localStorage.setItem('sprintStats', JSON.stringify(allStats));
}

function updateStatsDisplay() {
    document.getElementById('highScoreValue').innerText = highScore;
    document.getElementById('playCountValue').innerText = playCount;
}

function startGame() {
    resetGame();
    generateProblem();
    generateOptions();
    timer = setInterval(updateTimer, 1000);
    updateStatsDisplay();
}

function resetGame() {
    clearInterval(timer);
    time = 20;
    score = 0;
    document.getElementById('time').innerText = time;
    document.getElementById('result').innerText = '';
    document.getElementById('currentScore').innerText = score;
    document.getElementById('options').innerHTML = '';
    document.getElementById('problem').innerText = '';
    updateStatsDisplay();
}

function updateTimer() {
    time--;
    document.getElementById('time').innerText = time;
    if (time === 0) {
        endGame();
    }
}

function generateProblem() {
    const num1 = Math.floor(Math.random() * 10);
    const num2 = Math.floor(Math.random() * 10);
    const operation = getRandomOperation();
    let problem;

    switch (operation) {
        case '+':
            problem = `${num1} + ${num2}`;
            break;
        case '-':
            problem = `${num1} - ${num2}`;
            break;
        case '*':
            problem = `${num1} * ${num2}`;
            break;
        case '/':
            const divisor = num2 !== 0 ? num2 : 1;
            problem = `${num1} / ${divisor}`;
            break;
        default:
            problem = '';
    }

    document.getElementById('problem').innerText = problem;
}

function getRandomOperation() {
    const operations = ['+', '-', '*', '/'];
    return operations[Math.floor(Math.random() * operations.length)];
}

function generateOptions() {
    const problemText = document.getElementById('problem').innerText;
    const correctAnswer = eval(problemText);
    const options = [correctAnswer];

    const isDivision = problemText.includes('/');
    const isMultiplication = problemText.includes('*');

    while (options.length < 4) {
        let option;
        if (isDivision || isMultiplication) {
            option = correctAnswer + (Math.random() * 20 - 10);
            option = parseFloat(option.toFixed(2));
        } else {
            option = correctAnswer + Math.floor(Math.random() * 10) - 5;
        }

        if (!options.includes(option)) {
            options.push(option);
        }
    }

    options.sort(() => Math.random() - 0.5);

    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';
    options.forEach((option) => {
        const button = document.createElement('button');
        button.classList.add('option');
        button.innerText = option.toFixed(2);
        button.onclick = () => selectOption(option, correctAnswer);
        optionsContainer.appendChild(button);
    });
}

function selectOption(selectedOption, correctAnswer) {
    if (selectedOption === correctAnswer) {
        document.getElementById('result').innerHTML = `<span class="correct">Correct!</span>`;
        score++;
        document.getElementById('currentScore').innerText = score;
        generateProblem();
        generateOptions();
    } else {
        document.getElementById('result').innerHTML = `<span class="incorrect">Incorrect. Try again.</span>`;
    }
}

function endGame() {
    clearInterval(timer);
    document.getElementById('result').innerText = 'Time is up! Game over.';
    document.getElementById('options').innerHTML = '';
    document.getElementById('problem').innerText = '';

    // Increase play count and save it
    playCount++;
    if (score > highScore) {
        highScore = score;
    }
    saveStats();
    updateStatsDisplay();
}

// Show logged-in user name and logout link
window.addEventListener('DOMContentLoaded', () => {
    const userNameSpan = document.getElementById('user-name');
    const logoutLink = document.getElementById('logout-link');

    if (username && username !== 'Guest') {
        if (userNameSpan) userNameSpan.textContent = `Welcome, ${username}!`;
        if (logoutLink) logoutLink.style.display = 'inline';
    } else {
        if (userNameSpan) userNameSpan.textContent = "Welcome, Guest!";
        if (logoutLink) logoutLink.style.display = 'none';
    }

    if (logoutLink) {
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('currentUsername');
            localStorage.removeItem('currentUserEmail');
            window.location.href = 'Home.html';
        });
    }

    loadStats();
});

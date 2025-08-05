/*
 scoreboard.js - Scoreboard and Firebase logic
*/

// -=-=-=- DOM Elements -=-=-=-
const submitInitialsButton = document.getElementById('submit-initials-btn');
const closeScoreboardButton = document.getElementById('close-scoreboard-btn');
const toggleScoreboardButton = document.getElementById('toggle-scoreboard-btn');
const scoreList = document.getElementById('score-list');
const initialsInput = document.getElementById('initials-input');
const initialsPrompt = document.getElementById('initials-prompt');
const scoreboardDialog = document.getElementById('scoreboard-dialog');

// -=-=-=- Firebase Initialization -=-=-=-
const firebaseConfig = {
    apiKey: "AIzaSyD8mwbaU7Jgakj-OtH92BzAXDIIzGRIZk0",
    authDomain: "portfolio-game-484a5.firebaseapp.com",
    projectId: "portfolio-game-484a5",
    storageBucket: "portfolio-game-484a5.appspot.com",
    messagingSenderId: "278366782389",
    appId: "1:278366782389:web:a78354d13f36ec1656cffc",
    measurementId: "G-6YDSCNH0NM"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let highScores = [];
let scoreToSave = 0;

// -=-=-=- loadHighScores -=-=-=-
async function loadHighScores() {
    highScores = [];
    console.log("Fetching scores..."); 
    try {
        const q = db.collection("leaderboard").orderBy("score", "desc").limit(10);
        const querySnapshot = await q.get();
        querySnapshot.forEach((doc) => highScores.push({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error loading high scores:", error);
        if (scoreList) scoreList.innerHTML = '<li>Error loading scores</li>';
    }
    updateScoreboardDisplay();
}

// -=-=-=- updateScoreboardDisplay -=-=-=-
function updateScoreboardDisplay() {
    if (!scoreList) return;
    scoreList.innerHTML = '';
    if (highScores.length === 0) { scoreList.innerHTML = '<li>No scores yet!</li>'; return; }
    highScores.forEach((scoreEntry) => {
        const li = document.createElement('li');
        const initials = scoreEntry.initials?.padEnd(3, ' ') || '   ';
        const score = scoreEntry.score?.toString().padStart(8, '.') || '0'.padStart(8, '.');
        li.textContent = `${initials} ${score}`;
        scoreList.appendChild(li);
    });
}

// -=-=-=- checkAndPromptForHighScore -=-=-=-
function checkAndPromptForHighScore(score) {
    highScores.sort((a, b) => b.score - a.score);
    const isTopScore = highScores.length < 10 || (highScores.length > 0 && score > (highScores[highScores.length - 1]?.score ?? 0));
    if (isTopScore && score > 0) {
        scoreToSave = score;
        const scoreDisplay = document.getElementById('initials-score-display');
        if (scoreDisplay) scoreDisplay.textContent = `You caught a fish! Score: ${score}`;
        if (initialsInput) initialsInput.value = '';
        if (initialsPrompt) {
            initialsPrompt.style.display = 'block';
            hideJoystick();
            return true;
        }
    }
    return false;
}

// -=-=-=- submitScore -=-=-=-
async function submitScore() {
    let initials = initialsInput.value.toUpperCase().replace(/[^A-Z]/g, '');
    if (initials.length > 3) initials = initials.substring(0, 3);
    else if (initials.length === 0) { alert("Please enter 1-3 initials."); return; }
    else initials = initials.padEnd(3, ' ');

    if (scoreToSave > 0) {
        try {
            console.log(`Saving score: ${initials} - ${scoreToSave}`);
            await db.collection("leaderboard").add({
                initials: initials, score: scoreToSave,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
            if (initialsPrompt) initialsPrompt.style.display = 'none';
            scoreToSave = 0;
            await loadHighScores();
            if (scoreboardDialog) scoreboardDialog.style.display = 'block';
            hideJoystick();
        } catch (error) {
            console.error("Error saving score:", error);
            alert("Could not save score.");
            if (initialsPrompt) initialsPrompt.style.display = 'none';
            showJoystickIfNeeded();
        }
    } else {
        if (initialsPrompt) initialsPrompt.style.display = 'none';
        showJoystickIfNeeded();
    }
}
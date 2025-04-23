const startScreen = document.getElementById("start-screen");
const startBtn = document.getElementById("start-btn");
const gameMap = document.getElementById("game-map");
const gameCanvas = document.getElementById("gameCanvas");
const ctx = gameCanvas.getContext("2d");
const dialogBox = document.getElementById("dialog-box");
const dialogText = document.getElementById("dialog-text");
const closeDialogButton = document.getElementById("close-dialog");
const bookshelfDialog = document.getElementById('bookshelf-dialog');
const closeBookshelfButton = document.getElementById('close-bookshelf-dialog');
const bookshelfElement = document.getElementById('bookshelf');
const fishingPrompt = document.getElementById('fishing-prompt');
const startFishingButton = document.getElementById('start-fishing-btn');
const cancelFishingButton = document.getElementById('cancel-fishing-btn');
const fishingGameDisplay = document.getElementById('fishing-game');
const fishingStatus = document.getElementById('fishing-status');
const tensionBarContainer = document.getElementById('tension-bar-container');
const tensionBar = document.getElementById('tension-bar');
const reelButton = document.getElementById('reel-button');
const stopFishingButton = document.getElementById('stop-fishing-btn');
const scoreboardDialog = document.getElementById('scoreboard-dialog');
const scoreList = document.getElementById('score-list');
const closeScoreboardButton = document.getElementById('close-scoreboard-btn');
const initialsPrompt = document.getElementById('initials-prompt');
const initialsInput = document.getElementById('initials-input');
const submitInitialsButton = document.getElementById('submit-initials-btn');
const toggleScoreboardButton = document.getElementById('toggle-scoreboard-btn');
const joystickZone = document.getElementById('joystick-zone');
const projectChoiceDialog = document.getElementById('project-choice-dialog');
const contactFormDialog = document.getElementById("contact-form-dialog");

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

// -=-=-=- Map and player initialization -=-=-=-
const TILE_SIZE = 16;
const MAP_WIDTH = 20;
const MAP_HEIGHT = 15;

let playerTileX = 3;
let playerTileY = 3;
let joystick = null;
let joystickDirection = null;

// -=-=-=- Fishing Game State -=-=-=-
let isFishingActive = false;
let canFishHere = false;
let fishingState = 'idle';
let tension = 0;
const MAX_TENSION = 100;
const TENSION_INCREASE_RATE = 15;
const TENSION_DECREASE_RATE = 5;
const FISH_FIGHT_CHANCE = 0.15;
const FISH_FIGHT_STRENGTH = 25;
const CAST_TIME = 500;
const BITE_MIN_WAIT = 1000;
const BITE_MAX_WAIT = 5000;
const REEL_SPEED = 3;
const START_FISH_DISTANCE = 100;
let fishDistance = 0;
let currentFishScore = 0;

let gameLoopInterval = null;
let biteTimeout = null;
let isReeling = false;

// -=-=-=- Scoreboard State -=-=-=-
let highScores = [];
let scoreToSave = 0;

// -=-=-=- Dialog State Check -=-=-=-
function isAnyDialogOpen() {
    return dialogBox?.style.display === 'block' ||
           fishingPrompt?.style.display === 'block' ||
           fishingGameDisplay?.style.display === 'block' ||
           initialsPrompt?.style.display === 'block' ||
           scoreboardDialog?.style.display === 'block' ||
           projectChoiceDialog?.style.display === 'block' ||
           contactFormDialog?.style.display === 'block' ||
           bookshelfDialog?.style.display === 'block';
}

// -=-=-=- Joystick Visibility Helpers -=-=-=-
function hideJoystick() {
    if (joystickZone) {
        joystickZone.style.display = 'none';
    }
}

function showJoystickIfNeeded() {
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    if (joystickZone && isTouchDevice && joystick) {
        // Only show if NO dialogs are active
        if (!isAnyDialogOpen()) {
             joystickZone.style.display = 'block';
        } else {
             joystickZone.style.display = 'none'; // Ensure hidden if a dialog IS open
        }
    } else if (joystickZone) {
        joystickZone.style.display = 'none';
    }
}
// -=-=-=- End Helpers -=-=-=-

startBtn.addEventListener('click', () => {
    startScreen.style.display = 'none';
    gameMap.style.display = 'block';
    init();
});

async function init() {
    await loadHighScores();
    await loadTileImages();
    drawMap();
    positionElements();
    setupInteractions(); // This adds the keydown listener
    setupJoystick();     // This potentially shows the joystick
    window.addEventListener('resize', () => {
        positionElements();
        checkForWaterProximity();
    });
    checkForWaterProximity();
    showJoystickIfNeeded(); // Explicitly check if joystick should be visible after init
}

function loadTileImages() {
    return new Promise((resolve) => {
        let imagesLoaded = 0;
        const totalImages = Object.keys(tileTypes).length;

        for (const key in tileTypes) {
            const img = new Image();
            img.src = `assets/tiles/${tileTypes[key]}.png`;
            img.onload = () => {
                imagesLoaded++;
                tiles[key] = img;
                if (imagesLoaded === totalImages) {
                    resolve();
                }
            };
            img.onerror = () => {
                console.error(`Failed to load image: assets/tiles/${tileTypes[key]}.png`);
                imagesLoaded++;
                 if (imagesLoaded === totalImages) {
                    resolve();
                }
            }
        }
    });
}

function drawMap() {
    if (!gameCanvas || !ctx) return;
    gameCanvas.width = MAP_WIDTH * TILE_SIZE;
    gameCanvas.height = MAP_HEIGHT * TILE_SIZE;

    for (let y = 0; y < MAP_HEIGHT; y++) {
        for (let x = 0; x < MAP_WIDTH; x++) {
            const tileType = map[y][x];
            if (tiles[tileType]) {
                ctx.drawImage(tiles[tileType], x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            } else {
                ctx.fillStyle = 'grey';
                ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            }
        }
    }
}


function positionElements() {
    positionElement('pc', 4, 1);
    positionElement('bookshelf', 1, 1);
    positionElement('vinyl-shelf', 6, 1);
    positionElement('trainer', playerTileX, playerTileY);
    positionElement('mailbox', 6, 14);
    positionElement('resume-trainer', 3, 10);
    positionElement('skills-trainer', 11, 11);
    positionElement('experience-trainer', 19, 8);
}

function positionElement(elementId, tileX, tileY) {
    const element = document.getElementById(elementId);
    if (!element) return;
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) return;

    const canvasRect = canvas.getBoundingClientRect();
    const actualCanvasWidth = canvasRect.width;
    const actualCanvasHeight = canvasRect.height;
    const actualTileWidth = actualCanvasWidth / MAP_WIDTH;
    const actualTileHeight = actualCanvasHeight / MAP_HEIGHT;

    element.style.left = tileX * actualTileWidth + 'px';
    element.style.top = tileY * actualTileHeight + 'px';
    element.style.width = actualTileWidth + 'px';
    element.style.height = actualTileHeight + 'px';
}


function setupInteractions() {
    // Original Interactions (ensure these elements exist in HTML)
    const resumeTrainer = document.getElementById("resume-trainer");
    if (resumeTrainer) {
        resumeTrainer.addEventListener("click", () => window.open('https://github.com/calebluh/about-me/blob/main/README.md', '_blank'));
    }
    const skillsTrainer = document.getElementById("skills-trainer");
    if (skillsTrainer) {
        skillsTrainer.addEventListener("click", () => showDialog("Certifications: Microsoft IT Support Specialist, Autodesk Inventor Certified User, TestOut IT Fundamentals Pro, Excel Purple Belt"));
    }
    const experienceTrainer = document.getElementById("experience-trainer");
    if (experienceTrainer) {
        experienceTrainer.addEventListener("click", () => window.open('https://www.linkedin.com/in/calebluh/', '_blank'));
    }
    const pcElement = document.getElementById("pc");
    // Project Choice Dialog elements needed: projectChoiceDialog, robloxBtn, statlabBtn, linkedinBtn, closeBtn
    if (pcElement && projectChoiceDialog) {
        const robloxBtn = document.getElementById('roblox-btn');
        const statlabBtn = document.getElementById('statlab-btn');
        const linkedinBtn = document.getElementById('linkedin-btn');
        const closeBtn = document.getElementById('close-btn');

        pcElement.addEventListener("click", () => { projectChoiceDialog.style.display = 'block'; hideJoystick(); });
        if (robloxBtn) robloxBtn.addEventListener('click', () => { window.open("...", "_blank"); projectChoiceDialog.style.display = 'none'; showJoystickIfNeeded(); });
        if (statlabBtn) statlabBtn.addEventListener('click', () => { window.open("...", "_blank"); projectChoiceDialog.style.display = 'none'; showJoystickIfNeeded(); });
        if (linkedinBtn) linkedinBtn.addEventListener('click', () => { window.open("...", "_blank"); projectChoiceDialog.style.display = 'none'; showJoystickIfNeeded(); });
        if (closeBtn) closeBtn.addEventListener('click', () => { projectChoiceDialog.style.display = 'none'; showJoystickIfNeeded(); });
    }
    const mailbox = document.getElementById("mailbox");
    // Mailbox dialog elements needed: contactFormDialog, closeContactFormButton
    if (mailbox && contactFormDialog) {
        const closeContactFormButton = document.getElementById("close-contact-form");
        mailbox.addEventListener("click", () => { contactFormDialog.style.display = "block"; hideJoystick(); });
        if (closeContactFormButton) closeContactFormButton.addEventListener("click", () => { contactFormDialog.style.display = "none"; showJoystickIfNeeded(); });
    }
    // Main dialog close button needed: closeDialogButton, dialogBox
    if (closeDialogButton && dialogBox) {
        closeDialogButton.addEventListener("click", () => { dialogBox.style.display = "none"; showJoystickIfNeeded(); checkForWaterProximity(); });
    }
    const vinylShelf = document.getElementById('vinyl-shelf');
    if (vinylShelf) {
        vinylShelf.addEventListener('click', () => window.open('...', '_blank'));
    }
    // Bookshelf dialog elements needed: bookshelfElement, bookshelfDialog, closeBookshelfButton
    if (bookshelfElement && bookshelfDialog) {
        bookshelfElement.addEventListener('click', () => { bookshelfDialog.style.display = 'block'; hideJoystick(); });
        if (closeBookshelfButton) closeBookshelfButton.addEventListener('click', () => { bookshelfDialog.style.display = 'none'; showJoystickIfNeeded(); });
    }

    // Player Movement Listener
    document.removeEventListener("keydown", movePlayer); // Prevent duplicates
    document.addEventListener("keydown", movePlayer);

    // -=-=-=- Fishing & Scoreboard Listeners -=-=-=-
    if (startFishingButton) startFishingButton.addEventListener('click', startFishing);
    if (cancelFishingButton) cancelFishingButton.addEventListener('click', () => { hideFishingPrompt(); showJoystickIfNeeded(); });
    if (stopFishingButton) stopFishingButton.addEventListener('click', () => stopFishing('stopped'));

    if (reelButton) {
        reelButton.addEventListener('mousedown', () => { if (fishingState === 'cast_ready') castLine(); else if (fishingState === 'reeling') isReeling = true; });
        reelButton.addEventListener('mouseup', () => { if (fishingState === 'reeling') isReeling = false; });
        reelButton.addEventListener('mouseleave', () => { if (fishingState === 'reeling') isReeling = false; });
        reelButton.addEventListener('touchstart', (e) => { e.preventDefault(); if (fishingState === 'cast_ready') castLine(); else if (fishingState === 'reeling') isReeling = true; }, { passive: false });
        reelButton.addEventListener('touchend', (e) => { e.preventDefault(); if (fishingState === 'reeling') isReeling = false; });
    }
    document.body.addEventListener('touchend', () => { if (isReeling) isReeling = false; });

    if (submitInitialsButton) submitInitialsButton.addEventListener('click', submitScore);
    if (closeScoreboardButton) closeScoreboardButton.addEventListener('click', () => { if(scoreboardDialog) scoreboardDialog.style.display = 'none'; showJoystickIfNeeded(); });
    if (toggleScoreboardButton) toggleScoreboardButton.addEventListener('click', async () => {
        if (scoreboardDialog?.style.display === 'block') {
            scoreboardDialog.style.display = 'none';
            showJoystickIfNeeded();
        } else {
            await loadHighScores();
            if (scoreboardDialog) scoreboardDialog.style.display = 'block';
            hideJoystick();
            if (initialsPrompt) initialsPrompt.style.display = 'none';
            if (fishingGameDisplay) fishingGameDisplay.style.display = 'none';
            if (fishingPrompt) fishingPrompt.style.display = 'none';
            if (dialogBox) dialogBox.style.display = 'none';
            if (projectChoiceDialog) projectChoiceDialog.style.display = 'none';
            if (contactFormDialog) contactFormDialog.style.display = 'none';
            if (bookshelfDialog) bookshelfDialog.style.display = 'none';
        }
    });
}

function checkForWaterProximity() {
    if (isAnyDialogOpen()) {
        canFishHere = false;
        hideFishingPrompt();
        return;
    }
    if (isFishingActive) {
        canFishHere = false;
        hideFishingPrompt();
        return;
    }

    const waterTileType = 3;
    canFishHere = false;
    const tilesToCheck = [ { x: playerTileX, y: playerTileY - 1 }, { x: playerTileX, y: playerTileY + 1 }, { x: playerTileX + 1, y: playerTileY }, { x: playerTileX - 1, y: playerTileY } ];

    for (const tile of tilesToCheck) {
        if (tile.y >= 0 && tile.y < MAP_HEIGHT && tile.x >= 0 && tile.x < MAP_WIDTH) {
            if (map[tile.y][tile.x] === waterTileType) {
                canFishHere = true;
                break;
            }
        }
    }

    if (canFishHere) {
        if (fishingPrompt) fishingPrompt.style.display = 'block';
        hideJoystick();
    } else {
        hideFishingPrompt();
    }
}

function hideFishingPrompt() {
    if (fishingPrompt) {
         fishingPrompt.style.display = 'none';
    }
}

function updateTensionBar() {
    if (!tensionBar) return;
    const percentage = Math.max(0, Math.min(MAX_TENSION, tension)) / MAX_TENSION * 100;
    tensionBar.style.width = `${percentage}%`;
    if (percentage > 85) tensionBar.style.backgroundColor = 'red';
    else if (percentage > 60) tensionBar.style.backgroundColor = 'orange';
    else tensionBar.style.backgroundColor = 'lightgreen';
}

function startFishing() {
    hideFishingPrompt();
    isFishingActive = true;
    if (fishingGameDisplay) fishingGameDisplay.style.display = 'block';
    hideJoystick();
    fishingState = 'cast_ready';
    tension = 0;
    fishDistance = 0;
    updateTensionBar();
    if (fishingStatus) fishingStatus.textContent = "Press 'Cast / Reel' to cast!";
    if (reelButton) { reelButton.textContent = "Cast"; reelButton.disabled = false; }
    document.removeEventListener("keydown", movePlayer);
}

function stopFishing(reason) {
    if (biteTimeout) clearTimeout(biteTimeout);
    if (gameLoopInterval) clearInterval(gameLoopInterval);

    isFishingActive = false;
    if (fishingGameDisplay) fishingGameDisplay.style.display = 'none';
    hideFishingPrompt();

    biteTimeout = null;
    gameLoopInterval = null;
    isReeling = false;

    document.removeEventListener("keydown", movePlayer); // Prevent duplicates
    document.addEventListener("keydown", movePlayer);

    let promptNeeded = false;
    switch (reason) {
        case 'stopped':
            showDialog("You stopped fishing.");
            break;
        case 'caught':
            currentFishScore = Math.max(10, Math.round(START_FISH_DISTANCE * (1 - tension / MAX_TENSION / 2) * 10));
            showDialog(`You caught a fish! Score: ${currentFishScore}`);
            promptNeeded = checkAndPromptForHighScore(currentFishScore);
            break;
        case 'lost_tension':
            showDialog("Snap! The line broke!");
            currentFishScore = 0;
            break;
    }

    fishingState = 'idle';

    if (!isAnyDialogOpen()) {
        showJoystickIfNeeded();
    }
}

function castLine() {
    if (fishingState !== 'cast_ready') return;

    fishingState = 'casting';
    if (fishingStatus) fishingStatus.textContent = "Casting...";
    if (reelButton) reelButton.disabled = true;

    setTimeout(() => {
        if (fishingState !== 'casting') return;
        fishingState = 'waiting';
        fishDistance = START_FISH_DISTANCE;
        if (fishingStatus) fishingStatus.textContent = "Waiting for a bite...";
        if (reelButton) { reelButton.disabled = false; reelButton.textContent = "Reel"; }
        const waitTime = Math.random() * (BITE_MAX_WAIT - BITE_MIN_WAIT) + BITE_MIN_WAIT;
        biteTimeout = setTimeout(fishBites, waitTime);
    }, CAST_TIME);
}

function fishBites() {
    if (fishingState !== 'waiting') return;
    biteTimeout = null;
    fishingState = 'reeling';
    if (fishingStatus) fishingStatus.textContent = "Fish On! Hold 'Reel' to reel it in!";
    gameLoopInterval = setInterval(fishingLoop, 100);
}

function fishingLoop() {
    if (fishingState !== 'reeling') {
        clearInterval(gameLoopInterval);
        gameLoopInterval = null;
        return;
    }
    let tensionChange = 0;
    if (isReeling) {
        tensionChange += TENSION_INCREASE_RATE / 10;
        fishDistance -= REEL_SPEED;
        if (fishingStatus) fishingStatus.textContent = "Reeling...";
    } else {
        tensionChange -= TENSION_DECREASE_RATE / 10;
        if (fishingStatus) fishingStatus.textContent = "Hold 'Reel'!";
    }

    if (Math.random() < FISH_FIGHT_CHANCE) {
        tensionChange += FISH_FIGHT_STRENGTH / 10;
        if (fishingStatus) fishingStatus.textContent = "It's fighting back!";
        if (tensionBarContainer) {
            tensionBarContainer.style.animation = 'shake 0.2s';
            requestAnimationFrame(() => {
                setTimeout(() => { if (tensionBarContainer) tensionBarContainer.style.animation = ''; }, 200);
            });
        }
    }

    tension = Math.max(0, Math.min(MAX_TENSION, tension + tensionChange));
    updateTensionBar();

    if (tension >= MAX_TENSION) { stopFishing('lost_tension'); return; }
    if (fishDistance <= 0) { stopFishing('caught'); return; }
}

async function loadHighScores() {
    highScores = [];
    console.log("Attempting to fetch scores from Firestore...");
    try {
        const leaderboardCol = db.collection("leaderboard");
        const q = leaderboardCol.orderBy("score", "desc").limit(10);
        const querySnapshot = await q.get();
        querySnapshot.forEach((doc) => highScores.push({ id: doc.id, ...doc.data() }));
        console.log("Fetched scores:", highScores);
        updateScoreboardDisplay();
    } catch (error) {
        console.error("Error loading high scores:", error);
        if (scoreList) scoreList.innerHTML = '<li>Error loading scores</li>';
    }
}

function updateScoreboardDisplay() {
    if (!scoreList) return;
    scoreList.innerHTML = '';
    if (highScores.length === 0) {
        scoreList.innerHTML = '<li>No scores yet!</li>';
    } else {
        highScores.forEach((scoreEntry) => {
            const li = document.createElement('li');
            const initials = scoreEntry.initials ? scoreEntry.initials.padEnd(3, ' ') : '   ';
            const score = scoreEntry.score !== undefined ? scoreEntry.score.toString().padStart(8, '.') : '0'.padStart(8, '.');
            li.textContent = `${initials} ${score}`;
            scoreList.appendChild(li);
        });
    }
}

// Returns true if initials prompt was shown, false otherwise
function checkAndPromptForHighScore(score) {
    const isTopScore = highScores.length < 10 || (highScores.length > 0 && score > (highScores[highScores.length - 1]?.score ?? 0));

    if (isTopScore && score > 0) {
        scoreToSave = score;
        if (initialsInput) initialsInput.value = '';
        if (initialsPrompt) {
            initialsPrompt.style.display = 'block';
            hideJoystick();
            return true;
        }
    }
    showJoystickIfNeeded();
    return false;
}


async function submitScore() {
    let initials = initialsInput.value.toUpperCase().replace(/[^A-Z]/g, '');
    if (initials.length > 3) initials = initials.substring(0, 3);
    else if (initials.length === 0) { alert("Please enter 1-3 initials."); return; }
    else initials = initials.padEnd(3, ' ');

    if (scoreToSave > 0) {
        try {
            console.log(`Saving score: ${initials} - ${scoreToSave}`);
            const leaderboardCol = db.collection("leaderboard");
            await leaderboardCol.add({
                initials: initials, score: scoreToSave,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
            console.log("Score saved successfully!");
            if (initialsPrompt) initialsPrompt.style.display = 'none';
            scoreToSave = 0;
            await loadHighScores();
            if (scoreboardDialog) scoreboardDialog.style.display = 'block';
            hideJoystick();

        } catch (error) {
            console.error("Error saving score:", error);
            alert("Could not save score. Please try again.");
            if (initialsPrompt) initialsPrompt.style.display = 'none';
            showJoystickIfNeeded();
        }
    } else {
        console.warn("Attempted to save score, but scoreToSave was 0.");
        if (initialsPrompt) initialsPrompt.style.display = 'none';
        showJoystickIfNeeded();
    }
}

function showDialog(text) {
    if (dialogText && dialogBox) {
        dialogText.textContent = text;
        dialogBox.style.display = "block";
        hideJoystick();
    } else {
        console.error("Dialog elements (text or box) not found.");
    }
}

function movePlayer(event) {
    if (isFishingActive || isAnyDialogOpen()) return;

    let nextX = playerTileX;
    let nextY = playerTileY;
    let moved = false;

    switch (event.key) {
        case "ArrowUp": case "w": nextY -= 1; break;
        case "ArrowDown": case "s": nextY += 1; break;
        case "ArrowLeft": case "a": nextX -= 1; break;
        case "ArrowRight": case "d": nextX += 1; break;
        default: return;
    }

    if (nextX < 0 || nextX >= MAP_WIDTH || nextY < 0 || nextY >= MAP_HEIGHT) return;

    const targetTileType = map[nextY][nextX];
    const impassableTiles = [ 1, 3 ];
    if (!impassableTiles.includes(targetTileType)) {
        playerTileX = nextX;
        playerTileY = nextY;
        moved = true;
    }

    if (moved) {
        positionElement('trainer', playerTileX, playerTileY);
        checkForWaterProximity();
    }
}

function setupJoystick() {
    if (typeof nipplejs === 'undefined') {
        console.warn("nipplejs library not found. Joystick disabled.");
        hideJoystick(); return;
    }
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    if (isTouchDevice && joystickZone) {
        const options = {
            zone: joystickZone, mode: 'static', position: { left: '50%', top: '50%' },
            color: 'rgba(128, 128, 128, 0.7)', size: 100, threshold: 0.1, fadeTime: 250
        };
        if (!joystick) {
             joystick = nipplejs.create(options);
             setupJoystickEvents();
        }
        showJoystickIfNeeded();
    } else {
        hideJoystick();
    }
}

function setupJoystickEvents() {
    if (!joystick) return;
    let moveInterval = null;
    const moveDelay = 180;

     joystick.on('start', (evt, data) => { if (moveInterval) clearInterval(moveInterval); joystickDirection = null; });
     joystick.on('move', (evt, data) => {
         if (!data.direction) { joystickDirection = null; if (moveInterval) { clearInterval(moveInterval); moveInterval = null; } return; }
         const angle = data.angle.degree;
         let newDirection = null;
         if (angle > 45 && angle <= 135) newDirection = 'up';
         else if (angle > 135 && angle <= 225) newDirection = 'left';
         else if (angle > 225 && angle <= 315) newDirection = 'down';
         else newDirection = 'right';

         if (newDirection !== joystickDirection || !moveInterval) {
             joystickDirection = newDirection;
             triggerMovement(joystickDirection);
             if (moveInterval) clearInterval(moveInterval);
             moveInterval = setInterval(() => { if (joystickDirection) triggerMovement(joystickDirection); else { clearInterval(moveInterval); moveInterval = null; } }, moveDelay);
          }
     });
     joystick.on('end', (evt, data) => { joystickDirection = null; if (moveInterval) { clearInterval(moveInterval); moveInterval = null; } });
}

function triggerMovement(direction) {
     if (isFishingActive || isAnyDialogOpen()) return;
     if (!direction) return;
     let key;
     switch (direction) { case 'up': key = 'w'; break; case 'down': key = 's'; break; case 'left': key = 'a'; break; case 'right': key = 'd'; break; default: return; }
     movePlayer({ key: key });
}

// -=-=-=- Map Data & Tile Definitions -=-=-=-
const map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 5, 5, 5, 5, 5, 5, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 5, 5, 5, 5, 5, 5, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 5, 5, 5, 5, 5, 5, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 5, 5, 5, 5, 5, 5, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 5, 5, 5, 5, 5, 5, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 5, 5, 5, 5, 5, 5, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 5, 5, 5, 5, 5, 5, 1, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2],
    [1, 5, 5, 5, 5, 5, 5, 1, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2],
    [1, 1, 1, 1, 4, 1, 1, 1, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 3],
    [0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0, 2, 2, 3, 3, 3, 3, 3, 3],
    [0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 2, 2, 2, 3, 3, 3, 3, 3, 3],
    [0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3],
    [0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3],
    [0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 2, 3, 3, 3, 3, 3, 3, 3, 3],
];

const tileTypes = { 0: "grass", 1: "wall", 2: "path", 3: "water", 4: "door", 5: "floor" };
const tiles = {};
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
const pcElement = document.getElementById("pc");
const joystickToggleCheckbox = document.getElementById('joystick-toggle-checkbox');
const serverObjectElement = document.getElementById('server-object');
const itExperienceDialog = document.getElementById('it-experience-dialog');
const closeItExperienceButton = document.getElementById('close-it-experience-dialog');
const itInternNPC = document.getElementById('it-intern-npc');
const serverRack = document.getElementById('server-object');
const itInternDialog = document.getElementById('it-intern-dialog');
const closeItInternButton = document.getElementById('close-it-intern-dialog');
const serverRackDialog = document.getElementById('server-rack-dialog');
const closeServerRackButton = document.getElementById('close-server-rack-dialog');

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

// -=-=-=- Global vars -=-=-=-
const TILE_SIZE = 16;
const MAP_WIDTH = 20;
const MAP_HEIGHT = 15;

let playerTileX = 3;
let playerTileY = 3;
let joystick = null;
let joystickDirection = null;
let delay = null;

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

// --- Dialog State Check ---
function isAnyDialogOpen() {
    return dialogBox?.style.display === 'block' ||
           fishingPrompt?.style.display === 'block' ||
           fishingGameDisplay?.style.display === 'block' ||
           initialsPrompt?.style.display === 'block' ||
           scoreboardDialog?.style.display === 'block' ||
           projectChoiceDialog?.style.display === 'block' ||
           contactFormDialog?.style.display === 'block' ||
           bookshelfDialog?.style.display === 'block' ||
           itInternDialog?.style.display === 'block' ||
           serverRackDialog?.style.display === 'block' ||
           itExperienceDialog?.style.display === 'block';
}

// -=-=-=- Music Control -=-=-=-
document.getElementById('start-btn').onclick = function() {
  document.getElementById('music').play();
};

// --- Joystick Visibility Helpers ---
function hideJoystick() {
    if (joystickZone) {
        joystickZone.style.display = 'none';
    }
}

function showJoystickIfNeeded() {
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    const anyDialogOpen = isAnyDialogOpen();
    console.log(`showJoystickIfNeeded: isTouch=${isTouchDevice}, joystickObjExists=${!!joystick}, dialogOpen=${anyDialogOpen}`);

    if (joystickZone && isTouchDevice && joystick) {
        if (!anyDialogOpen) {
             joystickZone.style.display = 'block';
             console.log("--> Joystick Shown");
        } else {
             joystickZone.style.display = 'none';
             console.log("--> Joystick Hidden (Dialog Open)");
        }
    } else {
        hideJoystick();
        console.log("--> Joystick Hidden (Not touch or no joystick obj)");
    }
}
// --- End Helpers ---

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
    setupInteractions();
    setupJoystick();
    window.addEventListener('resize', () => {
        positionElements();
        checkForWaterProximity();  
    });
    checkForWaterProximity();  
    showJoystickIfNeeded();
}

function loadTileImages() {
    return new Promise((resolve) => {
        let imagesLoaded = 0;
        const tileKeys = Object.keys(tileTypes); // Store keys
        const totalImages = tileKeys.length;
        if (totalImages === 0) { resolve(); return; }

        tileKeys.forEach(key => { // Use forEach for clarity
            const img = new Image();
            img.src = `assets/tiles/${tileTypes[key]}.png`;
            img.onload = () => {
                imagesLoaded++;
                tiles[key] = img;
                if (imagesLoaded === totalImages) resolve();
            };
            img.onerror = () => {
                console.error(`Failed to load image: assets/tiles/${tileTypes[key]}.png`);
                imagesLoaded++;
                 if (imagesLoaded === totalImages) resolve();
            }
        });
    });
}

function drawMap() {
    if (!gameCanvas || !ctx) return;
    gameCanvas.width = MAP_WIDTH * TILE_SIZE;
    gameCanvas.height = MAP_HEIGHT * TILE_SIZE;
    for (let y = 0; y < MAP_HEIGHT; y++) {
        for (let x = 0; x < MAP_WIDTH; x++) {
            const tileType = map[y]?.[x];
            if (tileType !== undefined && tiles[tileType]) {
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
    positionElement('player', playerTileX, playerTileY);
    positionElement('mailbox', 6, 14);
    positionElement('resume-trainer', 3, 10);
    positionElement('skills-trainer', 3, 12);
    positionElement('fisher', 11, 11);
    positionElement('server-object', 15, 1);
    positionElement('server-rack', 17, 1);
}

function positionElement(elementId, tileX, tileY) {
    const element = document.getElementById(elementId);
    if (!element) return;
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) return;
    const canvasRect = canvas.getBoundingClientRect();
    const actualTileWidth = canvasRect.width / MAP_WIDTH;
    const actualTileHeight = canvasRect.height / MAP_HEIGHT;
    element.style.left = tileX * actualTileWidth + 'px';
    element.style.top = tileY * actualTileHeight + 'px';
    element.style.width = actualTileWidth + 'px';
    element.style.height = actualTileHeight + 'px';
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

function checkForWaterProximity() {
    if (isAnyDialogOpen() || isFishingActive) {
        canFishHere = false;
        hideFishingPrompt();
        return;
    }

    const dockTileType = 6; 
    canFishHere = false;

    const currentTileType = map[playerTileY]?.[playerTileX];
    if (currentTileType === dockTileType) {
        canFishHere = true;
    }

    if (canFishHere) {
        if (fishingPrompt) fishingPrompt.style.display = 'block';
        hideJoystick();
    } else {
        hideFishingPrompt();
        showJoystickIfNeeded();
    }
}

function setupInteractions() {
    document.removeEventListener("keydown", movePlayer);
    document.addEventListener("keydown", movePlayer);

    const setupListener = (id, action) => {
        const element = document.getElementById(id);
        if (element) element.addEventListener("click", action);
    };

    setupListener("resume-trainer", () => window.open('https://github.com/calebluh/about-me/blob/main/README.md', '_blank'));
    setupListener("skills-trainer", () => showDialog("Certifications: Variational Algorithm Design, Basics of Quantum Information, JavaScript Fundamentals, Microsoft IT Support Specialist, TestOut IT Fundamentals Pro, Level 3: Excel Purple Belt, Autodesk Inventor Certified User"));
    setupListener("fisher", () => showDialog("To fish, proceed to the dock. The calmer the fish the better the score!"));
    setupListener("vinyl-shelf", () => window.open('https://www.discogs.com/user/calebluh/collection', '_blank'));

    setupListener("server-rack", () => {
        if (serverRackDialog) {
            serverRackDialog.style.display = 'block';
            hideJoystick();
        }
    });
    setupListener("close-server-rack-dialog", () => {
        if (serverRackDialog) {
            serverRackDialog.style.display = 'none';
            showJoystickIfNeeded();
        }
    });
    
    const serverObject = document.getElementById('server-object');
    if (serverObject && itExperienceDialog) {
        serverObject.addEventListener('click', () => {
            if (itExperienceDialog) itExperienceDialog.style.display = 'block';
            hideJoystick();
        });
    }

    if (pcElement && projectChoiceDialog) {
        const closeBtn = document.getElementById('close-btn');
        setupListener("pc", () => { if(projectChoiceDialog) projectChoiceDialog.style.display = 'block'; hideJoystick(); });
        setupListener("roblox-btn", () => { window.open("https://www.roblox.com/games/113892368479986/Lacrosse-Legends", "_blank"); if(projectChoiceDialog) projectChoiceDialog.style.display = 'none'; showJoystickIfNeeded(); });
        setupListener("statlab-btn", () => { window.open("https://calebluh.github.io/stat-lab", "_blank"); if(projectChoiceDialog) projectChoiceDialog.style.display = 'none'; showJoystickIfNeeded(); });
        setupListener("linkedin-btn", () => { window.open("https://www.linkedin.com/in/calebluh/", "_blank"); if(projectChoiceDialog) projectChoiceDialog.style.display = 'none'; showJoystickIfNeeded(); });
        if (closeBtn) setupListener("close-btn", () => { if(projectChoiceDialog) projectChoiceDialog.style.display = 'none'; showJoystickIfNeeded(); });
    }
    if (mailbox && contactFormDialog) {
        const closeContactFormButton = document.getElementById("close-contact-form");
        setupListener("mailbox", () => { if(contactFormDialog) contactFormDialog.style.display = "block"; hideJoystick(); });
        if (closeContactFormButton) setupListener("close-contact-form", () => { if(contactFormDialog) contactFormDialog.style.display = "none"; showJoystickIfNeeded(); });
    }
    if (closeDialogButton && dialogBox) {
        closeDialogButton.addEventListener("click", () => {
            if (dialogBox) dialogBox.style.display = "none";
            if (delay) {
                clearInterval(delay);
                delay = null;
            } showJoystickIfNeeded();
            checkForWaterProximity();
        });
    }
    if (bookshelfElement && bookshelfDialog) {
        const closeBookshelfButton = document.getElementById('close-bookshelf-dialog');
        setupListener("bookshelf", () => { if(bookshelfDialog) bookshelfDialog.style.display = 'block'; hideJoystick(); });
        if (closeBookshelfButton) setupListener("close-bookshelf-dialog", () => { if(bookshelfDialog) bookshelfDialog.style.display = 'none'; showJoystickIfNeeded(); });
    }

    if (startFishingButton) setupListener("start-fishing-btn", startFishing);
    if (cancelFishingButton) setupListener("cancel-fishing-btn", () => { hideFishingPrompt(); showJoystickIfNeeded(); });
    if (stopFishingButton) setupListener("stop-fishing-btn", () => stopFishing('stopped'));
    if (submitInitialsButton) setupListener("submit-initials-btn", submitScore);
    if (closeScoreboardButton) setupListener("close-scoreboard-btn", () => { if(scoreboardDialog) scoreboardDialog.style.display = 'none'; showJoystickIfNeeded(); });
    if (toggleScoreboardButton) toggleScoreboardButton.addEventListener('click', async () => {
        console.log("Dialog check for scores btn:", isAnyDialogOpen()); // Keep debug log
        if (scoreboardDialog?.style.display === 'block') {
            scoreboardDialog.style.display = 'none'; showJoystickIfNeeded();
        } else {
            await loadHighScores();
            if (scoreboardDialog) scoreboardDialog.style.display = 'block'; hideJoystick();
            if (initialsPrompt) initialsPrompt.style.display = 'none';
            if (fishingGameDisplay) fishingGameDisplay.style.display = 'none';
            if (fishingPrompt) fishingPrompt.style.display = 'none';
            if (dialogBox) dialogBox.style.display = 'none';
            if (projectChoiceDialog) projectChoiceDialog.style.display = 'none';
            if (contactFormDialog) contactFormDialog.style.display = 'none';
            if (bookshelfDialog) bookshelfDialog.style.display = 'none';
            if (serverRackDialog) serverRackDialog.style.display = 'none';
        }
    });

    if (reelButton) {
        reelButton.addEventListener('mousedown', () => { if (fishingState === 'cast_ready') castLine(); else if (fishingState === 'reeling') isReeling = true; });
        reelButton.addEventListener('mouseup', () => { if (fishingState === 'reeling') isReeling = false; });
        reelButton.addEventListener('mouseleave', () => { if (fishingState === 'reeling') isReeling = false; });
        reelButton.addEventListener('touchstart', (e) => { e.preventDefault(); if (fishingState === 'cast_ready') castLine(); else if (fishingState === 'reeling') isReeling = true; }, { passive: false });
        reelButton.addEventListener('touchend', (e) => { e.preventDefault(); if (fishingState === 'reeling') isReeling = false; });
    }
    document.body.addEventListener('touchend', () => { if (isReeling) isReeling = false; });
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

function stopFishing(reason) {
    if (biteTimeout) clearTimeout(biteTimeout);
    if (gameLoopInterval) clearInterval(gameLoopInterval);
    isFishingActive = false;
    if (fishingGameDisplay) fishingGameDisplay.style.display = 'none';
    hideFishingPrompt();
    biteTimeout = null;
    gameLoopInterval = null;
    isReeling = false;
    document.removeEventListener("keydown", movePlayer);
    document.addEventListener("keydown", movePlayer);

    let showRegularDialogFlag = false;
    let promptWasShown = false;

    if (reason === 'caught') {
        currentFishScore = Math.max(10, Math.round(START_FISH_DISTANCE * (1 - tension / MAX_TENSION / 2) * 10));
        promptWasShown = checkAndPromptForHighScore(currentFishScore);
        if (!promptWasShown) {
            showRegularDialogFlag = true;
        }
    } else if (reason === 'stopped') {
        showRegularDialogFlag = true;
    } else if (reason === 'lost_tension') {
        showRegularDialogFlag = true;
        currentFishScore = 0;
    }

    fishingState = 'idle';

    if (showRegularDialogFlag) {
        if (reason === 'stopped') showDialog("You stopped fishing.");
        else if (reason === 'lost_tension') showDialog("Snap! The line broke!");
        else if (reason === 'caught') showDialog(`You caught a fish! Score: ${currentFishScore}`);
    }

    if (!promptWasShown && !showRegularDialogFlag) {
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
    if (fishingState !== 'reeling') { clearInterval(gameLoopInterval); gameLoopInterval = null; return; }
    let tensionChange = 0;
    if (isReeling) { tensionChange += TENSION_INCREASE_RATE / 10; fishDistance -= REEL_SPEED; if (fishingStatus) fishingStatus.textContent = "Reeling..."; }
    else { tensionChange -= TENSION_DECREASE_RATE / 10; if (fishingStatus) fishingStatus.textContent = "Hold 'Reel'!"; }
    if (Math.random() < FISH_FIGHT_CHANCE) {
        tensionChange += FISH_FIGHT_STRENGTH / 10; if (fishingStatus) fishingStatus.textContent = "It's fighting back!";
        if (tensionBarContainer) { tensionBarContainer.style.animation = 'shake 0.2s'; requestAnimationFrame(() => { setTimeout(() => { if (tensionBarContainer) tensionBarContainer.style.animation = ''; }, 200); }); }
    }
    tension = Math.max(0, Math.min(MAX_TENSION, tension + tensionChange));
    updateTensionBar();
    if (tension >= MAX_TENSION) { stopFishing('lost_tension'); return; }
    if (fishDistance <= 0) { stopFishing('caught'); return; }
}

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

function textDelay(element, text, speed = 50) { 
    if (delay) {
        clearInterval(delay);
    }

    element.textContent = '';
    let i = 0;
    element.style.minHeight = '1.2em';

    delay = setInterval(() => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(delay);
            delay = null; 
        }
    }, speed);
}

function showDialog(text) {
    if (delay) {
        clearInterval(delay);
        delay = null;
    }

    if (dialogText && dialogBox) {
        dialogBox.style.top = '';
        dialogBox.style.left = '';

        dialogBox.style.display = "block";

        textDelay(dialogText, text, 50); 

        hideJoystick(); 
    } else {
        console.error("Dialog elements (dialogText or dialogBox) not found for showDialog.");
    }
}

function setupJoystick() {
    console.log("Attempting joystick setup...");
    const joystickEnabled = joystickToggleCheckbox ? joystickToggleCheckbox.checked : true;

    if (!joystickEnabled) {
        console.log("Joystick explicitly disabled by user.");
        hideJoystick();
        return;
    }

    if (typeof nipplejs === 'undefined') {
         console.warn("nipplejs library not found.");
         hideJoystick();
         return;
    }
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    console.log("Is touch device?", isTouchDevice);
    if (isTouchDevice && joystickZone) {
        const options = { zone: joystickZone, mode: 'static', position: { left: '50%', top: '50%' }, color: 'rgba(128, 128, 128, 0.7)', size: 100, threshold: 0.3, fadeTime: 250 };
        if (!joystick) {
            console.log("Creating joystick instance...");
            joystick = nipplejs.create(options);
            console.log("Joystick object:", joystick);
            setupJoystickEvents();
       }
       showJoystickIfNeeded();
       console.log("Hiding joystick (not touch or no zone)");
       hideJoystick();
   }
}

function setupJoystickEvents() {
    if (!joystick) return;
    let moveInterval = null;
    const moveDelay = 180; 
    joystick.on('start', () => {
        console.log("Joystick Start");
        if (moveInterval) clearInterval(moveInterval);
        joystickDirection = null;
    });
    joystick.on('move', (evt, data) => {
        if (!data.direction) {
            console.log("Joystick Move: No direction data");
            joystickDirection = null;
            if (moveInterval) { clearInterval(moveInterval); moveInterval = null; }
            return;
        }
        const angle = data.angle.degree;
        let newDirection = null;
        // Determine direction based on angle
        if (angle > 45 && angle <= 135) newDirection = 'up';
        else if (angle > 135 && angle <= 225) newDirection = 'left';
        else if (angle > 225 && angle <= 315) newDirection = 'down';
        else newDirection = 'right'; // 315-360 and 0-45

        console.log(`Joystick Raw Move: Angle=${angle?.toFixed(1)}, Calc Dir=${newDirection}, Current Stored Dir=${joystickDirection}`);

        if (newDirection !== joystickDirection || !moveInterval) {
            console.log(`   Direction Changed/Interval Start: New=${newDirection}, Old=${joystickDirection}`);
            joystickDirection = newDirection; // Store the new direction
            triggerMovement(joystickDirection); // Trigger immediate movement

            // Clear any existing interval and start a new one
            if (moveInterval) clearInterval(moveInterval);
            moveInterval = setInterval(() => {
                 console.log(`   Interval Tick: Stored Dir=${joystickDirection}`);
                 // Use the stored direction for continuous movement
                 if (joystickDirection) {
                     triggerMovement(joystickDirection);
                 } else {
                     console.log("   Interval Cleared (No Direction)");
                     clearInterval(moveInterval);
                     moveInterval = null;
                 }
            }, moveDelay);
         }
    });
    joystick.on('end', () => {
        console.log("Joystick End");
        joystickDirection = null;
        if (moveInterval) {
            console.log("   Clearing Interval on End");
            clearInterval(moveInterval);
            moveInterval = null;
        }
    });
}

// Replace the existing triggerMovement function
function triggerMovement(direction) {
     console.log(`  triggerMovement called with direction: ${direction}`);
     if (isFishingActive || isAnyDialogOpen()) { 
         console.log(`  triggerMovement blocked: Fishing=${isFishingActive}, DialogOpen=${isAnyDialogOpen()}`);
         return;
     }
     if (!direction) {
         console.log("  triggerMovement ignored: No direction provided.");
         return;
     }
     let key;
     switch (direction) {
         case 'up': key = 'w'; break;
         case 'down': key = 's'; break;
         case 'left': key = 'a'; break;
         case 'right': key = 'd'; break;
         default:
             console.log(`  triggerMovement ignored: Unknown direction '${direction}'.`);
             return;
     }
     console.log(`   Mapping direction '${direction}' to key '${key}'`);
     movePlayer({ key: key });
}

function movePlayer(event) {
    console.log(` movePlayer called with key: ${event.key}`);

    if (isFishingActive || isAnyDialogOpen()) {
        console.log(` movePlayer blocked: Fishing=${isFishingActive}, DialogOpen=${isAnyDialogOpen()}`);
        return;
    }
    let nextX = playerTileX, nextY = playerTileY, moved = false;
    // Calculate next position based on key
    switch (event.key) {
        case "ArrowUp": case "w": nextY -= 1; break;
        case "ArrowDown": case "s": nextY += 1; break;
        case "ArrowLeft": case "a": nextX -= 1; break;
        case "ArrowRight": case "d": nextX += 1; break;
        default: return;
    }

    console.log(`  Attempting move from (${playerTileX},${playerTileY}) to (${nextX},${nextY})`);

    // Check boundaries
    if (nextX < 0 || nextX >= MAP_WIDTH || nextY < 0 || nextY >= MAP_HEIGHT) {
        console.log(`  Move blocked: Out of map bounds.`);
        return;
    }
    const targetTileType = map[nextY]?.[nextX];
    const impassableTiles = [ 1, 3, 8 ]; // Wall=1, Water=3, New Wall=8

    console.log(`   Target tile type at (${nextX},${nextY}): ${targetTileType}`);

    if (targetTileType !== undefined && !impassableTiles.includes(targetTileType)) {
        console.log(`    Move allowed.`);
        playerTileX = nextX;
        playerTileY = nextY;
        moved = true;
    } else {
        console.log(`    Move blocked: Impassable tile type (${targetTileType}).`);
    }

    if (moved) {
        positionElement('player', playerTileX, playerTileY); // Update player position visually
        checkForWaterProximity(); // Check if near water for fishing prompt
    }
}

// -=-=-=- Map Data & Tile Definitions -=-=-=-
const map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1],
    [1, 5, 5, 5, 5, 5, 5, 1, 0, 0, 0, 0, 0, 1, 5, 5, 5, 5, 5, 1],
    [1, 5, 5, 5, 5, 5, 5, 1, 0, 0, 0, 0, 0, 1, 5, 5, 5, 5, 5, 1],
    [1, 5, 5, 5, 5, 5, 5, 1, 0, 0, 0, 0, 0, 1, 5, 5, 5, 5, 5, 1],
    [1, 5, 5, 5, 5, 5, 5, 1, 0, 0, 0, 0, 0, 1, 1, 1, 4, 1, 1, 1],
    [1, 5, 5, 5, 5, 5, 5, 1, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0],
    [1, 5, 5, 5, 5, 5, 5, 1, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2],
    [1, 5, 5, 5, 5, 5, 5, 1, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2],
    [1, 5, 5, 5, 5, 5, 5, 1, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2],
    [1, 1, 1, 1, 4, 1, 1, 1, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 3],
    [0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0, 2, 2, 3, 3, 3, 3, 3, 3],
    [0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 2, 2, 2, 3, 3, 3, 3, 3, 3],
    [0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 6, 3, 3, 3, 3, 3],
    [0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3],
    [0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 2, 3, 3, 3, 3, 3, 3, 3, 3],
];
const tileTypes = { 0: "grass", 1: "wall", 2: "path", 3: "water", 4: "door", 5: "floor", 6: "dock" };
const tiles = {};

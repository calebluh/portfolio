/* 
fishing.js - Fishing minigame logic
*/ 

const fishingPrompt = document.getElementById('fishing-prompt');
const startFishingButton = document.getElementById('start-fishing-btn');
const cancelFishingButton = document.getElementById('cancel-fishing-btn');
const fishingGameDisplay = document.getElementById('fishing-game');
const fishingStatus = document.getElementById('fishing-status');
const tensionBarContainer = document.getElementById('tension-bar-container');
const tensionBar = document.getElementById('tension-bar');
const reelButton = document.getElementById('reel-button');
const stopFishingButton = document.getElementById('stop-fishing-btn');

// -=-=-=- Fishing Game State Vars -=-=-=-
let isFishingActive = false;
window.isFishingActive = isFishingActive;
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

// -=-=-=- startFishing -=-=-
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

// -=-=-=- checkForWaterProximity -=-=-=-
function checkForWaterProximity() {
    if (isAnyDialogOpen() || isFishingActive) {
        canFishHere = false;
        hideFishingPrompt();
        return;
    }

    const dockTileType = 30; 
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

// Export to global scope
window.checkForWaterProximity = checkForWaterProximity;

// -=-=-=- hideFishingPrompt -=-=-=-
function hideFishingPrompt() {
    if (fishingPrompt) {
         fishingPrompt.style.display = 'none';
    }
}

// -=-=-=- updateTensionBar -=-=-=-
function updateTensionBar() {
    if (!tensionBar) return;
    const percentage = Math.max(0, Math.min(MAX_TENSION, tension)) / MAX_TENSION * 100;
    tensionBar.style.width = `${percentage}%`;
    if (percentage > 85) tensionBar.style.backgroundColor = 'red';
    else if (percentage > 60) tensionBar.style.backgroundColor = 'orange';
    else tensionBar.style.backgroundColor = 'lightgreen';
}

// -=-=-=- stopFishing -=-=-=-
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

// -=-=-=- castLine -=-=-=-
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

// -=-=-=- fishBites -=-=-=-
function fishBites() {
    if (fishingState !== 'waiting') return;
    biteTimeout = null;
    fishingState = 'reeling';
    if (fishingStatus) fishingStatus.textContent = "Fish On! Hold 'Reel' to reel it in!";
    gameLoopInterval = setInterval(fishingLoop, 100);
}

// -=-=-=- fishingLoop -=-=-=-
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
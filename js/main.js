/* 
main.js - Entry point and global variables
*/

// -=-=-=- Constants -=-=-=-
const startScreen = document.getElementById("start-screen");
const startBtn = document.getElementById("start-btn");
const gameMap = document.getElementById("game-map");
const gameCanvas = document.getElementById("gameCanvas");
const ctx = gameCanvas.getContext("2d");

let playerTileX = 3;
let playerTileY = 3;
let joystick = null;
let joystickDirection = null;
let delay = null;

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

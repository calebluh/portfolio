/* 
main.js - Entry point and global variables
*/

// -=-=-=- Constants -=-=-=-
const startScreen = document.getElementById("start-screen");
const startBtn = document.getElementById("start-btn");
const gameMap = document.getElementById("game-map");
const gameCanvas = document.getElementById("gameCanvas");
const ctx = gameCanvas.getContext("2d");

let playerTileX = 36;
let playerTileY = 22;
let joystick = null;
let joystickDirection = null;
let delay = null;

startBtn.addEventListener('click', () => {
    startScreen.style.display = 'none';
    gameMap.style.display = 'block';
    document.getElementById('background-controls').style.display = 'block';
    init();
// -=-=-=- Background Customization -=-=-=-
const bgType = document.getElementById('bg-type');
const bgColorPicker = document.getElementById('bg-color-picker');
const bgTilePicker = document.getElementById('bg-tile-picker');

// Populate tile picker with available tiles
function populateTilePicker() {
    bgTilePicker.innerHTML = '';
    const tileKeys = Object.keys(tileTypes);
    tileKeys.forEach(key => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = tileTypes[key];
        bgTilePicker.appendChild(option);
    });
}

function setBackground(type, value) {
    if (type === 'color') {
        document.body.style.background = value;
    } else if (type === 'tile') {
        // Use a data URL for the tile image as a repeating background
        const tileKey = value;
        const img = tiles[tileKey];
        if (img && img.src) {
            document.body.style.background = `url('${img.src}') repeat`;
        }
    }
}

if (bgType && bgColorPicker && bgTilePicker) {
    populateTilePicker();
    bgType.addEventListener('change', () => {
        if (bgType.value === 'color') {
            bgColorPicker.style.display = '';
            bgTilePicker.style.display = 'none';
            setBackground('color', bgColorPicker.value);
        } else {
            bgColorPicker.style.display = 'none';
            bgTilePicker.style.display = '';
            setBackground('tile', bgTilePicker.value);
        }
    });
    bgColorPicker.addEventListener('input', () => {
        setBackground('color', bgColorPicker.value);
    });
    bgTilePicker.addEventListener('change', () => {
        setBackground('tile', bgTilePicker.value);
    });
    // Set initial background
    setBackground('color', bgColorPicker.value);
}
});

async function init() {
    await loadHighScores();
    // Ensure loadTileImages is defined (from map.js)
    if (typeof loadTileImages === 'function') {
        await loadTileImages();
    }
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

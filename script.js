// Start Screen Transition
const startScreen = document.getElementById("start-screen");
const startBtn = document.getElementById("start-btn");
const gameMap = document.getElementById("game-map");
const gameCanvas = document.getElementById("gameCanvas");
const ctx = gameCanvas.getContext("2d");
const dialogBox = document.getElementById("dialog-box");
const dialogText = document.getElementById("dialog-text");
const closeDialogButton = document.getElementById("close-dialog");

startBtn.addEventListener('click', () => {
    startScreen.style.display = 'none';
    gameMap.style.display = 'block';

    init(); // Call the init function
});

async function init() {
    await loadTileImages(); // Wait for images to load
    drawMap();             // Then draw the map
}

// NPC Interaction (Resume Trainer)
document.getElementById("resume-trainer").addEventListener("click", function() {
    document.getElementById("dialog-box").style.display = "block";
    document.getElementById("dialog-text").textContent = "Resume Trainer: 'Check out my resume here!'";
});

// NPC Interaction (Skills Trainer)
document.getElementById("skills-trainer").addEventListener("click", function() {
    document.getElementById("dialog-box").style.display = "block";
    document.getElementById("dialog-text").textContent = "Skills Trainer: 'Here are the skills I've mastered!'";
});

// NPC Interaction (Experience Trainer)
document.getElementById("experience-trainer").addEventListener("click", function() {
    document.getElementById("dialog-box").style.display = "block";
    document.getElementById("dialog-text").textContent = "Experience Trainer: 'Explore my professional experience!'";
});

// PC Interaction: Redirect to Links
const projectChoiceDialog = document.getElementById('project-choice-dialog');
const robloxBtn = document.getElementById('roblox-btn');
const statlabBtn = document.getElementById('statlab-btn');
const linkedinBtn = document.getElementById('linkedin-btn');

document.getElementById("pc").addEventListener("click", function() {
    projectChoiceDialog.style.display = 'block';
});

robloxBtn.addEventListener('click', () => {
    window.open("https://www.roblox.com/games/113892368479986/Lacrosse-Legends", "_blank");
    projectChoiceDialog.style.display = 'none';
});

statlabBtn.addEventListener('click', () => {
    window.open("https://calebluh.github.io/stat-lab", "_blank");
    projectChoiceDialog.style.display = 'none';
});

linkedinBtn.addEventListener('click', () => {
    window.open("https://www.linkedin.com/in/calebluh/", "_blank");
    projectChoiceDialog.style.display = 'none';
});

// Mailbox Interaction (Contact Form)
const mailbox = document.getElementById("mailbox");
const contactFormDialog = document.getElementById("contact-form-dialog");
const closeContactFormButton = document.getElementById("close-contact-form");

mailbox.addEventListener("click", function() {
    contactFormDialog.style.display = "block";
});

closeContactFormButton.addEventListener("click", function() {
    contactFormDialog.style.display = "none";
});

// Dialog Box Close
document.getElementById("close-dialog").addEventListener("click", function() {
    document.getElementById("dialog-box").style.display = "none";
});

// Player Movement Logic
let player = { x: 200, y: 200 }; // Initial trainer position

document.addEventListener("keydown", function(event) {
    const trainerElement = document.getElementById("trainer");
    switch (event.key) {
        case "ArrowUp":
        case "w": // For WASD controls
            player.y -= 10;
            break;
        case "ArrowDown":
        case "s":
            player.y += 10;
            break;
        case "ArrowLeft":
        case "a":
            player.x -= 10;
            break;
        case "ArrowRight":
        case "d":
            player.x -= 10;
            break;
    }
    trainerElement.style.transform = `translate(${player.x}px, ${player.y}px)`;
});

// TILE SIZE and MAP DATA
const TILE_SIZE = 32; // Define tile size
const MAP_WIDTH = 20;  // Map width in tiles
const MAP_HEIGHT = 15; // Map height in tiles

const map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2],
    [1, 1, 1, 1, 4, 1, 1, 1, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 3],
    [1, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0, 2, 2, 3, 3, 3, 3, 3, 3],
    [1, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 2, 2, 2, 3, 3, 3, 3, 3, 3],
    [1, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3],
    [1, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3],
    [1, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 2, 3, 3, 3, 3, 3, 3, 3, 3],
];

const tileTypes = {
    0: "grass",
    1: "wall",
    2: "path",
    3: "water",
    4: "door",
    5: "roof"
};

const tiles = {};

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
        }
    });
}

function drawMap() {
    for (let y = 0; y < MAP_HEIGHT; y++) {
        for (let x = 0; x < MAP_WIDTH; x++) {
            const tileType = map[y][x];
            if (tiles[tileType]) {
                ctx.drawImage(tiles[tileType], x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            }
        }
    }
}

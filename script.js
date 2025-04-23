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

const TILE_SIZE = 16;
const MAP_WIDTH = 20;
const MAP_HEIGHT = 15;

startBtn.addEventListener('click', () => {
    startScreen.style.display = 'none';
    gameMap.style.display = 'block';
    init();
});

async function init() {
    await loadTileImages();
    drawMap();
    positionElements();
    setupInteractions();
    window.addEventListener('resize', positionElements);
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
    // Set canvas logical size based on map dimensions and original tile size
    gameCanvas.width = MAP_WIDTH * TILE_SIZE;
    gameCanvas.height = MAP_HEIGHT * TILE_SIZE;

    // Draw the map using the logical TILE_SIZE
    for (let y = 0; y < MAP_HEIGHT; y++) {
        for (let x = 0; x < MAP_WIDTH; x++) {
            const tileType = map[y][x];
            if (tiles[tileType]) {
                ctx.drawImage(tiles[tileType], x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            } else {
                 // Draw a fallback color if tile image is missing
                ctx.fillStyle = 'grey';
                ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            }
        }
    }
}


function positionElements() {
    positionElement('pc', 5, 3);
    positionElement('mailbox', 2, 7);
    positionElement('bookshelf', 8, 1);
    positionElement('vinyl-shelf', 12, 5);
    positionElement('trainer', 3, 3);
    positionElement('resume-trainer', 7, 7);
    positionElement('skills-trainer', 9, 9);
    positionElement('experience-trainer', 11, 11);
}

function positionElement(elementId, tileX, tileY) {
    const element = document.getElementById(elementId);
    if (!element) return;
    const canvas = document.getElementById('gameCanvas');

    const actualTileWidth = canvas.offsetWidth / MAP_WIDTH;
    const actualTileHeight = canvas.offsetHeight / MAP_HEIGHT;

    element.style.left = tileX * actualTileWidth + 'px';
    element.style.top = tileY * actualTileHeight + 'px';

    // Adjust sprite size dynamically based on calculated tile size
    // This makes sprite size consistent with the visual grid
    element.style.width = actualTileWidth + 'px';
    element.style.height = actualTileHeight + 'px';
}


function setupInteractions() {
    // Resume Trainer - Link to PDF (replace with your URL)
    document.getElementById("resume-trainer").addEventListener("click", function() {
        window.open('path/to/your/resume.pdf', '_blank');
    });

    // Skills Trainer - Show skills in dialog (replace with your skills)
    document.getElementById("skills-trainer").addEventListener("click", function() {
        showDialog("Skills Trainer: JavaScript, HTML, CSS, React, Node.js...");
    });

    // Experience Trainer - Link to LinkedIn (replace with your URL)
    document.getElementById("experience-trainer").addEventListener("click", function() {
        window.open('https://www.linkedin.com/in/your-profile/', '_blank');
    });

    // PC Interaction
    const projectChoiceDialog = document.getElementById('project-choice-dialog');
    const robloxBtn = document.getElementById('roblox-btn');
    const statlabBtn = document.getElementById('statlab-btn');
    const linkedinBtn = document.getElementById('linkedin-btn');
    const closeBtn = document.getElementById('close-btn');

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

    closeBtn.addEventListener('click', () => {
        projectChoiceDialog.style.display = 'none';
    });

    // Mailbox Interaction
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
    closeDialogButton.addEventListener("click", function() {
        dialogBox.style.display = "none";
    });

    // Vinyl Shelf Interaction
    document.getElementById('vinyl-shelf').addEventListener('click', () => {
        window.open('https://www.discogs.com/user/calebluh/', '_blank');
    });

    // Bookshelf Interaction
    bookshelfElement.addEventListener('click', () => {
        bookshelfDialog.style.display = 'block';
    });

    closeBookshelfButton.addEventListener('click', () => {
        bookshelfDialog.style.display = 'none';
    });

    // Player Movement
    document.addEventListener("keydown", function(event) {
        movePlayer(event);
    });
}

function showDialog(text) {
    dialogText.textContent = text;
    dialogBox.style.display = "block";
}

// Player Movement - Simple example, needs collision detection etc.
let playerTileX = 3; // Initial position tile matching positionElements
let playerTileY = 3;

function movePlayer(event) {
    let moved = false;
    switch (event.key) {
        case "ArrowUp":
        case "w":
            playerTileY -= 1;
            moved = true;
            break;
        case "ArrowDown":
        case "s":
            playerTileY += 1;
            moved = true;
            break;
        case "ArrowLeft":
        case "a":
            playerTileX -= 1;
            moved = true;
            break;
        case "ArrowRight":
        case "d":
            playerTileX += 1;
            moved = true;
            break;
    }

    // Basic boundary check (replace with proper collision logic)
    if (playerTileX < 0) playerTileX = 0;
    if (playerTileY < 0) playerTileY = 0;
    if (playerTileX >= MAP_WIDTH) playerTileX = MAP_WIDTH - 1;
    if (playerTileY >= MAP_HEIGHT) playerTileY = MAP_HEIGHT - 1;

    if(moved) {
        // Reposition the player sprite based on new tile coordinates
        positionElement('trainer', playerTileX, playerTileY);
    }
}


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

const tileTypes = {
    0: "grass",
    1: "wall",
    2: "path",
    3: "water",
    4: "door",
    5: "floor"
};

const tiles = {};

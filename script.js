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
    // Inside Elements
    positionElement('pc', 4, 1);
    positionElement('bookshelf', 1, 1);
    positionElement('vinyl-shelf', 6, 1);
    positionElement('trainer', 3, 3);

    // Outside Elements
    positionElement('mailbox', 6, 14);

    // Spaced-out Trainers on Path/Grass
    positionElement('resume-trainer', 3, 10);
    positionElement('skills-trainer', 11, 11);
    positionElement('experience-trainer', 18, 8);
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
    // Resume Trainer
    document.getElementById("resume-trainer").addEventListener("click", function() {
        window.open('https://github.com/calebluh/about-me/blob/main/README.md', '_blank');
    });

    // Certs Trainer
    document.getElementById("skills-trainer").addEventListener("click", function() {
        showDialog("Certifications: Microsoft IT Support Specialist, Autodesk Inventor Certified User, TestOut IT Fundamentals Pro, Excel Purple Belt");
    });

    // Experience Trainer
    document.getElementById("experience-trainer").addEventListener("click", function() {
        window.open('https://www.linkedin.com/in/calebluh/', '_blank');
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
        window.open('https://www.discogs.com/user/calebluh/collection', '_blank');
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

// Player Movement
let playerTileX = 3;
let playerTileY = 3;

function movePlayer(event) {
    let nextX = playerTileX;
    let nextY = playerTileY;
    let moved = false;

    // Calculate proposed next position
    switch (event.key) {
        case "ArrowUp":
        case "w":
            nextY -= 1;
            break;
        case "ArrowDown":
        case "s":
            nextY += 1;
            break;
        case "ArrowLeft":
        case "a":
            nextX -= 1;
            break;
        case "ArrowRight":
        case "d":
            nextX += 1;
            break;
        default:
            return;
    }

    // Check boundaries
    if (nextX < 0 || nextX >= MAP_WIDTH || nextY < 0 || nextY >= MAP_HEIGHT) {
        return;
    }

    // Get the type of the target tile
    const targetTileType = map[nextY][nextX];

    // Define impassable tiles (add tile type numbers here)
    const impassableTiles = [
        1, // Wall tile type
        3  // Water tile type
    ];

    // Check if the target tile type is in the impassable list
    if (!impassableTiles.includes(targetTileType)) {
        // It's a valid move, update player's tile coordinates
        playerTileX = nextX;
        playerTileY = nextY;
        moved = true;
    }

    if(moved) {
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

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

    init();
});

async function init() {
    await loadTileImages();
    drawMap();
    positionElements();
    setupInteractions();
}

// Load tile images
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

// Draw the map
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

// Position interactive elements
const TILE_SIZE = 32;

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
    element.style.left = tileX * TILE_SIZE + 'px';
    element.style.top = tileY * TILE_SIZE + 'px';
}

// Set up event listeners
function setupInteractions() {
    // NPC Interactions
    document.getElementById("resume-trainer").addEventListener("click", function() {
        showDialog("Resume Trainer: 'Check out my resume here!'");
    });

    document.getElementById("skills-trainer").addEventListener("click", function() {
        showDialog("Skills Trainer: 'Here are the skills I've mastered!'");
    });

    document.getElementById("experience-trainer").addEventListener("click", function() {
        showDialog("Experience Trainer: 'Explore my professional experience!'");
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
    document.getElementById("close-dialog").addEventListener("click", function() {
        document.getElementById("dialog-box").style.display = "none";
    });

    // Vinyl Shelf Interaction
    document.getElementById('vinyl-shelf').addEventListener('click', () => {
        window.open('https://www.discogs.com/user/calebluh/', '_blank');
    });

    // Bookshelf Interaction
    document.getElementById('bookshelf').addEventListener('click', () => {
        showDialog("Bookshelf: Explore my current reads!");
    });

    // Player Movement
    document.addEventListener("keydown", function(event) {
        movePlayer(event);
    });
}

// Display dialog box
function showDialog(text) {
    dialogText.textContent = text;
    dialogBox.style.display = "block";
}

// Player Movement
let player = {
    x: 200,
    y: 200
};

function movePlayer(event) {
    const trainerElement = document.getElementById("trainer");
    switch (event.key) {
        case "ArrowUp":
        case "w":
            player.y -= TILE_SIZE;
            break;
        case "ArrowDown":
        case "s":
            player.y += TILE_SIZE;
            break;
        case "ArrowLeft":
        case "a":
            player.x -= TILE_SIZE;
            break;
        case "ArrowRight":
        case "d":
            player.x += TILE_SIZE;
            break;
    }
    trainerElement.style.transform = `translate(${player.x}px, ${player.y}px)`;
}

// TILE SIZE and MAP DATA
const MAP_WIDTH = 20;
const MAP_HEIGHT = 15;

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

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

let playerTileX = 3;
let playerTileY = 3;
let joystick = null;
let joystickDirection = null;

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
    setupJoystick();
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
                console.warn(`Tile image for type ${tileType} not loaded or missing.`);
            }
        }
    }
}


function positionElements() {
    positionElement('pc', 4, 1);
    positionElement('bookshelf', 1, 1);
    positionElement('vinyl-shelf', 6, 1);
    positionElement('trainer', playerTileX, playerTileY); // Position player initially

    positionElement('mailbox', 6, 14);

    positionElement('resume-trainer', 3, 10);
    positionElement('skills-trainer', 11, 11);
    positionElement('experience-trainer', 19, 8);
}

function positionElement(elementId, tileX, tileY) {
    const element = document.getElementById(elementId);
    if (!element) {
        console.warn(`Element with ID "${elementId}" not found.`);
        return;
    }
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) {
         console.error(`Game canvas not found.`);
         return;
    }

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
    const resumeTrainer = document.getElementById("resume-trainer");
    if (resumeTrainer) {
        resumeTrainer.addEventListener("click", function() {
            window.open('https://github.com/calebluh/about-me/blob/main/README.md', '_blank');
        });
    }

    const skillsTrainer = document.getElementById("skills-trainer");
    if (skillsTrainer) {
        skillsTrainer.addEventListener("click", function() {
            showDialog("Certifications: Microsoft IT Support Specialist, Autodesk Inventor Certified User, TestOut IT Fundamentals Pro, Excel Purple Belt");
        });
    }

    const experienceTrainer = document.getElementById("experience-trainer");
    if (experienceTrainer) {
        experienceTrainer.addEventListener("click", function() {
            window.open('https://www.linkedin.com/in/calebluh/', '_blank');
        });
    }

    const pcElement = document.getElementById("pc");
    const projectChoiceDialog = document.getElementById('project-choice-dialog');
    const robloxBtn = document.getElementById('roblox-btn');
    const statlabBtn = document.getElementById('statlab-btn');
    const linkedinBtn = document.getElementById('linkedin-btn');
    const closeBtn = document.getElementById('close-btn');

    if (pcElement && projectChoiceDialog && robloxBtn && statlabBtn && linkedinBtn && closeBtn) {
        pcElement.addEventListener("click", function() {
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
    } else {
         console.warn("One or more PC interaction elements are missing.");
    }


    const mailbox = document.getElementById("mailbox");
    const contactFormDialog = document.getElementById("contact-form-dialog");
    const closeContactFormButton = document.getElementById("close-contact-form");

    if (mailbox && contactFormDialog && closeContactFormButton) {
        mailbox.addEventListener("click", function() {
            contactFormDialog.style.display = "block";
        });

        closeContactFormButton.addEventListener("click", function() {
            contactFormDialog.style.display = "none";
        });
     } else {
         console.warn("One or more Mailbox interaction elements are missing.");
     }

    if (closeDialogButton && dialogBox) {
        closeDialogButton.addEventListener("click", function() {
            dialogBox.style.display = "none";
        });
    }

    const vinylShelf = document.getElementById('vinyl-shelf');
     if (vinylShelf) {
        vinylShelf.addEventListener('click', () => {
            window.open('https://www.discogs.com/user/calebluh/collection', '_blank');
        });
     }

    if (bookshelfElement && bookshelfDialog && closeBookshelfButton) {
        bookshelfElement.addEventListener('click', () => {
            bookshelfDialog.style.display = 'block';
        });

        closeBookshelfButton.addEventListener('click', () => {
            bookshelfDialog.style.display = 'none';
        });
    } else {
        console.warn("One or more Bookshelf interaction elements are missing.");
    }

    document.addEventListener("keydown", movePlayer);
}

function showDialog(text) {
    if (dialogText && dialogBox) {
        dialogText.textContent = text;
        dialogBox.style.display = "block";
    } else {
        console.error("Dialog elements (text or box) not found.");
    }
}

function movePlayer(event) {
    let nextX = playerTileX;
    let nextY = playerTileY;
    let moved = false;

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

    if (nextX < 0 || nextX >= MAP_WIDTH || nextY < 0 || nextY >= MAP_HEIGHT) {
        return;
    }

    const targetTileType = map[nextY][nextX];

    // Define impassable tiles
    const impassableTiles = [
        1, // Wall tile type
        3  // Water tile type
    ];

    if (!impassableTiles.includes(targetTileType)) {
        playerTileX = nextX;
        playerTileY = nextY;
        moved = true;
    }

    if (moved) {
        positionElement('trainer', playerTileX, playerTileY);
    }
}

function setupJoystick() {
    if (typeof nipplejs === 'undefined') {
        console.warn("nipplejs library not found. Joystick disabled.");
        const zone = document.getElementById('joystick-zone');
        if (zone) zone.style.display = 'none';
        return;
    }

    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    const zone = document.getElementById('joystick-zone');

    if (isTouchDevice && zone) {
         zone.style.display = 'block';

        const options = {
            zone: zone,
            mode: 'static',
            position: { left: '50%', top: '50%' },
            color: 'rgba(128, 128, 128, 0.7)',
            size: 100,
            threshold: 0.1,
            fadeTime: 250
        };

        joystick = nipplejs.create(options);
        let moveInterval = null;
        const moveDelay = 180;

        joystick.on('start', function (evt, data) {
             if (moveInterval) clearInterval(moveInterval);
             joystickDirection = null;
        });

        joystick.on('move', function (evt, data) {
            if (!data.direction) {
                if (moveInterval) {
                    clearInterval(moveInterval);
                    moveInterval = null;
                }
                joystickDirection = null;
                return;
            }

            const angle = data.angle.degree;
            let newDirection = null;

            if (angle > 45 && angle <= 135) {
                newDirection = 'up';
            } else if (angle > 135 && angle <= 225) {
                newDirection = 'left';
            } else if (angle > 225 && angle <= 315) {
                newDirection = 'down';
            } else {
                newDirection = 'right';
            }

             if (newDirection !== joystickDirection || !moveInterval) {
                joystickDirection = newDirection;
                triggerMovement(joystickDirection);

                if (moveInterval) clearInterval(moveInterval);

                moveInterval = setInterval(() => {
                    if (joystickDirection) {
                         triggerMovement(joystickDirection);
                    } else {
                        clearInterval(moveInterval);
                        moveInterval = null;
                    }
                }, moveDelay);
             }
        });

        joystick.on('end', function (evt, data) {
            joystickDirection = null;
            if (moveInterval) {
                clearInterval(moveInterval);
                moveInterval = null;
            }
        });

    } else if (zone) {
        zone.style.display = 'none';
    }
}

function triggerMovement(direction) {
    if (!direction) return;

    let key;
    switch (direction) {
        case 'up':    key = 'w'; break;
        case 'down':  key = 's'; break;
        case 'left':  key = 'a'; break;
        case 'right': key = 'd'; break;
        default: return;
    }
    movePlayer({ key: key });
}

// 0: grass, 1: wall, 2: path, 3: water, 4: door, 5: floor
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

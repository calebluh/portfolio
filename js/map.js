/*
map.js - Map data, tile definitions, rendering
*/

// -=-=-=- Constants -=-=-=-
const TILE_SIZE = 16;
const VIEWPORT_WIDTH = 20; // visible tiles horizontally
const VIEWPORT_HEIGHT = 15; // visible tiles vertically
const MAP_WIDTH = 60; // total map width in tiles
const MAP_HEIGHT = 45; // total map height in tiles

// --- Use mapData from mapdata.js as the world map ---
const map = mapData.map(row => row.slice());
const tileTypes = { 0: "grass", 1: "wall", 2: "path", 3: "water", 4: "door", 5: "floor", 6: "dock" };
const tiles = {};

// -=-=-=- loadTileImages -=-=-=-
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

// -=-=-=- drawMap -=-=-=-
// Camera variables
let cameraX = 0;
let cameraY = 0;

function updateCamera() {
    // Center camera on player, but clamp to map edges
    cameraX = playerTileX - Math.floor(VIEWPORT_WIDTH / 2);
    cameraY = playerTileY - Math.floor(VIEWPORT_HEIGHT / 2);
    cameraX = Math.max(0, Math.min(MAP_WIDTH - VIEWPORT_WIDTH, cameraX));
    cameraY = Math.max(0, Math.min(MAP_HEIGHT - VIEWPORT_HEIGHT, cameraY));
}

function drawMap() {
    if (!gameCanvas || !ctx) return;
    gameCanvas.width = VIEWPORT_WIDTH * TILE_SIZE;
    gameCanvas.height = VIEWPORT_HEIGHT * TILE_SIZE;
    updateCamera();
    for (let y = 0; y < VIEWPORT_HEIGHT; y++) {
        for (let x = 0; x < VIEWPORT_WIDTH; x++) {
            const mapX = cameraX + x;
            const mapY = cameraY + y;
            const tileType = map[mapY]?.[mapX];
            if (tileType !== undefined && tiles[tileType]) {
                ctx.drawImage(tiles[tileType], x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            } else {
                ctx.fillStyle = 'grey';
                ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            }
        }
    }
}

// -=-=-=- positionElements -=-=-=-
function positionElements() {
    positionElement('pc', 5, 4);
    positionElement('bookshelf', 9, 39);
    positionElement('vinyl-shelf', 13, 39);
    positionElement('player', playerTileX, playerTileY);
    positionElement('mailbox', 13, 32);
    positionElement('mailbox', 8, 10);
    positionElement('mailbox', 38, 11);
    positionElement('mailbox', 43, 35);
    positionElement('about-me-npc', 9, 35);
    positionElement('cert-npc', 34, 21);
    positionElement('resume-npc', 37, 23);
    positionElement('fisher', 21, 16);
    positionElement('fisher-2', 49, 1);
    positionElement('server-object', 7, 4);
    positionElement('server-object-2', 8, 4);
}

// -=-=-=- positionElement -=-=-=-
function positionElement(elementId, tileX, tileY) {
    const element = document.getElementById(elementId);
    if (!element) return;
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) return;
    const canvasRect = canvas.getBoundingClientRect();
    const actualTileWidth = canvasRect.width / VIEWPORT_WIDTH;
    const actualTileHeight = canvasRect.height / VIEWPORT_HEIGHT;
    // Offset by camera position
    const screenX = (tileX - cameraX) * actualTileWidth;
    const screenY = (tileY - cameraY) * actualTileHeight;
    element.style.left = screenX + 'px';
    element.style.top = screenY + 'px';
    element.style.width = actualTileWidth + 'px';
    element.style.height = actualTileHeight + 'px';
}
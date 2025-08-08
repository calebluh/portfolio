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
const tileTypes = {
    // Grass 1-9
    1: "grass1", 2: "grass2", 3: "grass3", 4: "grass4", 5: "grass5", 6: "grass6", 7: "grass7", 8: "grass8", 9: "grass9",
    // Dirt 11-19
    11: "dirt1", 12: "dirt2", 13: "dirt3", 14: "dirt4", 15: "dirt5", 16: "dirt6", 17: "dirt7", 18: "dirt8", 19: "dirt9",
    // Water 21-29
    21: "water1", 22: "water2", 23: "water3", 24: "water4", 25: "water5", 26: "water6", 27: "water7", 28: "water8", 29: "water9",
    // Dock 30
    30: "dock",
    // Walls 31-39
    31: "wall1", 32: "wall2", 33: "wall3", 34: "wall4", 35: "wall5", 36: "wall6", 37: "wall7", 38: "wall8", 39: "wall9",
    // Doors 41-49
    41: "door1", 42: "door2", 43: "door3", 44: "door4", 45: "door5", 46: "door6", 47: "door7", 48: "door8", 49: "door9",
    // Coasts 51-59
    51: "coast1", 52: "coast2", 53: "coast3", 54: "coast4", 55: "coast5", 56: "coast6", 57: "coast7", 58: "coast8", 59: "coast9",
    // Doors 61-69
    61: "door1", 62: "door2", 63: "door3", 64: "door4", 65: "door5", 66: "door6", 67: "door7", 68: "door8", 69: "door9",
    // Floor 71-79
    71: "floor1", 72: "floor2", 73: "floor3", 74: "floor4", 75: "floor5", 76: "floor6", 77: "floor7", 78: "floor8", 79: "floor9",
    // Sprites 100+
    100: "bookshelf", 101: "fisher", 102: "mailbox", 103: "about-me-npc", 104: "cert-npc", 105: "pc", 106: "player", 107: "resume-npc", 108: "server-rack", 109: "server", 110: "server2", 111: "trainer", 112: "vinyl-shelf"
};
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
            // Draw player sprite if this is the player position
            if (mapX === playerTileX && mapY === playerTileY) {
                if (typeof drawPlayerSprite === 'function') {
                    drawPlayerSprite(ctx, x * TILE_SIZE, y * TILE_SIZE);
                } else if (tiles[106]) {
                    ctx.drawImage(tiles[106], x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                }
            } else if (tileType !== undefined && tiles[tileType]) {
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
    positionElement('bookshelf', 12, 38);
    positionElement('vinyl-shelf', 15, 38);
    positionElement('player', playerTileX, playerTileY);
    positionElement('mailbox', 13, 32);
    positionElement('mailbox', 6, 9);
    positionElement('mailbox', 38, 11);
    positionElement('mailbox', 41, 36);
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
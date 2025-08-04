/*
map.js - Map data, tile definitions, rendering
*/

// -=-=-=- Constants -=-=-=-
const TILE_SIZE = 16;
const MAP_WIDTH = 20;
const MAP_HEIGHT = 15;

const map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1],
    [1, 5, 5, 5, 5, 5, 5, 1, 0, 0, 0, 0, 0, 1, 5, 5, 5, 5, 5, 1],
    [1, 5, 5, 5, 5, 5, 5, 1, 0, 0, 0, 0, 0, 1, 5, 5, 5, 5, 5, 1],
    [1, 5, 5, 5, 5, 5, 5, 1, 0, 0, 0, 0, 0, 1, 5, 5, 5, 5, 5, 1],
    [1, 5, 5, 5, 5, 5, 5, 1, 0, 0, 0, 0, 0, 1, 1, 1, 4, 1, 1, 1],
    [1, 5, 5, 5, 5, 5, 5, 1, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0],
    [1, 5, 5, 5, 5, 5, 5, 1, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2],
    [1, 5, 5, 5, 5, 5, 5, 1, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2],
    [1, 5, 5, 5, 5, 5, 5, 1, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2],
    [1, 1, 1, 1, 4, 1, 1, 1, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 3],
    [0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0, 2, 2, 3, 3, 3, 3, 3, 3],
    [0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 2, 2, 2, 3, 3, 3, 3, 3, 3],
    [0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 6, 3, 3, 3, 3, 3],
    [0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3],
    [0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 2, 3, 3, 3, 3, 3, 3, 3, 3],
];
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
function drawMap() {
    if (!gameCanvas || !ctx) return;
    gameCanvas.width = MAP_WIDTH * TILE_SIZE;
    gameCanvas.height = MAP_HEIGHT * TILE_SIZE;
    for (let y = 0; y < MAP_HEIGHT; y++) {
        for (let x = 0; x < MAP_WIDTH; x++) {
            const tileType = map[y]?.[x];
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
    positionElement('pc', 4, 1);
    positionElement('bookshelf', 1, 1);
    positionElement('vinyl-shelf', 6, 1);
    positionElement('player', playerTileX, playerTileY);
    positionElement('mailbox', 6, 14);
    positionElement('resume-trainer', 3, 10);
    positionElement('skills-trainer', 3, 12);
    positionElement('resume-npc', 13, 6);
    positionElement('fisher', 11, 11);
    positionElement('server-object', 15, 1);
    positionElement('server-object-2', 17, 1);
}

// -=-=-=- positionElement -=-=-=-
function positionElement(elementId, tileX, tileY) {
    const element = document.getElementById(elementId);
    if (!element) return;
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) return;
    const canvasRect = canvas.getBoundingClientRect();
    const actualTileWidth = canvasRect.width / MAP_WIDTH;
    const actualTileHeight = canvasRect.height / MAP_HEIGHT;
    element.style.left = tileX * actualTileWidth + 'px';
    element.style.top = tileY * actualTileHeight + 'px';
    element.style.width = actualTileWidth + 'px';
    element.style.height = actualTileHeight + 'px';
}
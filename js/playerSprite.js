// playerSprite.js
// Handles player sprite sheet loading and animation state

const PLAYER_FRAME_WIDTH = 16;
const PLAYER_FRAME_HEIGHT = 16;
const PLAYER_FRAMES_PER_ROW = 3;
const PLAYER_DIRECTIONS = ['down', 'right', 'left', 'up'];

let playerSprites = {};
let playerAnimFrame = 0;
let playerAnimDirection = 'down';
let playerAnimTick = 0;
const PLAYER_ANIM_TICK_MAX = 8; // Lower = faster animation

function loadPlayerSpriteSheet() {
    // Loads all player_[direction][number].png images
    return new Promise((resolve) => {
        let loaded = 0;
        let total = PLAYER_DIRECTIONS.length * PLAYER_FRAMES_PER_ROW;
        playerSprites = {};
        PLAYER_DIRECTIONS.forEach(dir => {
            playerSprites[dir] = [];
            for (let i = 1; i <= PLAYER_FRAMES_PER_ROW; i++) {
                const img = new Image();
                img.src = `assets/sprites/player_${dir}${i}.png`;
                img.onload = () => {
                    loaded++;
                    if (loaded === total) resolve();
                };
                img.onerror = () => {
                    console.error(`Failed to load: assets/sprites/player_${dir}${i}.png`);
                    loaded++;
                    if (loaded === total) resolve();
                };
                playerSprites[dir].push(img);
            }
        });
    });
}

function setPlayerAnimDirection(direction) {
    if (PLAYER_DIRECTIONS.includes(direction)) {
        playerAnimDirection = direction;
    }
}

function advancePlayerAnimFrame(moving) {
    if (moving) {
        playerAnimTick++;
        if (playerAnimTick >= PLAYER_ANIM_TICK_MAX) {
            playerAnimTick = 0;
            playerAnimFrame = (playerAnimFrame + 1) % PLAYER_FRAMES_PER_ROW;
        }
    } else {
        playerAnimFrame = 1; // Idle frame (middle)
        playerAnimTick = 0;
    }
}

function drawPlayerSprite(ctx, screenX, screenY) {
    if (!playerSprites[playerAnimDirection]) return;
    const img = playerSprites[playerAnimDirection][playerAnimFrame];
    if (!img) return;
    ctx.drawImage(
        img,
        screenX, screenY, PLAYER_FRAME_WIDTH, PLAYER_FRAME_HEIGHT
    );
}

window.loadPlayerSpriteSheet = loadPlayerSpriteSheet;
window.setPlayerAnimDirection = setPlayerAnimDirection;
window.advancePlayerAnimFrame = advancePlayerAnimFrame;
window.drawPlayerSprite = drawPlayerSprite;

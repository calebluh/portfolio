/*
joystick.js - Joystick setup and movement logic
*/ 

// -=-=-=- Joystick DOM Elements -=-=-=-
let joystickToggleCheckbox = null;
let joystickZone = null;

// -=-=-=- setupJoystick -=-=-=-
function setupJoystick() {
    // Ensure DOM elements are available
    if (!joystickToggleCheckbox) {
        joystickToggleCheckbox = document.getElementById("joystick-toggle-checkbox");
    }
    if (!joystickZone) {
        joystickZone = document.getElementById("joystick-zone");
    }
    console.log("Attempting joystick setup...");
    const joystickEnabled = joystickToggleCheckbox ? joystickToggleCheckbox.checked : true;

    if (!joystickEnabled) {
        if (joystickZone) {
            joystickZone.style.display = 'none';
            joystickZone.innerHTML = '';
        }
        if (joystick) {
            joystick.destroy();
            joystick = null;
        }
        hideJoystick();
        return;
    }

    if (typeof nipplejs === 'undefined') {
         console.warn("nipplejs library not found.");
         hideJoystick();
         return;
    }
    if (joystickZone) {
        joystickZone.style.display = 'block';
        if (!joystick) {
            const options = { zone: joystickZone, mode: 'static', position: { left: '50%', top: '50%' }, color: 'rgba(128, 128, 128, 0.7)', size: 100, threshold: 0.3, fadeTime: 250 };
            console.log("Creating joystick instance...");
            joystick = nipplejs.create(options);
            console.log("Joystick object:", joystick);
            setupJoystickEvents();
        }
        showJoystickIfNeeded();
    } else {
        hideJoystick();
    }

// Joystick toggle event listener setup
function setupJoystickToggleListener() {
    if (!joystickToggleCheckbox) {
        joystickToggleCheckbox = document.getElementById("joystick-toggle-checkbox");
    }
    if (joystickToggleCheckbox) {
        // Remove any previous listeners to avoid stacking
        joystickToggleCheckbox.onchange = null;
        joystickToggleCheckbox.addEventListener("change", setupJoystick, { once: false });
    }
}

// Only run this ONCE on page load
    if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
        setupJoystickToggleListener();
        setupJoystick();
        });
    } else {
        setupJoystickToggleListener();
        setupJoystick();
    }
}

// -=-=-=- setupJoystickEvents -=-=-=-
function setupJoystickEvents() {
    if (!joystick) return;
    let moveInterval = null;
    const moveDelay = 180; 
    joystick.on('start', () => {
        console.log("Joystick Start");
        if (moveInterval) clearInterval(moveInterval);
        joystickDirection = null;
    });
    joystick.on('move', (evt, data) => {
        if (!data.direction) {
            console.log("Joystick Move: No direction data");
            joystickDirection = null;
            if (moveInterval) { clearInterval(moveInterval); moveInterval = null; }
            return;
        }
        const angle = data.angle.degree;
        let newDirection = null;
        // Determine direction based on angle
        if (angle > 45 && angle <= 135) newDirection = 'up';
        else if (angle > 135 && angle <= 225) newDirection = 'left';
        else if (angle > 225 && angle <= 315) newDirection = 'down';
        else newDirection = 'right'; // 315-360 and 0-45

        console.log(`Joystick Raw Move: Angle=${angle?.toFixed(1)}, Calc Dir=${newDirection}, Current Stored Dir=${joystickDirection}`);

        if (newDirection !== joystickDirection || !moveInterval) {
            console.log(`   Direction Changed/Interval Start: New=${newDirection}, Old=${joystickDirection}`);
            if (getIsFishingActive() || isAnyDialogOpen()) return;
            joystickDirection = newDirection;
            triggerMovement(joystickDirection); // Trigger immediate movement

            // Clear any existing interval and start a new one
            if (moveInterval) clearInterval(moveInterval);
            moveInterval = setInterval(() => {
                console.log(`   Interval Tick: Stored Dir=${joystickDirection}`);
                // Use the stored direction for continuous movement
                if (joystickDirection) {
                    triggerMovement(joystickDirection);
                } else {
                    console.log("   Interval Cleared (No Direction)");
                    clearInterval(moveInterval);
                    moveInterval = null;
                }
            }, moveDelay);
        }
    });
    joystick.on('end', () => {
        console.log("Joystick End");
        joystickDirection = null;
        if (moveInterval) {
            console.log("   Clearing Interval on End");
            clearInterval(moveInterval);
            moveInterval = null;
        }
    });
}

// -=-=-=- triggerMovement -=-=-=-
function triggerMovement(direction) {
    console.log(`  triggerMovement called with direction: ${direction}`);
    if (getIsFishingActive() || isAnyDialogOpen()) {
        console.log(`  triggerMovement blocked: Fishing=${getIsFishingActive()}, DialogOpen=${isAnyDialogOpen()}`);
        return;
    }
    if (!direction) {
        console.log("  triggerMovement ignored: No direction provided.");
        return;
    }
    let key;
    switch (direction) {
        case 'up': key = 'w'; break;
        case 'down': key = 's'; break;
        case 'left': key = 'a'; break;
        case 'right': key = 'd'; break;
        default:
            console.log(`  triggerMovement ignored: Unknown direction '${direction}'.`);
            return;
    }
    console.log(`   Mapping direction '${direction}' to key '${key}'`);
    movePlayer({ key: key });
}

// -=-=-=- movePlayer -=-=-=-
function movePlayer(event) {
    console.log(` movePlayer called with key: ${event.key}`);

    if (getIsFishingActive() || isAnyDialogOpen()) {
        console.log(` movePlayer blocked: Fishing=${getIsFishingActive()}, DialogOpen=${isAnyDialogOpen()}`);
        return;
    }
    let nextX = playerTileX, nextY = playerTileY, moved = false;
    switch (event.key) {
        case "ArrowUp": case "w": nextY -= 1; break;
        case "ArrowDown": case "s": nextY += 1; break;
        case "ArrowLeft": case "a": nextX -= 1; break;
        case "ArrowRight": case "d": nextX += 1; break;
        default: return;
    }

    console.log(`  Attempting move from (${playerTileX},${playerTileY}) to (${nextX},${nextY})`);

    // Check boundaries
    if (nextX < 0 || nextX >= MAP_WIDTH || nextY < 0 || nextY >= MAP_HEIGHT) {
        console.log(`  Move blocked: Out of map bounds.`);
        return;
    }
    const targetTileType = map[nextY]?.[nextX];
    const impassableTiles = [ 1, 3 ]; // Wall=1, Water=3

    console.log(`   Target tile type at (${nextX},${nextY}): ${targetTileType}`);

    if (targetTileType !== undefined && !impassableTiles.includes(targetTileType)) {
        console.log(`    Move allowed.`);
        playerTileX = nextX;
        playerTileY = nextY;
        moved = true;
    } else {
        console.log(`    Move blocked: Impassable tile type (${targetTileType}).`);
    }

    if (moved) {
        drawMap(); // Redraw map so camera follows player
        positionElements(); // Update all elements' positions
        checkForWaterProximity(); // Check if near water for fishing prompt
    }
}

function getIsFishingActive() {
    return typeof window.isFishingActive !== 'undefined' ? window.isFishingActive : false;
}

window.movePlayer = movePlayer;
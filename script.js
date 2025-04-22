// Start Screen Transition
document.getElementById("start-btn").addEventListener("click", function() {
    document.getElementById("start-screen").style.display = "none";
    document.getElementById("game-map").style.display = "block";
});

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
document.getElementById("pc").addEventListener("click", function() {
    const choice = confirm("Which project would you like to view?\n\nOK: Lacrosse Legends (Roblox)\nCancel: Stat Lab");

    if (choice) {
        // Redirect to Lacrosse Legends Roblox page
        window.open("https://www.roblox.com/games/<YOUR_GAME_ID>/Lacrosse-Legends", "_blank");
    } else {
        // Redirect to Stat Lab website
        window.open("https://your-stat-lab-website-url.com", "_blank");
    }
});

// Mailbox Interaction (Contact Form)
document.getElementById("mailbox").addEventListener("click", function() {
    alert("Opening Mailbox... Drop me a message!");
    // Contact form logic
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
            player.x += 10;
            break;
    }
    trainerElement.style.transform = `translate(${player.x}px, ${player.y}px)`;
});

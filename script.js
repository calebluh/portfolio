// Start Screen Transition
document.getElementById("start-btn").addEventListener("click", function() {
    document.getElementById("start-screen").style.display = "none";
    document.getElementById("game-container").style.display = "block";
});

// Trainer Interaction
document.getElementById("next-btn").addEventListener("click", function() {
    document.getElementById("dialog").textContent = "Trainer: 'Take a look at my projects!'";
});

// Dialog Box
document.getElementById("trainer").addEventListener("click", function() {
    document.getElementById("dialog-box").style.display = "block";
    document.getElementById("dialog-text").textContent = "Trainer: 'Explore my coding adventures!'";
});

document.getElementById("close-dialog").addEventListener("click", function() {
    document.getElementById("dialog-box").style.display = "none";
});

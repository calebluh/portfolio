// -=-=-=- Handling Trainer Dialouge -=-=-=-
document.getElementById("next-btn").addEventListener("click", function() {
    document.getElementById("dialog").textContent = "Trainer: 'Here's my Pokédex of projects!'";
});

// -=-=-=- Transitioning From Start Screen -=-=-=-
document.getElementById("start-btn").addEventListener("click", function() {
    document.getElementById("start-screen").style.display = "none";
    document.getElementById("game-container").style.display = "block";
});

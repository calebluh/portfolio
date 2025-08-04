/*
interactions.js - DOM event listeners, dialogs, click logic
*/

// -=-=-=- setupInteractions -=-=-=-
function setupInteractions() {
    document.removeEventListener("keydown", movePlayer);
    document.addEventListener("keydown", movePlayer);

    const setupListener = (id, action) => {
        const element = document.getElementById(id);
        if (element) element.addEventListener("click", action);
    };

    setupListener("resume-trainer", () => window.open('https://github.com/calebluh/about-me/blob/main/README.md', '_blank'));
    setupListener("skills-trainer", () => showDialog("Certifications: Practical Introduction to Quantum-Safe Cryptography, Variational Algorithm Design, Basics of Quantum Information, Quantum Business Foundations, JavaScript Fundamentals, Microsoft IT Support Specialist, TestOut IT Fundamentals Pro, Excel Purple Belt, Autodesk Inventor Certified User"));
    setupListener("fisher", () => showDialog("To fish, proceed to the dock. The calmer the fish the better the score!"));
    setupListener("vinyl-shelf", () => window.open('https://www.discogs.com/user/calebluh/collection', '_blank'));
    
    const serverObject = document.getElementById('server-object');
    if (serverObject && itExperienceDialog) {
        serverObject.addEventListener('click', () => {
            if (itExperienceDialog) itExperienceDialog.style.display = 'block';
            hideJoystick();
        });
    }
    if (closeItExperienceButton && itExperienceDialog) {
        closeItExperienceButton.addEventListener('click', () => {
            if (itExperienceDialog) itExperienceDialog.style.display = 'none';
            showJoystickIfNeeded();
        });
    }

    const serverObject2 = document.getElementById('server-object-2');
    if (serverObject2 && internExperienceDialog) {
        serverObject2.addEventListener('click', () => {
            if (internExperienceDialog) internExperienceDialog.style.display = 'block';
            hideJoystick();
        });
    }
    if (closeInternExperienceButton && internExperienceDialog) {
        closeInternExperienceButton.addEventListener('click', () => {
            if (internExperienceDialog) internExperienceDialog.style.display = 'none';
            showJoystickIfNeeded();
        });
    }

    const resumeNpc = document.getElementById('resume-npc');
    if (resumeNpc) {
        resumeNpc.addEventListener('click', () => {
        window.open('assets/resume.pdf', '_blank');
        });
    }

    if (pcElement && projectChoiceDialog) {
        const closeBtn = document.getElementById('close-btn');
        setupListener("pc", () => { if(projectChoiceDialog) projectChoiceDialog.style.display = 'block'; hideJoystick(); });
        setupListener("roblox-btn", () => { window.open("https://www.roblox.com/games/113892368479986/Lacrosse-Legends", "_blank"); if(projectChoiceDialog) projectChoiceDialog.style.display = 'none'; showJoystickIfNeeded(); });
        setupListener("statlab-btn", () => { window.open("https://calebluh.github.io/stat-lab", "_blank"); if(projectChoiceDialog) projectChoiceDialog.style.display = 'none'; showJoystickIfNeeded(); });
        setupListener("linkedin-btn", () => { window.open("https://www.linkedin.com/in/calebluh/", "_blank"); if(projectChoiceDialog) projectChoiceDialog.style.display = 'none'; showJoystickIfNeeded(); });
        if (closeBtn) setupListener("close-btn", () => { if(projectChoiceDialog) projectChoiceDialog.style.display = 'none'; showJoystickIfNeeded(); });
    }
    if (mailbox && contactFormDialog) {
        const closeContactFormButton = document.getElementById("close-contact-form");
        setupListener("mailbox", () => { if(contactFormDialog) contactFormDialog.style.display = "block"; hideJoystick(); });
        if (closeContactFormButton) setupListener("close-contact-form", () => { if(contactFormDialog) contactFormDialog.style.display = "none"; showJoystickIfNeeded(); });
    }
    if (closeDialogButton && dialogBox) {
        closeDialogButton.addEventListener("click", () => {
            if (dialogBox) dialogBox.style.display = "none";
            if (delay) {
                clearInterval(delay);
                delay = null;
            } showJoystickIfNeeded();
            checkForWaterProximity();
        });
    }
    if (bookshelfElement && bookshelfDialog) {
        const closeBookshelfButton = document.getElementById('close-bookshelf-dialog');
        setupListener("bookshelf", () => { if(bookshelfDialog) bookshelfDialog.style.display = 'block'; hideJoystick(); });
        if (closeBookshelfButton) setupListener("close-bookshelf-dialog", () => { if(bookshelfDialog) bookshelfDialog.style.display = 'none'; showJoystickIfNeeded(); });
    }

    if (startFishingButton) setupListener("start-fishing-btn", startFishing);
    if (cancelFishingButton) setupListener("cancel-fishing-btn", () => { hideFishingPrompt(); showJoystickIfNeeded(); });
    if (stopFishingButton) setupListener("stop-fishing-btn", () => stopFishing('stopped'));
    if (submitInitialsButton) setupListener("submit-initials-btn", submitScore);
    if (closeScoreboardButton) setupListener("close-scoreboard-btn", () => { if(scoreboardDialog) scoreboardDialog.style.display = 'none'; showJoystickIfNeeded(); });
    if (toggleScoreboardButton) toggleScoreboardButton.addEventListener('click', async () => {
        console.log("Dialog check for scores btn:", isAnyDialogOpen()); // Keep debug log
        if (scoreboardDialog?.style.display === 'block') {
            scoreboardDialog.style.display = 'none'; showJoystickIfNeeded();
        } else {
            await loadHighScores();
            if (scoreboardDialog) scoreboardDialog.style.display = 'block'; hideJoystick();
            if (initialsPrompt) initialsPrompt.style.display = 'none';
            if (fishingGameDisplay) fishingGameDisplay.style.display = 'none';
            if (fishingPrompt) fishingPrompt.style.display = 'none';
            if (dialogBox) dialogBox.style.display = 'none';
            if (projectChoiceDialog) projectChoiceDialog.style.display = 'none';
            if (contactFormDialog) contactFormDialog.style.display = 'none';
            if (bookshelfDialog) bookshelfDialog.style.display = 'none';
        }
    });

    if (reelButton) {
        reelButton.addEventListener('mousedown', () => { if (fishingState === 'cast_ready') castLine(); else if (fishingState === 'reeling') isReeling = true; });
        reelButton.addEventListener('mouseup', () => { if (fishingState === 'reeling') isReeling = false; });
        reelButton.addEventListener('mouseleave', () => { if (fishingState === 'reeling') isReeling = false; });
        reelButton.addEventListener('touchstart', (e) => { e.preventDefault(); if (fishingState === 'cast_ready') castLine(); else if (fishingState === 'reeling') isReeling = true; }, { passive: false });
        reelButton.addEventListener('touchend', (e) => { e.preventDefault(); if (fishingState === 'reeling') isReeling = false; });
    }
    document.body.addEventListener('touchend', () => { if (isReeling) isReeling = false; });
}

// -=-=-=- showDialog -=-=-=-
function showDialog(text) {
    if (delay) {
        clearInterval(delay);
        delay = null;
    }

    if (dialogText && dialogBox) {
        dialogBox.style.top = '';
        dialogBox.style.left = '';

        dialogBox.style.display = "block";

        textDelay(dialogText, text, 50); 

        hideJoystick(); 
    } else {
        console.error("Dialog elements (dialogText or dialogBox) not found for showDialog.");
    }
}

// -=-=-=- textDelay -=-=-=-
function textDelay(element, text, speed = 50) { 
    if (delay) {
        clearInterval(delay);
    }

    element.textContent = '';
    let i = 0;
    element.style.minHeight = '1.2em';

    delay = setInterval(() => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(delay);
            delay = null; 
        }
    }, speed);
}

// -=-=-=- isAnyDialogOpen -=-=-=-
function isAnyDialogOpen() {
    return dialogBox?.style.display === 'block' ||
           fishingPrompt?.style.display === 'block' ||
           fishingGameDisplay?.style.display === 'block' ||
           initialsPrompt?.style.display === 'block' ||
           scoreboardDialog?.style.display === 'block' ||
           projectChoiceDialog?.style.display === 'block' ||
           contactFormDialog?.style.display === 'block' ||
           bookshelfDialog?.style.display === 'block';
}
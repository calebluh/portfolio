const hideJoystick = window.hideJoystick || function(){};
const showJoystickIfNeeded = window.showJoystickIfNeeded || function(){};
const dialogBox = document.getElementById('dialog-box');
const dialogText = document.getElementById("dialog-text");
const closeDialogButton = document.getElementById("close-dialog");
const bookshelfDialog = document.getElementById('bookshelf-dialog');
const closeBookshelfButton = document.getElementById('close-bookshelf-dialog');
const bookshelfElement = document.getElementById('bookshelf');
const projectChoiceDialog = document.getElementById('project-choice-dialog');
const itExperienceDialog = document.getElementById('it-experience-dialog');
const internExperienceDialog = document.getElementById('intern-experience-dialog');
const contactFormDialog = document.getElementById('contact-form-dialog');
const closeItExperienceButton = document.getElementById('close-it-experience-dialog');
const closeInternExperienceButton = document.getElementById('close-intern-experience-dialog');
const pcElement = document.getElementById('pc');
const mailbox = document.getElementById('mailbox');

/*
interactions.js - DOM event listeners, dialogs, click logic
*/

// -=-=-=- isAnyDialogOpen -=-=-=-
function isAnyDialogOpen() {
    return dialogBox?.style.display === 'block' ||
           initialsPrompt?.style.display === 'block' ||
           scoreboardDialog?.style.display === 'block' ||
           projectChoiceDialog?.style.display === 'block' ||
           contactFormDialog?.style.display === 'block' ||
           bookshelfDialog?.style.display === 'block' || 
           itExperienceDialog?.style.display === 'block' ||
           internExperienceDialog?.style.display === 'block';
}

function setupInteractions() {
    document.removeEventListener("keydown", window.movePlayer);
    document.addEventListener("keydown", window.movePlayer);

    const setupListener = (id, action) => {
        const element = document.getElementById(id);
        if (element) element.addEventListener("click", action);
    };


    [
        { id: "about-me-npc", action: () => window.open('https://github.com/calebluh/about-me/blob/main/README.md', '_blank') },
        { id: "cert-npc", action: () => {
            showDialog(`
                <div style="max-height:62vh;overflow-y:auto;box-sizing:border-box;padding:0 8px 0 0;scrollbar-gutter:stable;">
                  <h2 style="margin-bottom:10px;">My Certifications</h2>
                  <div style="display:flex;justify-content:center;margin-bottom:18px;">
                    <div class="cert-div" data-locale="en_US" data-size="large" data-theme="light" data-type="HORIZONTAL" data-vanity="calebluh" data-version="v1"></div>
                  </div>
                  <div style="display:flex;flex-wrap:wrap;gap:12px;justify-content:center;max-width:480px;margin:0 auto;">
                    <a href="https://www.credly.com/badges/fb980ed4-c569-46bb-b843-cbc3c7f6a242/linked_in_profile" target="_blank" class="cert-card" style="text-decoration:none;width:210px;">
                      <div style="background:#fff;border:1.5px solid #b3b3b3;border-radius:8px;padding:12px 16px;width:100%;height:80px;display:flex;align-items:center;gap:10px;box-shadow:0 2px 8px #0001;box-sizing:border-box;">
                        <img src="../assets/logos/IBM.jfif" alt="Quantum-Safe" style="width:38px;height:38px;border-radius:6px;flex-shrink:0;">
                        <div style="flex:1;"><b>Quantum-Safe Cryptography</b><br><span style="font-size:0.9em;color:#444;">Credly</span></div>
                      </div>
                    </a>
                    <a href="https://www.linkedin.com/learning/certificates/c9474d3b75c38aff7b6702ce5d6d3ca157d85ae69e3473d17b30e7a0853da7f4" target="_blank" class="cert-card" style="text-decoration:none;width:210px;">
                      <div style="background:#fff;border:1.5px solid #b3b3b3;border-radius:8px;padding:12px 16px;width:100%;height:80px;display:flex;align-items:center;gap:10px;box-shadow:0 2px 8px #0001;box-sizing:border-box;">
                        <img src="../assets/logos/IBM.jfif" alt="LinkedIn Learning" style="width:38px;height:38px;border-radius:6px;flex-shrink:0;">
                        <div style="flex:1;"><b>Variational Algorithm Design</b><br><span style="font-size:0.9em;color:#444;">Credly</span></div>
                      </div>
                    </a>
                    <a href="https://www.credly.com/badges/f01b3027-f88a-4258-98db-eef436d64ca4/linked_in_profile" target="_blank" class="cert-card" style="text-decoration:none;width:210px;">
                      <div style="background:#fff;border:1.5px solid #b3b3b3;border-radius:8px;padding:12px 16px;width:100%;height:80px;display:flex;align-items:center;gap:10px;box-shadow:0 2px 8px #0001;box-sizing:border-box;">
                        <img src="../assets/logos/IBM.jfif" alt="Quantum Info" style="width:38px;height:38px;border-radius:6px;flex-shrink:0;">
                        <div style="flex:1;"><b>Basics of Quantum Information</b><br><span style="font-size:0.9em;color:#444;">Credly</span></div>
                      </div>
                    </a>
                    <a href="https://www.credly.com/badges/8cec31a6-9f6d-401d-865e-65ec05ecd514/linked_in_profile" target="_blank" class="cert-card" style="text-decoration:none;width:210px;">
                      <div style="background:#fff;border:1.5px solid #b3b3b3;border-radius:8px;padding:12px 16px;width:100%;height:80px;display:flex;align-items:center;gap:10px;box-shadow:0 2px 8px #0001;box-sizing:border-box;">
                        <img src="../assets/logos/IBM.jfif" alt="Quantum Business" style="width:38px;height:38px;border-radius:6px;flex-shrink:0;">
                        <div style="flex:1;"><b>Quantum Business Foundations</b><br><span style="font-size:0.9em;color:#444;">Credly</span></div>
                      </div>
                    </a>
                    <a href="https://www.credly.com/badges/7f6a61a0-dbe5-48d1-a018-0f78dd2a3681/linked_in_profile" target="_blank" class="cert-card" style="text-decoration:none;width:210px;">
                      <div style="background:#fff;border:1.5px solid #b3b3b3;border-radius:8px;padding:12px 16px;width:100%;height:80px;display:flex;align-items:center;gap:10px;box-shadow:0 2px 8px #0001;box-sizing:border-box;">
                        <img src="../assets/logos/mozilla.jfif" alt="JS Fundamentals" style="width:38px;height:38px;border-radius:6px;flex-shrink:0;">
                        <div style="flex:1;"><b>JavaScript Fundamentals</b><br><span style="font-size:0.9em;color:#444;">Credly</span></div>
                      </div>
                    </a>
                    <a href="https://certification.testout.com/verifycert/6-1C6-VL7WXP" target="_blank" class="cert-card" style="text-decoration:none;width:210px;">
                      <div style="background:#fff;border:1.5px solid #b3b3b3;border-radius:8px;padding:12px 16px;width:100%;height:80px;display:flex;align-items:center;gap:10px;box-shadow:0 2px 8px #0001;box-sizing:border-box;">
                        <img src="../assets/logos/TestOut.jfif" alt="TestOut" style="width:38px;height:38px;border-radius:6px;background:#eee;flex-shrink:0;">
                        <div style="flex:1;"><b>IT Fundamentals Pro</b><br><span style="font-size:0.9em;color:#444;">TestOut</span></div>
                      </div>
                    </a>
                    <a href="https://certificates.simnetonline.com/eea8917e-e750-4625-b5dc-8a47a814f47c#acc.J5Koeawi" target="_blank" class="cert-card" style="text-decoration:none;width:210px;">
                      <div style="background:#fff;border:1.5px solid #b3b3b3;border-radius:8px;padding:12px 16px;width:100%;height:80px;display:flex;align-items:center;gap:10px;box-shadow:0 2px 8px #0001;box-sizing:border-box;">
                        <img src="../assets/logos/McGrawHill.jfif" alt="SimNet" style="width:38px;height:38px;border-radius:6px;background:#eee;flex-shrink:0;">
                        <div style="flex:1;"><b>Excel Purple Belt</b><br><span style="font-size:0.9em;color:#444;">SimNet</span></div>
                      </div>
                    </a>
                    <a href="https://www.credly.com/badges/59e4f265-c8db-44a4-96cb-aaa35528406d?source=linked_in_profile" target="_blank" class="cert-card" style="text-decoration:none;width:210px;">
                      <div style="background:#fff;border:1.5px solid #b3b3b3;border-radius:8px;padding:12px 16px;width:100%;height:80px;display:flex;align-items:center;gap:10px;box-shadow:0 2px 8px #0001;box-sizing:border-box;">
                        <img src="../assets/logos/Autodesk.jfif" alt="Inventor" style="width:38px;height:38px;border-radius:6px;flex-shrink:0;">
                        <div style="flex:1;"><b>Autodesk Inventor Certified User</b><br><span style="font-size:0.9em;color:#444;">Credly</span></div>
                      </div>
                    </a>
                  </div>
                  <script type="text/javascript" src="https://platform.linkedin.com/badges/js/profile.js" async defer></script>
                </div>
            `, true);
        } },
        { id: "fisher", action: () => showDialog("To fish, proceed to the dock. The calmer the fish the better the score!") },
        { id: "fisher-2", action: () => showDialog("To fish, proceed to the dock. The calmer the fish the better the score!") },
        { id: "vinyl-shelf", action: () => window.open('https://www.discogs.com/user/calebluh/collection', '_blank') },
        { id: "resume-npc", action: () => { 
            const resumeDialog = document.getElementById('resume-dialog');
            if (resumeDialog) resumeDialog.style.display = 'block';
            hideJoystick();
        } },
        { id: "bookshelf", action: () => { if(bookshelfDialog) bookshelfDialog.style.display = 'block'; hideJoystick(); } },
        { id: "mailbox", action: () => { if(contactFormDialog) contactFormDialog.style.display = "block"; hideJoystick(); } },
        { id: "pc", action: () => { if(projectChoiceDialog) projectChoiceDialog.style.display = 'block'; hideJoystick(); } },
        { id: "server-object", action: () => { if(itExperienceDialog) itExperienceDialog.style.display = 'block'; hideJoystick(); } },
        { id: "server-object-2", action: () => { if(internExperienceDialog) internExperienceDialog.style.display = 'block'; hideJoystick(); } }
    ].forEach(({id, action}) => setupListener(id, action));

    // Resume dialog close button
    const resumeDialog = document.getElementById('resume-dialog');
    const closeResumeBtn = document.getElementById('close-resume-dialog');
    if (closeResumeBtn && resumeDialog) {
        closeResumeBtn.addEventListener('click', function() {
            resumeDialog.style.display = 'none';
            showJoystickIfNeeded();
        });
    }
// Expose setupInteractions globally for main.js
window.setupInteractions = setupInteractions;

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
function showDialog(text, isHtml) {
    if (delay) {
        clearInterval(delay);
        delay = null;
    }

    if (dialogText && dialogBox) {
        dialogBox.style.top = '';
        dialogBox.style.left = '';
        dialogBox.style.display = "block";
        if (isHtml) {
            dialogText.innerHTML = text;
        } else {
            textDelay(dialogText, text, 50);
        }
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

// Export setupInteractions to global scope for main.js
window.setupInteractions = setupInteractions;
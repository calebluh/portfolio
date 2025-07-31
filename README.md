# Caleb Luh's Interactive 2D Portfolio Game

Welcome to my interactive 2D portfolio game! This project showcases my web development skills and personal projects in a fun, retro game-style format. Built with vanilla HTML, CSS, and JavaScript, it uses the HTML Canvas API for map rendering, DOM manipulation for interactive elements, Firebase for a persistent scoreboard, and nipple.js for optional mobile controls.

**Live Demo:** [https://calebluh.github.io/portfolio/](https://calebluh.github.io/portfolio/)

---

## Features

* **Interactive Map:** Explore a colorful 2D world rendered on HTML Canvas, now with a brand new server room!
* **Character Movement:** Control your character using keyboard (WASD/Arrows) or an optional on-screen joystick (touch devices).
* **Joystick Toggle:** Enable or disable the on-screen joystick from the start screen.
* **Collision Detection:** Prevents walking through walls and water.
* **Interactive Objects & NPCs:** Click on objects and characters to trigger actions:
    * View Projects (PC)
    * Access Resume, Skills, and Experience Info (Trainers)
    * Open Contact Form (Mailbox)
    * Explore Reading List (Bookshelf)
    * Visit Discogs Collection (Vinyl Shelf)
    * **NEW:** Discover two server racks—one highlights my Active Directory experience, the other details my IT Internship with the City of Oconomowoc.
* **New Server Room:** Venture into the new room to learn about my hands-on IT internship, including technical support, network configuration, VPNs, and more.
* **Fishing Minigame:** Cast a line near water, reel in fish, and manage line tension.
* **Firebase Scoreboard:** Compete for high scores in the fishing minigame, saved persistently with Firebase Firestore.
* **Responsive Design:** Adapts to different screen sizes.
* **Pop-up Dialogs:** Displays information, forms, and choices without leaving the page.
* **Background Music:** Enjoy a dynamic lofi 8-bit soundtrack.

---

## Next Update
* **Achievements:** The next update will include achievements for certain scores on the fishing minigame, interacting with all NPCs, sending me mail, and for some other secrets! Stay tuned!

---

## How to Play

1. **Press Start:** Click the "Press Start" button on the initial screen.
2. **(Optional) Toggle Joystick & Music:** Decide if you want the on-screen joystick and background music enabled using the checkboxes on the start screen.
3. **Move:**
    * **Desktop:** Use `W`, `A`, `S`, `D` or the Arrow Keys.
    * **Mobile/Touch (if enabled):** Use the virtual joystick that appears at the bottom.
4. **Interact:** Click or tap on objects (PC, bookshelf, mailbox, vinyl shelf, servers) and other characters (trainers) to see different parts of the portfolio or get information.
5. **Explore the Server Room:** Check out the new server racks—one shares my Active Directory experience, the other details my IT Internship.
6. **Fish:** Walk near a body of water. If a prompt appears, click "Cast Line" to start the fishing minigame. Use the "Reel" button to catch fish while managing tension.
7. **Unlock Music & Achievements:** Special music tracks and achievement pop-ups are unlocked by high scores, exploring, and interacting with key objects.
8. **View Scores:** Click the "Scores" button in the top-right corner to view the fishing high scores.

---

## Technologies Used

* HTML5
* CSS3 (including Flexbox, Absolute/Fixed Positioning, Media Queries)
* JavaScript (ES6+)
* HTML Canvas API (for map rendering)
* [Firebase Firestore](https://firebase.google.com/docs/firestore) (for scoreboard)
* [nipple.js](https://github.com/yoannmoinet/nipplejs) (for mobile joystick)
* [Formspree](https://formspree.io/) (for contact form backend)
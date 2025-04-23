# Caleb Luh's Interactive 2D Portfolio Game

Welcome to my interactive 2D portfolio game! This project showcases my web development skills and personal projects in a fun, retro game-style format. Built with vanilla HTML, CSS, and JavaScript, it uses the HTML Canvas API for map rendering, DOM manipulation for interactive elements, Firebase for a persistent scoreboard, and nipple.js for optional mobile controls.

**Live Demo:** [https://calebluh.github.io/portfolio/](https://calebluh.github.io/portfolio/)

## Features

* **Interactive Map:** Explore a 2D world rendered on HTML Canvas.
* **Character Movement:** Control your character using keyboard (WASD/Arrows) or an optional on-screen joystick (touch devices).
* **Joystick Toggle:** Enable or disable the on-screen joystick from the start screen.
* **Collision Detection:** Prevents walking through walls and water.
* **Interactive Objects & NPCs:** Click on objects and characters to trigger actions:
    * View Projects (PC)
    * Access Resume, Skills, Experience Info (Trainers)
    * Open Contact Form (Mailbox)
    * Explore Reading List (Bookshelf)
    * Visit Discogs Collection (Vinyl Shelf)
* **Fishing Minigame:** Cast a line near water, reel in fish, and manage line tension.
* **Firebase Scoreboard:** Compete for high scores in the fishing minigame, saved persistently with Firebase Firestore.
* **Responsive Design:** Adapts to different screen sizes.
* **Pop-up Dialogs:** Displays information, forms, and choices without leaving the page.

## How to Play

1.  **Press Start:** Click the "Press Start" button on the initial screen.
2.  **(Optional) Toggle Joystick:** Decide if you want the on-screen joystick enabled (primarily for touch devices) using the checkbox on the start screen.
3.  **Move:**
    * **Desktop:** Use `W`, `A`, `S`, `D` or the Arrow Keys.
    * **Mobile/Touch (if enabled):** Use the virtual joystick that appears at the bottom.
4.  **Interact:** Click or tap on objects (PC, bookshelf, mailbox, vinyl shelf) and other characters (trainers) to see different parts of the portfolio or get information.
5.  **Fish:** Walk near a body of water. If a prompt appears, click "Cast Line" to start the fishing minigame. Use the "Reel" button to catch fish while managing tension.
6.  **View Scores:** Click the "Scores" button in the top-right corner to view the fishing high scores.

## Technologies Used

* HTML5
* CSS3 (including Flexbox, Absolute/Fixed Positioning, Media Queries)
* JavaScript (ES6+)
* HTML Canvas API (for map rendering)
* [Firebase Firestore](https://firebase.google.com/docs/firestore) (for scoreboard)
* [nipple.js](https://github.com/yoannmoinet/nipplejs) (for mobile joystick)
* [Formspree](https://formspree.io/) (for contact form backend)

## Setup (for development)

1.  Clone the repository: `git clone https://github.com/calebluh/portfolio.git`
2.  Navigate to the directory: `cd portfolio`
3.  Open `index.html` in your web browser (preferably using a local server like VS Code's Live Server for proper asset loading).

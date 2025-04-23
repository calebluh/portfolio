# Caleb Luh's Interactive 2D Portfolio

Welcome to my interactive 2D portfolio! This project showcases my web development skills and personal projects in a fun, retro game-style format. Built with vanilla HTML, CSS, and JavaScript, it uses the HTML Canvas API for the map rendering and DOM manipulation for interactive elements.

**Live Demo:** [https://calebluh.github.io/portfolio/](https://calebluh.github.io/portfolio/)

## Features

* **Interactive Map:** Explore a 2D world rendered on HTML Canvas.
* **Character Movement:** Control your character using keyboard (WASD/Arrows) or an on-screen joystick (mobile).
* **Collision Detection:** Prevents walking through walls and water.
* **Interactive Objects:** Click on objects and NPCs (Non-Player Characters) to trigger actions:
    * View Projects (PC)
    * Access Resume, Skills, Experience Info (Trainers)
    * Open Contact Form (Mailbox)
    * Explore Reading List (Bookshelf)
    * Visit Discogs Collection (Vinyl Shelf)
* **Responsive Design:** Adapts to different screen sizes with dynamic element positioning and mobile controls.
* **Pop-up Dialogs:** Displays information and choices without leaving the page.

## How to Play

1.  **Press Start:** Click the "Press Start" button on the initial screen.
2.  **Move:**
    * **Desktop:** Use `W`, `A`, `S`, `D` or the Arrow Keys.
    * **Mobile/Touch:** Use the virtual joystick that appears in the bottom-right corner.
3.  **Interact:** Click or tap on objects (PC, bookshelf, mailbox, vinyl shelf) and other characters (trainers) to see different parts of the portfolio or get information.

## Technologies Used

* HTML5
* CSS3 (including Flexbox, Absolute/Fixed Positioning, Media Queries)
* JavaScript (ES6+)
* HTML Canvas API (for map rendering)
* [NippleJS](https://github.com/yoannmoinet/nipplejs) (for mobile joystick - *to be added*)
* Formspree (for contact form backend)

## Setup (for development)

1.  Clone the repository: `git clone https://github.com/calebluh/portfolio.git`
2.  Navigate to the directory: `cd portfolio`
3.  Open `index.html` in your web browser (preferably using a local server like VS Code's Live Server for proper asset loading).

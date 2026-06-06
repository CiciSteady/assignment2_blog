# Assignment 4: Thesis Defense Game

**Student Name:** RenXuan  
**Student ID:** ZY2557207  
**Project Option:** Option A, "Defend Your Thesis"  
**Date:** 2026-06-06

## 1. Project Overview

For Assignment 4, I built a playable web game called **Defend Your Thesis**. The concept is a survival-defense game where the player is a graduate student defending a thesis core from incoming academic threats such as bugs, deadlines, and peer reviewers.

The final application is a static web game that can be hosted on GitHub Pages:

```text
https://cicisteady.github.io/assignment2_blog/thesis_defense_game.html
```

The game files are:

```text
site/thesis_defense_game.html
site/assets/thesis_defense_game.js
site/assets/style.css
```

## 2. Functional Software

The application runs in a browser and does not require a build step. It satisfies the requirement for a fully hosted web service because it is integrated into the existing GitHub Pages blog.

### Implemented Features

- Character selection page with 7 playable characters
- Canvas-based maze and real-time rendering
- Thesis core that must be defended
- Incoming threats: Bugs, Deadlines, and Peer Reviewers
- Citation collectibles and score logic
- Keyboard controls with Arrow keys or WASD
- Mouse/touch movement by clicking or tapping the canvas
- Game timer, score, citation count, and thesis integrity HUD
- Game over / victory overlay
- Guaranteed playable outcome after a 10-second defense round
- Responsive layout for desktop and mobile screens

## 3. Game Design

### Core Mechanic

The player moves through a maze and protects the thesis core. The player can collect citations for points while intercepting threats before they reach the thesis. The game keeps the defense round short and stable, so every player can complete a session and see a score.

### Characters

The game includes seven characters:

| Character | Role |
|---|---|
| Data Knight | Balanced defender |
| Citation Mage | Wider citation collection aura |
| Method Engineer | Strong and stable defender |
| Coffee Sprinter | Fastest movement |
| Algorithm Ninja | Quick interception |
| Lab Guardian | Durable thesis protection |
| Reviewer Whisperer | Bonus score against peer reviewers |

### Threats

| Threat | Behavior |
|---|---|
| Bug | Moves toward the thesis and causes integrity damage |
| Deadline | Faster and more dangerous pressure source |
| Peer Review | Slower but persistent academic threat |

## 4. Architecture

The project uses a simple static architecture:

```text
HTML page
  -> loads shared site CSS
  -> loads game JavaScript
  -> renders Canvas game
  -> updates HUD and game state in real time
```

The JavaScript code is organized around:

- `createState()`: initializes player, thesis core, citations, threats, score, and timer
- `renderCharacterButtons()`: builds the character selection interface
- `startGame()` and `resetGame()`: control game lifecycle
- `update(dt)`: updates movement, collisions, threats, score, and timer
- `draw()`: renders the maze, citations, player, threats, particles, and overlays
- Keyboard and pointer event listeners for controls

## 5. AI-Assisted Development Process

I used AI as a development partner for both planning and implementation.

### Architecture Planning

AI helped convert the assignment prompt into a stable web-game architecture. Instead of making a complex game engine, I chose a static HTML/CSS/JavaScript design so the result could be hosted directly on GitHub Pages.

### Feature Implementation

AI helped implement specific features:

- Character selection and stat differences
- Canvas maze rendering
- Player movement with wall collision
- Threat spawning and movement
- Citation collection
- Score and timer logic
- Victory overlay and replay flow
- Responsive UI styling

### Problem Solving

During development, AI helped check likely problems:

- The maze dimensions must match the canvas dimensions
- The game must remain playable on smaller screens
- Canvas rendering should not depend on external image files
- The game should still work without a backend
- GitHub Pages should be able to serve the game as a static file

## 6. Technical Details

### Canvas Rendering

The game uses an HTML `<canvas>` with a 28 by 21 tile maze. Each tile is 32 pixels, resulting in an internal resolution of 896 by 640 pixels. CSS scales the canvas responsively while preserving the aspect ratio.

### Collision Detection

Collision detection checks the player's future position against wall tiles. The player moves separately on the X and Y axes, which allows smooth sliding along walls.

### Game Loop

The game uses `requestAnimationFrame` for smooth animation. Each frame calculates delta time, updates the player and threats, then redraws the game.

### Controls

The game supports:

- Arrow keys
- WASD keys
- Pointer click/tap on the canvas

## 7. Verification

The game was verified with:

```powershell
node --check site\assets\thesis_defense_game.js
```

The maze dimensions were also checked to ensure they match the canvas grid:

```text
rows: 21
columns per row: 28
canvas: 896 x 640
tile size: 32
```

Local link checking confirmed that the Assignment 4 page links to:

- The playable game
- The Markdown report
- The PDF report

## 8. Reflection

This assignment showed the difference between "prompting for fun" and "engineering for results." A game idea can sound interesting, but making it stable requires careful decisions about game state, rendering, collision detection, controls, scoring, and deployment.

AI was most helpful when the task was concrete. For example, asking for "a character selection system with 7 characters and unique stats" or "wall collision for a tile maze" produced useful implementation guidance. The final result still required verification, file organization, and deployment checks.

The most important lesson is that AI can speed up implementation, but the developer still needs to define the product goal, keep the scope realistic, and test the result.

## 9. Conclusion

The final Assignment 4 submission is a functional, hosted web game. It includes a stable gameplay loop, character selection, score logic, keyboard and mouse controls, and documentation explaining how AI supported the development process.

# Assignment 4: Thesis Defense Game

**Student Name:** RenXuan  
**Student ID:** ZY2557207  
**Project Option:** Option A, "Defend Your Thesis"  
**Date:** 2026-06-11

## 1. Project Overview

For Assignment 4, I built a playable web game called **Defend Your Thesis**. The concept is a one-minute survival-defense game where the player is a graduate student defending a thesis core and a committee gate from incoming academic threats such as bugs, deadlines, and peer reviewers.

The final deliverable is a desktop browser game that can be hosted on GitHub Pages:

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

The desktop browser game runs in a browser and does not require a build step. It satisfies the requirement for a fully hosted web service because it is integrated into the existing GitHub Pages blog.

### Implemented Features

- Character selection page with 7 playable characters
- Canvas-based maze and real-time rendering
- Thesis core that must be defended
- Incoming threats: Bugs, Deadlines, and Peer Reviewers
- Citation collectibles and score logic
- Keyboard controls with Arrow keys or WASD
- Mouse movement by clicking the canvas
- One-minute defense timer, score, defended count, thesis integrity, rejection gate, and threat strength HUD
- Difficulty selection with Low, Medium, and High modes
- Target success-rate labels: Low 60%, Medium 20%, High 1%
- Clear pass/fail result overlay
- Success condition: survive 60 seconds with thesis integrity above 0% and rejection gate below 100%
- Failure condition: thesis integrity reaches 0%, or missed threats push the rejection gate to 100%
- Three defense objects with different rewards: Code Lab, Schedule Gate, and Committee Door
- Humanoid threat characters that shrink after successful defense and grow stronger after failed defense
- Gate archers that automatically shoot matching attackers from range
- Sword rescue mechanic: if attackers reach an archer, the archer is pinned down until the player defeats the attacker with a sword
- Desktop browser layout for keyboard and mouse play

## 3. Game Design

### Core Mechanic

The player moves through a maze and protects three related defense objects. Bugs move toward the Code Lab, Deadlines move toward the Schedule Gate, and Peer Reviewers move toward the Committee Door. The player can collect citations for points, but the main task is to intercept incoming threats before they reach their target objects.

The round lasts 60 seconds. If the player survives the full minute while keeping thesis integrity above 0% and rejection gate below 100%, the defense is passed. If the player misses too many threats, the threats become stronger, the rejection gate rises, and the player can be rejected at the door.

The game includes three difficulty modes:

| Difficulty | Target Success Rate | Main Effect |
|---|---:|---|
| Low | 60% | Fewer attackers, slower movement, stronger archer support |
| Medium | 20% | More attackers, faster pressure, weaker archer safety |
| High | 1% | Large waves, fast attackers, high damage and rejection pressure |

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

### Defense Objects and Threats

| Threat | Target Object | Successful Defense Reward | Failed Defense Consequence |
|---|---|---|---|
| Bugs | Code Lab | +1 Debug Point, repairs a small amount of thesis integrity, and weakens Bugs | Bugs grow stronger and damage thesis integrity |
| Deadlines | Schedule Gate | +1 Time Buffer, temporarily slows incoming pressure | Deadlines grow stronger and increase rejection pressure |
| Peer Reviewers | Committee Door | +1 Review Point and lowers rejection risk | Peer Reviewers grow stronger and push the player closer to being rejected |

The threats are drawn as small humanoid characters. Each gate also has an archer helper. The archer shoots only the matching threat type: the Code Lab archer shoots Bugs, the Schedule Gate archer shoots Deadlines, and the Committee Door archer shoots Peer Reviewers. When a threat reaches an archer, the archer becomes pinned down and cannot shoot. The player must move close with the sword to defeat the attacker and rescue the archer.

When the player or an archer defends successfully, the corresponding threat type becomes weaker and smaller. When the player fails to defend, that threat type becomes larger, faster, and more dangerous.

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
- `update(dt)`: updates movement, pathfinding, collisions, threats, score, timer, integrity, and rejection gate
- `updateAllies(dt)`: controls gate archer targeting and shooting
- `updateArrows(dt)`: moves arrows and applies ranged defense damage
- `rescueAlly()`: resolves close-combat rescue when the player reaches a pinned archer with the sword
- `draw()`: renders the maze, citations, player, threats, particles, and overlays
- `endRound(passed, reason)`: displays explicit success or failure feedback
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
- Threat spawning, pathfinding, and target-specific movement
- Citation collection
- Score, one-minute timer, rejection gate, and pass/fail logic
- Humanoid visual design for Bugs, Deadlines, and Peer Reviewers
- Threat growth and weakening mechanics
- Gate archer helpers and arrow projectile logic
- Sword-based player rescue logic for close combat
- Victory/failure overlay and replay flow
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

The game uses `requestAnimationFrame` for smooth animation. Each frame calculates delta time, updates the player, moves threats toward their target objects, checks collisions, updates the rejection gate, and redraws the game.

### Pass and Failure Logic

The game has clear results:

- **Pass:** the player survives 60 seconds, thesis integrity stays above 0%, and rejection gate stays below 100%.
- **Fail by collapse:** thesis integrity reaches 0%.
- **Fail by rejection:** missed threats push the rejection gate to 100%, so the player is rejected at the committee door.

This makes the game more meaningful than a guaranteed-win demo. The player must actively defend the thesis environment.

### Gate Archers and Sword Rescue

To make the game more balanced and interesting, I added three gate archers. They help defend automatically, so the player does not need to chase every single enemy alone. However, they are fragile in close combat. If an attacker reaches an archer, the archer stops shooting and displays a distress state. The player character carries a sword and must move close to defeat that attacker, rescue the archer, and restore the gate defense.

### Controls

The game supports:

- Arrow keys
- WASD keys
- Mouse click movement on the canvas

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
- The presentation PDF

## 8. Reflection

This assignment showed the difference between "prompting for fun" and "engineering for results." A game idea can sound interesting, but making it stable requires careful decisions about game state, rendering, collision detection, pathfinding, controls, scoring, failure conditions, and deployment.

AI was most helpful when the task was concrete. For example, asking for "a character selection system with 7 characters and unique stats" or "wall collision for a tile maze" produced useful implementation guidance. The final result still required verification, file organization, and deployment checks.

The most important lesson is that AI can speed up implementation, but the developer still needs to define the product goal, keep the scope realistic, and test the result.

## 9. Conclusion

The final Assignment 4 submission is a functional, hosted desktop browser game. It includes a stable gameplay loop, character selection, difficulty selection, score logic, one-minute win/fail rules, growing and weakening threats, keyboard and mouse controls, and documentation explaining how AI supported the development process.

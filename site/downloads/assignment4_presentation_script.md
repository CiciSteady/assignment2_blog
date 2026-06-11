# Assignment 4 Presentation Script

**Title:** Defend Your Thesis: An AI-Assisted Web Game  
**Presenter:** RenXuan  
**Duration:** about 5 minutes  
**Language:** English

## Slide 1 - Title

Good morning everyone. My name is RenXuan, and today I will present my Assignment 4 project, **Defend Your Thesis**.

For this assignment, I chose Option A, which is to build a playable web game based on the idea of defending a thesis. My goal was not only to make something fun, but also to turn a classroom prompt into a stable software application that can run in the browser and be hosted on GitHub Pages.

The final result is an HTML5 Canvas game where the player acts as a graduate student protecting a thesis core and a committee gate from bugs, deadlines, and peer reviewers.

## Slide 2 - Assignment Goal and My Delivery

The assignment asked us to develop an AI-assisted application, bridge the gap between prompting for fun and engineering for results, and deliver either an executable application or a stable hosted web service.

My delivery is a fully hosted static web game. It does not need a backend or a build step. The main files are one HTML page, one JavaScript game file, and shared CSS from my blog website.

I also integrated the game into my existing RenXuan's blog, so Assignment 4 has a clear entry page, a playable game link, and downloadable Markdown and PDF documentation.

## Slide 3 - Game Concept

The concept is a survival-defense game called **Defend Your Thesis**.

In the game, the center object is the thesis core. The player moves through a neon maze to collect citations and intercept threats before they damage the thesis environment.

The threats represent common academic pressures: bugs, deadlines, and peer reviewers. This makes the theme connected to graduate study, while the mechanics remain simple and playable.

The design goal was stability and clear feedback. I wanted the player to understand how to win, how to fail, and why different defense actions matter.

## Slide 4 - Gameplay Features

The game includes seven playable characters, each with a different color and gameplay identity. For example, Data Knight is balanced, Coffee Sprinter is faster, and Reviewer Whisperer gets bonus score against peer reviewers.

The game also includes citation collectibles, score logic, thesis integrity, a rejection gate, a one-minute defense timer, and a result overlay.

The success rule is clear: survive 60 seconds with thesis integrity above zero and the rejection gate below 100 percent. The failure rule is also clear: if integrity reaches zero, the thesis collapses; if rejection reaches 100 percent, the player is rejected at the door.

I also added three defense objects. Bugs attack the Code Lab and successful defense gives a Debug Point. Deadlines attack the Schedule Gate and successful defense gives a Time Buffer. Peer Reviewers attack the Committee Door and successful defense gives a Review Point that lowers rejection risk.

To make the game more playable, each gate has a helper archer. These archers shoot the matching attackers from range. But they are weak in close combat. If an attacker reaches an archer, the archer is pinned down and can no longer shoot. At that moment, the player must move close and use the sword to rescue the archer.

For controls, I implemented both keyboard and mouse input. Players can use Arrow keys or WASD, and they can also click or tap on the canvas to move. This makes the game usable on both desktop and smaller screens.

## Slide 5 - Technical Architecture

Technically, the game is built with HTML, CSS, and JavaScript.

The most important technical component is the Canvas rendering system. The maze is a 28 by 21 tile grid, and each tile is 32 pixels. This creates an internal canvas size of 896 by 640 pixels.

The game uses a requestAnimationFrame loop. Each frame calculates delta time, updates player movement, moves threats toward their target objects, checks collisions, collects citations, updates the HUD, and redraws the canvas.

Collision detection is tile-based. Before the player moves, the code checks whether the next position would touch a wall. I also added simple tile-based pathfinding so the small humanoid threats can move toward the Code Lab, Schedule Gate, or Committee Door. The archer system uses projectile arrows, cooldowns, target filtering, and a rescue state when an archer is pinned down.

## Slide 6 - How AI Helped

AI was my development partner during this project.

First, AI helped convert the assignment description into a realistic architecture. Instead of building a complicated game engine, I chose a static web game because it is easier to deploy and test.

Second, AI helped with specific implementation problems, such as character selection, Canvas drawing, wall collision, pathfinding, threat spawning, archer shooting, sword rescue, scoring, pass/fail logic, and responsive layout.

Third, AI helped with verification. I checked that the JavaScript had no syntax errors, that the maze dimensions matched the canvas, and that all local links worked.

The key lesson is that AI is most useful when the request is specific. A vague prompt gives an idea, but a concrete engineering task produces usable code.

## Slide 7 - Result and Reflection

The final result is a functional hosted game with a clear Assignment 4 page, playable gameplay, and documentation.

This project helped me understand the difference between a fun prototype and a stable application. A working game needs state management, rendering, collision detection, pathfinding, input controls, score logic, clear failure conditions, responsive design, and deployment.

For the presentation demo, I would first open the Assignment 4 page, then start the game, select a character, show the gate archers shooting, rescue a pinned archer with the sword, and show how defended threats become weaker while missed threats become stronger.

In conclusion, **Defend Your Thesis** is a small but complete AI-assisted application. It meets the assignment requirements and demonstrates how LLMs can support real software development when combined with testing and engineering judgment.

const canvas = document.querySelector("#game-canvas");
const ctx = canvas.getContext("2d");

const scoreEl = document.querySelector("#score-value");
const citationEl = document.querySelector("#citation-value");
const integrityEl = document.querySelector("#integrity-value");
const timerEl = document.querySelector("#timer-value");
const startButton = document.querySelector("#start-game");
const randomButton = document.querySelector("#random-character");
const resetButton = document.querySelector("#reset-game");
const playAgainButton = document.querySelector("#play-again");
const resultOverlay = document.querySelector("#result-overlay");
const resultTitle = document.querySelector("#result-title");
const resultCopy = document.querySelector("#result-copy");
const characterGrid = document.querySelector("#character-grid");
const selectedChip = document.querySelector("#selected-chip");
const selectedDescription = document.querySelector("#selected-description");

const TILE = 32;
const ROUND_SECONDS = 10;
const maze = [
  "############################",
  "#............##............#",
  "#.####.#####.##.#####.####.#",
  "#.#  #.#   #.##.#   #.#  #.#",
  "#.####.###.#.##.#.###.####.#",
  "#..........................#",
  "#.####.##.########.##.####.#",
  "#......##....##....##......#",
  "######.##### ## #####.######",
  "     #.##          ##.#     ",
  "######.## ###CC### ##.######",
  "#........ #    # ..........#",
  "#.####.## ######## ##.####.#",
  "#...##.##....##....##.##...#",
  "###.##.#####.##.#####.##.###",
  "#..........................#",
  "#.######.##########.######.#",
  "#...........P..............#",
  "#.####.#####.##.#####.####.#",
  "#..........................#",
  "############################",
];

const characters = [
  { name: "Data Knight", color: "#37f0d4", accent: "#f5e960", speed: 168, radius: 12, ability: "Balanced movement and a reliable defense pulse." },
  { name: "Citation Mage", color: "#f56fd6", accent: "#6df6ff", speed: 156, radius: 12, ability: "Collects citations with a wider research aura." },
  { name: "Method Engineer", color: "#ff8a54", accent: "#52e08f", speed: 148, radius: 13, ability: "Strong thesis integrity and steady control." },
  { name: "Coffee Sprinter", color: "#f6d365", accent: "#f06a7a", speed: 190, radius: 11, ability: "Fastest defender during deadline pressure." },
  { name: "Algorithm Ninja", color: "#7c8cff", accent: "#38f2a5", speed: 178, radius: 11, ability: "Sharp movement and quick threat knockback." },
  { name: "Lab Guardian", color: "#62d2ff", accent: "#ffcb6b", speed: 142, radius: 14, ability: "Durable lab protection for the thesis core." },
  { name: "Reviewer Whisperer", color: "#b6f26c", accent: "#ff7ab6", speed: 162, radius: 12, ability: "Turns hostile reviews into bonus score." },
];

const threatTypes = [
  { name: "Bug", color: "#ff4d6d", speed: 82, radius: 10, damage: 8 },
  { name: "Deadline", color: "#ffb703", speed: 96, radius: 11, damage: 10 },
  { name: "Peer Review", color: "#9b5de5", speed: 74, radius: 12, damage: 7 },
];

let selectedIndex = 0;
let keys = new Set();
let state;
let animationId;
let lastFrame = 0;
let mouseTarget = null;

function createState() {
  const spawn = findMarker("P") || { x: 14.5 * TILE, y: 17.5 * TILE };
  const core = { x: 14 * TILE, y: 10.5 * TILE, radius: 26 };
  const citations = [];

  maze.forEach((row, y) => {
    [...row].forEach((cell, x) => {
      if (cell === ".") {
        citations.push({ x: x * TILE + TILE / 2, y: y * TILE + TILE / 2, taken: false });
      }
    });
  });

  return {
    mode: "select",
    player: { x: spawn.x, y: spawn.y, vx: 0, vy: 0 },
    core,
    citations,
    threats: [],
    particles: [],
    score: 0,
    integrity: 100,
    elapsed: 0,
    spawnClock: 0,
    pulseClock: 0,
    citationsTaken: 0,
  };
}

function findMarker(marker) {
  for (let y = 0; y < maze.length; y += 1) {
    const x = maze[y].indexOf(marker);
    if (x >= 0) {
      return { x: x * TILE + TILE / 2, y: y * TILE + TILE / 2 };
    }
  }
  return null;
}

function isWallPixel(x, y) {
  const col = Math.floor(x / TILE);
  const row = Math.floor(y / TILE);
  if (row < 0 || row >= maze.length || col < 0 || col >= maze[row].length) {
    return true;
  }
  return maze[row][col] === "#";
}

function canMoveTo(x, y, radius) {
  const probes = [
    [x - radius, y - radius],
    [x + radius, y - radius],
    [x - radius, y + radius],
    [x + radius, y + radius],
    [x, y - radius],
    [x, y + radius],
    [x - radius, y],
    [x + radius, y],
  ];
  return probes.every(([px, py]) => !isWallPixel(px, py));
}

function chooseCharacter(index) {
  selectedIndex = index;
  const character = characters[selectedIndex];
  selectedChip.textContent = character.name;
  selectedDescription.textContent = character.ability;
  renderCharacterButtons();
}

function renderCharacterButtons() {
  characterGrid.innerHTML = "";
  characters.forEach((character, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `character-card${index === selectedIndex ? " selected" : ""}`;
    button.style.setProperty("--character-color", character.color);
    button.innerHTML = `<span>${character.name}</span><small>${Math.round(character.speed)} speed</small>`;
    button.addEventListener("click", () => chooseCharacter(index));
    characterGrid.append(button);
  });
}

function startGame() {
  state = createState();
  state.mode = "playing";
  resultOverlay.classList.add("hidden");
  lastFrame = performance.now();
  cancelAnimationFrame(animationId);
  animationId = requestAnimationFrame(loop);
}

function resetGame() {
  state = createState();
  resultOverlay.classList.add("hidden");
  mouseTarget = null;
  updateHud();
  draw();
}

function endRound() {
  state.mode = "ended";
  state.score += Math.round(state.integrity * 6) + state.citationsTaken * 15;
  resultTitle.textContent = "Thesis Accepted";
  resultCopy.textContent = `Final score ${state.score}. The committee signs the defense form.`;
  resultOverlay.classList.remove("hidden");
  updateHud();
}

function spawnThreat() {
  const spawns = [
    { x: 1.5 * TILE, y: 1.5 * TILE },
    { x: 26.5 * TILE, y: 1.5 * TILE },
    { x: 1.5 * TILE, y: 19.5 * TILE },
    { x: 26.5 * TILE, y: 19.5 * TILE },
  ];
  const spawn = spawns[Math.floor(Math.random() * spawns.length)];
  const type = threatTypes[Math.floor(Math.random() * threatTypes.length)];
  state.threats.push({ ...type, x: spawn.x, y: spawn.y, hitClock: 0 });
}

function loop(now) {
  const dt = Math.min((now - lastFrame) / 1000, 0.05);
  lastFrame = now;
  update(dt);
  draw();
  if (state.mode === "playing") {
    animationId = requestAnimationFrame(loop);
  }
}

function update(dt) {
  const character = characters[selectedIndex];
  state.elapsed += dt;
  state.spawnClock += dt;
  state.pulseClock = Math.max(0, state.pulseClock - dt);

  if (state.spawnClock > 0.75) {
    state.spawnClock = 0;
    spawnThreat();
  }

  updatePlayer(dt, character);
  updateCitations(character);
  updateThreats(dt, character);
  updateParticles(dt);
  updateHud();

  if (state.elapsed >= ROUND_SECONDS) {
    endRound();
  }
}

function updatePlayer(dt, character) {
  let dx = 0;
  let dy = 0;
  if (keys.has("ArrowLeft") || keys.has("KeyA")) dx -= 1;
  if (keys.has("ArrowRight") || keys.has("KeyD")) dx += 1;
  if (keys.has("ArrowUp") || keys.has("KeyW")) dy -= 1;
  if (keys.has("ArrowDown") || keys.has("KeyS")) dy += 1;

  if (!dx && !dy && mouseTarget) {
    const tx = mouseTarget.x - state.player.x;
    const ty = mouseTarget.y - state.player.y;
    const distance = Math.hypot(tx, ty);
    if (distance > 8) {
      dx = tx / distance;
      dy = ty / distance;
    } else {
      mouseTarget = null;
    }
  }

  const length = Math.hypot(dx, dy) || 1;
  const stepX = (dx / length) * character.speed * dt;
  const stepY = (dy / length) * character.speed * dt;
  moveEntity(state.player, stepX, stepY, character.radius);
}

function moveEntity(entity, stepX, stepY, radius) {
  const nextX = entity.x + stepX;
  if (canMoveTo(nextX, entity.y, radius)) entity.x = nextX;
  const nextY = entity.y + stepY;
  if (canMoveTo(entity.x, nextY, radius)) entity.y = nextY;
}

function updateCitations(character) {
  const aura = character.name === "Citation Mage" ? 30 : 22;
  state.citations.forEach((citation) => {
    if (!citation.taken && distance(state.player, citation) < aura) {
      citation.taken = true;
      state.citationsTaken += 1;
      state.score += 40;
      burst(citation.x, citation.y, character.accent, 7);
    }
  });
}

function updateThreats(dt, character) {
  state.threats.forEach((threat) => {
    threat.hitClock = Math.max(0, threat.hitClock - dt);
    const toCore = normalize(state.core.x - threat.x, state.core.y - threat.y);
    moveEntity(threat, toCore.x * threat.speed * dt, toCore.y * threat.speed * dt, threat.radius);

    if (distance(threat, state.player) < threat.radius + character.radius + 8 && threat.hitClock <= 0) {
      threat.hitClock = 0.75;
      state.score += character.name === "Reviewer Whisperer" && threat.name === "Peer Review" ? 90 : 55;
      const away = normalize(threat.x - state.player.x, threat.y - state.player.y);
      threat.x += away.x * 72;
      threat.y += away.y * 72;
      burst(threat.x, threat.y, character.color, 9);
    }

    if (distance(threat, state.core) < threat.radius + state.core.radius && threat.hitClock <= 0) {
      threat.hitClock = 0.9;
      state.integrity = Math.max(20, state.integrity - threat.damage);
      const away = normalize(threat.x - state.core.x, threat.y - state.core.y);
      threat.x += away.x * 90;
      threat.y += away.y * 90;
      burst(state.core.x, state.core.y, threat.color, 8);
    }
  });
}

function updateParticles(dt) {
  state.particles = state.particles.filter((particle) => {
    particle.x += particle.vx * dt;
    particle.y += particle.vy * dt;
    particle.life -= dt;
    return particle.life > 0;
  });
}

function burst(x, y, color, amount) {
  for (let i = 0; i < amount; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 45 + Math.random() * 90;
    state.particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      color,
      life: 0.4 + Math.random() * 0.4,
    });
  }
}

function draw() {
  const character = characters[selectedIndex];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  drawMaze();
  drawCitations();
  drawCore();
  drawThreats();
  drawPlayer(character);
  drawParticles();
  if (state.mode === "select") {
    drawReadyScreen(character);
  }
}

function drawBackground() {
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "#07111f");
  gradient.addColorStop(0.55, "#111827");
  gradient.addColorStop(1, "#230f2d");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "rgba(85, 240, 218, 0.08)";
  ctx.lineWidth = 1;
  for (let x = 0; x < canvas.width; x += TILE) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += TILE) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}

function drawMaze() {
  maze.forEach((row, y) => {
    [...row].forEach((cell, x) => {
      if (cell === "#") {
        const px = x * TILE;
        const py = y * TILE;
        ctx.fillStyle = "rgba(29, 233, 182, 0.18)";
        ctx.fillRect(px + 2, py + 2, TILE - 4, TILE - 4);
        ctx.strokeStyle = "rgba(109, 246, 255, 0.48)";
        ctx.strokeRect(px + 2.5, py + 2.5, TILE - 5, TILE - 5);
      }
    });
  });
}

function drawCitations() {
  state.citations.forEach((citation) => {
    if (citation.taken) return;
    ctx.fillStyle = "#f5e960";
    ctx.shadowColor = "#f5e960";
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(citation.x, citation.y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  });
}

function drawCore() {
  const pulse = 1 + Math.sin(performance.now() / 180) * 0.08;
  ctx.save();
  ctx.translate(state.core.x, state.core.y);
  ctx.scale(pulse, pulse);
  ctx.fillStyle = "rgba(55, 240, 212, 0.18)";
  ctx.strokeStyle = "#37f0d4";
  ctx.lineWidth = 3;
  polygon(0, 0, state.core.radius, 6);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#e9fffb";
  ctx.font = "bold 12px Segoe UI";
  ctx.textAlign = "center";
  ctx.fillText("THESIS", 0, 4);
  ctx.restore();
}

function drawThreats() {
  state.threats.forEach((threat) => {
    ctx.save();
    ctx.translate(threat.x, threat.y);
    ctx.fillStyle = threat.color;
    ctx.shadowColor = threat.color;
    ctx.shadowBlur = threat.hitClock > 0 ? 18 : 8;
    polygon(0, 0, threat.radius, threat.name === "Bug" ? 5 : 4);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 8px Segoe UI";
    ctx.textAlign = "center";
    ctx.fillText(threat.name[0], 0, 3);
    ctx.restore();
  });
}

function drawPlayer(character) {
  ctx.save();
  ctx.translate(state.player.x, state.player.y);
  ctx.fillStyle = character.color;
  ctx.strokeStyle = character.accent;
  ctx.lineWidth = 3;
  ctx.shadowColor = character.color;
  ctx.shadowBlur = 16;
  ctx.beginPath();
  ctx.arc(0, 0, character.radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.fillStyle = "#07111f";
  ctx.beginPath();
  ctx.arc(4, -4, 2.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawParticles() {
  state.particles.forEach((particle) => {
    ctx.globalAlpha = Math.max(particle.life, 0);
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  });
}

function drawReadyScreen(character) {
  ctx.fillStyle = "rgba(7, 17, 31, 0.66)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#e9fffb";
  ctx.font = "700 34px Georgia";
  ctx.textAlign = "center";
  ctx.fillText("Select a defender, then start the defense", canvas.width / 2, canvas.height / 2 - 14);
  ctx.fillStyle = character.color;
  ctx.font = "700 20px Segoe UI";
  ctx.fillText(character.name, canvas.width / 2, canvas.height / 2 + 26);
}

function polygon(x, y, radius, sides) {
  ctx.beginPath();
  for (let i = 0; i < sides; i += 1) {
    const angle = -Math.PI / 2 + (i / sides) * Math.PI * 2;
    const px = x + Math.cos(angle) * radius;
    const py = y + Math.sin(angle) * radius;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function normalize(x, y) {
  const length = Math.hypot(x, y) || 1;
  return { x: x / length, y: y / length };
}

function updateHud() {
  scoreEl.textContent = state.score.toString();
  citationEl.textContent = `${state.citationsTaken}/${state.citations.length}`;
  integrityEl.textContent = `${Math.round(state.integrity)}%`;
  timerEl.textContent = `${Math.max(0, ROUND_SECONDS - state.elapsed).toFixed(1)}s`;
}

window.addEventListener("keydown", (event) => {
  keys.add(event.code);
  if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Space"].includes(event.code)) {
    event.preventDefault();
  }
});

window.addEventListener("keyup", (event) => {
  keys.delete(event.code);
});

canvas.addEventListener("pointerdown", (event) => {
  const rect = canvas.getBoundingClientRect();
  mouseTarget = {
    x: ((event.clientX - rect.left) / rect.width) * canvas.width,
    y: ((event.clientY - rect.top) / rect.height) * canvas.height,
  };
});

startButton.addEventListener("click", startGame);
resetButton.addEventListener("click", resetGame);
playAgainButton.addEventListener("click", startGame);
randomButton.addEventListener("click", () => chooseCharacter(Math.floor(Math.random() * characters.length)));

renderCharacterButtons();
state = createState();
updateHud();
draw();

const canvas = document.querySelector("#game-canvas");
const ctx = canvas.getContext("2d");

const scoreEl = document.querySelector("#score-value");
const defendedEl = document.querySelector("#defended-value");
const integrityEl = document.querySelector("#integrity-value");
const rejectionEl = document.querySelector("#rejection-value");
const timerEl = document.querySelector("#timer-value");
const threatPowerEl = document.querySelector("#threat-power-value");
const startButton = document.querySelector("#start-game");
const randomButton = document.querySelector("#random-character");
const resetButton = document.querySelector("#reset-game");
const playAgainButton = document.querySelector("#play-again");
const resultOverlay = document.querySelector("#result-overlay");
const resultTitle = document.querySelector("#result-title");
const resultCopy = document.querySelector("#result-copy");
const resultEyebrow = document.querySelector("#result-eyebrow");
const characterGrid = document.querySelector("#character-grid");
const selectedChip = document.querySelector("#selected-chip");
const selectedDescription = document.querySelector("#selected-description");
const bugDefenseEl = document.querySelector("#bug-defense-value");
const deadlineDefenseEl = document.querySelector("#deadline-defense-value");
const reviewDefenseEl = document.querySelector("#review-defense-value");

const TILE = 32;
const ROUND_SECONDS = 60;
const MAX_REJECTION = 100;
const ARCHER_RANGE = 230;
const ARCHER_COOLDOWN = 0.85;
const ARROW_SPEED = 440;
const SWORD_RANGE = 44;
const SWORD_COOLDOWN = 0.26;
const MELEE_BREAK_SECONDS = 10;
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
  { name: "Data Knight", color: "#37f0d4", accent: "#f5e960", speed: 170, radius: 12, ability: "Balanced movement and steady defense against every academic threat." },
  { name: "Citation Mage", color: "#f56fd6", accent: "#6df6ff", speed: 158, radius: 12, ability: "Collects citations with a wider research aura and turns them into score." },
  { name: "Method Engineer", color: "#ff8a54", accent: "#52e08f", speed: 150, radius: 13, ability: "Protects thesis integrity better when Bugs reach the code lab." },
  { name: "Coffee Sprinter", color: "#f6d365", accent: "#f06a7a", speed: 194, radius: 11, ability: "Fastest defender, useful when Deadlines sprint toward the schedule gate." },
  { name: "Algorithm Ninja", color: "#7c8cff", accent: "#38f2a5", speed: 180, radius: 11, ability: "Quick interception and stronger knockback after each successful defense." },
  { name: "Lab Guardian", color: "#62d2ff", accent: "#ffcb6b", speed: 144, radius: 14, ability: "Durable protection that reduces damage when any object is breached." },
  { name: "Reviewer Whisperer", color: "#b6f26c", accent: "#ff7ab6", speed: 164, radius: 12, ability: "Special bonus against Peer Reviewers and lowers the rejection gate faster." },
];

const defenseTargets = {
  bug: {
    id: "bug",
    name: "Code Lab",
    label: "Bugs",
    reward: "Debug Point",
    color: "#ff4d6d",
    x: 7.5 * TILE,
    y: 11.5 * TILE,
    archerName: "Debug Archer",
    archerX: 6.6 * TILE,
    archerY: 11.5 * TILE,
  },
  deadline: {
    id: "deadline",
    name: "Schedule Gate",
    label: "Deadlines",
    reward: "Time Buffer",
    color: "#ffb703",
    x: 14 * TILE,
    y: 5.5 * TILE,
    archerName: "Schedule Archer",
    archerX: 15.2 * TILE,
    archerY: 5.5 * TILE,
  },
  review: {
    id: "review",
    name: "Committee Door",
    label: "Peer Reviewers",
    reward: "Review Point",
    color: "#9b5de5",
    x: 20.5 * TILE,
    y: 11.5 * TILE,
    archerName: "Committee Archer",
    archerX: 21.4 * TILE,
    archerY: 11.5 * TILE,
  },
};

const threatTypes = [
  { id: "bug", name: "Bug", short: "BUG", color: "#ff4d6d", shirt: "#ff9aae", speed: 68, radius: 10, damage: 5, rejection: 4, target: defenseTargets.bug },
  { id: "deadline", name: "Deadline", short: "DUE", color: "#ffb703", shirt: "#ffe08a", speed: 78, radius: 11, damage: 6, rejection: 5, target: defenseTargets.deadline },
  { id: "review", name: "Peer Reviewer", short: "REV", color: "#9b5de5", shirt: "#cab0ff", speed: 62, radius: 12, damage: 5, rejection: 7, target: defenseTargets.review },
];

const directions = [
  { x: 1, y: 0 },
  { x: -1, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: -1 },
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
    allies: Object.values(defenseTargets).map((target) => ({
      id: target.id,
      name: target.archerName,
      x: target.archerX,
      y: target.archerY,
      color: target.color,
      cooldown: Math.random() * 0.6,
      engagedThreatUid: null,
      rescued: 0,
      shots: 0,
    })),
    arrows: [],
    threats: [],
    particles: [],
    score: 0,
    integrity: 100,
    rejection: 0,
    elapsed: 0,
    spawnClock: 0,
    slowClock: 0,
    swordClock: 0,
    slashClock: 0,
    defended: 0,
    missed: 0,
    citationsTaken: 0,
    targetScores: { bug: 0, deadline: 0, review: 0 },
    threatPower: { bug: 2, deadline: 2, review: 2 },
    nextThreatUid: 1,
    message: "Survive 60 seconds. Gate archers help from range, but rescue them with your sword if attackers get close.",
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

function isWallTile(col, row) {
  if (row < 0 || row >= maze.length || col < 0 || col >= maze[row].length) {
    return true;
  }
  return maze[row][col] === "#";
}

function isWallPixel(x, y) {
  return isWallTile(Math.floor(x / TILE), Math.floor(y / TILE));
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
  mouseTarget = null;
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

function endRound(passed, reason) {
  if (state.mode === "ended") return;
  state.mode = "ended";
  cancelAnimationFrame(animationId);

  const integrityBonus = Math.max(0, Math.round(state.integrity * 6));
  const defenseBonus = state.defended * 45;
  const rejectionPenalty = Math.round(state.rejection * 2);
  if (passed) {
    state.score += integrityBonus + defenseBonus - rejectionPenalty;
    resultEyebrow.textContent = "Defense Passed";
    resultTitle.textContent = "Thesis Accepted";
    resultCopy.textContent = `You survived 60 seconds, defended ${state.defended} threats, and kept rejection at ${Math.round(state.rejection)}%. Final score: ${Math.max(0, state.score)}.`;
  } else {
    resultEyebrow.textContent = "Defense Failed";
    resultTitle.textContent = reason === "rejection" ? "Rejected at the Door" : "Thesis Collapsed";
    resultCopy.textContent = reason === "rejection"
      ? `Missed threats became too strong and pushed the rejection gate to ${Math.round(state.rejection)}%. Defended threats: ${state.defended}.`
      : `The thesis integrity dropped to ${Math.round(state.integrity)}%. Defended threats: ${state.defended}, missed threats: ${state.missed}.`;
  }

  resultOverlay.classList.remove("hidden");
  updateHud();
  draw();
}

function spawnThreat() {
  if (state.threats.length >= 14) return;

  const spawns = [
    { x: 1.5 * TILE, y: 1.5 * TILE },
    { x: 26.5 * TILE, y: 1.5 * TILE },
    { x: 1.5 * TILE, y: 19.5 * TILE },
    { x: 26.5 * TILE, y: 19.5 * TILE },
    { x: 13.5 * TILE, y: 1.5 * TILE },
    { x: 14.5 * TILE, y: 19.5 * TILE },
  ];
  const spawn = spawns[Math.floor(Math.random() * spawns.length)];
  const type = threatTypes[Math.floor(Math.random() * threatTypes.length)];
  const power = state.threatPower[type.id];
  const hp = Math.max(1, Math.ceil(power));

  state.threats.push({
    ...type,
    uid: state.nextThreatUid,
    x: spawn.x,
    y: spawn.y,
    hp,
    maxHp: hp,
    hitClock: 0,
    wobble: Math.random() * Math.PI * 2,
  });
  state.nextThreatUid += 1;
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
  state.slowClock = Math.max(0, state.slowClock - dt);
  state.swordClock = Math.max(0, state.swordClock - dt);
  state.slashClock = Math.max(0, state.slashClock - dt);

  const averagePower = averageThreatPower();
  const spawnInterval = Math.max(0.9, 2.25 - state.elapsed / 130 - averagePower * 0.05);
  if (state.spawnClock >= spawnInterval) {
    state.spawnClock = 0;
    spawnThreat();
  }

  updatePlayer(dt, character);
  updateCitations(character);
  updateThreats(dt, character);
  updateAllies(dt);
  updateArrows(dt);
  updateParticles(dt);
  updateHud();

  if (state.integrity <= 0) {
    endRound(false, "integrity");
  } else if (state.rejection >= MAX_REJECTION) {
    endRound(false, "rejection");
  } else if (state.elapsed >= ROUND_SECONDS) {
    endRound(true, "time");
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
    const distanceToTarget = Math.hypot(tx, ty);
    if (distanceToTarget > 8) {
      dx = tx / distanceToTarget;
      dy = ty / distanceToTarget;
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
      state.score += 35;
      burst(citation.x, citation.y, character.accent, 7);
    }
  });
}

function updateThreats(dt, character) {
  const nextThreats = [];

  state.threats.forEach((threat) => {
    threat.hitClock = Math.max(0, threat.hitClock - dt);
    threat.wobble += dt * 5;

    const ally = findAlly(threat.id);
    if (!threat.engagedAllyId && ally && distance(threat, ally) < threat.radius + 28) {
      engageAlly(threat, ally);
    }

    if (threat.engagedAllyId) {
      updateMeleeThreat(threat, character, dt);
      if (threat.hp > 0) nextThreats.push(threat);
      return;
    }

    const route = pathDirection(threat, threat.target);
    const slowFactor = state.slowClock > 0 ? 0.72 : 1;
    const speedBoost = 1 + state.threatPower[threat.id] * 0.08;
    moveEntity(threat, route.x * threat.speed * speedBoost * slowFactor * dt, route.y * threat.speed * speedBoost * slowFactor * dt, threat.radius);

    if (distance(threat, state.player) < threat.radius + character.radius + SWORD_RANGE && state.swordClock <= 0 && threat.hitClock <= 0) {
      defendThreat(threat, character, "sword");
      if (threat.hp <= 0) return;
    }

    if (distance(threat, threat.target) < threat.radius + 20) {
      breachTarget(threat, character);
      return;
    }

    if (threat.hp > 0) {
      nextThreats.push(threat);
    }
  });

  state.threats = nextThreats;
}

function updateAllies(dt) {
  state.allies.forEach((ally) => {
    const engaged = ally.engagedThreatUid ? findThreat(ally.engagedThreatUid) : null;
    if (ally.engagedThreatUid && !engaged) {
      ally.engagedThreatUid = null;
    }

    if (ally.engagedThreatUid) {
      return;
    }

    ally.cooldown = Math.max(0, ally.cooldown - dt);
    if (ally.cooldown > 0) return;

    const target = findArcherTarget(ally);
    if (!target) return;

    shootArrow(ally, target);
    ally.cooldown = ARCHER_COOLDOWN + Math.random() * 0.35;
  });
}

function updateArrows(dt) {
  state.arrows = state.arrows.filter((arrow) => {
    arrow.x += arrow.vx * dt;
    arrow.y += arrow.vy * dt;
    arrow.life -= dt;

    const target = findThreat(arrow.targetUid);
    if (!target || target.hp <= 0) return false;

    if (distance(arrow, target) < target.radius + 14) {
      archerHitThreat(target, arrow);
      return false;
    }

    return arrow.life > 0;
  });

  releaseResolvedAllies();
  state.threats = state.threats.filter((threat) => threat.hp > 0);
}

function findArcherTarget(ally) {
  const candidates = state.threats
    .filter((threat) => threat.id === ally.id && !threat.engagedAllyId && threat.hp > 0 && distance(ally, threat) <= ARCHER_RANGE)
    .sort((a, b) => distance(a, ally) - distance(b, ally));
  return candidates[0] || null;
}

function shootArrow(ally, target) {
  const aim = normalize(target.x - ally.x, target.y - ally.y);
  state.arrows.push({
    x: ally.x,
    y: ally.y - 16,
    vx: aim.x * ARROW_SPEED,
    vy: aim.y * ARROW_SPEED,
    targetUid: target.uid,
    color: ally.color,
    life: 0.75,
  });
  ally.shots += 1;
}

function archerHitThreat(threat, arrow) {
  threat.hp -= 1.2;
  threat.hitClock = 0.35;
  state.defended += 1;
  state.targetScores[threat.id] += 1;
  state.threatPower[threat.id] = Math.max(0.75, state.threatPower[threat.id] - 0.16);
  state.score += 42 + Math.round(threat.maxHp * 6);
  state.message = `${threat.target.name} archer landed a shot. ${threat.target.label} became weaker.`;
  burst(arrow.x, arrow.y, arrow.color, 6);

  if (threat.hp <= 0) {
    state.score += 25;
    burst(threat.x, threat.y, threat.color, 12);
  }
}

function engageAlly(threat, ally) {
  threat.engagedAllyId = ally.id;
  threat.meleeClock = 0;
  threat.hitClock = 0.4;
  ally.engagedThreatUid = threat.uid;
  state.message = `${ally.name} is pinned down in close combat. Rush in with your sword to rescue them.`;
}

function updateMeleeThreat(threat, character, dt) {
  const ally = findAlly(threat.engagedAllyId);
  if (!ally) {
    threat.engagedAllyId = null;
    return;
  }

  threat.meleeClock += dt;
  const tug = normalize(ally.x - threat.x, ally.y - threat.y);
  threat.x += tug.x * 18 * dt;
  threat.y += tug.y * 18 * dt;

  if (distance(threat, state.player) < threat.radius + character.radius + SWORD_RANGE && state.swordClock <= 0) {
    rescueAlly(threat, character, ally);
    return;
  }

  if (threat.meleeClock >= MELEE_BREAK_SECONDS) {
    ally.engagedThreatUid = null;
    threat.engagedAllyId = null;
    breachTarget(threat, character);
    threat.hp = 0;
  }
}

function rescueAlly(threat, character, ally) {
  threat.hp = 0;
  threat.hitClock = 0.5;
  state.swordClock = SWORD_COOLDOWN;
  state.slashClock = 0.22;
  state.defended += 1;
  state.targetScores[threat.id] += 1;
  state.threatPower[threat.id] = Math.max(0.65, state.threatPower[threat.id] - 0.28);
  state.score += 130 + Math.round(threat.maxHp * 18);
  ally.engagedThreatUid = null;
  ally.rescued += 1;
  state.message = `Sword rescue! ${ally.name} is back on the gate and ${threat.target.label} lost strength.`;
  burst(threat.x, threat.y, character.accent, 18);
}

function releaseResolvedAllies() {
  state.allies.forEach((ally) => {
    const threat = ally.engagedThreatUid ? findThreat(ally.engagedThreatUid) : null;
    if (ally.engagedThreatUid && (!threat || threat.hp <= 0)) {
      ally.engagedThreatUid = null;
    }
  });
}

function findAlly(id) {
  return state.allies.find((ally) => ally.id === id) || null;
}

function findThreat(uid) {
  return state.threats.find((threat) => threat.uid === uid) || null;
}

function defendThreat(threat, character, source = "sword") {
  const bonus = character.name === "Reviewer Whisperer" && threat.id === "review" ? 55 : 0;
  const knockback = character.name === "Algorithm Ninja" ? 110 : 82;
  const target = threat.target;

  threat.hp -= 1;
  threat.hitClock = 0.72;
  state.swordClock = SWORD_COOLDOWN;
  state.slashClock = source === "sword" ? 0.2 : state.slashClock;
  state.defended += 1;
  state.targetScores[threat.id] += 1;
  state.threatPower[threat.id] = Math.max(0.8, state.threatPower[threat.id] - 0.18);
  state.score += 75 + bonus + Math.round(10 * threat.maxHp);

  if (threat.id === "bug") {
    const repair = character.name === "Method Engineer" ? 3 : 1.5;
    state.integrity = Math.min(100, state.integrity + repair);
    state.message = `Sword strike: Debug Point gained. ${target.label} shrank and thesis integrity recovered.`;
  } else if (threat.id === "deadline") {
    state.slowClock = Math.min(4, state.slowClock + (character.name === "Coffee Sprinter" ? 1.2 : 0.8));
    state.message = `Sword strike: Time Buffer gained. ${target.label} slowed down for a moment.`;
  } else {
    const reviewRelief = character.name === "Reviewer Whisperer" ? 5 : 3;
    state.rejection = Math.max(0, state.rejection - reviewRelief);
    state.message = `Sword strike: Review Point gained. ${target.label} lost influence at the committee door.`;
  }

  const away = normalize(threat.x - state.player.x, threat.y - state.player.y);
  threat.x += away.x * knockback;
  threat.y += away.y * knockback;
  burst(threat.x, threat.y, character.color, 10);

  if (threat.hp <= 0) {
    state.score += 45;
    burst(threat.x, threat.y, threat.color, 14);
  }
}

function breachTarget(threat, character) {
  const guardianScale = character.name === "Lab Guardian" ? 0.72 : 1;
  const power = state.threatPower[threat.id];
  const damage = threat.damage * (1 + power * 0.08) * guardianScale;
  const rejection = threat.rejection * (1 + power * 0.1);

  state.missed += 1;
  state.integrity = Math.max(0, state.integrity - damage);
  state.rejection = Math.min(MAX_REJECTION, state.rejection + rejection);
  state.threatPower[threat.id] = Math.min(8, state.threatPower[threat.id] + 0.38);
  state.message = `${threat.target.label} breached the ${threat.target.name}. They grew stronger and pushed you closer to rejection.`;
  burst(threat.target.x, threat.target.y, threat.color, 12);
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
      life: 0.4 + Math.random() * 0.45,
    });
  }
}

function draw() {
  const character = characters[selectedIndex];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  drawMaze();
  drawTargets();
  drawAllies();
  drawCitations();
  drawCore();
  drawThreats();
  drawArrows();
  drawPlayer(character);
  drawParticles();
  drawStatusBars();
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

function drawTargets() {
  Object.values(defenseTargets).forEach((target) => {
    ctx.save();
    ctx.translate(target.x, target.y);
    ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
    ctx.strokeStyle = target.color;
    ctx.lineWidth = 2;
    roundedRect(-42, -24, 84, 48, 10);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = target.color;
    ctx.font = "bold 11px Segoe UI";
    ctx.textAlign = "center";
    ctx.fillText(target.name, 0, 4);
    ctx.restore();
  });
}

function drawAllies() {
  state.allies.forEach((ally) => {
    const engaged = ally.engagedThreatUid ? findThreat(ally.engagedThreatUid) : null;
    ctx.save();
    ctx.translate(ally.x, ally.y);
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.shadowColor = ally.color;
    ctx.shadowBlur = engaged ? 20 : 12;

    ctx.fillStyle = engaged ? "#ffffff" : ally.color;
    ctx.strokeStyle = ally.color;
    ctx.beginPath();
    ctx.arc(0, -14, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.shadowBlur = 0;
    ctx.fillStyle = engaged ? "rgba(255, 77, 109, 0.78)" : "rgba(255, 255, 255, 0.16)";
    roundedRect(-10, -6, 20, 24, 6);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = ally.color;
    ctx.beginPath();
    ctx.moveTo(-8, 3);
    ctx.lineTo(-21, -8);
    ctx.moveTo(8, 3);
    ctx.lineTo(21, -8);
    ctx.moveTo(-5, 17);
    ctx.lineTo(-12, 28);
    ctx.moveTo(5, 17);
    ctx.lineTo(12, 28);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(22, -4, 13, -Math.PI / 2, Math.PI / 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(22, -17);
    ctx.lineTo(22, 9);
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 8px Segoe UI";
    ctx.textAlign = "center";
    ctx.fillText("ARCHER", 0, 41);

    if (engaged) {
      ctx.fillStyle = "#ff4d6d";
      ctx.font = "900 24px Segoe UI";
      ctx.fillText("!", 0, -30);
    }
    ctx.restore();
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
    const globalPower = state.threatPower[threat.id];
    const scale = 0.78 + threat.hp * 0.12 + globalPower * 0.04;
    drawThreatPerson(threat, scale);
  });
}

function drawArrows() {
  state.arrows.forEach((arrow) => {
    const angle = Math.atan2(arrow.vy, arrow.vx);
    ctx.save();
    ctx.translate(arrow.x, arrow.y);
    ctx.rotate(angle);
    ctx.strokeStyle = arrow.color;
    ctx.fillStyle = "#ffffff";
    ctx.lineWidth = 3;
    ctx.shadowColor = arrow.color;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(-12, 0);
    ctx.lineTo(12, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(14, 0);
    ctx.lineTo(5, -5);
    ctx.lineTo(5, 5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  });
}

function drawThreatPerson(threat, scale) {
  ctx.save();
  ctx.translate(threat.x, threat.y + Math.sin(threat.wobble) * 1.8);
  ctx.scale(scale, scale);
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.shadowColor = threat.color;
  ctx.shadowBlur = threat.hitClock > 0 ? 20 : 8;

  ctx.strokeStyle = threat.color;
  ctx.fillStyle = threat.shirt;
  ctx.beginPath();
  ctx.arc(0, -16, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.shadowBlur = 0;
  ctx.fillStyle = threat.color;
  roundedRect(-10, -8, 20, 24, 7);
  ctx.fill();

  ctx.strokeStyle = threat.color;
  ctx.beginPath();
  ctx.moveTo(-10, 0);
  ctx.lineTo(-20, 9);
  ctx.moveTo(10, 0);
  ctx.lineTo(20, 9);
  ctx.moveTo(-5, 16);
  ctx.lineTo(-12, 28);
  ctx.moveTo(5, 16);
  ctx.lineTo(12, 28);
  ctx.stroke();

  drawThreatAccessory(threat);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 8px Segoe UI";
  ctx.textAlign = "center";
  ctx.fillText(threat.short, 0, 5);
  ctx.restore();
}

function drawThreatAccessory(threat) {
  ctx.strokeStyle = "#ffffff";
  ctx.fillStyle = "#ffffff";
  if (threat.id === "bug") {
    ctx.beginPath();
    ctx.moveTo(-5, -23);
    ctx.lineTo(-11, -30);
    ctx.moveTo(5, -23);
    ctx.lineTo(11, -30);
    ctx.stroke();
  } else if (threat.id === "deadline") {
    ctx.beginPath();
    ctx.arc(0, -16, 4, 0, Math.PI * 2);
    ctx.moveTo(0, -16);
    ctx.lineTo(0, -20);
    ctx.moveTo(0, -16);
    ctx.lineTo(3, -14);
    ctx.stroke();
  } else {
    roundedRect(8, -31, 18, 12, 4);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(11, -19);
    ctx.lineTo(7, -14);
    ctx.stroke();
  }
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
  ctx.arc(0, -10, character.radius * 0.72, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.shadowBlur = 0;
  roundedRect(-character.radius * 0.78, -2, character.radius * 1.56, character.radius * 1.55, 7);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#07111f";
  ctx.beginPath();
  ctx.arc(4, -13, 2.1, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#f5e960";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(12, -4);
  ctx.lineTo(27, -22);
  ctx.stroke();
  ctx.fillStyle = "#f5e960";
  polygon(30, -25, 5, 3);
  ctx.fill();

  if (state.slashClock > 0) {
    ctx.globalAlpha = state.slashClock / 0.22;
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(0, 0, SWORD_RANGE, -0.9, 0.9);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }
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

function drawStatusBars() {
  const barX = 18;
  const barY = 16;
  drawBar(barX, barY, 178, 11, state.integrity / 100, "#37f0d4", "Integrity");
  drawBar(barX, barY + 20, 178, 11, state.rejection / MAX_REJECTION, "#ff4d6d", "Rejection Gate");

  ctx.fillStyle = "rgba(248, 255, 254, 0.82)";
  ctx.font = "bold 12px Segoe UI";
  ctx.textAlign = "left";
  ctx.fillText(state.message, 18, canvas.height - 18);
}

function drawBar(x, y, width, height, value, color, label) {
  ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
  roundedRect(x, y, width, height, height / 2);
  ctx.fill();
  ctx.fillStyle = color;
  roundedRect(x, y, Math.max(2, width * Math.max(0, Math.min(1, value))), height, height / 2);
  ctx.fill();
  ctx.fillStyle = "rgba(248, 255, 254, 0.8)";
  ctx.font = "bold 9px Segoe UI";
  ctx.textAlign = "left";
  ctx.fillText(label, x + width + 8, y + 9);
}

function drawReadyScreen(character) {
  ctx.fillStyle = "rgba(7, 17, 31, 0.72)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#e9fffb";
  ctx.font = "700 32px Georgia";
  ctx.textAlign = "center";
  ctx.fillText("Survive 60 seconds and keep the defense gate open", canvas.width / 2, canvas.height / 2 - 30);
  ctx.fillStyle = "rgba(233, 255, 251, 0.82)";
  ctx.font = "600 17px Segoe UI";
  ctx.fillText("Defend Bugs, Deadlines, and Peer Reviewers before they reach their objects.", canvas.width / 2, canvas.height / 2 + 6);
  ctx.fillStyle = character.color;
  ctx.font = "700 20px Segoe UI";
  ctx.fillText(`Selected defender: ${character.name}`, canvas.width / 2, canvas.height / 2 + 42);
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

function roundedRect(x, y, width, height, radius) {
  const r = Math.min(radius, Math.abs(width) / 2, Math.abs(height) / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function normalize(x, y) {
  const length = Math.hypot(x, y) || 1;
  return { x: x / length, y: y / length };
}

function pathDirection(entity, target) {
  const start = { col: Math.floor(entity.x / TILE), row: Math.floor(entity.y / TILE) };
  const end = { col: Math.floor(target.x / TILE), row: Math.floor(target.y / TILE) };

  if (start.col === end.col && start.row === end.row) {
    return normalize(target.x - entity.x, target.y - entity.y);
  }

  const queue = [start];
  const visited = new Set([`${start.col},${start.row}`]);
  const parent = new Map();

  for (let i = 0; i < queue.length; i += 1) {
    const current = queue[i];
    if (current.col === end.col && current.row === end.row) break;

    directions.forEach((direction) => {
      const next = { col: current.col + direction.x, row: current.row + direction.y };
      const key = `${next.col},${next.row}`;
      if (visited.has(key) || isWallTile(next.col, next.row)) return;
      visited.add(key);
      parent.set(key, current);
      queue.push(next);
    });
  }

  const endKey = `${end.col},${end.row}`;
  if (!parent.has(endKey)) {
    return normalize(target.x - entity.x, target.y - entity.y);
  }

  let step = end;
  let previous = parent.get(endKey);
  while (previous && !(previous.col === start.col && previous.row === start.row)) {
    step = previous;
    previous = parent.get(`${step.col},${step.row}`);
  }

  const stepCenter = { x: step.col * TILE + TILE / 2, y: step.row * TILE + TILE / 2 };
  return normalize(stepCenter.x - entity.x, stepCenter.y - entity.y);
}

function averageThreatPower() {
  const values = Object.values(state.threatPower);
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function updateHud() {
  scoreEl.textContent = Math.max(0, state.score).toString();
  defendedEl.textContent = state.defended.toString();
  integrityEl.textContent = `${Math.round(state.integrity)}%`;
  rejectionEl.textContent = `${Math.round(state.rejection)}%`;
  timerEl.textContent = `${Math.max(0, ROUND_SECONDS - state.elapsed).toFixed(1)}s`;
  threatPowerEl.textContent = averageThreatPower().toFixed(1);
  bugDefenseEl.textContent = state.targetScores.bug.toString();
  deadlineDefenseEl.textContent = state.targetScores.deadline.toString();
  reviewDefenseEl.textContent = state.targetScores.review.toString();
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

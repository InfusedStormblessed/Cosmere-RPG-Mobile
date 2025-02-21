const player1 = document.getElementById('player1');
const player2 = document.getElementById('player2');
const player1HealthBar = document.getElementById('player1-health');
const player2HealthBar = document.getElementById('player2-health');
const winScreen = document.getElementById('win-screen');
const winMessage = document.getElementById('win-message');
const restartButton = document.getElementById('restart-button');
const gameContainer = document.getElementById('game-container');

const p1LeftButton = document.getElementById('p1-left');
const p1RightButton = document.getElementById('p1-right');
const p1AttackButton = document.getElementById('p1-attack');
const p1AttackTypeButton = document.getElementById('p1-attack-type');
const p2LeftButton = document.getElementById('p2-left');
const p2RightButton = document.getElementById('p2-right');
const p2AttackButton = document.getElementById('p2-attack');
const p2AttackTypeButton = document.getElementById('p2-attack-type');

let player1X = 100;
let player2X = gameContainer.offsetWidth - 150;
let player1Y = 275;
let player2Y = 275;
let player1Attacking = false;
let player2Attacking = false;
let player1AttackType = 1;
let player2AttackType = 1;
let player1Health = 100;
let player2Health = 100;

const playerSpeed = 5;

function checkCollision() {
  const rect1 = player1.getBoundingClientRect();
  const rect2 = player2.getBoundingClientRect();

  if (rect1.left < rect2.right &&
      rect1.right > rect2.left &&
      rect1.top < rect2.bottom &&
      rect1.bottom > rect2.top &&
      player1Attacking && player2Attacking) {
    if (player1AttackType === player2AttackType) {
      player1Health -= 10;
      player2Health -= 10;
    } else {
      if (player1AttackType === 1) player2Health -= 20;
      else player1Health -= 20;
    }
    updateHealthBars();
    if (player1Health <= 0 || player2Health <= 0) {
      endGame();
    }
  }
}

function updatePlayers() {
  player1.style.left = player1X + 'px';
  player1.style.top = player1Y + 'px';
  player2.style.left = player2X + 'px';
  player2.style.top = player2Y + 'px';

  if (player1Attacking) {
    player1.classList.add(player1AttackType === 1 ? 'attack' : 'attack2');
  } else {
    player1.classList.remove('attack', 'attack2');
  }

  if (player2Attacking) {
    player2.classList.add(player2AttackType === 1 ? 'attack' : 'attack2');
  } else {
    player2.classList.remove('attack', 'attack2');
  }

  checkCollision();
  requestAnimationFrame(updatePlayers);
}

function updateHealthBars() {
  player1HealthBar.style.width = player1Health + '%';
  player1HealthBar.style.backgroundColor = player1Health > 50 ? 'green' : player1Health > 20 ? 'yellow' : 'red';
  player2HealthBar.style.width = player2Health + '%';
  player2HealthBar.style.backgroundColor = player2Health > 50 ? 'green' : player2Health > 20 ? 'yellow' : 'red';
}

function endGame() {
  winMessage.textContent = player1Health <= 0 ? 'Player 2 Wins!' : 'Player 1 Wins!';
  winScreen.classList.remove('hidden');
}

restartButton.addEventListener('click', () => {
  location.reload();
});

document.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'a':
      player1X = Math.max(0, player1X - playerSpeed);
      break;
    case 'd':
      player1X = Math.min(gameContainer.offsetWidth - 50, player1X + playerSpeed);
      break;
    case 'w':
      player1Attacking = true;
      break;
    case 's':
      player1AttackType = player1AttackType === 1 ? 2 : 1;
      break;
    case 'ArrowLeft':
      player2X = Math.max(0, player2X - playerSpeed);
      break;
    case 'ArrowRight':
      player2X = Math.min(gameContainer.offsetWidth - 50, player2X + playerSpeed);
      break;
    case 'ArrowUp':
      player2Attacking = true;
      break;
    case 'ArrowDown':
      player2AttackType = player2AttackType === 1 ? 2 : 1;
      break;
  }
});

document.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'w':
      player1Attacking = false;
      break;
    case 'ArrowUp':
      player2Attacking = false;
      break;
  }
});

// Mobile Controls
p1LeftButton.addEventListener('touchstart', () => { player1X = Math.max(0, player1X - playerSpeed); });
p1RightButton.addEventListener('touchstart', () => { player1X = Math.min(gameContainer.offsetWidth - 50, player1X + playerSpeed); });
p1AttackButton.addEventListener('touchstart', () => { player1Attacking = true; });
p1AttackButton.addEventListener('touchend', () => { player1Attacking = false; });
p1AttackTypeButton.addEventListener('touchstart', () => { player1AttackType = player1AttackType === 1 ? 2 : 1; });

p2LeftButton.addEventListener('touchstart', () => { player2X = Math.max(0, player2X - playerSpeed); });
p2RightButton.addEventListener('touchstart', () => { player2X = Math.min(gameContainer.offsetWidth - 50, player2X + playerSpeed); });
p2AttackButton.addEventListener('touchstart', () => { player2Attacking = true; });
p2AttackButton.addEventListener('touchend', () => { player2Attacking = false; });
p2AttackTypeButton.addEventListener('touchstart', () => { player2AttackType = player2AttackType === 1 ? 2 : 1; });

updateHealthBars();
updatePlayers();

const output = document.getElementById('output');
const input = document.getElementById('input');
const submit = document.getElementById('submit');

let player = {
  name: '',
  class: '',
  hp: 0,
  maxHp: 0,
  mp: 0,
  maxMp: 0,
  atk: 0,
  def: 0,
  exp: 0,
  level: 1,
  inventory: [],
  shield: 0
};

let enemy = {
  name: '',
  hp: 0,
  atk: 0
};

let gameState = 'characterCreation';
let playerPosition = { x: 1, y: 1 };
let enemyPosition = { x: 0, y: 0 };

let classes = {
  windrunner: { name: 'Windrunner', hp: 120, atk: 12, def: 8, mp: 20 },
  lightweaver: { name: 'Lightweaver', hp: 100, atk: 15, def: 5, mp: 30 },
  edgedancer: { name: 'Edgedancer', hp: 110, atk: 10, def: 10, mp: 25 },
  truthwatcher: { name: 'Truthwatcher', hp: 90, atk: 8, def: 12, mp: 35 },
  skybreaker: {name: 'Skybreaker', hp:130, atk:18, def: 6, mp:15},
  willshaper: {name: 'Willshaper', hp: 105, atk: 9, def: 9, mp: 30},
  stoneward: {name: 'Stoneward', hp: 150, atk: 8, def: 15, mp: 10}
};

let enemies = {
  skaze: { name: 'Skaze', hp: 60, atk: 12 },
  voidbringer: { name: 'Voidbringer', hp: 80, atk: 18 },
  chull: { name: 'Chull', hp: 100, atk: 20 },
  fused: { name: 'Fused', hp: 70, atk: 15 },
  unmade: {name: 'Unmade', hp: 150, atk: 25}
};

let items = {
  10: { name: 'Stormlight Vial', effect: 'heal', amount: 40 },
  20: { name: 'Infused Gem', effect: 'mana', amount: 30 },
  30: { name: 'Shardblade Fragment', effect: 'atk', amount: 8 },
  40: { name: 'Shardplate Plating', effect: 'def', amount: 5 },
  50: {name: 'Sphere of Protection', effect: 'shield', amount: 30},
  60: {name: 'Voidlight Crystal', effect: 'enemyDamage', amount: 20}
};

let mapData = [
  [1, 1, 1, 1, 1],
  [1, 0, 0, 2, 1],
  [1, 0, 1, 0, 1],
  [1, 3, 0, 0, 1],
  [1, 1, 1, 1, 1]
];

let mapFeatures = {
  2: 'Ruined Tower',
  3: 'Cremling Nest'
};

function print(text) {
  output.innerHTML += `<p>${text}</p>`;
  output.scrollTop = output.scrollHeight;
}

function startGame() {
  print('Welcome to Roshar!');
  print('Choose your Order: 1. Windrunner, 2. Lightweaver, 3. Edgedancer, 4. Truthwatcher, 5. Skybreaker, 6. Willshaper, 7. Stoneward');
}

function handleInput() {
  const command = input.value.trim();
  input.value = '';

  if (gameState === 'characterCreation') {
    if (player.name === '') {
      let classKey = Object.keys(classes)[parseInt(command) - 1];
      if (classes[classKey]) {
        player.class = classes[classKey].name;
        player.hp = classes[classKey].hp; player.maxHp = classes[classKey].hp;
        player.atk = classes[classKey].atk; player.def = classes[classKey].def;
        player.mp = classes[classKey].mp; player.maxMp = classes[classKey].mp;
        print('Enter your name:');
      } else {
        print('Invalid class choice.');
        startGame();
      }
    } else {
      player.name = command;
      gameState = 'exploration';
      print(`Welcome, ${player.name}, ${player.class}!`);
      showExplorationOptions();
    }
  } else if (gameState === 'exploration') {
    handleExploration(command);
  } else if (gameState === 'combat') {
    handleCombat(command);
  }
}

function showExplorationOptions() {
  print('1. Move, 2. Inventory, 3. Fight');
}

function handleExploration(command) {
  if (command === '1') {
    print('Move N/S/E/W');
    input.addEventListener('keydown', handleDirection);
  } else if (command === '2') {
    print(`Inventory: ${player.inventory.join(', ')}`);
    print('Use item? (item number or "no")');
    input.addEventListener('keydown', handleItemUse);
  } else if (command === '3') {
    startCombat();
  } else {
    print('Invalid command.');
    showExplorationOptions();
  }
  updateMap();
}

function handleDirection(event) {
  let direction = event.key;
  movePlayer(direction);
  input.removeEventListener('keydown', handleDirection);
}

function handleItemUse(event) {
  input.removeEventListener('keydown', handleItemUse);
  if (event.key === 'Enter') {
    let itemNumber = parseInt(input.value);
    input.value = '';
    let itemIndex = player.inventory.indexOf(itemNumber);
    if (itemIndex !== -1 && items[itemNumber]) {
      let item = items[itemNumber];
      if (item.effect === 'heal') {
        player.hp = Math.min(player.maxHp, player.hp + item.amount);
        print(`Used ${item.name}. Healed ${item.amount} HP.`);
      } else if (item.effect === 'mana') {
        player.mp = Math.min(player.maxMp, player.mp + item.amount);
        print(`Used ${item.name}. Restored ${item.amount} MP.`);
      } else if (item.effect === 'atk') {
        player.atk += item.amount;
        print(`Used ${item.name}. Attack increased by ${item.amount}.`);
      } else if (item.effect === 'def') {
        player.def += item.amount;
        print(`Used ${item.name}. Defense increased by ${item.amount}.`);
      } else if (item.effect === 'shield') {
        player.shield = item.amount;
        print(`Used ${item.name}. You have a shield of ${item.amount} damage.`);
      } else if (item.effect === 'enemyDamage') {
        enemy.hp = Math.max(0, enemy.hp - item.amount);
        print(`Used ${item.name}. Enemy takes ${item.amount} damage.`);
      }
      player.inventory.splice(itemIndex, 1);
    } else {
      print('Invalid item number.');
    }
    showExplorationOptions();
  } else if (input.value.toLowerCase() === 'no') {
      input.value = '';
      showExplorationOptions();
      input.removeEventListener('keydown', handleItemUse);
  }
}

function startCombat() {
  gameState = 'combat';
  let enemyKeys = Object.keys(enemies);
  let randomEnemyKey = enemyKeys[Math.floor(Math.random() * enemyKeys.length)];
  enemy = { ...enemies[randomEnemyKey] };
  enemyPosition.x = Math.floor(Math.random() * 5) + 1;
  enemyPosition.y = Math.floor(Math.random() * 5) + 1;
  print(`A wild ${enemy.name} appears!`);
  showCombatOptions();
  updateMap();}

function showCombatOptions() {
  print(`Enemy: ${enemy.name}, HP: ${enemy.hp}`);
  print('1. Attack, 2. Run, 3. Magic attack');
}

function handleCombat(command) {
  if (command === '1') {
    const playerDamage = Math.floor(Math.random() * player.atk) + 1;
    enemy.hp -= playerDamage;
    print(`You deal ${playerDamage} damage.`);
    if (enemy.hp <= 0) {
      print(`You defeated the ${enemy.name}!`);
      player.exp += 20;
      if (player.exp >= 100) {
        player.level++; player.exp -= 100; player.maxHp += 20; player.atk += 5; player.def += 2; player.maxMp += 10; player.hp = player.maxHp; player.mp = player.maxMp;
        print(`You Leveled up!`);
      }
      gameState = 'exploration';
      enemyPosition.x = 0;
      enemyPosition.y = 0;
      showExplorationOptions();
      updateMap();
      return;
    }
    const enemyDamage = Math.floor(Math.random() * enemy.atk) + 1;
    if (player.shield > 0) {
      let damageTaken = Math.min(enemyDamage, player.shield);
      player.shield -= damageTaken;
      enemyDamage -= damageTaken;
      print(`Your shield absorbed ${damageTaken} damage.`);
    }
    player.hp = Math.max(0, player.hp - enemyDamage);
    print(`The ${enemy.name} attacks! You take ${enemyDamage} damage.`);
    if (player.hp <= 0) {
      print('You were defeated!');
      gameState = 'exploration';
      player.hp = player.maxHp;
      player.mp = player.maxMp;
      enemyPosition.x = 0;
      enemyPosition.y = 0;
      showExplorationOptions();
      updateMap();
      return;
    }
    showCombatOptions();
  } else if (command === '2') {
    print('You ran away!');
    gameState = 'exploration';
    enemyPosition.x = 0;
    enemyPosition.y = 0;
    showExplorationOptions();
    updateMap();
  } else if (command === '3' && player.mp >= 5) {
    player.mp -= 5;
    const playerDamage = Math.floor(Math.random() * (player.atk + 10)) + 1;
    enemy.hp -= playerDamage;
    print(`You deal ${playerDamage} magic damage.`);
    if (enemy.hp <= 0) {
      print(`You defeated the ${enemy.name}!`);
      player.exp += 20;
      if (player.exp >= 100) {
        player.level++; player.exp -= 100; player.maxHp += 20; player.atk += 5; player.def += 2; player.maxMp += 10; player.hp = player.maxHp; player.mp = player.maxMp;
        print(`You Leveled up!`);
      }
      gameState = 'exploration';
      enemyPosition.x = 0;
      enemyPosition.y = 0;
      showExplorationOptions();
      updateMap();
      return;
    }
    const enemyDamage = Math.floor(Math.random() * enemy.atk) + 1;
    if (player.shield > 0) {
      let damageTaken = Math.min(enemyDamage, player.shield);
      player.shield -= damageTaken;
      enemyDamage -= damageTaken;
      print(`Your shield absorbed ${damageTaken} damage.`);
    }
    player.hp = Math.max(0, player.hp - enemyDamage);
    print(`The ${enemy.name} attacks! You take ${enemyDamage} damage.`);
    if (player.hp <= 0) {
      print('You were defeated!');
      gameState = 'exploration';
      player.hp = player.maxHp;
      player.mp = player.maxMp;
      enemyPosition.x = 0;
      enemyPosition.y = 0;
      showExplorationOptions();
      updateMap();
      return;
    }
    showCombatOptions();
  } else {
    print('Invalid command.');
    showCombatOptions();
  }

  // Enemy AI
  if (gameState === 'combat' && enemy.hp > 0) {
    if (Math.random() < 0.7) {
      const enemyDamage = Math.floor(Math.random() * enemy.atk) + 1;
      if (player.shield > 0) {
        let damageTaken = Math.min(enemyDamage, player.shield);
        player.shield -= damageTaken;
        enemyDamage -= damageTaken;
        print(`Your shield absorbed ${damageTaken} damage.`);
      }
      player.hp = Math.max(0, player.hp - enemyDamage);
      print(`The ${enemy.name} attacks! You take ${enemyDamage} damage.`);
    } else {
      print(`The ${enemy.name} hesitates.`);
    }
  }
}

function updateMap() {
  const mapContainer = document.querySelector('.map');
  if (mapContainer) {
    mapContainer.remove();
  }

  const map = document.createElement('div');
  map.classList.add('map');
  document.getElementById('game-container').appendChild(map);

  for (let y = 1; y <= 5; y++) {
    for (let x = 1; x <= 5; x++) {
      const cell = document.createElement('div');
      cell.classList.add('map-cell');
      map.appendChild(cell);

      if (playerPosition.x === x && playerPosition.y === y) {
        const playerDiv = document.createElement('div');
        playerDiv.classList.add('player');
        cell.appendChild(playerDiv);
      }

      if (enemyPosition.x === x && enemyPosition.y === y && gameState === 'combat') {
        const enemyDiv = document.createElement('div');
        enemyDiv.classList.add('enemy', enemy.name.toLowerCase());
        cell.appendChild(enemyDiv);
      }
      if (mapData[y - 1][x - 1] === 1) {
        cell.style.backgroundColor = 'gray';
      } else if (mapData[y - 1][x - 1] === 2 || mapData[y - 1][x - 1] === 3) {
        cell.style.backgroundColor = 'brown';
      }
    }
  }
}

document.getElementById('up').addEventListener('click', () => movePlayer('ArrowUp'));
document.getElementById('down').addEventListener('click', () => movePlayer('ArrowDown'));
document.getElementById('left').addEventListener('click', () => movePlayer('ArrowLeft'));
document.getElementById('right').addEventListener('click', () => movePlayer('ArrowRight'));

function movePlayer(direction) {
  if (direction === 'ArrowUp' && playerPosition.y > 1) {
    playerPosition.y--;
  } else if (direction === 'ArrowDown' && playerPosition.y < 5) {
    playerPosition.y++;
  } else if (direction === 'ArrowLeft' && playerPosition.x > 1) {
    playerPosition.x--;
  } else if (direction === 'ArrowRight' && playerPosition.x < 5) {
    playerPosition.x++;
  }
  if (mapData[playerPosition.y - 1][playerPosition.x - 1] === 1) {
    if (direction === 'ArrowUp' || direction === 'ArrowDown' || direction === 'ArrowLeft' || direction === 'ArrowRight'){
      playerPosition.x = playerPosition.x;
      playerPosition.y = playerPosition.y;
    }
  }
  updateMap();
  if (Math.random() < .3) {
    startCombat();
  } else if (mapData[playerPosition.y - 1][playerPosition.x - 1] === 2 || mapData[playerPosition.y - 1][playerPosition.x - 1] === 3) {
    print(`You find a ${mapFeatures[mapData[playerPosition.y - 1][playerPosition.x - 1]]}!`);
  } else {
    showExplorationOptions();
  }
}

submit.addEventListener('click', handleInput);
input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    handleInput();
  }
});

startGame();
updateMap();

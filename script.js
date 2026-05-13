const db = "https://tinkr.tech/sdb/denni_antiyoy/antiyoy";

let selectedHex = null;

async function getData() {
  const response = await fetch(db);
  const state = await response.json();
  const map = document.getElementById('map');

  const player = state.players?.[0] ?? "-";
  const money = state.money ?? "-";
  const income = state.income ?? "-";
  const upkeep = state.upkeep ?? "-";
  const turn = state.turn ?? "-";
  const currentPlayer = state.current_player ?? "-";

  const infopanel = document.getElementById('info-panel');
  infopanel.innerHTML = `
    <div class="stat">
      <span class="stat-label">Turn</span>
      <span class="stat-value">${turn}</span>
    </div>
    <div class="stat">
      <span class="stat-label">Player</span>
      <span class="stat-value">${currentPlayer}</span>
    </div>
    <div class="stat">
      <span class="stat-label">Money</span>
      <span class="stat-value">${money}</span>
    </div>
  `;

  map.innerHTML = '';

  for (const hex of state.map) {
    if (hex.type === 'impassable') continue;

    // div for hex click
    const hexWrapper = document.createElement('div');
    hexWrapper.style.position = 'absolute';
    hexWrapper.style.left = hex.x + 'px';
    hexWrapper.style.top = hex.y + 'px';
    hexWrapper.style.width = hex.width + 'px';
    hexWrapper.style.height = hex.height + 'px';
    hexWrapper.style.cursor = 'pointer';
    hexWrapper.dataset.col = hex.col;
    hexWrapper.dataset.row = hex.row;

    // show selected hex
    if (
      selectedHex &&
      selectedHex.col === hex.col &&
      selectedHex.row === hex.row
    ) {
      hexWrapper.style.outline = '3px solid yellow';
      hexWrapper.style.zIndex = '10';
    }

    hexWrapper.addEventListener('click', () => onHexClick(hex));

    // background tile
    const img = document.createElement('img');
    img.src = 'https://tinkr.tech' + hex.image;
    img.style.width = '100%';
    img.style.height = '100%';
    hexWrapper.appendChild(img);

    // building overlay
    if (hex.building_image !== null) {
      const buildingImg = document.createElement('img');
      buildingImg.src = 'https://tinkr.tech' + hex.building_image;
      buildingImg.style.position = 'absolute';
      buildingImg.style.left = '0';
      buildingImg.style.top = '0';
      buildingImg.style.width = '100%';
      buildingImg.style.height = '100%';
      hexWrapper.appendChild(buildingImg);
    }

    // unit overlay
    if (hex.unit_image !== null) {
      const unitImg = document.createElement('img');
      unitImg.src = 'https://tinkr.tech' + hex.unit_image;
      unitImg.style.position = 'absolute';
      unitImg.style.left = '0';
      unitImg.style.top = '0';
      unitImg.style.width = '100%';
      unitImg.style.height = '100%';
      hexWrapper.appendChild(unitImg);
    }

    map.appendChild(hexWrapper);
  }
}

// first click = select, second = move
function onHexClick(hex) {
  const playerKey = sessionStorage.getItem("player_key");
  if (!playerKey) {
    alert("join the game first!");
    return;
  }

  if (!selectedHex) {
    selectedHex = { col: hex.col, row: hex.row };
    console.log("Selected hex:", selectedHex);
    getData(); 
  } else {
    const from = selectedHex;
    const to = { col: hex.col, row: hex.row };
    selectedHex = null;

    if (from.col === to.col && from.row === to.row) {
      // same hex clicked
      getData();
      return;
    }

    move(playerKey, from, to);
  }
}

// jion
async function login() {
  const userLogin = prompt("Enter your username:");
  if (!userLogin) return;

  const res = await fetch(db, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "join",
      username: userLogin
    })
  });

  const data = await res.json();

  if (data.player_key) {
    sessionStorage.setItem("player_key", data.player_key);
    sessionStorage.setItem("login", userLogin);
    alert("Joined as " + userLogin + "!");
  } else {
    alert(data.error ?? "failed to join");
  }
}

// start
async function start() {
  const res = await fetch(db, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "start" })
  });

  const data = await res.json();
  if (data.ok) {
    alert("Game started!");
  } else {
    alert(data.error ?? "failed to start the game");
  }
}

// move
async function move(playerKey, from, to) {
  const res = await fetch(db, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "move",
      player_key: playerKey,
      from: { col: from.col, row: from.row },
      to:   { col: to.col,   row: to.row   }
    })
  });

  const data = await res.json();
  if (data.ok) {
    console.log("move done:", from, "to", to);
  } else {
    alert(data.error ?? "move failed");
  }

  getData(); // refresh
}

// end turn
async function endTurn() {
  const playerKey = sessionStorage.getItem("player_key");
  if (!playerKey) { alert("join first!"); return; }

  const res = await fetch(db, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "end_turn",
      player_key: playerKey
    })
  });

  const data = await res.json();
  if (!data.ok) alert(data.error ?? "error ending turn");
  getData();
}

// gg
async function surrender() {
  const playerKey = sessionStorage.getItem("player_key");
  if (!playerKey) { alert("join first!"); return; }

  if (!confirm("surrend?")) return;

  const res = await fetch(db, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "surrender",
      player_key: playerKey
    })
  });

  const data = await res.json();
  if (!data.ok) alert(data.error);
  getData();
}

getData();
setInterval(getData, 1500);
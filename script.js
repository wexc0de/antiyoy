async function getData() {
  const response = await fetch('https://tinkr.tech/sdb/denni_antiyoy/antiyoy');
  const state = await response.json();
  const map = document.getElementById('map');

const player = state.players[0];

const money = state.money;
const income = state.income;
const upkeep = state.upkeep;
const turn = state.turn;
const currentPlayer = state.current_player;

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
`

map.innerHTML = '';

  for (const hex of state.map) {
    if (hex.type === 'impassable') continue;

    // background tile
    const img = document.createElement('img');
    img.src = 'https://tinkr.tech' + hex.image;
    img.style.position = 'absolute';
    img.style.left = hex.x + 'px';
    img.style.top = hex.y + 'px';
    img.style.width = hex.width + 'px';
    img.style.height = hex.height + 'px';
    map.appendChild(img);

    // building overlay 
    if (hex.building_image !== null) {
     const buildingImg = document.createElement('img');
      buildingImg.src = 'https://tinkr.tech' + hex.building_image;
      buildingImg.style.position = 'absolute';
      buildingImg.style.left = hex.x + 'px';
      buildingImg.style.top = hex.y + 'px';
      buildingImg.style.width = hex.width + 'px';
      buildingImg.style.height = hex.height + 'px';
      map.appendChild(buildingImg);
    }

    // unit ovelray
    if (hex.unit_image !== null) {
      const unitImg = document.createElement('img');
      unitImg.src = 'https://tinkr.tech' + hex.unit_image;
      unitImg.style.position = 'absolute';
      unitImg.style.left = hex.x + 'px';
      unitImg.style.top = hex.y + 'px';
      unitImg.style.width = hex.width + 'px';
      unitImg.style.height = hex.height + 'px';
      map.appendChild(unitImg);
    }
  }
}

getData();
setInterval(getData, 1500);
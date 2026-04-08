async function getData() {
  const response = await fetch('https://tinkr.tech/sdb/denni_antiyoy/antiyoy');
  const state = await response.json();
  const map = document.getElementById('map');

  for (const hex of state.map) {
    if (hex.type === 'impassable') continue;

    const img = document.createElement('img');
    img.src = 'https://tinkr.tech' + hex.image;
    img.style.position = 'absolute';
    img.style.left = hex.x + 'px';
    img.style.top = hex.y + 'px';
    img.style.width = hex.width + 'px';
    img.style.height = hex.height + 'px';
    map.appendChild(img);
  }
}

getData();
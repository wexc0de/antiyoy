async function getWeather() {
  const response = await fetch('tinkr.tech/sdb/denni_antiyoy/antiyoy');
  const data = await response.json();
  console.log(data.temperature);
}
async function getData() {
  const response = await fetch('https://tinkr.tech/sdb/denni_antiyoy/antiyoy');
  const data = await response.json();
  console.log(data);
}
getData()
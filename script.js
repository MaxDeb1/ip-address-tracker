const input = document.getElementById("addressInput");
const submitBtn = document.querySelector("#submitBtn");

let ip = "";
/* 192.212.174.101 */

async function getInfos(withIP = true) {
    let infos;
    let timezone;

    if(withIP) {
    infos = await fetch('http://ip-api.com/json/')
    .then((response) => response.json())
    .then((jsonResponse) => jsonResponse)

    timezone = await fetch(`https://geo.ipify.org/api/v2/country?apiKey=at_zX0wbwU506D4z2TgRQZkvwQm6zYaK&ipAddress=${infos.query}`)
    .then(resultat => resultat.json())
    .then(json => json.location.timezone)

    } else {
      infos = await fetch(`http://ip-api.com/json/${ip}`)
          .then((response) => response.json())
          .then((jsonResponse) => jsonResponse)

      timezone = await fetch(`https://geo.ipify.org/api/v2/country?apiKey=at_zX0wbwU506D4z2TgRQZkvwQm6zYaK&ipAddress=${ip}`)
          .then(resultat => resultat.json())
          .then(json => json.location.timezone)
    }
    console.log(infos);
  
    displayInfos(infos, timezone)
    getMap(infos)
}

function displayInfos(infos, timezone) {
    let ip = infos.query;
    let location = infos.city;
    let isp = infos.isp;

    document.getElementById("ip-address").textContent = ip;
    document.getElementById("location").textContent = location;
    document.getElementById("timezone").textContent = "UTC " + timezone;
    document.getElementById("isp").textContent = isp;
}

function initializingMap() {
    const container = L.DomUtil.get('map');
    if(container != null){
        container._leaflet_id = null;
    }
}

function getMap(infos) {
    initializingMap()

    let lng = infos.lon;
    let lat = infos.lat;

    map = L.map('map', { zoomControl: false, scrollWheelZoom: false }).setView([lat, lng], 13);
    
    var tiles = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1
    }).addTo(map);

    var markerIcon = L.icon({
        iconUrl: './images/icon-location.svg',
    });

    L.marker([lat, lng], {icon: markerIcon}).addTo(map);
}

submitBtn.addEventListener('click', () => {
    console.log(input.value);
    ip = input.value;
    getInfos(false);
});

getInfos();
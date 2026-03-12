let mapOptions = {
    center: [37.9755648, 23.7348324],
    zoom: 6
}
let map = new L.map('map', mapOptions);
let layer = new L.TileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png');

map.addLayer(layer);
// marker =  L.marker([37.9755648, 23.7348324]).addTo(map);
const cor = document.getElementById('cordinates');

function onMapClick(e) {
    // const url = "https://re.jrc.ec.europa.eu/api/v5_2/seriescalc?lat=45&lon=8&outputformat=json";
    //https:re.jrc.ec.europa.eu/api/v5_3/MRcalc?lat=37.98&lon=23.72&outputformat=json

    const lat = e.latlng.lat;
    const lon = e.latlng.lng;

    // const url = `https://re.jrc.ec.europa.eu/api/v5_3/MRcalc?lat=${lat}&lon=${lon}&outputformat=json`;

    // fetch(url)
    // .then(r => r.json())
    // .then(data => console.log(data));

    // alert("You clicked the map at " + e.latlng.toString());

    // let somt = e.latlng.toString().split("(");
    // alert(somt);
    // alert("First lenght split at ( " + somt.length);
    // let n = somt[1].split(")");
    // alert(n);
    // alert("Second lenght split at ) " + n.length);
    // let nn = n[0].split(",");
    // alert(nn);
    // alert("Third lenght split at , " + nn.length);
    // let cordinates =
    // alert(cordinates);
    // alert(cordinates.length);  

    // KEEP THIS LATER
    // marker =  L.marker(e.latlng).addTo(map);
    cor.value = lat + " " + lon;
}

map.on('click', onMapClick);
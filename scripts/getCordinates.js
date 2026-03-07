let mapOptions = {
    center: [37.9755648, 23.7348324],
    zoom: 6
}

let map = new L.map('map', mapOptions);
let layer = new L.TileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png');

map.addLayer(layer);
// marker =  L.marker([37.9755648, 23.7348324]).addTo(map);
const cor = document.getElementById('cordinates');
// alert(cor.value)

function onMapClick(e) {
    // alert("You clicked the map at " + e.latlng.toString());
    let somt = e.latlng.toString().split("(");
    // alert(somt);
    // alert("First lenght split at ( " + somt.length);
    let n = somt[1].split(")");
    // alert(n);
    // alert("Second lenght split at ) " + n.length);
    let nn = n[0].split(",");
    // alert(nn);
    // alert("Third lenght split at , " + nn.length);
    let cordinates = n[0] + n[1];
    // let cordinates =
    // alert(cordinates);
    // alert(cordinates.length);  

    // KEEP THIS LATER
    // marker =  L.marker(e.latlng).addTo(map);
    cor.value = cordinates;

    // popup.setLatLng(e.latlng).setContent("You clicked the map at " + e.latlng.toString()).openOn(map);   
}

map.on('click', onMapClick);
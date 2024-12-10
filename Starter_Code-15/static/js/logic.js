// Create the tile layer
var streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// Initialize LayerGroups
var layers = {
  Quakes: new L.LayerGroup()
};

// Create the map
var map = L.map("map", {
  center: [0.000, 0.000],
  zoom: 2.5,
  layers: [
    layers.Quakes
  ]
});

// Add streetmap tile layer to the map
streetmap.addTo(map);

// Create  overlays object to add to the layer control
var overlays = {
  "Earthquakes": layers.Quakes
};
// Create a control for layers, and add overlays to it
L.control.layers(null, overlays).addTo(map);

// Perform call to retrieve the earthquake data for the month in json format
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(EarthquakeData) {

    console.log(EarthquakeData);

    let EarthquakeList = EarthquakeData.features;

    console.log(EarthquakeList[0]);
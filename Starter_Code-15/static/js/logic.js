// Create the tile layer (streetmap)
var streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// Initialize LayerGroups to store earthquake data
var layers = {
  Quakes: new L.LayerGroup() // Group for earthquake markers
};

// Create the map with a default center and zoom level
var map = L.map("map", {
  center: [0.000, 0.000],
  zoom: 2.5,
  layers: [layers.Quakes] // Set initial layer to earthquakes
});

// Add streetmap tile layer to the map
streetmap.addTo(map);

// Create overlay object for layer control (to toggle earthquake markers)
var overlays = {
  "Earthquakes": layers.Quakes
};

// Add layer control to the map (for switching between layers)
L.control.layers(null, overlays).addTo(map);

// Fetch earthquake data in GeoJSON format for the last week
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(EarthquakeData) {
  
  console.log(EarthquakeData); // Log the data for inspection
  let EarthquakeList = EarthquakeData.features; // Extract earthquake features
  console.log(EarthquakeList[0]); // Log the first earthquake data for inspection

  // Loop through each earthquake feature
  EarthquakeList.forEach(function(Earthquake) {
    var depth = Earthquake.geometry.coordinates[2]; // Get the depth of the earthquake

    // Normalize depth to create a scale for the circle's opacity (based on depth)
    let depthFill = depth / 300 + 0.1; 
    if (depthFill > 1) depthFill = 1; // Cap the value at 1 for maximum opacity

    // Function to determine color based on depth
    function getColor(depth) {
      return depth > 500 ? "#355E3B" :
             depth > 400 ? "#228B22" :
             depth > 300 ? "#5F8575" :
             depth > 200 ? "#50C878" :
             depth > 100 ? "#7CFC00" :
                            "#90EE90";
    }

    // Adjust earthquake size based on magnitude and latitude
    var EarthquakeSize = (Earthquake.properties.mag * 50000) * Math.cos((Earthquake.geometry.coordinates[1] / 180) * Math.PI);

    // Create a circle marker for each earthquake
    var newQuake = L.circle([Earthquake.geometry.coordinates[1], Earthquake.geometry.coordinates[0]], {
      color: 'black', // Border color of the circle
      weight: 1, // Border weight
      fillColor: getColor(Earthquake.geometry.coordinates[2]), // Fill color based on depth
      fillOpacity: 0.65, // Fill opacity
      radius: EarthquakeSize // Radius based on earthquake magnitude
    });

    // Add the marker to the earthquake layer group
    newQuake.addTo(layers.Quakes);

    // Bind a popup to the marker with relevant information
    newQuake.bindPopup("Magnitude: " + Earthquake.properties.mag + 
                        "<br>Depth: " + depth + 
                        "<br>Place: " + Earthquake.properties.place);
  });

  // Create a legend to display the depth-based color scale
  var info = L.control({
    position: "bottomright"
  });

  // Add content to the legend
  info.onAdd = function() {
    var div = L.DomUtil.create('div', 'info legend');
    var grades = [0, 100, 200, 300, 400, 500]; // Depth thresholds
    var labels = ["#355E3B", "#228B22", "#5F8575", "#50C878", "#7CFC00", "#90EE90"]; // Corresponding colors

    // Loop through the grades and labels to build the legend
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
        '<i style="background:' + labels[i] + '"></i> ' +
        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
  };

  // Add the info legend to the map
  info.addTo(map);
});

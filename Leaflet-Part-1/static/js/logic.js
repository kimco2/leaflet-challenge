// Store our API as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

  // Create the base layers
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });


// Create the map, setting centre, zoom, and layer
let myMap = L.map("map", {
center: [-10.510462, 105.053362],
zoom: 4,
layers: [street]
});

// Create basemaps
  let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
  };

// Create an earthquake layer
let earthquakes = new L.layerGroup(baseMaps);

// Define an object that contains the overlays
let overlayMaps = {
    Earthquakes: earthquakes
};

// Add a control to the map so the user can change the layers they look at
L.control.layers(baseMaps, overlayMaps).addTo(myMap);


// Get the style data for each earthquake included on the map. 
// Color is being set based on depth, and radius based on magnitude
function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColour(feature.geometry.coordinates[2]),  // I don't think this is working properly
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }
  
// This function sets the circle colour for the earthquake depending on its depth
function getColour(depth) {
    if (depth > 90) {
        return "#1f306e";
    }
    else if (depth > 70) {
        return "#553772";
    }
    else if (depth >50) {
        return "#ad2e24";
    }
    else if (depth > 30) {
        return "#8f3b76";
    }
    else if (depth > 10) {
        return "#c7417b";
    }
    else if (depth > -10){
    return "#f5487f";
    }
    else {
    return "#f5df48"
    }
};

// This function sets the radius of the earthquake circle marker based on its magnitude
function getRadius(mag) {
    return mag * 4;
};

// Get the geoJson data from the url
  d3.json(queryUrl).then(function(data) {
// Create a geoJson layer with the data
    L.geoJson(data, {
        // And turn the data into a circle marker on the map
        pointToLayer: function(feature, latlng) {
          console.log(data);
          return L.circleMarker(latlng);
        },
        // Set the style for each circle marker using the styleInfo function
        style: styleInfo,
        onEachFeature: function(feature, layer) {
            layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p><p>${new Date(feature.properties.time)}</p>`);
        }
        }).addTo(earthquakes);
  
    // Add the earthquake layer to the map
    earthquakes.addTo(myMap);
  });


// Create a legend
let legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {
let div = L.DomUtil.create("div", "legend");
  div.innerHTML += '<i style="background: #f5487f"></i><span>-10-10</span><br>';
  div.innerHTML += '<i style="background: #c7417b"></i><span>10-30</span><br>';
  div.innerHTML += '<i style="background: #8f3b76"></i><span>30-50</span><br>';
  div.innerHTML += '<i style="background: #ad2e24"></i><span>50-70</span><br>';
  div.innerHTML += '<i style="background: #553772"></i><span>70-90</span><br>';
  div.innerHTML += '<i style="background: #1f306e"></i><span>90+</span><br>';
  return div;
};
legend.addTo(myMap);




  // Create the base layers
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });


// Create the map, setting centre, zoom, and layer
let myMap = L.map("map", {
center: [-15.510462, 105.053362],
zoom: 3.5,
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

// Set the style data for each earthquake included on the map. Color is being set based on depth, and radius based on magnitude
function styleInfo(feature) {
    return {
      fillOpacity: 1,
      fillColor: getColour(feature.geometry.coordinates[2]), 
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }
  
// This function sets the circle colour for the earthquake depending on its depth
function getColour(depth) {
    if (depth > 90) {
        return "#19073B";
    }
    else if (depth > 70) {
        return "#573172";
    }
    else if (depth >50) {
        return "#804E74";
    }
    else if (depth > 30) {
        return "#A96A77";
    }
    else if (depth > 10) {
        return "#D18779";
    }
    else if (depth > -10){
    return "#F29455";
    }
    else {
    return "#FF51EB"  // I added this just in case there were any with a depth lower than -10
    }
};

// This function sets the radius of the earthquake circle marker based on its magnitude
function getRadius(mag) {
    return mag * 5;  
};

// Grab the geoJson data from the url (stored in the config.js file)
  d3.json(queryUrl).then(function(data) {
// Create a geoJson layer with the data
    L.geoJson(data, {
        // Turn the data into a circle marker on the map
        pointToLayer: function(feature, latlng) {
        return L.circleMarker(latlng);
        },
        // Set the style for each circle marker
        style: styleInfo,
        onEachFeature: function(feature, layer) {
            layer.bindPopup(`<h3>${feature.properties.place}</h3><hr>
            <p><strong>Coordinates:</strong> ${feature.geometry.coordinates[1]}, ${feature.geometry.coordinates[0]} 
            <br><strong>Magnitude:</strong> ${feature.properties.mag} 
            <br><strong>Depth:</strong> ${feature.geometry.coordinates[2]}
            <br>${new Date(feature.properties.time)}</p>`);
          }
        }).addTo(earthquakes);
  
    // Add the earthquake layer to the map
    earthquakes.addTo(myMap);
  });

// Create a legend
let legend = L.control({position: 'bottomright'});

// Create components of the legend (colour and text)
legend.onAdd = function (map) {
let div = L.DomUtil.create("div", "legend");
  div.innerHTML += '<i style="background: #F29455"></i><span>-10-10</span><br>';  
  div.innerHTML += '<i style="background: #D18779"></i><span>10-30</span><br>';
  div.innerHTML += '<i style="background: #A96A77"></i><span>30-50</span><br>';
  div.innerHTML += '<i style="background: #804E74"></i><span>50-70</span><br>';
  div.innerHTML += '<i style="background: #573172"></i><span>70-90</span><br>';
  div.innerHTML += '<i style="background: #19073B"></i><span>90+</span><br>';
  return div;
};

// Add legend to the map
legend.addTo(myMap);




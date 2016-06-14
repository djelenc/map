/*const TILES = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?'
            + 'access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliN'
            + 'DBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw';*/
const TILES = "http://172.15.16.31:1337/{z}/{x}/{y}.png"
const colors = ["red", "blue", "green", "orange", "yellow"];

let colorCount = -1;
let selectedRoute;
let map;

Meteor.startup(function(){
    Leaflet.load();
});

Template.body.rendered = function () {
  this.autorun(function () {
    if (Leaflet.loaded()) {
      // create globally accessible icons
      greenIcon = createIcon("green");
      blueIcon = createIcon("blue");
      redIcon = createIcon("red");
      orangeIcon = createIcon("orange");
      medicalIcon = createIcon("medical");
      policeIcon = createIcon("police");
      fireIcon = createIcon("fire");
      crashIcon = createIcon("crash");

      // green is the default icon
      selectedIcon = greenIcon;

      // initialize map
      map = L.map('mapid').setView([62.830, 27.515], 17);
      L.tileLayer(TILES, {
        maxZoom: 22,
        id: 'mapbox.streets'
      }).addTo(map);
      map.doubleClickZoom.disable();
      map.on('dblclick', (event) => {
        const lat = event.latlng.lat;
        const lon = event.latlng.lng;

        selectedRoute.addLayer(L.marker([lat, lon], {icon: selectedIcon}));
        selectedRoute["poly"].addLatLng(event.latlng);
        selectedRoute["coords"].push({
          "lat": lat,
          "lon": lon,
          "icon": selectedIcon["name"]
        });
      });

      // start adding new route
      newRoute();
    }
  });
};

Template.body.helpers({
  identities() {
    return Identities.find();
  }
});

Template.body.events({
  "click #send"(event) {
    const recipient = $("#sendTarget").val();
    const payload = selectedRoute["coords"];
    console.log("recipient: " + recipient + ", payload: " + payload);

    Meteor.call("uploadMap", recipient, payload);
  },
  "click #clear"() {
    let tempColor = selectedRoute["poly"].options.color;
  	selectedRoute.clearLayers();
  	selectedRoute["poly"] = L.polyline([], {color: tempColor}).addTo(selectedRoute);
  	selectedRoute["coords"] = [];
  },
  "click #new"() { newRoute(); },
  "click #greenIcon"() { selectedIcon = greenIcon; },
  "click #medicalIcon"() { selectedIcon = medicalIcon; },
  "click #redIcon"() { selectedIcon = redIcon; },
  "click #policeIcon"() { selectedIcon = policeIcon; },
  "click #blueIcon"() { selectedIcon = blueIcon; },
  "click #fireIcon"() { selectedIcon = fireIcon; },
  "click #orangeIcon"() { selectedIcon = orangeIcon; },
  "click #crashIcon"() { selectedIcon = crashIcon; }
});

function getColor() {
	return colors[(colorCount + 1) % colors.length];
}

function onRouteClick(event){
	if(selectedRoute["coords"].length == 0){
		map.removeLayer(selectedRoute);
	} else {
		selectedRoute["poly"].setStyle({
			color: selectedRoute["color"],
			opacity: 0.5
		});
	}

	selectedRoute = event.target;
	selectedRoute["poly"].setStyle({
		color: 'white',
		opacity: 0.8
	});
}

function newRoute() {
	if (selectedRoute && selectedRoute["coords"].length == 0){
		map.addLayer(selectedRoute);
		return;
	}

	if (selectedRoute ){
		selectedRoute["poly"].setStyle({
			color: selectedRoute["color"],
			opacity: 0.5
		});
	}

	let route = new L.FeatureGroup();
	route["coords"] = [];
	route.on('click', onRouteClick);
	map.addLayer(route);
	route["color"] = getColor();
	route["poly"] = L.polyline([], {color: "white", opacity: 0.8}).addTo(route);

	selectedRoute = route;

	map.addLayer(selectedRoute);
}

function createIcon(name) {
  let icon = L.icon({
    iconUrl: name + '.svg',
  	iconSize:     [50, 50],
  	iconAnchor:   [25, 50],
  	popupAnchor:  [-3, -76]
  });

  icon["name"] = name;

  return icon;
}

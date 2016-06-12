let colors = ["red", "blue", "green", "orange", "yellow"]
let colorCount = -1;

let selectedRoute;
let routeCount = 0;

let map;

Meteor.startup(function(){
    Leaflet.load();
});

Template.body.rendered = function () {
  this.autorun(function () {
    if (Leaflet.loaded()) {
      createIcons();
      createMap();
    }
  });
};

Template.body.onCreated(() => {
  this.state = new ReactiveDict();
});

Template.body.helpers({
});

Template.body.events({
  "click #send"(event) {
    event.preventDefault();
    // Meteor.call("uploadMap", "ccc_quick_maps", { name: "david", value: 100 });
    // sendRoute();
    console.log("send");
  },
  "click #clear"(event) {
    event.preventDefault();
    clearRoute();
    // Meteor.call("uploadMap", "ccc_quick_maps", { name: "david", value: 100 });
    console.log("clear");
  },
  "click #new"(event) {
    event.preventDefault();
    // Meteor.call("uploadMap", "ccc_quick_maps", { name: "david", value: 100 });
    // newRoute();
    console.log("new");
  }
});

function createIcons() {
  greenIcon = createIcon("green");
  blueIcon = createIcon("blue");
  redIcon = createIcon("red");
  orangeIcon = createIcon("orange");
  medicalIcon = createIcon("medical");
  policeIcon = createIcon("police");
  fireIcon = createIcon("fire");
  crashIcon = createIcon("crash");
  selectedIcon = greenIcon;
}

function createMap() {
  map = L.map('mapid').setView([62.830, 27.515], 17);
  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw', {
    maxZoom: 22,
    id: 'mapbox.streets'
  }).addTo(map);
  map.doubleClickZoom.disable();
  map.on('dblclick', (event) => {
    addMarker(event.latlng.lat, event.latlng.lng);
    selectedRoute["poly"].addLatLng(event.latlng);
    selectedRoute["coords"].push([event.latlng.lat, event.latlng.lng, selectedIcon["name"]]);
  });
  newRoute();
}


function getColor(){
	colorCount = (colorCount+1)%colors.length;
	return colors[colorCount];
}

function onRouteClick(event){
	if(selectedRoute["coords"].length == 0){
		removeSelectedRoute();
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

function removeSelectedRoute(){
	map.removeLayer(selectedRoute);
}

function newRoute() {
  console.log("new route");

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

function sendRoute(){
	let name = document.getElementById("sendTarget").value;
	alert(name+" "+JSON.stringify(selectedRoute["coords"]));
	window.status = name+" "+JSON.stringify(selectedRoute["coords"]);
}

function clearRoute(){
	let tempColor = selectedRoute["poly"].options.color;
	selectedRoute.clearLayers();
	selectedRoute["poly"] = L.polyline([], {color: tempColor}).addTo(selectedRoute);
	selectedRoute["coords"] = [];
}

function addMarker(y,x){
	selectedRoute.addLayer(L.marker([y, x], {icon: selectedIcon}));
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

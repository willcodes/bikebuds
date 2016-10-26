var userLat = "";
var userLong = "";

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert('Please enable geolocation in your browser to find your dream bike stop');
    }
}

var map = L.map('map', {
	center: [coordinate1, coordinate2],
	zoom: 13
});
	L.titleLayer('http://{s}.title.openstreetmap.org/{z}/{x}/{y}.png',
		attribution: 'Map data &copy; <a href="http: THE REST'
		maxZoom: 18
	}).addTo(map);
});

function showPosition(position) {
     userLat =  Math.position.coords.latitude; 
     userLong =  position.coords.longitude; 
     console.log("this is users Lat" + userLat);
     console.log("this is users long" + userLong);
}
var userLat = "";
var userLong = "";

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert('Please enable geolocation in your browser to find your dream bike stop');
    }
}
function showPosition(position) {
     userLat =  Math.position.coords.latitude; 
     userLong =  position.coords.longitude; 
     console.log("this is users Lat" + userLat);
     console.log("this is users long" + userLong);
}
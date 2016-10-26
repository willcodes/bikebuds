var userLat = "";
var userLong = "";

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert('Please enable geolocation in your browser to find your dream bike stop');
    }
}

 myApp.findCity = function(lat,lng){
         $.ajax({
             url: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyD3sqMdCuQ0LelH9L1ox8A7vw5JPFOAuGw`,
             dataType: 'JSON',
             method: 'POST',
         }).then(function(cityData){
             console.log(cityData);
             return cityData[0].cityName
         });
        }

function showPosition(position) {
     userLat =  Math.position.coords.latitude; 
     userLong =  position.coords.longitude; 
     console.log("this is users Lat" + userLat);
     console.log("this is users long" + userLong);
}


// var map = L.map('map', {
//     center: [coordinate1, coordinate2],
//     zoom: 13
// });
//     L.titleLayer('http://{s}.title.openstreetmap.org/{z}/{x}/{y}.png',
//         attribution: 'Map data &copy; <a href="http: THE REST'
//         maxZoom: 18
//     }).addTo(map);
// });


// function getLocation() {
//         if (navigator.geolocation) {
//             navigator.geolocation.getCurrentPosition(showPosition);
//         } else {
//             alert('browser does not support location services.');
//         }
//     }
function showPosition(position) {
        lat = position.coords.latitude; 
        lng = position.coords.longitude; 
        console.log(lat);
        console.log(lng);
        myApp.findCity(lat,lng);
    }

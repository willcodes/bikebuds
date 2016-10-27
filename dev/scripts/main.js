myApp = {};
var lat = '';
var lng = '';
var myCity = '';
var cityHref = '';
var saved_stations = [];

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert('browser does not support location services.');
    }
}
function showPosition(position) {
    lat = position.coords.latitude; 
    lng = position.coords.longitude; 
    console.log(lat);
    console.log(lng);
    myApp.findCity(lat,lng);
}

myApp.findCity = function(lat,lng){
    $.ajax({
        url: `https://maps.googleapis.com/maps/api/geocode/json?`,
        dataType: 'JSON',
        method: 'GET',
        data: {
        key: 'AIzaSyD3sqMdCuQ0LelH9L1ox8A7vw5JPFOAuGw',
        latlng: `${lat},${lng}`,
        }
})
.then((resp) => {
var addressComponents = resp.results[0].address_components;
console.log(addressComponents);
for(i=0;i<addressComponents.length;i++){
    var types = addressComponents[i].types;
    console.log(types);
    if(types=="locality,political"){
        var city = addressComponents[i].long_name ? addressComponents[i].long_name : alert('City Not Found'); // this should be your city, depending on where you are
        if (city) {
            myCity = city;
            console.log(myCity);
            myApp.findBikes(myCity);
        }
    }
}
});
}
myApp.findBikes = function(cityName){
    $.ajax({
        url: 'https://api.citybik.es/v2/networks',
        dataType: 'JSON',
        method: 'GET',
    }).then(function(thisCity){
        var thisArray = thisCity.networks;
        for(var i = 0; i < thisArray.length; i++){
            // console.log(thisArray[i].location.city);
            if(thisArray[i].location.city.indexOf(',') > -1){
                var finalCityName = thisArray[i].location.city.split(',')[0]
                // console.log(finalCityName);
                if(myCity === finalCityName){
                    cityHref = thisArray[i].href;
                    console.log(cityHref);
                }
            }
        }
    });
}

// event listener for submit form
$('form').on('submit', function(formEvent) {
    formEvent.preventDefault();
    $('header').fadeOut();
    $('.output').fadeIn();
    //create variable to store user's choice
    userChoice = $('#personsNumber option:selected').val();
    console.log(userChoice);
    myApp.matchBikes(cityHref)
});


myApp.matchBikes = function(cityHref){
    $.ajax({
        url: 'https://api.citybik.es/' + cityHref,
        dataType: 'JSON',
        method: 'GET',
    })
    //find the nearby bike stations
    .then(function(stationData){
        var bikeStations = stationData.network.stations;
        // filter that shit
        bikeStations = bikeStations.filter(function(bikeStation){
            return (userChoice <= bikeStation.free_bikes);
        });
        saved_stations.push(bikeStations);
        myApp.addMarkers(saved_stations);
    });
}

myApp.addMarkers = function(arr) {
            //map stuff below
            //this is a map layer from the interwebs
            var layer = new L.StamenTileLayer("terrain");
            //this is the map variable
            var map = new L.Map("mapid", {
            center: new L.LatLng(lat, lng),
            zoom: 15
            });
        map.addLayer(layer);

        //map stuff above

         var manIcon = L.icon({
            iconUrl: 'assets/manicon.svg',
            iconSize: [56,56],
            inconAnchor: [0,0],
            popupAnchor: [0,-26],
        });

        var manMarker = L.marker([lat, lng], {icon: manIcon}).addTo(map);
        manMarker.bindPopup(`You are here!`).openPopup()
        
        for(var i = 0; i < arr[0].length; i++){
            var lat2 = arr[0][i].latitude;
            var lng2 = arr[0][i].longitude;
        var bikeIcon = L.icon({
            iconUrl: 'assets/bikeicon.svg',
            iconSize: [64,64],
            iconAnchor: [0,0],
            popupAnchor: [32,16],
        });
        var marker = L.marker([lat2,lng2],
        {icon: bikeIcon})
        .addTo(map);
        marker.bindPopup(`<div class="address">${arr[0][i].extra.address}</div> <div class="free-bikes"> Free Bikes: ${arr[0][i].free_bikes}</div> <div class="empty-bikes"> Empty Slots: ${arr[0][i].empty_slots}</div> <button class = "btn___info">Show </button> `).openPopup();
    }
// arr.forEach(function(arrayObj,index){
//      });   
}
$('#mapid').on('click','.btn___info', function(){
    var infoContainer = $('.info-container');
    var street = $(this).siblings('.address').text();
    var freeBikes = $(this).siblings('.free-bikes').text();
    var emptyBikes = $(this).siblings('.empty-bikes').text();
    console.log(street,freeBikes,emptyBikes);

    var infoTitle = $("<h2>").text("Bike Stop Information");
    var streetInfo = $("<div> Location: ").text(street);
    var bikeInfoTitle = $("<h3>").text("Bikes:")
    var freeBikesInfo = $("<div>").text(freeBikes);
    var emptyBikesInfo = $("<div>").text(emptyBikes);

    infoContainer.empty();
    infoContainer.append(infoTitle,streetInfo,bikeInfoTitle,freeBikesInfo,emptyBikesInfo);
});

//page reloads when reset button is clicked
    $('input[type=reset]').on('click', function(){
        location.reload();
    })

myApp.init = function(){
    getLocation();

    $('.hero').vide({
      mp4: 'assets/bikevideo',
      webm: 'assets/bikevideo',
      ogv: 'assets/bikevideo',
      poster: 'assets/bikevideo',
    }, 
    {
      volume: 1,
      playbackRate: 1,
      muted: true,
      loop: true,
      autoplay: true,
      position: '50% 50%', // Similar to the CSS `background-position` property.
      posterType: 'detect', // Poster image type. "detect" — auto-detection; "none" — no poster; "jpg", "png", "gif",... - extensions.
      resizing: true, // Auto-resizing, read: https://github.com/VodkaBears/Vide#resizing
      bgColor: 'rgba(0,0,0,0.8)', // Allow custom background-color for Vide div,
      className: '', // Add custom CSS class to Vide div
    
    });

}

$(document).ready(function(){
    myApp.init();
});
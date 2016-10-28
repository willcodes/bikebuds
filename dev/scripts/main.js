//create blank object to hold application functions.
myApp = {};
//create variables to store info to be used later
var lat = '';
var lng = '';
//this is for city determined by geolocation
var myCity = '';
//href taken from myApp.findCity
var cityHref = '';
//array of stations filtered by bikes needed
var saved_stations = [];
var infoContainer = $('.info-container');

//browser built in geolocation 
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert('browser does not support location services.');
    }
}
//get position and store lat/lng
function showPosition(position) {
    lat = position.coords.latitude; 
    lng = position.coords.longitude; 
    console.log(lat);
    console.log(lng);
    //run findCity fnct
    myApp.findCity(lat,lng);
}
//ajax call for reverse geocode. finding city
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
        //locality and political must both match to return the Municipal name, ie'toronto'
        if(types=="locality,political"){
            //ternary fnct to pass an alert if there is no long name available
            var city = addressComponents[i].long_name ? addressComponents[i].long_name : alert('City Not Found');
            if (city) {
                myCity = city;
                //save mycity in case we need later  isntantiate next fnct
                myApp.findBikes(myCity);
                }
            }
        }
    });
}
//find bike network by looping through the cities to find the city name, then get the href
myApp.findBikes = function(cityName) {
    $.ajax({
        url: 'https://api.citybik.es/v2/networks',
        dataType: 'JSON',
        method: 'GET',
    }).then(function(thisCity){
        var thisArray = thisCity.networks;
        for(var i = 0; i < thisArray.length; i++){
            //if the location has a state or province..
            if(thisArray[i].location.city.indexOf(',') > -1){
                //cut off the comma and get the first part 
                var finalCityName = thisArray[i].location.city.split(',')[0]
                // console.log(finalCityName);
                //condition statement, if these match we grab the href, else, this app won't work
                //maybe add, no bikes nearby?               
                if(myCity === finalCityName){
                    cityHref = thisArray[i].href;
                    console.log(cityHref);
                    //get rid of loader below here and fadeIn our header content
                    //this data is complete and the user should be able to use this app
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
    //run the matchbikes fnct
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
        // filter that shit <-- don't swear in our code!! -Will (i know it was you christina!)
        bikeStations = bikeStations.filter(function(bikeStation){
            return (userChoice <= bikeStation.free_bikes);
        });
        //push bikeStations into saved_stations (blank array we had at the top)
        saved_stations.push(bikeStations);
        //run add map markers function with this bad boy
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
            zoom: 16
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
        manMarker.bindPopup(`You are here!`).openPopup();
        
        //loop through saved_stations array, display the info (should have used data attr....maybe next time but prob not)
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
            //these things are all relate to our map
            marker.bindPopup(`<div class="address">${arr[0][i].extra.address}</div> <div class="free-bikes"> Free Bikes: ${arr[0][i].free_bikes}</div> <div class="empty-bikes"> Empty Slots: ${arr[0][i].empty_slots}</div> <button class = "btn___info">Show </button> `);
            //saying when we click the marker, run this fnct
            marker.on('click', myApp.getDirections);
        }
    }

//separate click function to display the informations
$('#mapid').on('click','.btn___info', function(){
    infoContainer.empty();
    var street = $(this).siblings('.address').text();
    var freeBikes = $(this).siblings('.free-bikes').text();
    var emptyBikes = $(this).siblings('.empty-bikes').text();
    // console.log(street,freeBikes,emptyBikes);

    var infoTitle = $("<h2>").text("Bike Stop Information");
    var streetInfo = $("<div class='street-name'>").text(street);
    var bikeInfoTitle = $("<h3>").text("Bikes:")
    var freeBikesInfo = $("<div>").text(freeBikes);
    var emptyBikesInfo = $("<div>").text(emptyBikes);
    
    infoContainer.append(infoTitle,streetInfo,bikeInfoTitle,freeBikesInfo,emptyBikesInfo);
    $('#direction').css('opacity', '1');
    $('#direction').css('height', 'auto');
    $('.infoAndDirection').css('opacity', '1');
    //scroll to bottom function below here.
});

myApp.getDirections = function({latlng: {lat: destLat, lng: destLng}}){
    $('#direction').css('opacity', '0');
    $('#direction').css('height', '0');
    infoContainer.empty();
    console.log(destLat, destLng);
    var origin = new google.maps.LatLng(lat,lng);
    var destination = new google.maps.LatLng(destLat , destLng);
    var DirectionsService = new google.maps.DirectionsService();

    DirectionsService.route({    
        origin: origin,
        destination: destination,
        travelMode: "WALKING",
//honestly, below looks funny but its not, were just passing the actual object through instead of naming it something and looping through later, don't worry guys, i got this!
    },function({
        routes: [{
            legs: [
                {
                    steps: directions
                }
            ]
        }]
      }) {
          //switched to es6 here because why not
          var directions = directions.map(direction => direction.instructions);
          console.log(directions); 
          $('#direction').empty();
          var directionsTitle = $('<h3>').text("Directions: ");
          $('#direction').append(directionsTitle);
          for(var i = 0; i < directions.length; i++ ){
              var directionItem = $('<div>').html(directions[i]);
              console.log(directionItem);
              $("#direction").append(directionItem);
          }
        });
    }
//page reloads when reset button is clicked

//reset button :D
$('input[type=reset]').on('click', function(){
    location.reload();
})

//init function with vide bs inside
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
      bgColor: 'transparent', // Allow custom background-color for Vide div,
      className: '', // Add custom CSS class to Vide div
    });
}
//doc ready with init.
$(document).ready(function(){
    myApp.init();
});
myApp = {};
var lat = '';
var lng = '';
var myCity = '';
var cityHref = '';

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
                    var cityHref = thisArray[i].href;
                    console.log(cityHref);
                }
            }
        }
    });
}


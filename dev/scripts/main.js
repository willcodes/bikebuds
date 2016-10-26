var myApp = {};
var lat = '';
var lng = '';
var cityName = '';

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert('Geolocation is not supported by this browser');
    }
}

function showPosition(position) {
    lat = position.coords.latitude;
    lng = position.coords.longitude;
    myApp.getCity(lat,lng);
}

myApp.getCity = function(lat,lng){
    $.ajax({
        url: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyD3sqMdCuQ0LelH9L1ox8A7vw5JPFOAuGw`,
        method: 'GET',
        dataType: 'json',
    })
    .then(function(cityData){
        console.log(cityData);
        var cityDataAddComp = cityData.results[0].address_components;
        console.log(cityDataAddComp);
        for(var i = 0; i< cityDataAddComp.length; i++){
            var types = cityDataAddComp[i].types;
            console.log(types);
            if(types == "locality,political"){
                var cityName = cityDataAddComp[i].long_name;
                console.log(cityName);
            }
        }
    });
};


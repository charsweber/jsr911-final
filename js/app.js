
firebase.initializeApp(config);
function getLocation() {
    if (navigator.geolocation) {
      var position = navigator.geolocation.getCurrentPosition(initMap);
      return position;
        // navigator.geolocation.getCurrentPosition(showPosition);
    } else { 
        console.log("Geolocation is not supported by this browser.");
        // add city input field to page
        $('#user-city').css("display", "inline");
    }
}
var database = firebase.database();
$(document).ready(function() {
  navigator.geolocation.getCurrentPosition(showPosition);
	function showPosition(position) {
		lat = position.coords.latitude;
		long = position.coords.longitude;
	    // console.log("Latitude: " + lat + 
	    // "Longitude: " + long);
	    getTemp(lat, long);
	}

	var today = new Date();
	var dd = today.getDate();
	var day = today.getDay();
	var mm = today.getMonth();
	var yyyy = today.getFullYear();
	var monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	var daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

	getLocation();

	var weatherurl = "https://api.openweathermap.org/data/2.5/weather?lat=";
	var weatherconfig = "ac9cf7fcb52a1a8a3613881c8ef99587";

	function getTemp(lat, long) { 
		// $('#loading-image').show();
		$.ajax({
		  dataType: "json",
		  url: weatherurl + lat + "&lon=" + long + "&appid=" + weatherconfig + "&units=imperial",
		  beforeSend: function(){
	        	$('#loader').show();
	      },
		  success: function(result) {
		  	var city = result.name;
		  	var temp = Math.floor(result.main.temp);
		  	var icon = result.weather[0].icon;
		  	var weatherDescription = result.weather[0].description;
		  	// get in icon id http://openweathermap.org/weather-conditions
		  	$('#greetings').append('<h1>welcome to ' + city.toLowerCase() + '!</h1>');
		  	$('#greetings').append("<h3>" + daysOfWeek[day].toLowerCase() + ", " + monthsOfYear[mm].toLowerCase() + " " + dd + ", " + yyyy + "</h3>");
		  	$('#weather-details').append('<li id="weathdetails">' + temp + '&deg; F</li>' + '<li id="wethdetails">' + weatherDescription + '</li>' + 
			'<img src="http://openweathermap.org/img/w/' + icon + '.png">');
		  }, 
		  complete: function(){
		    $('#loader').hide();
		  },
		});
	}
	// $('#city-form').submit(function(event) {
	//     event.preventDefault();
	//     var userCity = $('#user-city').val();
	//     $('#user-city').val('');
	//     console.log(userCity);
 //  	});
});

var map;
var infowindow;

// $('#coffee-spots').click(function() {
//   google.maps.event.trigger(map, 'resize');
//   $('#hidden').css('display', 'inline');
// })
var lati,
  longi;
function initMap(position) {
  // console.log(position);
  lati = position.coords.latitude;
  longi = position.coords.longitude;
  var loc = {lat: lati, lng: longi};

  map = new google.maps.Map(document.getElementById('map'), {
    center: loc,
    zoom: 15
  });

  infowindow = new google.maps.InfoWindow();
  var service = new google.maps.places.PlacesService(map);
  service.nearbySearch({
    location: loc,
    radius: 500,
    type: ['cafe']
  }, callback);

  var marker = new google.maps.Marker({
    position: map.getCenter(),
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 10
    },
    map: map
  });
}

function callback(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i]);
    }
  }
}

function createMarker(place) {
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });
  var beenhere = '<p>' + place.name + '<br>rating: ' + place.rating + '</p>';
  // '<br>' + place.opening_hours.open_now +
  // use this to display hours ^ 
  beenhere += '<p>been here?</p>';
  beenhere += '<button id="add-cafe" type="button">yes</button>'

  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(beenhere);
    infowindow.open(map, this);
    document.getElementById('add-cafe').addEventListener("click", function() {
      var cafeName = place.name;
      var cafeReference = database.ref('cafes');
      cafeReference.push({
        cafe: cafeName
        // cafelocation: placeLoc
      });
      $("#add-cafe").hide();
      beenhere += '<p>you\'ve been here before</p>';
    })
    // add event listener to input button, takes place.name and adds to 
  });
 }

// create event handler for if been here is clicked - add place.name to firebase and also change icon to star instead of red
// change marker from default to star
// update "been here" text so that it says "you visited here on DATE"
// add date of click (of add-cafe button) to firebase, along with geometry.location
// when user clicks li icon, expand to-do list under weather info









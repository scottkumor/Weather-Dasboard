/* db */
/* raw weather object from api */

/* variables */
/* parsed weather object */

/* utility functions */
/* get raw data */
/* parse raw data */
/* render parsed data */

/* event functions */
/* search button click */
/* have city name  */
/* send city name to a openweather api */
/* set the weather info to the object returned (see raw data) */


$(document).ready(function() {
var cityWeather = `https://openweathermap.org/data/2.5/weather?q=London,uk&appid=b6907d289e10d714a6e88b30761fae22`;
$.ajax({
    url: cityWeather,
    method: "GET"
}).then(function(response){
    console.log(response);
});

});










/* init */
/* check local storage for history of cities and render */
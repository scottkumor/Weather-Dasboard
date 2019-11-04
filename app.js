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

$(document).ready(function () {

    $('#cityInput').keypress(function(e){
        if (e.which == 13){//Enter key pressed
            $('#citySubmit').click();//Trigger search button click event
        }
    });

    // Here we run our AJAX call to the OpenWeatherMap API
    $("#citySubmit").on("click", function() {
        

        var forecastTitle = $(`<div class="fs-m ts-i">Your 5-Day Weather Forecast</div>`)
        $('#forecastTitle').html(forecastTitle);
        $('#forecast').html('');


        // This is our API key
    var APIKey = "1bc8de1510a7bc2ef6cbcd528035eef8";
    var cityInput = $('#cityInput').val();

    // Here we are building the URL we need to query the database
    var queryURLw = "https://api.openweathermap.org/data/2.5/weather?q=" + cityInput + "&units=imperial&appid=" + APIKey;
    var queryURLf = "http://api.openweathermap.org/data/2.5/forecast?q=" + cityInput + "&appid=" + APIKey;

        //performing an ajax request
        $.ajax({
            url: queryURLw,
            method: "GET"
        }).then(function (responseW) {
            // Log the resulting object
            console.log(responseW);

            var timeStamp = responseW.dt;
            var newDate = moment.unix(timeStamp).format('L');
            var iCode = responseW.weather[0].icon;
            var iURL = "http://openweathermap.org/img/w/" + iCode + ".png";

            console.log(newDate);

            $('#weatherName').html(`<div class="c-g-wdb fs-j m-s ts-n">${responseW.name}</div>`);
            $('#weatherDate').html(`<div class="c-g-wdb fs-j m-s ts-n">${newDate}</div>`)
            $('#weatherTemp').html(`<div class="ff-3 ts-i">The current temperature is:  </div><div class="c-pri-2 fs-m p-s ts-n">${responseW.main.temp.toFixed()+'°'}</div>`);
            $('#weatherHum').html(`<div class="ff-3 ts-i">The current humidity is:   </div><div class="c-pri-2 fs-m p-s ts-n">${responseW.main.humidity.toFixed()+'%'}</div>`);
            $('#weatherWind').html(`<div class="ff-3 ts-i">Wind gusts could reach   </div><div class="c-pri-2 fs-m p-s ts-n">${responseW.wind.speed.toFixed()+' mph'} </div>`);
            $('#weatherIcon').html(`<img class="" src="${iURL}"/>`)

            var uvLat = responseW.coord.lat;
            var uvLon = responseW.coord.lon;
            var queryURLu = `http://api.openweathermap.org/data/2.5/uvi?appid=${APIKey}&lat=${uvLat}&lon=${uvLon}`;
            
            $.ajax({
                url: queryURLu,
                method: "GET"
            }).then(function (responseU) {
                // Log the resulting object
                console.log(responseU);
                $('#weatherUV').html(`<div class="ff-3 ts-i">The current UV Index is </div><div class="c-pri-2 fs-m p-s ts-n">${responseU.value}</div>`);

            });
        });
       
            $.ajax({
                url: queryURLf,
                method: "GET"
            }).then(function (response) {
                console.log(response);

                newDiv.val('');

                var list = response.list;
                //console.log(list);

                for (i=0; i < list.length; i += 8){
                    var K = list[i].main.temp;
                    var lK = list[i].main.temp_min;
                    var hK = list[i].main.temp_max;
                   
                    var temp = (((K-273.15)*1.8)+32).toFixed();
                    var hum = list[i].main.humidity.toFixed();
                    var low = (((lK-273.15)*1.8)+32).toFixed();
                    var high = (((hK-273.15)*1.8)+32).toFixed();

                    //console.log(hum);

                    newDiv = $('<div>');
                   
                    
                    newDiv.html(`<div class="fs-l">${temp}°</div><br />Humidity: ${hum}%<br />Low: ${low}°<br />High: ${high}°`);
                    newDiv.attr("class", "m-s p-m s");

                    
                    $('#cardsWrapper').append(newDiv);
                    

                }

              });

              $("#cityInput").val('');
 
         });






        // event.stopPropagation();
        // event.stopImmediatePropagation();
        /* get the key and the value */
    //     var key = $(this).data("key");
    //     var value = $(`#${key}`).val();
    
    //     // save it local storage
    //     pastSearch[key] = value;
    //     localStorage.setItem("myDay", JSON.stringify(pastSearch));
      

    });
   

// <button id="cat-button">magical cat button</button>
// <div id="images"></div>
// <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
// <script type="text/javascript">
//   //event listener for cat button
//   $("#cat-button").on("click", function() {
//     //assigning the API url to the variable queryURL
//     var queryURL =
//       "https://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=cats";

//     //performing an ajax request
//     $.ajax({
//       url: queryURL,
//       method: "GET"
//     })

//       //after the data comes back from giphy
//       .then(function(response) {
//         console.log(response);
//         //parse the img url assign to
//         var imageUrl = response.data.image_original_url;

//         //creating an image tag jquery and assigning it to a variable
//         var catImage = $("<img>");

//         //putting two attributes on the image tag
//         catImage.attr("src", imageUrl);
//         catImage.attr("alt", "cat image");

//         //putting catimage inside of images object
//         $("#images").prepend(catImage);
//       });
//   });








/* init */
/* check local storage for history of cities and render */
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
        $('#forecastTitle').append(forecastTitle);


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

            $('#weatherName').append(`<div class="c-g-wdb"><div class="c-pri-2 fs-j p-s ts-n">${responseW.name}</div></div>`);
            $('#weatherTemp').append(`<div class="ai-b ff-3 ts-i">The current temperature is: <div class="c-pri-2  p-s ts-n">${responseW.main.temp.toFixed()}°</div></div>`);
            $('#weatherHum').append(`<div class="ai-b ff-3 ts-i">The current humidity is: <div class="c-pri-2 p-s ts-n">${responseW.main.humidity.toFixed()}%</div></div>`);
            $('#weatherWind').append(`<div class="ai-b ff-3 ts-i">Wind gusts could reach <div class="c-pri-2 p-s ts-n">${responseW.wind.speed.toFixed()+' mph'} </div></div>`);

            var uvLat = responseW.coord.lat;
            var uvLon = responseW.coord.lon;
            var queryURLu = `http://api.openweathermap.org/data/2.5/uvi?appid=${APIKey}&lat=${uvLat}&lon=${uvLon}`;



            $.ajax({
                url: queryURLu,
                method: "GET"
            }).then(function (responseU) {
                // Log the resulting object
                console.log(responseU);
                $('#weatherUV').append(`<div class="ai-b ff-3 ts-i ">The current UV Index is <div class="c-pri-2 p-s ts-n">${responseU.value}</div></div>`);

            });
        });
       
            $.ajax({
                url: queryURLf,
                method: "GET"
            }).then(function (response) {
                console.log(response);

                var list = response.list;
                //console.log(list);

                for (i=0; i < list.length; i += 8){
                    var K = list[i].main.temp;
                    var lK = list[i].main.temp_min;
                    var hK = list[i].main.temp_max;
                    console.log(lK)

                    var temp = (((K-273.15)*1.8)+32).toFixed();
                    var hum = list[i].main.humidity.toFixed();
                    var low = (((lK-273.15)*1.8)+32).toFixed();
                    var high = (((hK-273.15)*1.8)+32).toFixed();

                    //console.log(hum);

                    var newDiv = $('<div>');
                   
                    
                    newDiv.html(`<div class="fs-l">${temp}°</div><br />Humidity: ${hum}%<br />Low: ${low}°<br />High: ${high}°`);
                    newDiv.attr("class", "m-s p-m s");

                    
                    $('#forecast').append(newDiv);
                }
                

              });



              $("#cityInput").val('');
              newDiv = '';
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
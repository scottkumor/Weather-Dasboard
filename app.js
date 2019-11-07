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
    let storedHistory = JSON.parse(localStorage.getItem("storage")) || {};
    for (i = 0; i < storedHistory.length; i++) {
        if (Object.keys(storedHistory).length) {
            $('#history').append(`<button class="bg-g-fbh bd-n c-pri-2 fz-l p-s ta-l ti-s m-s">${storedHistory[i].value}</button>`);
        }
    };

    var searches = [];

    function searchStore() {
        let userInput = $('#cityInput');
        searches[searches.length] = {
            value: userInput.val()
        };
        localStorage.setItem("storage", JSON.stringify(searches));
        $('#history').append(`<button class="bg-g-fbh bd-n c-pri-2 fz-l p-s ta-l ti-s m-s">${userInput.val()}</button>`);
        $("#cityInput").val('');
    };



    $('#cityInput').keypress(function (e) {
        if (e.which == 13) {//Enter key pressed
            $('#citySubmit').click();//Trigger search button click event
        }
    });

    // Here we run our AJAX call to the OpenWeatherMap API
    $("#citySubmit").on("click", function () {
        callAPI();
        searchStore();
    });

    $(".bg-g-fbh").on("click", function () {
        let pass = $(this).text();
        $('#cityInput').val(pass);
        callAPI();
        $("#cityInput").val('');
    });

    $("#clear").on("click", function () {
        localStorage.clear();
        $('#history').empty();
    });



    function callAPI() {



        var forecastTitle = $(`<div class="fz-jj c-pri-3 fs-i">Your 5-Day Weather Forecast</div>`)
        $('#forecastTitle').html(forecastTitle);
        $('#forecast').html('');


        // This is our API key
        var APIKey = "1bc8de1510a7bc2ef6cbcd528035eef8";
        var cityInput = $('#cityInput').val().trim();

        // Here we are building the URL we need to query the database
        var queryURLw = "https://api.openweathermap.org/data/2.5/weather?q=" + cityInput + "&units=imperial&appid=" + APIKey;
        var queryURLf = "http://api.openweathermap.org/data/2.5/forecast?q=" + cityInput + "&appid=" + APIKey;

        //performing an ajax request
        $.ajax({
            url: queryURLw,
            method: "GET"
        }).then(function (responseW) {
            // Log the resulting object
            //console.log(responseW);

            var timeStamp = responseW.dt;
            var newDate = moment.unix(timeStamp).format('L');
            var iCode = responseW.weather[0].icon;
            var iURL = "http://openweathermap.org/img/w/" + iCode + ".png";

            //console.log(newDate);

            $('#weatherName').html(`<div>${responseW.name}</div>`);
            $('#weatherDate').html(`<div>${newDate}</div>`)
            $('#weatherTemp').html(`<div class="ff-3 fs-i">The current temperature is</div><div class="c-pri-2 fz-jjj p-s ts-n">${responseW.main.temp.toFixed() + '°'}</div>`);
            $('#weatherHum').html(`<div class="ff-3 fs-i">The current humidity is</div><div class="c-pri-2 fz-jjj p-s ts-n">${responseW.main.humidity.toFixed() + '%'}</div>`);
            $('#weatherWind').html(`<div class="ff-3 fs-i">Wind gusts could reach</div><div class="c-pri-2 fz-jj p-s ts-n">${responseW.wind.speed.toFixed() + ' mph'} </div>`);
            $('#weatherIcon').html(`<img class="iz-i" src="${iURL}"/>`)

            var uvLat = responseW.coord.lat;
            var uvLon = responseW.coord.lon;
            var queryURLu = `http://api.openweathermap.org/data/2.5/uvi?appid=${APIKey}&lat=${uvLat}&lon=${uvLon}`;

            $.ajax({
                url: queryURLu,
                method: "GET"
            }).then(function (responseU) {
                // Log the resulting object
                //console.log(responseU);
                $('#weatherUV').html(`<div class="ff-3 fs-i">The current<a class="td-n c-pri-3" href"https://www.aimatmelanoma.org/prevention/uv-index/"> UV Index</a> is</div><div class="c-pri-2 fz-jj p-s ts-n">${responseU.value}</div>`);

            });
        });

        $.ajax({
            url: queryURLf,
            method: "GET"
        }).then(function (response) {
            //console.log(response);

            $('#cardsWrapper').empty();


            newDiv = '';

            var list = response.list;




            for (i = 0; i < list.length; i += 8) {
                //create a day object every 8 times it loops, loop through that array to generate cards



                var K = list[i].main.temp;
                var lK = list[i].main.temp_min;
                var hK = list[i].main.temp_max;
                var dt = list[i].dt
                var date = moment.unix(dt).format('L');
                //console.log(date);

                var temp = (((K - 273.15) * 1.8) + 32).toFixed();
                var hum = list[i].main.humidity.toFixed();
                var low = (((lK - 273.15) * 1.8) + 32).toFixed();
                var high = (((hK - 273.15) * 1.8) + 32).toFixed();

                //console.log(hum);

                newDiv = $('<div>');


                newDiv.html(`<div class="c-g-wdb fz-l">${date}</div><div class="fz-jj">${temp}°</div><br />Humidity: ${hum}%<br />Low: ${low}°<br />High: ${high}°`);
                newDiv.attr("class", "m-s p-m s");


                $('#cardsWrapper').append(newDiv);


            }

        });

    }
});
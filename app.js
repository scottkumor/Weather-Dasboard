/* db */
/* raw weather object from api */

/* letiables */
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

    let searches = [];

    function searchStore() {
        let userInput = $('#cityInput');
        searches[searches.length] = {
            value: userInput.val()
        };
        localStorage.setItem("storage", JSON.stringify(searches));
        $('#history').append(`<button class="bg-g-fbh bd-n ol-n c-pri-2 fz-l p-s ta-l ti-s m-s">${userInput.val()}</button>`);
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

    $(document).on("click", ".bg-g-fbh", function () {
        let pass = $(this).text();
        $('#cityInput').val(pass);
        callAPI();
        $("#cityInput").val('');
    });

    $("#clear").on("click", function () {
        localStorage.clear();
        $('#history').empty();
    });

    function changeFavicon(src) {
        $('link[rel="icon"]').attr('href', src);
    }

    function callAPI() {

        let forecastTitle = $(`<div class="fz-jj c-pri-3 fs-i">Your 5-Day Weather Forecast</div>`)
        $('#forecastTitle').html(forecastTitle);
        $('#forecast').html('');
        

        // This is my API key
        let APIKey = "1bc8de1510a7bc2ef6cbcd528035eef8";
        let cityInput = $('#cityInput').val().trim();

        // Here we are building the URLs we need to query the database
        let queryURLw = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&units=imperial&appid=${APIKey}`;

        //performing an ajax request
        $.ajax({
            url: queryURLw,
            method: "GET"
        }).then(function (responseW) {
            // Log the resulting object
            //console.log(responseW);

            let timeStamp = responseW.dt;
            let newDate = moment.unix(timeStamp).format('L');
            let iCode = responseW.weather[0].icon;
            let iURL = "http://openweathermap.org/img/wn/" + iCode + "@2x.png";
            changeFavicon(`${iURL}`);

            //console.log(newDate);

            $('#weatherName').html(`<div>${responseW.name}</div>`);
            $('#weatherDate').html(`<div>${newDate}</div>`)
            $('#weatherTemp').html(`<div class="ff-3 fs-i">The current temperature is</div><div class="c-pri-2 fz-jjj p-s ts-n">${responseW.main.temp.toFixed() + '°'}</div>`);
            $('#weatherHum').html(`<div class="ff-3 fs-i">The current humidity is</div><div class="c-pri-2 fz-jjj p-s ts-n">${responseW.main.humidity.toFixed() + '%'}</div>`);
            $('#weatherWind').html(`<div class="ff-3 fs-i">Wind gusts could reach</div><div class="c-pri-2 fz-jj p-s ts-n">${responseW.wind.speed.toFixed() + ' mph'} </div>`);
            $('#weatherIcon').html(`<img class="iz-i bgc-pri-5 s" src="${iURL}"/>`)

            let uvLat = responseW.coord.lat;
            let uvLon = responseW.coord.lon;
            let queryURLu = `http://api.openweathermap.org/data/2.5/uvi?appid=${APIKey}&lat=${uvLat}&lon=${uvLon}`;

            $.ajax({
                url: queryURLu,
                method: "GET"
            }).then(function (responseU) {
                // Log the resulting object
                //console.log(responseU);
                $('#weatherUV').html(`<div class="ff-3 fs-i">The current<a class="td-n c-pri-3" href"https://www.aimatmelanoma.org/prevention/uv-index/"> UV Index</a> is</div><div class="c-pri-2 fz-jj p-s ts-n">${responseU.value}</div>`);

            });
        });


        let queryURLf = "http://api.openweathermap.org/data/2.5/forecast?q=" + cityInput + "&appid=" + APIKey;

        $.ajax({
            url: queryURLf,
            method: "GET"
        }).then(function (response) {

            $('#cardsWrapper').empty();

            newDiv = '';

            let list = response.list;

            list.forEach((num, index) => {
                //console.log(index);
                if (index%8 === 0) {
                  /* create card  and append to html */
                  let K = list[index].main.temp;
                  let lK = list[index].main.temp_min;
                  let hK = list[index].main.temp_max;
                  let dt = list[index].dt
                  let date = moment.unix(dt).format('L');
                                  console.log(date);

                 
                  let iconGet = list[index].weather[0].icon;
                  //let subIconGet = iconGet[index].icon;
                  //console.log(iconGet);
  
                  let icon = "http://openweathermap.org/img/wn/" + iconGet + "@2x.png";
                  // console.log(icon);
                  //<img src="${icon}"> <-- append inside newdiv.html
  
                  let temp = (((K - 273.15) * 1.8) + 32).toFixed();
                  let hum = list[index].main.humidity.toFixed();
                  let low = (((lK - 273.15) * 1.8) + 32).toFixed();
                  let high = (((hK - 273.15) * 1.8) + 32).toFixed();
  
                  
  
                  newDiv = $('<div>');
  
                  newDiv.html(`<div class="c-g-wdb fz-j">${date}</div><div class="fz-jj">${temp}°</div><img src="${icon}"><br />Humidity: ${hum}%<br />Low: ${low}°<br />High: ${high}°`);
                  newDiv.attr("class", "bgc-pri-5 d-f df-fdc jc-c ai-c m-s p-m s");
  
                  $('#cardsWrapper').append(newDiv);
                }

                else {
                    // go through heach item
                    //grab temp, humidity, low, high, and icon
                    //average the temps, lowest low, highest high
                }
              });
                
               

            
        });
    }
});
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

let storedHistory = JSON.parse(localStorage.getItem("storage")) || {};

$(document).ready(function () {
    
    var archive = {}, // Notice change here
        keys = Object.keys(localStorage),
        i = keys.length;

    while ( i-- ) {
        
        archive[ keys[i] ] = JSON.parse(localStorage.getItem( keys[i] ));
        // console.log(archive[keys[i]])
        
        $("#history").append(
            `
                <div class="r-flex hisBtnWrap">
                    <button class="hisBtn">${archive[keys[i]].cityInput}</button>
                    <i class="fa fa-times clear"></i>
                </div>
            `
        );
    }
    
    $("#cityInput").keypress(function (e) {
        if (e.which == 13) {
            //Enter key pressed
            $("#citySubmit").click(); //Trigger search button click event
        }
    });

    // Here we run our AJAX call to the OpenWeatherMap API
    $("#citySubmit").on("click", function () {
        callAPI();
        $('#countries').prop('selectedIndex', 0);
        $('#states').prop('selectedIndex', 0);
    });

    $("#wipe").on("click", function () {
        localStorage.clear();
        $("#history").empty();
    });
    
    $(".hisBtn").on("click", function () {
        let text = $(this).text();
        let city = JSON.parse(localStorage.getItem(text)).cityInput;
        let country = JSON.parse(localStorage.getItem(text)).countryInput || "";
        let state = JSON.parse(localStorage.getItem(text)).stateInput || "";

        console.log(city, country, state)

        $("#cityInput").val(city);
        $("#countryInput").val(country);
        $("#stateInput").val(state);

        callAPI();

        //localStorage.removeItem(text);
        $("#cityInput").val("");
    });

    $('#countries').change(function(){ 
        var opt = $(this).find('option:selected').val();

        if(opt === 'us'){
            $("#states").prop("disabled", false)
        }
        else {
            $("#states").prop("disabled", true)
        }
        
    });
});


function changeFavicon(src) {
    $('link[rel="icon"]').attr("href", src);
}

function callAPI() {

    $("#greeting").attr("style", "display:none;");
    
    // This is my API key
    let APIKey = "1bc8de1510a7bc2ef6cbcd528035eef8";
    let cityInput = $("#cityInput").val().trim();
    let countryInput = $("#countries").val();
    let stateInput = $("#states").val();
    var units = $("input[name='unitRdo']:checked").val();
    let weatherURL = "";

    // URLs needed to query the database
    let global = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&units=${units}&appid=${APIKey}`;
    let country = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput},${countryInput}&units=${units}&appid=${APIKey}`;
    let usStates = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput},${stateInput},us&units=${units}&appid=${APIKey}`;

    if (stateInput !== "") {
        weatherURL = usStates;

        let key = cityInput;
        let value = {cityInput, countryInput, stateInput}

        localStorage.setItem(key, JSON.stringify(value));
        
        $("#history").append(
            `
            <div class="r-flex hisBtnWrap">
                <button class="hisBtn">${cityInput}, ${stateInput} (USA)</button>
                <i class="fa fa-times clear"></i>
            </div>
            `
        );

        $("#cityInput").val("");
    }
    if (countryInput !== ""  && countryInput !== "us") {
        weatherURL = country;

        let key = cityInput;
        let value = {cityInput, countryInput}

        localStorage.setItem(key, JSON.stringify(value));
        
        $("#history").append(
            `
            <div class="r-flex hisBtnWrap">
                <button class="hisBtn">${cityInput}, ${countryInput}</button>
                <i class="fa fa-times clear"></i>
            </div>
            `
        );
        
        $("#cityInput").val("");

    }
    else if (countryInput !== "us"){
        weatherURL = global;

        let key = cityInput
        let value = {cityInput, countryInput};
        
        localStorage.setItem(key, JSON.stringify(value));
        
        $("#history").append(
            `
            <div class="r-flex hisBtnWrap">
                <button class="hisBtn">${cityInput}</button>
                <i class="fa fa-times clear"></i>
            </div>
            `
        );
        
        $("#cityInput").val("");

    }
    


    $.ajax({
        url: weatherURL,
        method: "GET",
    }).then(function (weatherRes) {
        // Log the resulting object
        //console.log(weatherRes);

        let timeStamp = weatherRes.dt;
        let newDate = moment.unix(timeStamp).format("L");
        let iCode = weatherRes.weather[0].icon;
        let iURL = "http://openweathermap.org/img/wn/" + iCode + "@2x.png";
        changeFavicon(`${iURL}`);

        //console.log(newDate);

        $("#weatherName").text(`${weatherRes.name}`);
        $("#weatherDate").text(`${newDate}`);
        $("#weatherTemp").html(
            `
                <div class="tempText">The current temperature is</div>
                <div class="tempNum">${weatherRes.main.temp.toFixed() + "°"}</div>
            `
        );
        $("#weatherHum").html(
            `
                <div class="humText">The current humidity is</div>
                <div class="humNum">${weatherRes.main.humidity.toFixed() + "%"}</div>
            `
        );
        $("#weatherWind").html(
            `
                <div class="">Wind gusts could reach</div>
                <div class="">${weatherRes.wind.speed.toFixed() + " mph"} </div>
            `
        );
        $("#weatherIcon").html(`<img class="" src="${iURL}"/>`);

        let uvLat = weatherRes.coord.lat;
        let uvLon = weatherRes.coord.lon;
        let uvURL = `http://api.openweathermap.org/data/2.5/uvi?appid=${APIKey}&lat=${uvLat}&lon=${uvLon}`;


        // seprate call for UV
        $.ajax({
            url: uvURL,
            method: "GET",
        }).then(function (uvRes) {
            // Log the resulting object
            //console.log(uvRes);
            $("#weatherUV").html(
                `
                    <div class="r-flex">The current
                        <a class="" href"https://www.aimatmelanoma.org/prevention/uv-index/"> UV Index</a> is
                    </div>
                    <div class="">${uvRes.value}</div>
                `
            );
        });
    });

// synchronous request for forecast data

    let forecastURL ="";
    
    let globalF = `http://api.openweathermap.org/data/2.5/forecast?q=${cityInput}&units=${units}&appid=${APIKey}`;
    let countryF = `http://api.openweathermap.org/data/2.5/forecast?q=${cityInput},${countryInput}&units=${units}&appid=${APIKey}`
    let usStatesF = `https://api.openweathermap.org/data/2.5/forecast?q=${cityInput},${stateInput},us&units=${units}&appid=${APIKey}`;

    if (stateInput !== "") {
        forecastURL = usStatesF;
    }
    if (countryInput !== "") {
        forecastURL = countryF;
    }
    else {
        forecastURL = globalF;
    }

    $.ajax({
        url: forecastURL,
        method: "GET",
    }).then(function (forecastRes) {
        $("#forecastWrapper").empty();

        newDiv = "";

        let list = forecastRes.list;

        list.forEach((num, index) => {
            //console.log(index);
            if (index % 8 === 0) {
            /* create card  and append to html */
                let K = list[index].main.temp;
                let lK = list[index].main.temp_min;
                let hK = list[index].main.temp_max;
                let dt = list[index].dt;
                let date = moment.unix(dt).format("L");
            //   console.log(date);

                let iconGet = list[index].weather[0].icon;
                //let subIconGet = iconGet[index].icon;
                //console.log(iconGet);

                let icon = "http://openweathermap.org/img/wn/" + iconGet + "@2x.png";
                let temp = ((K - 273.15) * 1.8 + 32).toFixed();
                let hum = list[index].main.humidity.toFixed();
                let low = ((lK - 273.15) * 1.8 + 32).toFixed();
                let high = ((hK - 273.15) * 1.8 + 32).toFixed();

                newDiv = $("<div>");

                newDiv.html(
                    `
                        <div class="">${date}</div>
                        <div class="">${temp}°</div>
                        <img src="${icon}">
                        <div>Humidity: ${hum}%</div>
                        <div>Low: ${low}°</div>
                        <div>High: ${high}°</div>
                    `
                );
                newDiv.attr("class", "foreCard c-flex");

                $("#forecastWrapper").append(newDiv);
            } else {
            // go through heach item
            //grab temp, humidity, low, high, and icon
            //average the temps, lowest low, highest high
            }
        });
    });
}
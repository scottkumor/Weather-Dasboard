/*













you need to fix the way the storage is poulled on refresh
it only goes by city, so if you save two citries with the same
name the app wont be able to get all the info becasue the key is overwrritten.
change keys to something more specific for each store, possibly using the state code
or the couintry code and only city code for the most broad search

FUCK
































*/



$(document).ready(function () {

    var archive = {}, // Notice change here
        keys = Object.keys(localStorage),
        i = keys.length;

    while (i--) {
        
        archive[keys[i]] = JSON.parse(localStorage.getItem(keys[i]));
        
        $("#history").append(
            `
            <div class="r-flex hisBtnWrap">
                <button class="hisBtn">
                    ${archive[keys[i]].cityInput}
                    
                </button>
                <i data-key="${archive[keys[i]].cityInput}" class="fa fa-times clear"></i>
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
    });

    $("#wipe").on("click", function () {
        localStorage.clear();
        $("#history").empty();
    });

    $("#history").on("click", ".hisBtnWrap", function (evnt) {

        let text = $(this).text().trim();
        console.log(text)
        let item = JSON.parse(localStorage.getItem(text)) || '';

        $("#cityInput").val(text)
        $("#countries").val(item.countryInput || '');
        $("#states").val(item.stateInput || '');

        localStorage.removeItem(text);
        $(this).remove();

        callAPI();
    });

    $("#history").on("click", ".clear", function (event) {
        event.stopPropagation();
        let text = $(this).data("key");
        localStorage.removeItem(text);
        $(this).parent().remove();
    });

    $('#countries').change(function () {
        var opt = $(this).find('option:selected').val();

        if (opt === 'us') {
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
    let units = $("input[name='unitRdo']:checked").val();
    let tempUnit = "";
    let windUnit = "";
    let weatherURL = "";

    // URLs needed to query the database
    let global = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&units=${units}&appid=${APIKey}`;
    let country = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput},${countryInput}&units=${units}&appid=${APIKey}`;
    let usStates = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput},${stateInput},us&units=${units}&appid=${APIKey}`;

    $("#history").append(
        `
        <div class="r-flex hisBtnWrap">
            <button class="hisBtn">
                ${cityInput}
                
            </button>
            <i data-key="${cityInput}" class="fa fa-times clear"></i>
        </div>
        `
    );

    if (stateInput !== "") {
        weatherURL = usStates;

        let key = cityInput;
        let value = { cityInput, countryInput, stateInput }

        localStorage.setItem(key, JSON.stringify(value));
    }
    if (countryInput !== "" && countryInput !== "us") {
        weatherURL = country;

        let key = cityInput;
        let value = { cityInput, countryInput }

        localStorage.setItem(key, JSON.stringify(value));
    }
    else if (countryInput !== "us") {
        weatherURL = global;

        let key = cityInput
        let value = { cityInput, countryInput };

        localStorage.setItem(key, JSON.stringify(value));
    }

    if (units === "kelvin") {
        tempUnit = "°K"
    }
    if (units === "metric") {
        tempUnit = "°C"
    }
    else {
        tempUnit = "°F"
    }


    if (units === "imperial") {
        windUnit = "mph";
    }
    if (units === "metric") {
        windUnit = "kmh";
    }
    else {
        windUnit = "mph";
    }

    $.ajax({
        url: weatherURL,
        method: "GET",
    }).then(function (weatherRes) {
        // Log the resulting object
        //console.log(weatherRes);

        let timeStamp = weatherRes.dt;
        let newDate = moment.unix(timeStamp).format("dddd, MMMM Do");
        let iCode = weatherRes.weather[0].icon;
        let iURL = "http://openweathermap.org/img/wn/" + iCode + "@2x.png";
        changeFavicon(`${iURL}`);

        //console.log(newDate);

        $("#weatherName").html(
            `
                <div class="sub"> Today's weather in</div>
                <div class="sup">${weatherRes.name}<div>
            `
        );
        $("#weatherDate").text(`${newDate}`);
        $("#weatherTemp").html(
            `
                <div class="sub">The current temperature is\xA0</div>
                <div class="sup">${weatherRes.main.temp.toFixed()}${tempUnit}</div>
                
            `
        );
        $("#weatherHum").html(
            `
                <div class="sub">The current humidity is\xA0</div>
                <div class="sup">${weatherRes.main.humidity.toFixed() + "%"}</div>
            `
        );
        $("#weatherWind").html(
            `
                <div class="sub">Wind gusts could reach\xA0</div>
                <div class="sup">${weatherRes.wind.speed.toFixed()} ${windUnit}</div>
            `
        );
        $("#weatherIcon").html(`<img class="icon" src="${iURL}"/>`);
        $("#resultWrap").attr("style", "padding:2vw;");
        $("#detailWrap").attr("style", "padding:2vw;");


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
                    <div class="r-flex sub">The current\xA0
                        <a id="uvLink" target="_blank" href="https://www.aimatmelanoma.org/prevention/uv-index/"> UV Index </a>\xA0is\xA0
                    </div>
                    <div class="sup">${uvRes.value}</div>
                `
            );
        });
    });


    // synchronous request for forecast data

    let forecastURL = "";

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

    if (units === "kelvin") {
        tempUnit = "°K"
    }
    if (units === "metric") {
        tempUnit = "°C"
    }
    else {
        tempUnit = "°F"
    }


    if (units === "imperial") {
        windUnit = "mph";
    }
    if (units === "metric") {
        windUnit = "kmh";
    }
    else {
        windUnit = "mph";
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
                let date = moment.unix(dt).format("ddd, MMM Do");
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
                        <div class="r-flex">
                            <div class="">${date}</div>
                            <div class="">${temp}°</div>
                            <img src="${icon}">
                            <div>Humidity: ${hum}%</div>
                            <div>Low: ${low}°</div>
                            <div>High: ${high}°</div>
                        <div>
                    `
                );
                newDiv.attr("class", "foreCard");

                $("#forecastWrapper").append(newDiv);
            } else {
                // go through heach item
                //grab temp, humidity, low, high, and icon
                //average the temps, lowest low, highest high
            }
        });
    });

    

    $("#cityInput").val('');
    $('#countries').prop('selectedIndex', 0);
    $('#states').prop('selectedIndex', 0);
    $("#states").prop("disabled", true);
}
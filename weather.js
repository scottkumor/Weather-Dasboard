$(document).ready(function () {
    $("#cityInput").keypress(function (e) {
        if (e.which == 13) {
            //Enter key pressed
            $("#citySubmit").click(); //Trigger search button click event
        }
    });

    // Here we run our AJAX call to the OpenWeatherMap API
    $("#citySubmit").on("click", function () {
        callWeatherAPI();
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

        callWeatherAPI();
    });
});

function callWeatherAPI() {

    $("#greeting").attr("style", "display:none;");
    $("#forecastToggle").attr("style", "display:block;");


///////////////


    // This is my API key PROCESS ENV THIS
    let APIKey = "1bc8de1510a7bc2ef6cbcd528035eef8";
    //READ ABOVE PROCESS ENV

///////////////



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

    // resets default values for next search
    $("#cityInput").val('');
    $('#countries').prop('selectedIndex', 0);
    $('#states').prop('selectedIndex', 0);
    $("#states").prop("disabled", true);
}






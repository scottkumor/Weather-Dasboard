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
        callForecastAPI();
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
        callForecastAPI();

    });

    $("#forecastToggle").on("click", function () {
        callForecastAPI();

        //turn this into a toggle to show and hide forecastWrapper
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

    
};

function callForecastAPI() {

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
    let forecastURL = "";

    let global = `https://api.openweathermap.org/data/2.5/forecast?q=${cityInput}&units=${units}&appid=${APIKey}`;
    let country = `https://api.openweathermap.org/data/2.5/forecast?q=${cityInput},${countryInput}&units=${units}&appid=${APIKey}`;
    let usStates = `https://api.openweathermap.org/data/2.5/forecast?q=${cityInput},${stateInput},us&units=${units}&appid=${APIKey}`;

    // api.openweathermap.org/data/2.5/forecast?q={city name}&appid={your api key}
    if (stateInput !== "") {forecastURL = usStates;}
    if (countryInput !== "" && countryInput !== "us") {forecastURL = country;}
    else if (countryInput !== "us") {forecastURL = global;}

    if (units === "kelvin") {tempUnit = "°K"}
    if (units === "metric") {tempUnit = "°C"}
    else {tempUnit = "°F"}

    if (units === "imperial") {windUnit = "mph";}
    if (units === "metric") {windUnit = "kmh";}
    else {windUnit = "mph";}

    $.ajax({
        url: forecastURL,
        method: "GET",
    }).then(function (forecastRes) {

        let list = forecastRes.list;
        console.log(list)

        let today = moment().format('L');
        let day1 = moment(moment().add(1, 'days')).format("L");
        let day2 = moment(moment().add(2, 'days')).format("L");
        let day3 = moment(moment().add(3, 'days')).format("L");
        let day4 = moment(moment().add(4, 'days')).format("L");
        let day5 = moment(moment().add(5, 'days')).format("L");



        let tempHigh1 = "";
        let tempHighArray1 = [];
        let tempLow1 = "";
        let tempLowArray1 = [];
        let hum1 = "";
        let humArray1 = [];
        let wind1 = "";
        let windArray1 = [];
        // let windDeg1 = "";
        // let windDegArray1 = [];
        let icon1 = "";
        let iconsArray1 = [];

        let tempHigh2 = "";
        let tempHighArray2 = [];
        let tempLow2 = "";
        let tempLowArray2 = [];
        let hum2 = "";
        let humArray2 = [];
        let wind2 = "";
        let windArray2 = [];
        // let windDeg2 = "";
        // let windDegArray2 = [];
        let icon2 = "";
        let iconsArray2 = [];

        let tempHigh3 = "";
        let tempHighArray3 = [];
        let tempLow3 = "";
        let tempLowArray3 = [];
        let hum3 = "";
        let humArray3 = [];
        let wind3 = "";
        let windArray3 = [];
        // let windDeg3 = "";
        // let windDegArray3 = [];
        let icon3 = "";
        let iconsArray3 = [];

        let tempHigh4 = "";
        let tempHighArray4 = [];
        let tempLow4 = "";
        let tempLowArray4 = [];
        let hum4 = "";
        let humArray4 = [];
        let wind4 = "";
        let windArray4 = [];
        // let windDeg4 = "";
        // let windDegArray4 = [];
        let icon4 = "";
        let iconsArray4 = [];

        let tempHigh5 = "";
        let tempHighArray5 = [];
        let tempLow5 = "";
        let tempLowArray5 = [];
        let hum5 = "";
        let humArray5 = [];
        let wind5 = "";
        let windArray5 = [];
        // let windDeg5 = "";
        // let windDegArray5 = [];
        let icon5 = "";
        let iconsArray5 = [];

        for (i = 0; i < list.length; i++) {

            let date = moment.unix(list[i].dt).format('L');
            
            if (date === today) {continue;};

            if (date === day1) {
                let highGet1 = list[i].main.temp_max;
                let lowGet1 = list[i].main.temp_min;
                let humGet1 = list[i].main.humidity;
                let windGet1 = list[i].wind.speed;
                // let windDegGet1 = list[i].wind.deg; direction of wind, possibly
                // implement an icon that rotates via css/js
                let icons1 = list[i].weather[0].icon;

                tempHighArray1.push(highGet1);
                tempLowArray1.push(lowGet1);
                humArray1.push(humGet1);
                windArray1.push(windGet1);
                //windDegArray1.push(windDegGet1);
                iconsArray1.push(icons1);

                let modeMap = {};
                let maxIc = iconsArray1[0], maxCount = 1;
                for (let i = 0; i < iconsArray1.length; i++) {
                    let ic = iconsArray1[i];
                    if (modeMap[ic] == null)
                        modeMap[ic] = 1;
                    else
                        modeMap[ic]++;
                    if (modeMap[ic] > maxCount) {
                        maxIc = ic;
                        maxCount = modeMap[ic];
                    }
                }

                icon1 = "http://openweathermap.org/img/wn/" + maxIc + ".png";
            };

            if (date === day2) {
                let highGet2 = list[i].main.temp_max;
                let lowGet2 = list[i].main.temp_min;
                let humGet2 = list[i].main.humidity;
                let windGet2 = list[i].wind.speed;
                // let windDegGet2 = list[i].wind.deg; direction of wind, possibly
                // implement an icon that rotates via css/js
                let icons2 = list[i].weather[0].icon;


                tempHighArray2.push(highGet2);
                tempLowArray2.push(lowGet2);
                humArray2.push(humGet2);
                windArray2.push(windGet2);
                //windDegArray2.push(windDegGet2);
                iconsArray2.push(icons2);

                let modeMap = {};
                let maxIc = iconsArray2[0], maxCount = 1;
                for (let i = 0; i < iconsArray2.length; i++) {
                    let ic = iconsArray2[i];
                    if (modeMap[ic] == null)
                        modeMap[ic] = 1;
                    else
                        modeMap[ic]++;
                    if (modeMap[ic] > maxCount) {
                        maxIc = ic;
                        maxCount = modeMap[ic];
                    }
                }

                icon2 = "http://openweathermap.org/img/wn/" + maxIc + ".png";
            };

            if (date === day3) {
                let highGet3 = list[i].main.temp_max;
                let lowGet3 = list[i].main.temp_min;
                let humGet3 = list[i].main.humidity;
                let windGet3 = list[i].wind.speed;
                // let windDegGet3 = list[i].wind.deg; direction of wind, possibly
                // implement an icon that rotates via css/js
                let icons3 = list[i].weather[0].icon;


                tempHighArray3.push(highGet3);
                tempLowArray3.push(lowGet3);
                humArray3.push(humGet3);
                windArray3.push(windGet3);
                //windDegArray3.push(windDegGet3);
                iconsArray3.push(icons3);

                let modeMap = {};
                let maxIc = iconsArray3[0], maxCount = 1;
                for (let i = 0; i < iconsArray3.length; i++) {
                    let ic = iconsArray3[i];
                    if (modeMap[ic] == null)
                        modeMap[ic] = 1;
                    else
                        modeMap[ic]++;
                    if (modeMap[ic] > maxCount) {
                        maxIc = ic;
                        maxCount = modeMap[ic];
                    }
                }

                icon3 = "http://openweathermap.org/img/wn/" + maxIc + ".png";
            };

            if (date === day4) {
                let highGet4 = list[i].main.temp_max;
                let lowGet4 = list[i].main.temp_min;
                let humGet4 = list[i].main.humidity;
                let windGet4 = list[i].wind.speed;
                // let windDegGet4 = list[i].wind.deg; direction of wind, possibly
                // implement an icon that rotates via css/js
                let icons4 = list[i].weather[0].icon;


                tempHighArray4.push(highGet4);
                tempLowArray4.push(lowGet4);
                humArray4.push(humGet4);
                windArray4.push(windGet4);
                //windDegArray4.push(windDegGet4);
                iconsArray4.push(icons4);

                let modeMap = {};
                let maxIc = iconsArray4[0], maxCount = 1;
                for (let i = 0; i < iconsArray4.length; i++) {
                    let ic = iconsArray4[i];
                    if (modeMap[ic] == null)
                        modeMap[ic] = 1;
                    else
                        modeMap[ic]++;
                    if (modeMap[ic] > maxCount) {
                        maxIc = ic;
                        maxCount = modeMap[ic];
                    }
                }

                icon4 = "http://openweathermap.org/img/wn/" + maxIc + ".png";
            };

            if (date === day5) {
                let highGet5 = list[i].main.temp_max;
                let lowGet5 = list[i].main.temp_min;
                let humGet5 = list[i].main.humidity;
                let windGet5 = list[i].wind.speed;
                // let windDegGet5 = list[i].wind.deg; direction of wind, possibly
                // implement an icon that rotates via css/js
                let icons5 = list[i].weather[0].icon;


                tempHighArray5.push(highGet5);
                tempLowArray5.push(lowGet5);
                humArray5.push(humGet5);
                windArray5.push(windGet5);
                //windDegArray5.push(windDegGet5);
                iconsArray5.push(icons5);


                let modeMap = {};
                let maxIc = iconsArray5[0], maxCount = 1;
                for (let i = 0; i < iconsArray5.length; i++) {
                    let ic = iconsArray5[i];
                    if (modeMap[ic] == null)
                        modeMap[ic] = 1;
                    else
                        modeMap[ic]++;
                    if (modeMap[ic] > maxCount) {
                        maxIc = ic;
                        maxCount = modeMap[ic];
                    }
                }

                icon5 = "http://openweathermap.org/img/wn/" + maxIc + ".png";
            };

        };

        tempHigh1 = Math.max.apply(Math, tempHighArray1).toFixed();
        tempLow1 = Math.min.apply(Math, tempLowArray1).toFixed();
        hum1 = Math.max.apply(Math, humArray1).toFixed();
        wind1 = Math.min.apply(Math, windArray1).toFixed();
        //windDeg1 = Math.max.apply(Math, windDegArray1).toFixed();
        console.log("high: "+tempHigh1,"low: "+tempLow1,"hum: "+hum1,"wind: "+wind1, "icon: "+icon1);

        tempHigh2 = Math.max.apply(Math, tempHighArray2).toFixed();
        tempLow2 = Math.min.apply(Math, tempLowArray2).toFixed();
        hum2 = Math.max.apply(Math, humArray2).toFixed();
        wind2 = Math.min.apply(Math, windArray2).toFixed();
        //windDeg2 = Math.max.apply(Math, windDegArray2).toFixed();
        console.log("high: "+tempHigh2,"low: "+tempLow2,"hum: "+hum2,"wind: "+wind2, "icon: "+icon2);

        tempHigh3 = Math.max.apply(Math, tempHighArray3).toFixed();
        tempLow3 = Math.min.apply(Math, tempLowArray3).toFixed();
        hum3 = Math.max.apply(Math, humArray3).toFixed();
        wind3 = Math.min.apply(Math, windArray3).toFixed();
        //windDeg3 = Math.max.apply(Math, windDegArray3).toFixed();
        console.log("high: "+tempHigh3,"low: "+tempLow3,"hum: "+hum3,"wind: "+wind3, "icon: "+icon3);

        tempHigh4 = Math.max.apply(Math, tempHighArray4).toFixed();
        tempLow4 = Math.min.apply(Math, tempLowArray4).toFixed();
        hum4 = Math.max.apply(Math, humArray4).toFixed();
        wind4 = Math.min.apply(Math, windArray4).toFixed();
        //windDeg4 = Math.max.apply(Math, windDegArray4).toFixed();
        console.log("high: "+tempHigh4,"low: "+tempLow4,"hum: "+hum4,"wind: "+wind4, "icon: "+icon4);

        tempHigh5 = Math.max.apply(Math, tempHighArray5).toFixed();
        tempLow5 = Math.min.apply(Math, tempLowArray5).toFixed();
        hum5 = Math.max.apply(Math, humArray5).toFixed();
        wind5 = Math.min.apply(Math, windArray5).toFixed();
        //windDeg5 = Math.max.apply(Math, windDegArray5).toFixed();
        console.log("high: "+tempHigh5,"low: "+tempLow5,"hum: "+hum5,"wind: "+wind5, "icon: "+icon5);
    
    
        newDiv1 = $("<div>");

        newDiv1.html(
            `
                <div r-flex">
                    <div class="cardLeft c-flex">
                        <div class="">${day1}</div>
                        <img class="icon" src="${icon1}">
                    </div>
                    <div class="cardRight c-flex">
                        <div>High: ${tempHigh1}°</div>
                        <div>Low: ${tempLow1}°</div>
                        <div>Humidity: ${hum1}%</div>
                        <div>Wind: ${wind1}°</div>
                    </div>
                <div>
            `
        );
        newDiv1.attr("class", "foreCard");


        newDiv2 = $("<div>");

        newDiv2.html(
            `
                <div r-flex">
                    <div class="cardLeft c-flex">
                        <div class="">${day2}</div>
                        <img class="icon" src="${icon2}">
                    </div>
                    <div class="cardRight c-flex">
                        <div>High: ${tempHigh2}°</div>
                        <div>Low: ${tempLow2}°</div>
                        <div>Humidity: ${hum2}%</div>
                        <div>Wind: ${wind2}°</div>
                    </div>
                <div>
            `
        );
        newDiv2.attr("class", "foreCard");


        newDiv3 = $("<div>");

        newDiv3.html(
            `
                <div r-flex">
                    <div class="cardLeft c-flex">
                        <div class="">${day3}</div>
                        <img class="icon" src="${icon3}">
                    </div>
                    <div class="cardRight c-flex">
                        <div>High: ${tempHigh3}°</div>
                        <div>Low: ${tempLow3}°</div>
                        <div>Humidity: ${hum3}%</div>
                        <div>Wind: ${wind3}°</div>
                    </div>
                <div>
            `
        );
        newDiv3.attr("class", "foreCard");

        newDiv4 = $("<div>");

        newDiv4.html(
            `
                <div r-flex">
                    <div class="cardLeft c-flex">
                        <div class="">${day4}</div>
                        <img class="icon" src="${icon4}">
                    </div>
                    <div class="cardRight c-flex">
                        <div>High: ${tempHigh4}°</div>
                        <div>Low: ${tempLow4}°</div>
                        <div>Humidity: ${hum4}%</div>
                        <div>Wind: ${wind4}°</div>
                    </div>
                <div>
            `
        );
        newDiv4.attr("class", "foreCard");

        newDiv5 = $("<div>");

        newDiv5.html(
            `
                <div r-flex">
                    <div class="cardLeft c-flex">
                        <div class="">${day5}</div>
                        <img class="icon" src="${icon5}">
                    </div>
                    <div class="cardRight c-flex">
                        <div>High: ${tempHigh5}°</div>
                        <div>Low: ${tempLow5}°</div>
                        <div>Humidity: ${hum5}%</div>
                        <div>Wind: ${wind5}°</div>
                    </div>
                <div>
            `
        );
        newDiv5.attr("class", "foreCard");


        $("#forecastWrapper").append(newDiv1, newDiv2, newDiv3, newDiv4, newDiv5);
    
    
    });

    

    // resets default values for next search
    $("#cityInput").val('');
    $('#countries').prop('selectedIndex', 0);
    $('#states').prop('selectedIndex', 0);
    $("#states").prop("disabled", true);
};






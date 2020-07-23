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


    $.ajax({
        url: forecastURL,
        method: "GET",
    }).then(function (forecastRes) {

        $("#forecastWrapper").empty();

        newDiv = "";
        //possibly turn this into a table of newDivs as rows with column headers

        let list = forecastRes.list;
        console.log(list);

        let fDay1 = moment(moment().add(1, 'days')).format("L");
        let fDay1Temps = [];
        let fDay1Highs = [];
        let fDay1Lows = [];
        let fDay1Hums = [];
        let fDay1Icons = [];

        let fDay2 = moment(moment().add(2, 'days')).format("L");
        let fDay2Temps = [];
        let fDay2Highs = [];
        let fDay2Lows = [];
        let fDay2Hums = [];
        let fDay2Icons = [];

        let fDay3 = moment(moment().add(3, 'days')).format("L");
        let fDay4 = moment(moment().add(4, 'days')).format("L");
        let fDay5 = moment(moment().add(5, 'days')).format("L");



        for (i = 0; i < list.length; i++) {
            

            let txtDate = moment.unix(list[i].dt).format("ddd, MMM Do");
            let date = moment.unix(list[i].dt).format("L");

            //txtDate is for diaply, date is for avergaing all data on one day
            //run a match on these data points and average what you get. 
            if (date === fDay1) {

                let temps = list[i].main.temp;
                fDay1Temps.push(temps);
                //console.log(fDay1Temps);
                let temp = Math.max.apply(Math, fDay1Temps)
                //console.log(temp.toFixed());


                let highs = list[i].main.temp_max;
                fDay1Highs.push(highs);
                //console.log(fDay1Highs);
                let high = Math.max.apply(Math, fDay1Highs)
                //console.log(high.toFixed());

                let lows = list[i].main.temp_min;
                fDay1Lows.push(lows);
                //console.log(fDay1Lows);
                let low = Math.min.apply(Math, fDay1Lows)
                //console.log(low.toFixed());

                let hums = list[i].main.humidity;
                fDay1Hums.push(hums);
                //console.log(fDay1Hums);
                let hum = Math.max.apply(Math, fDay1Hums)
                //console.log(hum.toFixed());


                let icons = list[i].weather[0].icon;
                fDay1Icons.push(icons);
                console.log(fDay1Icons);

                let modeMap = {};
                let maxIc = fDay1Icons[0], maxCount = 1;
                for (let i = 0; i < fDay1Icons.length; i++) {
                    let ic = fDay1Icons[i];
                    if (modeMap[ic] == null)
                        modeMap[ic] = 1;
                    else
                        modeMap[ic]++;
                    if (modeMap[ic] > maxCount) {
                        maxIc = ic;
                        maxCount = modeMap[ic];
                    }
                }

                let iconGet = maxIc;
                console.log(iconGet)
                let icon = "http://openweathermap.org/img/wn/" + iconGet + "@2x.png";

                newDiv = $("<div>");

                newDiv.html(
                    `
                        <div r-flex">
                            <div class="cardLeft c-flex">
                                <div class="">${txtDate}</div>
                                <div class="r-flex">
                                    <div class="">${temp.toFixed()}°</div>
                                    <img class="icon" src="${icon}">
                                </div>
                            </div>
                            <div class="cardRight c-flex">
                                <div>Humidity: ${hum.toFixed()}%</div>
                                <div>Low: ${low.toFixed()}°</div>
                                <div>High: ${high.toFixed()}°</div>
                            </div>
                        <div>
                    `
                );
                newDiv.attr("class", "foreCard");
                //tweak this card as you see fit

                $("#forecastWrapper").append(newDiv);

            }
            if (date === fDay2) {

                // let temps = list[i].main.temp;
                // fDay2Temps.push(temps);
                // //console.log(fDay2Temps);
                // let temp = Math.max.apply(Math, fDay2Temps)
                // //console.log(temp.toFixed());


                // let highs = list[i].main.temp_max;
                // fDay2Highs.push(highs);
                // //console.log(fDay2Highs);
                // let high = Math.max.apply(Math, fDay2Highs)
                // //console.log(high.toFixed());

                // let lows = list[i].main.temp_min;
                // fDay2Lows.push(lows);
                // //console.log(fDay2Lows);
                // let low = Math.min.apply(Math, fDay2Lows)
                // //console.log(low.toFixed());

                // let hums = list[i].main.humidity;
                // fDay2Hums.push(hums);
                // //console.log(fDay2Hums);
                // let hum = Math.max.apply(Math, fDay2Hums)
                // //console.log(hum.toFixed());


                // let icons = list[i].weather[0].icon;
                // fDay2Icons.push(icons);
                // console.log(fDay2Icons);

                // let modeMap = {};
                // let maxIc = fDay2Icons[0], maxCount = 1;
                // for (let i = 0; i < fDay2Icons.length; i++) {
                //     let ic = fDay2Icons[i];
                //     if (modeMap[ic] == null)
                //         modeMap[ic] = 1;
                //     else
                //         modeMap[ic]++;
                //     if (modeMap[ic] > maxCount) {
                //         maxIc = ic;
                //         maxCount = modeMap[ic];
                //     }
                // }

                // let iconGet = maxIc;
                // console.log(iconGet)
                // let icon = "http://openweathermap.org/img/wn/" + iconGet + "@2x.png";

                
            }
            if (date === fDay3) {
                console.log('match 3')
            }
            if (date === fDay4) {
                console.log('match 4')
            }
            if (date === fDay5) {
                console.log('match 5')
            }



















            // let temp = list[i].main.temp.toFixed();
            // // average of all temps in this main array
            // let low = list[i].main.temp_min.toFixed(); //take these at face value
            // let high = list[i].main.temp_max.toFixed();

            // let iconGet = list[i].weather[0].icon;
            // // use a an array to store all the codes, find the most frequent one
            // // and set it to iconGet
            // let icon = "http://openweathermap.org/img/wn/" + iconGet + "@2x.png";

            // let hum = list[i].main.humidity.toFixed();
            // // check to see if this needs to be an average


            // newDiv = $("<div>");

            // newDiv.html(
            //     `
            //             <div r-flex">
            //                 <div class="cardLeft c-flex">
            //                     <div class="">${txtDate}</div>
            //                     <div class="r-flex">
            //                         <div class="">${temp}°</div>
            //                         <img class="icon" src="${icon}">
            //                     </div>
            //                 </div>
            //                 <div class="cardRight c-flex">
            //                     <div>Humidity: ${hum}%</div>
            //                     <div>Low: ${low}°</div>
            //                     <div>High: ${high}°</div>
            //                 </div>
            //             <div>
            //         `
            // );
            // newDiv.attr("class", "foreCard");
            // //tweak this card as you see fit

            // $("#forecastWrapper").append(newDiv);

            // // go through heach item
            // //grab temp, humidity, low, high, and icon
            // //average the temps, lowest low, highest high

        };
    });


    // resets default values for next search
    $("#cityInput").val('');
    $('#countries').prop('selectedIndex', 0);
    $('#states').prop('selectedIndex', 0);
    $("#states").prop("disabled", true);
}

$(document).ready(function () {

    // Here we run our AJAX call to the OpenWeatherMap API
    $("#forecastToggle").on("click", function () {
        callForecastAPI();

        //turn this into a toggle to show and hide forecastWrapper
    });
});



function callForecastAPI() {


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

        newDiv1 = "";

        let list = forecastRes.list;
        console.log(list);

        let tempDay1 = "";
        let highDay1 = "";
        let lowDay1 = "";
        let humDay1 = "";
        let iconDay1 = "";

        for (i = 0; i < list.length; i++) {

            let fDay1 = moment(moment().add(1, 'days')).format("L");
            let fDay2 = moment(moment().add(2, 'days')).format("L");
            let fDay3 = moment(moment().add(3, 'days')).format("L");
            let fDay4 = moment(moment().add(4, 'days')).format("L");
            let fDay5 = moment(moment().add(5, 'days')).format("L");

            let txtDate = moment.unix(list[i].dt).format("ddd, MMM Do");
            let date = moment.unix(list[i].dt).format("L");

            //txtDate is for display, date is for avergaing all data on one day
            //run a match on these data points and average what you get. 
            if (date === fDay1) {
                let fDay1Temps = [];
                let fDay1Highs = [];
                let fDay1Lows = [];
                let fDay1Hums = [];
                let fDay1Icons = [];

                let temps = list[i].main.temp;
                fDay1Temps.push(temps);
                tempDay1 = Math.max.apply(Math, fDay1Temps);


                let highs = list[i].main.temp_max;
                fDay1Highs.push(highs);
                highDay1 = Math.max.apply(Math, fDay1Highs)

                let lows = list[i].main.temp_min;
                fDay1Lows.push(lows);
                lowDay1 = Math.min.apply(Math, fDay1Lows)

                let hums = list[i].main.humidity;
                fDay1Hums.push(hums);
                humDay1 = Math.max.apply(Math, fDay1Hums);


                let icons = list[i].weather[0].icon;
                fDay1Icons.push(icons);

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

                iconDay1 = "http://openweathermap.org/img/wn/" + maxIc + "@2x.png";


            }
            if (date === fDay2) {

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

            newDiv1 = $("<div>");

            newDiv1.html(
                `
                    <div r-flex">
                        <div class="cardLeft c-flex">
                            <div class="">${txtDate}</div>
                            <div class="r-flex">
                                <div class="">${tempDay1}°</div>
                                <img class="icon" src="${iconDay1}">
                            </div>
                        </div>
                        <div class="cardRight c-flex">
                            <div>Humidity: ${humDay1}%</div>
                            <div>Low: ${lowDay1}°</div>
                            <div>High: ${highDay1}°</div>
                        </div>
                    <div>
                `
            );
            newDiv1.attr("class", "foreCard");
            //tweak this card as you see fit

            $("#forecastWrapper").append(newDiv1);
        };


    });

};




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

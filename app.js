/*





you need to fix the way the storage is poulled on refresh
it only goes by city, so if you save two citries with the same
name the app wont be able to get all the info becasue the key is overwrritten.
change keys to something more specific for each store, possibly using the state code
or the couintry code and only city code for the most broad search

turn forecast into a opt-in, toggle a button to go back to just today's weather


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

    

    $("#wipe").on("click", function () {
        localStorage.clear();
        $("#history").empty();
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
};
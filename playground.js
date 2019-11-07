var searches = [];

function searchStore() {
    var userInput = $('#cityInput');
    searches[searches.length] = {
        value: userInput.val()
    };
    localStorage.setItem("storage", JSON.stringify(searches));
};


userInput = JSON.parse(localStorage.getItem("storage")) || {};
    $('#history').append(`<button class="bg-g-fbh bd-n c-pri-2 fz-l p-s ta-l ti-s m-s">${userInput}</button>`);

    //searchStore();

    


    function renderSearch() {

        //$('#history').empty();

        var history = JSON.parse(localStorage.getItem("storage"));
        console.log(history);

        for (i = 0; i < history.length; i++) {

            var city = searches[i].value;

            $('#history').append(`<button class="bg-g-fbh bd-n c-pri-2 fz-l p-s ta-l ti-s m-s">${city}</button>`);

        };
    };

    
        /* get the key and the value */
        renderSearch();

        // event.stopPropagation();
        // event.stopImmediatePropagation();

        //     if(pastSearches.indexOf(search) == -1) {
        //         pastSearches.unshift(search);
        //         if(pastSearches.length > 5) { 
        //            pastSearches.pop();
        //         }
        //         localStorage["pastSearches"] = JSON.stringify(pastSearches);
        //    }

        // $(document).on("click", ".pastSearchLink", function(e) {
        //     e.preventDefault();
        //     var search = $(this).text();
        //     doSearch(search);
        // });

        $("#cityInput").val('');
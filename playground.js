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


//         // event.stopPropagation();
//         // event.stopImmediatePropagation();

//         //     if(pastSearches.indexOf(search) == -1) {
//         //         pastSearches.unshift(search);
//         //         if(pastSearches.length > 5) { 
//         //            pastSearches.pop();
//         //         }
//         //         localStorage["pastSearches"] = JSON.stringify(pastSearches);
//         //    }

//         // $(document).on("click", ".pastSearchLink", function(e) {
//         //     e.preventDefault();
//         //     var search = $(this).text();
//         //     doSearch(search);
//         // });

//         

        $(document).ready(function () {

            let storedHistory = JSON.parse(localStorage.getItem("storage")) || {};
            for (i = 0; i < storedHistory.length; i++) {
                if (Object.keys(storedHistory).length) {
                    $('#history').append(`<button class="bg-g-fbh bd-n c-pri-2 fz-l p-s ta-l ti-s m-s">${storedHistory[i].value}</button>`);
                } else {
                    $('#history').empty();
                }
            };




            $('#cityInput').keypress(function (e) {
                if (e.which == 13) {//Enter key pressed
                    $('#citySubmit').click();//Trigger search button click event
                }
            });
        
            $("#citySubmit").on("click", function () {
               searchStore();
               






            }); //end of on click

        }); //end of doc ready
            

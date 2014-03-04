/*
    LEGO Universe News! Minifig Wizard

    Created 2013-2014 Triangle717 & rioforce
    <http://Triangle717.WordPress.com/>
    <http://rioforce.WordPress.com/>

    Licensed under The MIT License
    <http://opensource.org/licenses/MIT>
*/


// IDs of background-color changing boxes and it's length
var boxIDList = ["redColorBox", "greenColorBox", "blueColorBox",
                 "yellowColorBox", "orangeColorBox", "grayColorBox",
                 "blackColorBox", "whiteColorBox"
                ];


$(function() {
    "use strict";

    /* ------- Initialize color boxes ------- */


    // Construct the box. ID attribute will be added in a moment
    var colorBoxes = '<td class="colorBox" onclick="changeColor(this.id)"></td>';

    // Append the required number of boxes to the table
    for (var i = 0; i < boxIDList.length; i += 1) {
        $("tbody").append(colorBoxes);
    }

    // Go through each column and apply it's ID attribute
    for (var m = 0; m < boxIDList.length; m += 1) {
        // Counting VS real number stuff, + 2 for valid nth-child selectors
        var realNumber = (m + 2);
        $("td:nth-child(" + realNumber + ")").attr("id", boxIDList[m]);
    }


    /* ------- Settings panel displaying ------- */


    // Current location of settings panel
    // true === down, false === up
    var position = true;


    // The user wants to display the settings
    $("#gear").click(function () {
        // The settings are currently visible, trigger transition to hide them
        if (position) {
            position = false;
            $("#settings-panel").css("transform", "translateY(-30px)");
        } else {
            // The settings are currently hidden, trigger transition to display them
            position = true;
            $("#settings-panel").css("transform", "");
        }
    });


    /* ------- Image size changing ------- */


    var $newImgSizeRaw, $newImgSize,
        $imgSize = $("#size-input");

    // Get entered value on each keypress
    $imgSize.keyup(function () {
        $newImgSizeRaw = $imgSize.val();

        // Convert it to a Base10 integer
        $newImgSize = parseInt($newImgSizeRaw, 10);

        /* If the integer:
            1. is is a valid number
            2. is less than or equal to 600 (original size),
        */
        if ((!isNaN($newImgSize)) && ($newImgSize <= 600)) {
            // Resize all images to the new size
            $(".TheBigPicture").width($newImgSize);
            $("#ShadowImg").width($newImgSize);
        }
    });
});


function changeColor(newColor) {
    "use strict";
    // Construct the ID selector
    newColor = "#" + newColor;

    // Get the CSS value from the clicked box
    var bgcolor = $(newColor).css("background-color");

    // Change the background color to the selected color
    $("body").css("background-color", bgcolor);
}

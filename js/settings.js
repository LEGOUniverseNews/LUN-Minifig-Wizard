/*
    LEGO Universe News! Minifig Wizard

    Created 2013-2014 Triangle717 & rioforce
    <http://Triangle717.WordPress.com/>
    <http://rioforce.WordPress.com/>

    Licensed under The MIT License
    <http://opensource.org/licenses/MIT>
*/


// IDs of background-color changing boxes and it's length
var boxIDList = ["red-color-box", "green-color-box", "blue-color-box",
                 "yellow-color-box", "orange-color-box", "gray-color-box",
                 "black-color-box", "white-color-box"
                ];


$(function() {
    "use strict";

    /* ------- Initialize color boxes ------- */


    // Construct the box. ID attribute will be added in a moment
    var colorBox = '<td class="color-box" onclick="changeColor(this.id)"></td>';

    // Append the required number of boxes to the table
    $.each(boxIDList, function() {
        $("tbody").append(colorBox);
    });

    // Go through each column and apply it's ID attribute
    $.each(boxIDList.reverse(), function(index, value) {
        // Counting VS real number stuff, + 2 for valid nth-child selectors
        $("td:nth-child({0})".format(index + 2)).attr("id", value);
    });

    // Now that the boxes are generated, apply the currently selected border
    // to the gray box, as it is used on page load
    $("#gray-color-box").addClass("white-border");

    /* ------- Settings panel displaying ------- */


    // Current location of settings panel
    // true === down, false === up
    var displayPosition = true;


    // The user wants to display the settings
    $("#gear").click(function() {
        // The settings are currently visible, trigger transition to hide them
        if (displayPosition) {
            displayPosition = false;
            $("#settings-panel").css("transform", "translateY(-30px)");
        } else {
            // The settings are currently hidden, trigger transition to display them
            displayPosition = true;
            $("#settings-panel").css("transform", "");
        }
    });


    /* ------- Image size changing ------- */


    var $newImgSizeRaw, $newImgSize,
        $imgSize = $("#size-input");

    // Get entered value on each keypress (this way, it is instant and dynamic)
    $imgSize.keyup(function () {
        $newImgSizeRaw = $imgSize.val();

        // Convert it to a Base10 integer
        $newImgSize = parseInt($newImgSizeRaw, 10);

        /**
         * If the integer entered is
         * 1. a valid number,
         * 2. less than or equal to 600 (original size)
         * then resize the image
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
    /* Change the window background color to the desired selection */

    var bgColor, currentColor;
    // Construct the ID selector
    newColor = "#{0}".format(newColor);

    // Get the CSS value from the clicked box
    bgColor = $(newColor).css("background-color");

    // Get the ID of the currently selected box
    currentColor = $(".color-box").find('.white-border').selector.replace(/ .white-border/, "");

    // Remove the white border from the old box and apply it to the new one
    $(currentColor).removeClass("white-border");
    $(newColor).addClass("white-border");

    // Change the background color to the selected color
    $("body").css("background-color", bgColor);
}

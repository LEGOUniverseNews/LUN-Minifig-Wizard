/*
  LEGO Universe News! Minifig Wizard

  Created 2013-2014 Triangle717 & rioforce
  <http://Triangle717.WordPress.com/>
  <http://rioforce.WordPress.com/>

  Licensed under The MIT License
  <http://opensource.org/licenses/MIT>
*/


// Color boxes IDs
var boxIDList = ["red-color-box", "green-color-box", "blue-color-box",
                 "yellow-color-box", "orange-color-box", "black-color-box",
                 "white-color-box", "gray-color-box"
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
    // Counting VS real number stuff, index + 2 for valid `nth-child` selectors
    $("td:nth-child({0})".format(index + 2)).attr("id", value);
  });

  // Now that the boxes are generated, apply the currently selected border
  // to the gray box, as it is used on page load
  $("#gray-color-box").addClass("white-border");


  /* ------- Settings panel displaying ------- */


  // Current location of settings panel
  // true === hidden, false === visible
  var panelIsHidden = true,
      transitionSpeed = 1150,
      transitionSupport = Modernizr.csstransitions,
      $gearBttn = $("#gear"),
      $settingsPanel = $("#settings-panel");


  // This browser does not support CSS transitions
  if (!transitionSupport) {
    // IE9 - Hide settings panel on window load
    $settingsPanel.css("bottom", "-120px");

    // IE9 - Recreate #gear:hover movement
    // FIXME It keeps getting stuck in an up-and-down loop for a few seconds
    $gearBttn.on("mouseover", function() {
      $gearBttn.animate({"bottom": "4px"}, 500);
    });
    $gearBttn.on("mouseout", function() {
      $gearBttn.animate({"bottom": "-2px"}, 500);
    });
  }

  // The user wants to display the settings panel
  $gearBttn.on("click", function() {
    // The panel is currently hidden, trigger CSS transition to display them
    if (panelIsHidden) {
      panelIsHidden = false;
      $settingsPanel.css("visibility", "visible");

      // Except CSS transitions are not supported, use jQuery animation instead
      if (!transitionSupport) {
        $settingsPanel.animate({"bottom": "52px"}, transitionSpeed);
      } else {
        $settingsPanel.css("transform", "translate3d(0, -35px, 0)");
      }
    } else {
      // The panel is currently visible, trigger CSS transition to hide them
      panelIsHidden = true;
      if (!transitionSupport) {
        $settingsPanel.animate({"bottom": "-120px"}, transitionSpeed);
      } else {
        $settingsPanel.css("transform", "");

        // transitionSpeed + 2 to accommodate for possible lag
        window.setTimeout(function() {
          $settingsPanel.css("visibility", "hidden");
        }, transitionSpeed + 2);
      }
    }
  });


  /* ------- Image size changing ------- */


  var $newImgSizeRaw, $newImgSize,
      $imgSize = $("#size-input");

  // Get entered value on each key press (that way the change is instant and dynamic)
  $imgSize.keyup(function() {
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
      $(".the-big-picture").width($newImgSize);
      $("#shadow-img").width($newImgSize);
    }
  });
});


function changeColor(newColor) {
  "use strict";
  /* Change the window background color to the desired selection */

  var $bgColor, currentColor;
  // Construct the ID selector
  newColor = "#{0}".format(newColor);

  // Get the CSS value from the clicked box
  $bgColor = $(newColor).css("background-color");

  // Get the ID of the currently selected box
  currentColor = $(".color-box").find('.white-border').selector.replace(/ .white-border/, "");

  // Remove the white border from the old box and apply it to the new one
  $(currentColor).removeClass("white-border");
  $(newColor).addClass("white-border");

  // Change the background color to the selected color
  $("body").css("background-color", $bgColor);
}

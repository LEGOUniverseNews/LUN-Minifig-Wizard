/*
 * LEGO Universe News! Minifig Wizard
 *
 * Created 2013-2014 Triangle717 & rioforce
 * <http://Triangle717.WordPress.com/>
 * <http://rioforce.WordPress.com/>
 *
 * Licensed under The MIT License
 * <http://opensource.org/licenses/MIT>
 */


// Color boxes IDs
var boxIDList = [
  "gray-color-box", "white-color-box", "black-color-box",
   "orange-color-box", "yellow-color-box", "blue-color-box",
   "green-color-box", "red-color-box"
];


$(function() {
  "use strict";

  /* ------- Initialize color boxes ------- */


  // Display the color boxes, giving them IDs
  $.each(boxIDList, function(index, value) {
    $("table").append("<td class='color-box'></td>").wrap("<tr/>");
    $("td:nth-child({0})".format(index + 1)).attr("id", value);
  });

  // Now that the boxes are generated, apply the currently selected border
  // to the gray box, as it is used on page load
  $("#gray-color-box").addClass("white-border");


  /* ------- Settings panel displaying ------- */


  // Current location of settings panel
  // true === hidden, false === visible
  var panelIsHidden     = true,
      transitionSpeed   = 1150,
      transitionSupport = Modernizr.csstransitions,
      $gearBtn          = $("#gear"),
      $settingsPanel    = $("#settings-panel");

  $gearBtn.on("click", function() {
    // The panel is currently hidden, trigger CSS transition to display them
    if (panelIsHidden) {
      panelIsHidden = false;
      $settingsPanel.css("visibility", "visible");

      // Except CSS transitions are not supported, use jQuery animation instead
      if (!transitionSupport) {
        $settingsPanel.animate({"bottom": "3.6em"}, transitionSpeed);
      } else {
        $settingsPanel.css("transform", "translate3d(0, -2.188em, 0)");
      }
    } else {
      // The panel is currently visible, trigger CSS transition to hide them
      panelIsHidden = true;
      if (!transitionSupport) {
        $settingsPanel.animate({"bottom": "-7.5em"}, transitionSpeed);
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

  // Get changed value
  var $imgSize = $("#size-input");
  $imgSize.on("input", function() {
    var $newImgSizeRaw = $imgSize.val(),
        $newImgSize    = parseInt($newImgSizeRaw);

     // If the integer entered is
     // 1. a valid number,
     // 2. less than or equal to 600 (full size), then resize the image
     // 3. If it is greater than 600, change it to 600
    if (!isNaN($newImgSize)) {
      if ($newImgSize >= 600) {
        $newImgSize = 600;
      }

      // Resize all images to the new size
      $(".the-big-picture").width($newImgSize);
    }
  });


  /* ------- Window background color changing ------- */


  $(".color-box").on("click", function() {
    // Get the CSS value from the clicked box
    var $bgColor = $(this).css("background-color");

    // Remove the white border from the old box and apply it to the new one
    $(".color-box").removeClass("white-border");
    $(this).addClass("white-border");

    // Change the background color to the selected color
    $("body").css("background-color", $bgColor);
  });
});

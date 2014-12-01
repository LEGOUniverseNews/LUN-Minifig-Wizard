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


(function($) {
"use strict";
  $(function() {

    /**
     * Initialize color boxes
     */

    // Color boxes IDs
    var boxIDList = [
      "gray-color-box", "white-color-box", "black-color-box",
      "orange-color-box", "yellow-color-box", "blue-color-box",
      "green-color-box", "red-color-box"
    ];

    // Display the color boxes, giving them IDs
    boxIDList.forEach(function(value, index) {
      $("tr").append("<td class='color-box'></td>");
      $("td:nth-child({0})".format(index + 1)).attr("id", value);
    });

    // Now that the boxes are generated, apply the currently selected border
    // to the gray box, as it is used on page load
    $("#gray-color-box").addClass("white-border");


    /**
     * Settings panel displaying
     */
    // Current location of settings panel
    var gearBtn   = document.querySelector("#btn-gear"),
        settPanel = document.querySelector("#settings-panel"),
        isVisible = false;

    gearBtn.onclick = function() {
      // The panel is currently hidden
      if (isVisible) {
        isVisible = false;
        settPanel.style.visibility = "visible";
        settPanel.style.webkitTransform = "translate3d(0, -2.188em, 0)";
        settPanel.style.msTransform = "translate3d(0, -2.188em, 0)";
        settPanel.style.transform = "translate3d(0, -2.188em, 0)";

        // The panel is currently visible
      } else {
        isVisible = true;
        settPanel.style.webkitTransform = "";
        settPanel.style.msTransform = "";
        settPanel.style.transform = "";
      }
    };


    /**
     * Image size changing
     */
    var $sizeInput = $("#input-size");
    $sizeInput.on("input", function() {
      var imageSize = parseInt($sizeInput.val());

      // Keep it real
      if (!isNaN(imageSize)) {

          // Clamp the image size if needed
          if (imageSize > 600) {
            imageSize = 600;
          } else if (imageSize < 0) {
            imageSize = 0;
          }

        // Resize all images to the new size
        $(".the-big-picture").width(imageSize);
      }
    });


    /**
     * Changing background color.
     */
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
})(jQuery);

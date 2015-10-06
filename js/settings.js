/*
 * LEGO Universe News! Minifig Wizard
 *
 * Created 2013-2015 Triangle717 & rioforce
 * <http://Triangle717.WordPress.com/>
 * <http://rioforce.WordPress.com/>
 *
 * Licensed under The MIT License
 * <http://opensource.org/licenses/MIT>
 */


(function($) {
  "use strict";
  $(function() {
    // Display the minifigure
    var images = document.LUN.decodeQuery();
    if (images) {
      images.forEach(function(value) {
        $(document.LUN.getVariable("imgShadow")).before("<img class='the-big-picture' src='" + value + "'>");
      });
    }

    /**
     * Settings panel displaying
     */
    var $settPanel = $("#settings-panel");
    $("#btn-gear").on("click", function() {
      $settPanel.toggleClass("visible");
    });

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
        $sizeInput.val(imageSize);
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

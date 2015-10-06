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
    var QsettingsPanel = document.querySelector("#settings-panel");
    document.querySelector("#btn-gear").addEventListener("click", function() {
      QsettingsPanel.classList.toggle("visible");
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
     * Change the new window background color.
     */
    var QcolorBox = document.querySelector("#settings-panel tr"),
        Qbody = document.querySelector("body");

    QcolorBox.addEventListener("click", function(e) {
      // Activate only on the color boxes
      if (!e.target.classList.contains("color-box")) {
        return false;
      }

      // Remove previous colors
      if (/color-(?!box)/.test(Qbody.className)) {
        var oldClass = Qbody.className.match(/color-\w+/);
        Qbody.classList.remove(oldClass);
      }

      // Change the background color
      document.querySelector(".color-box.white-border").classList.remove("white-border");
      e.target.classList.add("white-border");
      Qbody.classList.add(e.target.classList[1]);
    });
  });
})(jQuery);

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
  // Global variables for various stuff
  // TODO Remove these as much as possible
  var oldPartNumberId;

  // Restore prototype extending behavior of string-format
  format.extend(String.prototype);

  /**
   * @type {Object}
   */
  var layoutDetails = {
    size: 4,
    curImages: [],
    curPartID: null,
    curPartName: ""
  };


  // Retrieve a jQuery selector for commonly used elements
  var $buildArea          = $(document.LUN.getVariable("buildArea")),
      $background         = $(document.LUN.getVariable("background")),
      $buttonResize       = $(document.LUN.getVariable("buttonResize")),
      $minifigItems       = $(document.LUN.getVariable("minifigItems")),
      $buttonNewWindow    = $(document.LUN.getVariable("buttonNewWindow")),
      $areaMinifigParts   = $(document.LUN.getVariable("areaMinifigParts")),
      $categoryButtonsTh  = $(document.LUN.getVariable("categoryButtonsTh")),
      $categoryButtonsDiv = $(document.LUN.getVariable("categoryButtonsDiv")),
      $categoryButtonsImg = $(document.LUN.getVariable("categoryButtonsImg"));


  /**
   * Capitalize the first letter of the given text.
   * @param {String} text
   * @returns {String}
   */
  function capitalFirst(text) {
    return text.charAt(0).toUpperCase() + text.substr(1);
  }


  /**
   * Preserve orange box around selected part (if any) between resizes.
   * @param {String} partID
   * @returns {Boolean} Always returns true.
   */
  function reapplyBubble(partID) {
    // Only perform the class changes if an item was selected
    if (partID) {
      var $partID = $(partID);

      // 2 milliseconds (and no sooner!) later, reapply the bubble
      // The timeout is required so jQuery has time to remove the class
      // TODO This broke in commit 69b9e35c7be66f3725750cded503040d927083f8
      // when the ID was moved to the global object
      window.setTimeout(function() {
        $partID.addClass("selected");
      }, 2);
    }
    return true;
  }


  /**
   * Open a new window with a larger version of the minifig.
   * @returns {Boolean} Always returns true.
   */
  $buttonNewWindow.on("click", function() {
    var qs = document.LUN.encodeQuery();
    // We have a usuable query string
    if (qs) {
      window.open("window.html" + qs, "LUNMinifigWizard", "width=600, height=600");
    }
    return true;
  });


  /**
   * Update the build area with the selected image.
   * @returns {Boolean} Always returns true.
   */
  $minifigItems.on("click", function(e) {
    // Respond to user clicks
    if (e.target.localName.toLowerCase() !== "img") {
      return false;
    }
    var partNumber = $(e.target).parent().attr("id");

    // Get an ID selector
    layoutDetails.curPartID = "#" + partNumber;

    // Valid image parts
    var minifigParts = {
      "hat"   : document.LUN.getVariable("imgHat"),
      "leg"   : document.LUN.getVariable("imgLeg"),
      "head"  : document.LUN.getVariable("imgHead"),
      "torso" : document.LUN.getVariable("imgTorso"),
      "sword" : document.LUN.getVariable("imgSword"),
      "shield": document.LUN.getVariable("imgShield"),
    };

    // Get the ID to the part the user clicked
    var buildAreaID = minifigParts[layoutDetails.curPartName];

    // For some reason, the minifig part is not valid
    if (buildAreaID === undefined) {
      document.LUN.throwError("internal");
      return false;
    }

    // The user clicked a new part, swap orange background
    var $newPart = $(layoutDetails.curPartID);
    if (!$newPart.hasClass("selected")) {
      $(oldPartNumberId).removeClass("selected");
      $newPart.addClass("selected");
    }

    // Store the old part number and change to the selected image
    oldPartNumberId = "#" + partNumber;
    var curImageIndex = parseInt(partNumber.substr(partNumber.indexOf("-") + 1), 10);
    $(buildAreaID).attr("src", layoutDetails.curImages[curImageIndex]);
    return true;
  });


  /**
   * Alias changePartImages() function
   * to remove `onclick` attribute in the HTML,
   * and apply orange "bubble" to the current category image.
   * @returns {Boolean} Always returns true.
   */
  $categoryButtonsImg.on("click", function() {
    $categoryButtonsImg.removeClass("bubble active");
    $(this).addClass("bubble active");
    changePartImages($(this).attr("id"));
    return true;
  });


  /**
   * Parse the JSON file for image links.
   * Update the table with the proper images as
   * specified by the part parameter.
   */
  function changePartImages(partName) {
    // Update global variable with chosen part
    layoutDetails.curPartName = partName;

    // Fetch the JSON for parsing
    $.ajax({
      type: "GET",
      cache: true,
      url: "img/images.json",
      dataType: "json",

      // Now begin using that data on successful download
      success: function(json) {
        var tableString = "<tr><td class='selector' id='" + partName + "-0'>";

        // Clear any previous images
        $minifigItems.empty();
        if (layoutDetails.curImages.length > 0) {
          layoutDetails.curImages = [];
        }

        // Get the total number of images for this part
        var numOfImages = json[partName].length - 1;

        // Run through all the images
        $.each(json[partName], function(index, image) {

          // Get a part number,
          // get the thumbnail link,
          // store the URL to each full size image
          var partNumber = index + 1,
              thumbLink  = image.thumbnail;
          layoutDetails.curImages.push(image.fullsize);

          // Wrap the URL in an image tag, wrap that in a link, add it to the table
          tableString += "<img alt='{1} #{2}' width='64' height='64' src='{3}'>".format(
            index, capitalFirst(partName), partNumber, thumbLink);

          // Check if
          // a. we have not run through all the images
          // b. the index is a multiple of the current row size,
          // c. we are not at the start of the images
          // If all this is true, then make a new table row.

          // TODO I know this can be MAJORLY fixed
          if (index !== numOfImages && (index % layoutDetails.size) === 0 && index !== 0) {
            tableString += "</td></tr><tr><td class='selector' id='" + partName + "-" + partNumber +"'>";

          } else {
            // Check if we have not run through all the images.
            // if it is not, start a new table column
            if (partNumber !== numOfImages) {
              tableString += "</td><td class='selector' id='" + partName + "-" + partNumber +"'>";
            } else {
              // Otherwise, close the table column without making a new one
              tableString += "</td>";
            }
          }
        });

        // Display the table with the images
        $minifigItems.html(tableString);

        // Display the scroll bar when needed for both layout sizes
        if ((layoutDetails.size === 4 && numOfImages > 16) || (layoutDetails.size === 6 && numOfImages > 24)) {
          // Activate scroll bar
          $buildArea.perfectScrollbar({
            wheelSpeed: 1,
            suppressScrollX: true
          });

          // Update the scrollbar so it does not change sizes on us
          $buildArea.perfectScrollbar("update");

          // The scroll bar is not needed, destroy it
        } else {
          $buildArea.perfectScrollbar("destroy");
        }
      }
    });
  }


  /**
   * Resizes the table between small and large display.
   */
  $buttonResize.on("click", function() {
    // We are currently using the small display
    if (layoutDetails.size === 4) {
      // Change the number of items in a row to 6
      layoutDetails.size = 6;

      // Run animations to in/decrease the size/locations of whatever we need
      // In order in which they run for both enlarge and decrease:
      // Resize button (location)
      // Scrollbar
      // Background
      // Category buttons (enlargement)
      // Category buttons (location)
      // Container
      // Left margin
      // Resize button (swap SVGs)

      // CSS transitions are not supported, fall back to jQuery animations
      if (!Modernizr.csstransitions) {
        $buttonResize.animate({"left": "+=190px"}, 300);
        $areaMinifigParts.animate({"width": "+=180px"}, 300);
        $background.animate({"width": "+=180px"}, 300);
        $categoryButtonsDiv.animate({"margin-left": "+=48px"}, 300);
        $categoryButtonsTh.animate({"padding-left": "5px"}, 100);
        $categoryButtonsTh.animate({"padding-right": "5px"}, 100);
        $buildArea.animate({"width": "+=180px"}, 150);

      } else {
        // For browsers that do support CSS transitions, trigger them
        $buttonResize.css("transform", "translate3d(190px, 0, 0)");
        $areaMinifigParts.css("width", "+=180px");
        $background.css("width", "+=180px");
        $categoryButtonsDiv.css("margin-left", "+=48px");
        $categoryButtonsTh.css("padding-left", "5px");
        $categoryButtonsTh.css("padding-right", "5px");
        $buildArea.css("width", "+=180px");
      }

      // Increase the margins on left side of the table to make it all even
      // This runs even if the browser does not support CSS transitions
      $minifigItems.css("margin-left", "20px");
      $buttonResize.attr("src", "img/ui/Reduce-button.svg");

      // We are currently using the larger size
    } else {
      // Set the number of items in a row to 4
      layoutDetails.size = 4;

      // CSS transitions are not supported, fall back to jQuery animations
      if (!Modernizr.csstransitions) {
        $buttonResize.animate({"left": "-=190px"}, 300);
        $areaMinifigParts.animate({"width": "-=180px"}, 300);
        $background.animate({"width": "-=180px"}, 300);
        $categoryButtonsDiv.animate({"margin-left": "-=48px"}, 300);
        $categoryButtonsTh.animate({"padding-left": "0px"}, 100);
        $categoryButtonsTh.animate({"padding-right": "0px"}, 100);
        $buildArea.animate({"width": "-=180px"}, 150);

      } else {
        // For browsers that do support CSS transitions, trigger them
        $buttonResize.css("transform", "");
        $areaMinifigParts.css("width", "");
        $background.css("width", "");
        $categoryButtonsDiv.css("margin-left", "");
        $categoryButtonsTh.css("padding-left", "");
        $categoryButtonsTh.css("padding-right", "");
        $buildArea.css("width", "-=180px");
      }

      $minifigItems.css("margin-left", "5px");
      $buttonResize.attr("src", "img/ui/Enlarge-button.svg");
    }

    // Reconstruct the table using the desired size
    changePartImages(layoutDetails.curPartName);

    // Reapply the orange selection bubble
    reapplyBubble(layoutDetails.curPartID);
  });


  $(function() {
    // Show/hide jetpack easter egg
    // TODO Make this mobile compatible
    $("#emmet").on("dblclick", function() {
      var $specialImg = $(document.LUN.getVariable("imgSpecial"));
      if ($specialImg.attr("src").indexOf("empty") > -1)  {
        $specialImg.attr("src", "img/special/Special001.png");
      } else {
        $specialImg.attr("src", "img/spark/empty.png");
      }
    });

    // Run process to display the available minifig heads upon page load
    changePartImages("head");
    return true;
  });
})(jQuery);

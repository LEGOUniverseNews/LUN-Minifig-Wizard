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
  /**
   * @type {Object}
   */
  var layoutDetails = {
    size        : 4,
    curImages   : [],
    curPartName : null,
    curPartIDs  : {
      hat   : null,
      leg   : null,
      head  : null,
      torso : null,
      sword : null,
      shield: null
    },
    minifigParts: {
      hat   : document.LUN.getVariable("imgHat"),
      leg   : document.LUN.getVariable("imgLeg"),
      head  : document.LUN.getVariable("imgHead"),
      torso : document.LUN.getVariable("imgTorso"),
      sword : document.LUN.getVariable("imgSword"),
      shield: document.LUN.getVariable("imgShield")
    }
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
      $categoryButtonsImg = $(document.LUN.getVariable("categoryButtonsImg")),
      w                   = new Worker("js/workers/table-gen.min.js");


  /**
   * Open a new window with a larger version of the minifig.
   *
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
   *
   * @returns {Boolean} Always returns true.
   */
  $minifigItems.on("click", function(e) {
    // Respond to user clicks
    if (e.target.localName.toLowerCase() !== "img") {
      return false;
    }
    // Get the part ID
    var partNumber = $(e.target).parent().attr("id"),
        curPartID  = "#" + partNumber;
    layoutDetails.curPartIDs[layoutDetails.curPartName] = curPartID;

    // Get the ID to the part the user clicked
    var buildAreaID = layoutDetails.minifigParts[layoutDetails.curPartName];

    // The user clicked a new part, swap orange background
    var $newPart = $(curPartID);
    if (!$newPart.hasClass("selected")) {
      $(".selector").removeClass("selected");
      $newPart.addClass("selected");
    }

    // Change to the selected image
    var curIndex = partNumber.match(/^\w+?-(\d+)$/)[1];
    $(buildAreaID).attr("src", layoutDetails.curImages[curIndex]);
    return true;
  });


  /**
   * Build the images table.
   *
   * @param {Object} json The JSON to build the table with.
   * @param {String} partName The part category to build.
   */
  function buildImageTable(json) {
    // Clear any previous images
    $minifigItems.empty();
    layoutDetails.curImages = [];

    // Gather the information needed for table generation
    var details = {
      name   : layoutDetails.curPartName,
      size   : layoutDetails.size,
      images : json[layoutDetails.curPartName],
      number : json[layoutDetails.curPartName].length,
      curPart: layoutDetails.curPartIDs[layoutDetails.curPartName]
    };

    // Create a web worker to handle the table generation
    w.postMessage(details);

    // Insert the table into the DOM
    // and get the fullsize images
    w.onmessage = function(e) {
      $minifigItems.html(e.data.table);
      layoutDetails.curImages = e.data.fullsize;
    };

    // Display the scroll bar when needed for both layout sizes
    if ((layoutDetails.size === 4 && details.number > 16) || (layoutDetails.size === 6 && details.number > 24)) {
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


  /**
   * Get the images JSON.
   *
   * @returns {Object} jQuery AJAX object.
   */
  function getImagesJSON() {
    return $.ajax({
      type: "GET",
      cache: true,
      url: "img/images.json",
      dataType: "json"
    });
  }


  /**
   * Entry function to update the image table.
   * Also controls JSON storage and retrieval.
   *
   * @param {String} partName The part category to build.
   */
  function changePartImages(partName) {
    // Update global variable with chosen part
    layoutDetails.curPartName = partName;

    // The JSON has been previously stored
    if (window.localStorage.hasOwnProperty("images")) {
      var json = JSON.parse(window.localStorage.getItem("images"));

      // Split apart the version numbers so we can compare
      // only the major and minor values.
      // Any image changes will update minor and reset patch
      // but never only change patch.
      var jsonVer     = json.version.split("."),
          internalVer = document.LUN.version.split(".");

      // We have the same version, reuse the cache
      if (internalVer[0] === jsonVer[0] && internalVer[1] === jsonVer[1]) {
        buildImageTable(json);

      } else if (internalVer[0] > jsonVer[0] || internalVer[1] > jsonVer[1]) {
        getImagesJSON().success(function(json) {
          window.localStorage.setItem("images", JSON.stringify(json));
          buildImageTable(json);
        });
      }

      // The JSON has never been stored
    } else {
      getImagesJSON().success(function(json) {
        window.localStorage.setItem("images", JSON.stringify(json));
        buildImageTable(json);
      });
    }
  }

  /**
   * Alias changePartImages function
   * to remove `onclick` attribute in the HTML,
   * and apply orange "bubble" to the current category image.
   *
   * @returns {Boolean} Always returns true.
   */
  $categoryButtonsImg.on("click", function() {
    $categoryButtonsImg.removeClass("bubble active");
    $(this).addClass("bubble active");
    changePartImages($(this).attr("id"));
    return true;
  });


  /**
   * Resizes the table between small and large display.
   */
  $buttonResize.on("click", function() {
    // We are currently using the small display
    if (layoutDetails.size === 4) {
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

      $buttonResize.css("transform", "translate3d(190px, 0, 0)");
      $areaMinifigParts.css("width", "+=180px");
      $background.css("width", "+=180px");
      $categoryButtonsDiv.css("margin-left", "+=48px");
      $categoryButtonsTh.css("padding-left", "5px");
      $categoryButtonsTh.css("padding-right", "5px");
      $buildArea.css("width", "+=180px");

      // Increase the margins on left side of the table to make it all even
      // This runs even if the browser does not support CSS transitions
      $minifigItems.css("margin-left", "20px");
      $buttonResize.attr("src", "img/ui/Reduce-button.svg");

      // We are currently using the larger size
    } else {
      layoutDetails.size = 4;
      $buttonResize.css("transform", "");
      $areaMinifigParts.css("width", "");
      $background.css("width", "");
      $categoryButtonsDiv.css("margin-left", "");
      $categoryButtonsTh.css("padding-left", "");
      $categoryButtonsTh.css("padding-right", "");
      $buildArea.css("width", "-=180px");
      $minifigItems.css("margin-left", "5px");
      $buttonResize.attr("src", "img/ui/Enlarge-button.svg");
    }

    // Reconstruct the table using the desired size
    changePartImages(layoutDetails.curPartName);
  });


  $(function() {
    // Show/hide jetpack easter egg
    $("#emmet").on("click", function() {
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

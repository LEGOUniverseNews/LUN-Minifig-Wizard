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


// Global variables for various stuff
var bodyPart,
    partNumberID,
    oldPartTypeID,
    oldPartNumberID,
    rowSize    = 4,
    imagesList = [];

/**
 * Retrieve a jQuery selector for commonly used elements
 */
var $buildArea,
    $background,
    $buttonResize,
    $categoryButtonsTh,
    $categoryButtonsDiv,
    $categoryButtonsImg;

(function() {
  "use strict";
  $buildArea          = $(getVariable("buildArea"));
  $background         = $(getVariable("background"));
  $buttonResize       = $(getVariable("buttonResize"));
  $categoryButtonsTh  = $(getVariable("categoryButtonsTh"));
  $categoryButtonsDiv = $(getVariable("categoryButtonsDiv"));
  $categoryButtonsImg = $(getVariable("categoryButtonsImg"));
}());


/**
 * Apply orange "bubble" to category image
 */
function highlightCategory() {
  "use strict";
  $categoryButtonsImg.on("click", function() {
    $categoryButtonsImg.removeClass("bubble active");
    $(this).addClass("bubble active");
  });
}


/**
 * Preserve orange box around selected item
 * (if present) between resizes
 */
function reapplyBubble(partNumberID) {
  "use strict";

  // Only perform the class changes if an item is selected
  if (partNumberID !== undefined) {
    // Remove the orange bubble from th selected part
    $(partNumberID).removeClass("selected");

    // 2 milliseconds (and no sooner!) later, reapply the bubble
    // The timeout is required so jQuery has time to remove the class
    window.setTimeout(function() {
      $(partNumberID).addClass("selected");
    }, 2);
  }
}


/**
 * Change the part image to the selected one
 */
function main(partNumber) {
  "use strict";
  var imgID;
  partNumberID = "#{0}".format(partNumber);

  // Get the proper imgID for each part
  switch (bodyPart) {
    case "Torso":
      imgID = getVariable("imgTorso");
      break;
    case "Leg":
      imgID = getVariable("imgLeg");
      break;
    case "Hat":
      imgID = getVariable("imgHat");
      break;
    case "Shield":
      imgID = getVariable("imgShield");
      break;
    case "Sword":
      imgID = getVariable("imgSword");
      break;
    case "Head":
      imgID = getVariable("imgHead");
      break;
  }

  // The user clicked a new part, swap orange background
  if (oldPartNumberID !== partNumberID) {
    $(oldPartNumberID).removeClass("selected");
    $(partNumberID).addClass("selected");
  }

  // Set the old part number
  oldPartNumberID = "#{0}".format(partNumber);

  // Change the image to the selected one
  $(imgID).attr("src", imagesList[partNumber]);
}

/**
 * Alias changePartImages function
 * to remove onclick attribute in the HTML.
 */
$categoryButtonsImg.on("click", function() {
  "use strict";
  changePartImages($(this).attr("id"));
});


/**
 * Parse the XML file for image links.
 * Update the table with the proper images as
 * specified by the part parameter.
 */
function changePartImages(part) {
  "use strict";

  // Update global variable with chosen part
  bodyPart = part;

  // Construct jQuery id attribute selector
  var partTypeID = "#{0}".format(bodyPart);
  highlightCategory(oldPartTypeID, partTypeID);

  // Keep a copy of the old element ID
  oldPartTypeID = "#{0}".format(bodyPart);


  // Fetch the XML for parsing
  $(function() {
    $.ajax({
      type: "GET",
      cache: true,
      url: "img/images.xml",
      dataType: "xml",
      // Now begin using that data on successful download
      success: function(xml) {
        var imgLink, fullImgLink,
            index       = 0,
            partNumber  = 0,
            numOfImages = 0,
            tableString = "<tr><td class='selector' id='0'>";

        // Clear the array of full size images if it contains data
        if (imagesList.length > 0) {
            imagesList.splice(0, imagesList.length);
        }

        // Get the URL's to each full size image, add to imagesList array
        $(xml).find(bodyPart).each(function() {
          fullImgLink = $(this).find("image").text();
          imagesList.push(fullImgLink);
        });

        // Clear the table of any previous images
        $("#minifig-items").empty();

        // Get the total number of images for this part
        $(xml).find(bodyPart).each(function() {
          numOfImages += 1;
        });

        // Go through all the images, adding them to the table
        $(xml).find(bodyPart).each(function() {
          partNumber += 1;

          // Bring it back down to work with array indexes
          index = partNumber - 1;
          imgLink = $(this).find("thumb").text();

          // Wrap the URL in an image tag, wrap that in a link, add it to the table
          /* jshint ignore:start */
          tableString += '<a name="{0}" onclick="main(this.name)"><img alt="{1} #{2}" width="64" height="64" src="{3}" /></a>'.format(
            index, bodyPart, partNumber, imgLink);
          /* jshint ignore:end */


          // Check if
          // a. we have not run through all the images
          // b. the index is a multiple of the current row size,
          // c. we are not at the start of the images
          // If all this is true, then make a new table row.

          //FUTURE FIXME I know this can be MAJORLY cleaned up ($.each() or Array.forEach)
          if (partNumber !== numOfImages && (partNumber % rowSize) === 0 && partNumber !== 0) {
            tableString += "</td></tr><tr><td class='selector' id='{0}'>".format(partNumber);
          } else {

             // Check if we have not run through all the images.
             // if it is not, start a new table column
            if (partNumber !== numOfImages) {
              tableString += "</td><td class='selector' id='{0}'>".format(partNumber);
            } else {
              // Otherwise, close the table column without making a new one
              tableString += "</td>";
            }
          }
        });

        // Finally, display the table with the images
        $("#minifig-items").html(tableString);

        // Display the scroll bar when needed for both layout sizes
        if ((rowSize === 4 && numOfImages > 16) || (rowSize === 6 && numOfImages > 24)) {
          // Activate scroll bar
          $buildArea.perfectScrollbar({
            wheelSpeed: 6.5,
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
  });
}


/**
 * Resizes the table between small and large display
 */
$buttonResize.on("click", function() {
  "use strict";

  // We are currently using the small display
  if (rowSize === 4) {
    // Change the number of items in a row to 6
    rowSize = 6;

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
      $(".area-minifig-parts").animate({"width": "+=180px"}, 300);
      $background.animate({"width": "+=180px"}, 300);
      $categoryButtonsDiv.animate({"margin-left": "+=48px"}, 300);
      $categoryButtonsTh.animate({"padding-left": "5px"}, 100);
      $categoryButtonsTh.animate({"padding-right": "5px"}, 100);
      $buildArea.animate({"width": "+=180px"}, 150);

    } else {
      // For browsers that do support CSS transitions, trigger them
      $buttonResize.css("transform", "translate3d(190px, 0, 0)");
      $(".area-minifig-parts").css("width", "+=180px");
      $background.css("width", "+=180px");
      $categoryButtonsDiv.css("margin-left", "+=48px");
      $categoryButtonsTh.css("padding-left", "5px");
      $categoryButtonsTh.css("padding-right", "5px");
      $buildArea.css("width", "+=180px");
    }

    // Increase the margins on left side of the table to make it all even
    // This runs even if the browser does not support CSS transitions
    $("#minifig-items").css("margin-left", "20px");
    $buttonResize.attr("src", "img/ui/Reduce-button.svg");

    // We are currently using the larger size
  } else {
    // Set the number of items in a row to 4
    rowSize = 4;

    // CSS transitions are not supported, fall back to jQuery animations
    if (!Modernizr.csstransitions) {
      $buttonResize.animate({"left": "-=190px"}, 300);
      $(".area-minifig-parts").animate({"width": "-=180px"}, 300);
      $background.animate({"width": "-=180px"}, 300);
      $categoryButtonsDiv.animate({"margin-left": "-=48px"}, 300);
      $categoryButtonsTh.animate({"padding-left": "0px"}, 100);
      $categoryButtonsTh.animate({"padding-right": "0px"}, 100);
      $buildArea.animate({"width": "-=180px"}, 150);

    } else {
      // For browsers that do support CSS transitions, trigger them
      window.$buttonResize.css("transform", "");
      $(".area-minifig-parts").css("width", "");
      $background.css("width", "");
      $categoryButtonsDiv.css("margin-left", "");
      $categoryButtonsTh.css("padding-left", "");
      $categoryButtonsTh.css("padding-right", "");
      $buildArea.css("width", "-=180px");
    }

    $("#minifig-items").css("margin-left", "5px");
    $buttonResize.attr("src", "img/ui/Enlarge-button.svg");
  }

  // Reconstruct the table using the desired size
  changePartImages(bodyPart);

  // Reapply the orange selection bubble
  reapplyBubble(partNumberID);
});

$(function() {
  "use strict";

  // Apply orange bubble and mark as active the first button ("Head").
  // This must be done here to stop the orange bubble from sticking
  // if a (singular) new category is selected then the table is enlarged.
  // Selecting multiple categories before enlarging is not bugged.
  $(".category-buttons-img:first").addClass("active");
  $(".category-buttons-img:first").addClass("bubble");

  // Find "The Special" who will disarm the Kragle using his interesting abilities
  $("#emmet").dblclick(function() {
    var $SpecialImg = $(getVariable("imgSpecial"));
    if ($SpecialImg.attr("src").split("/")[3] === "empty.png") {
      $SpecialImg.attr("src", "img/special/Special001.png");
    } else {
      $SpecialImg.attr("src", "img/ui/figure/empty.png");
    }
  });

  // Run process to display the available minifig heads upon page load
  changePartImages("Head");
});

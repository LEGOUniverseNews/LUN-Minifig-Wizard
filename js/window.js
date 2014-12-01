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


// Construct the HTML for the beginning of the page
var docuCode = "<!DOCTYPE html><html lang='en'><head><meta charset='utf-8'>" +
    "<meta http-equiv='x-ua-compatible' content='IE=edge'>" +
    "<title>LEGO Universe News! Minifig Wizard</title>" +
    "<link rel='stylesheet' href='http://fonts.googleapis.com/css?family=Nunito:400'>" +
    "<link rel='stylesheet' href='css/LUNWizard.window.min.css'>" +
    "</head><body>";

// Area for background-color changing boxes and image size
// The content is injected by settings.js
var tableCode = "<div id='btn-gear'><img width='40' height='40' alt='Settings panel toggle button' src='img/ui/Gear.svg' />" +
    "</div><div id='settings-panel'>Background Color<table><tr>" +
    "</tr></table><br><span id='size-text'>Size</span><br>" +
    "<input id='input-size' type='number' min='0' max='600' placeholder='600' autocomplete='off'>" +
    "<label id='size-label' for='input-size'>px</label></div>";

// JavaScript links
var scriptCode = "<script src='lib/jquery-2.1.1.min.js'></script>" +
//  var scriptCode = "<script src='//code.jquery.com/jquery-2.1.1.min.js'></script>" +
    "<script src='lib/string-format.js'></script>" +
    "<script src='lib/modernizr.custom.13815.js'></script>" +
    "<script src='js/variables.js'></script>" +
    "<script src='js/LUNWizard.settings.min.js'></script></body></html>";


/**
 * Open a new window with a larger version of the user's Minifigure.
 */
$("#btn-new-window").on("click", function() {
  "use strict";

  // Images that compose the user's minifig
  var myImages = [
    $(_getVariable("imgHead")).attr("src"),
    $(_getVariable("imgSpecial")).attr("src"),
    $(_getVariable("imgHat")).attr("src"),
    $(_getVariable("imgLeg")).attr("src"),
    $(_getVariable("imgTorso")).attr("src"),
    $(_getVariable("imgSword")).attr("src"),
    $(_getVariable("imgShield")).attr("src")
  ];

  // Initial image HTML structure
  var minifigDisplay = "";

  myImages.forEach(function(value, index) {
    // Generate the HTML to display each image
    minifigDisplay += "<img class='the-big-picture' src='" + value + "'>";

    // Add the drop shadow as well
    if (index === (myImages.length - 1)) {
      minifigDisplay += "<img class='the-big-picture' id='img-shadow' src='img/ui/figure/drop-shadow.png'>";
    }
  });

  // Open a new pop up window with the content
  // TODO Replace document.write() with existing page using query strings for image URLs
  var myOwnMinifig = window.open("window.html","LUNMinifigWizard","width=600, height=600");
  myOwnMinifig.document.write(docuCode + minifigDisplay + tableCode + scriptCode);
  myOwnMinifig.document.close();
});

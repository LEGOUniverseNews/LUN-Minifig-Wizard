/**
 * LEGO Universe News! Minifig Wizard
 *
 * Created 2013-2014 Triangle717 & rioforce
 * <http://Triangle717.WordPress.com/>
 * <http://rioforce.WordPress.com/>
 *
 * Licensed under The MIT License
 * <http://opensource.org/licenses/MIT>
 */


$("#button-new-window").on("click", function() {
  "use strict";
  /* Open a new window with the user's Minifigure for picture taking */
  // Store the values of the images in an array
  var myList = [
    $(getVariable("imgHead")).attr("src"),
    $(getVariable("imgSpecial")).attr("src"),
    $(getVariable("imgHat")).attr("src"),
    $(getVariable("imgLeg")).attr("src"),
    $(getVariable("imgTorso")).attr("src"),
    $(getVariable("imgSword")).attr("src"),
    $(getVariable("imgShield")).attr("src"),
    "<img class='the-big-picture' id='shadow-img' src='img/ui/figure/drop-shadow.png"
  ];

  // Construct the HTML for the beginning of the page
  var docuCode = "<!DOCTYPE html><html lang='en'><head><meta charset='utf-8'>" +
      "<meta http-equiv='x-ua-compatible' content='IE=edge'>" +
      "<title>LEGO Universe News! Minifig Wizard</title>" +
      "<link rel='stylesheet' href='http://fonts.googleapis.com/css?family=Nunito:400'>" +
      "<link rel='stylesheet' href='css/LUNWizard.window.min.css'>" +
      "</head><body>";

  // Area for background-color changing boxes and image size
  // The content is injected by settings.js
  var tableCode = "<div id='gear'><img width='40' height='40' alt='Settings panel toggle button' src='img/ui/Gear.svg' />" +
      "</div><div id='settings-panel'>Background Color<table>" +
      "</table><br><span id='size-text'>Size</span><br>" +
      "<input id='size-input' type='number' placeholder='600' autocomplete='off'>" +
      "<label id='size-label' for='size-input'>px</label></div>";

  // JavaScript links
  var scriptCode = "<script src='lib/jquery-2.1.1.min.js'></script>" +
//  var scriptCode = "<script src='//code.jquery.com/jquery-2.1.1.min.js'></script>" +
      "<script src='lib/string-format.js'></script>" +
      "<script src='lib/modernizr.custom.13815.js'></script>" +
      "<script src='js/LUNWizard.window.min.js'></script>";

  // Closing HTML
  var endCode = "</body></html>";

  // Initial line for the body
  var minifigDisplay = "<img class='the-big-picture' src='";

  for (var i = 0; i < myList.length; i += 1) {
    // Add the link to the image
    minifigDisplay += myList[i] + "' />";

    // Keep adding the images while there are images to display
    // AND if the image is not the drop shadow, do not assign the class
    if (i !== (myList.length - 1) && i !== 6) {
      minifigDisplay += "<img class='the-big-picture' src='";
    }
  }

  // Open a new pop up window with the content
  // TODO Replace document.write() with existing page using query strings for image URLs
  var myOwnMinifig = window.open("window.html","LUNMinifigWizard","width=600, height=600");
  myOwnMinifig.document.write(docuCode + minifigDisplay + tableCode + scriptCode + endCode);
  myOwnMinifig.document.close();
});

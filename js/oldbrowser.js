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


/**
 * Check for and stop displaying the Minifig Wizard
 * on old browsers (mainly Internet Explorer)
 */
$(function() {
  "use strict";

  // Error message that might need to be displayed
  var errorStyle = "#error-link{text-decoration:none;}#error-link:hover{text-decoration:underline;}span{font-style:italic;}",
      errorText  = "<p class='error'>Your browser is not supported!<br>Please update your browser to enjoy the" +
      "<br><span>LEGO Universe News!</span> Minifig Wizard.</p><p class='error'>You can research newer browsers at" +
      "&nbsp;<a id='error-link' target='_blank' href='http://browsehappy.com/'>browsehappy.com</a></p>",

  // Error message styling
  errorCSS       = {
    "font-size": "1.9em",
    "font-weight": "bold",
    "font-family": "Times New Roman, serif",
    "color": "red",
    "margin-left": "0.9em"
  };

  // Check if the browser does not support the border-radius CSS property
  if (!Modernizr.borderradius) {
    // Remove page contents for a clean palette
    $("body").remove();

    // Display error message and apply CSS
    $("html").html("<head />");
    $("head").append("<meta name='viewport' content='width=device-width, initial-scale=1.0'>");
    $("head").append("<style />");
    $("head").append("<style />");
    $("style").html(errorStyle);
    $("html").html("<body />");
    $("body").append(errorText);
    $(".error").css(errorCSS);
    return false;
  }
});

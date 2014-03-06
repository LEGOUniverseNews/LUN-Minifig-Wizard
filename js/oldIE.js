/*
    LEGO Universe News! Minifig Wizard

    Created 2013-2014 Triangle717 & rioforce
    <http://Triangle717.WordPress.com/>
    <http://rioforce.WordPress.com/>

    Licensed under The MIT License
    <http://opensource.org/licenses/MIT>
*/

$(function() {
    "use strict";
    /*
    Check for and stop displaying the Minifig Wizard
    on really old versions of Internet Explorer
    */

    // Error message that might need to be displayed
    /* jshint ignore:start */
    var errorMessageText = '<style>#error-link{text-decoration:none;}#error-link:hover{text-decoration:underline;}</style>\n' +
        '<p id="error">Your browser is not supported!<br>Please update your browser to enjoy the<br>LEGO Universe News! Minifig Wizard.' +
        '<br><br>You can research newer browsers at <a id="error-link" target="_blank" href="http://browsehappy.com/">browsehappy.com</a></p>',
    /* jshint ignore:end */

    // I think the variable name says enough. :P
    errorMessageCSS = {
        "font-size": "200%",
        "font-weight": "bold",
        "color": "red",
        "margin-left": "40px"
    };

    // Check if the user-agent matches old IE
    if ($.browser.msie && $.browser.versionNumber <= 8) {
        // Remove page contents for a clean palette
        $("body").remove();

        // Display error message
        $("html").html(errorMessageText);

        // Apply the CSS
        $.each(errorMessageCSS, function(key, value) {
            $("#error").css(key, value);
        });
        return false;
    }
});
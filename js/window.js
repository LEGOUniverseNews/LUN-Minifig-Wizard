/*
    LEGO Universe News! Minifig Wizard

    Created 2013-2014 Triangle717 & rioforce
    <http://Triangle717.WordPress.com/>
    <http://rioforce.WordPress.com/>

    Licensed under The MIT License
    <http://opensource.org/licenses/MIT>
*/

function newMinifigWindow() {
    "use strict";
    /* Open a new window with the user's Minifigure for picture taking */
    // Store the values of the images in an array
    var myList = [
        $("#HeadImg").attr("src"),
        $("#SpecialImg").attr("src"),
        $("#TorsoImg").attr("src"),
        $("#HatImg").attr("src"),
        $("#LegImg").attr("src"),
        $("#SwordImg").attr("src"),
        $("#ShieldImg").attr("src"),
        '\t<img class="the-big-picture" id="shadow-img" src="img/ui/figure/drop-shadow.png'
    ];

    // Construct the HTML for the beginning of the page
    var docuCode = '<!DOCTYPE html>\n<html lang="en">\n<head>\n' +
        '\t<meta charset="utf-8">\n' +
        "\t<title>LEGO Universe News! Minifig Wizard</title>\n" +
        '\n<link href="http://fonts.googleapis.com/css?family=Source+Sans+Pro:600" rel="stylesheet" type="text/css">\n' +
        '\t<link rel="stylesheet" type="text/css" href="css/LUNWizard.window.min.css">\n' +
        "</head>\n\n<body>\n";

    // Area for background-color changing boxes and image size
    // The content is injected by settings.js
    var tableCode = '\n\t<div id="gear">\n\t\t<img width="40" height="40" src="img/ui/Gear.svg" />' +
        '\n\t</div>\n\t<div id="settings-panel">\n\t\tBackground Color\n\t\t<table>\n' +
        '\t\t\t<tr></tr>\n\t\t</table>\n\t\t<br><span id="size-text">Size</span><br>\n' +
        '\t\t<input id="size-input" type="number" placeholder="600" autocomplete="off">' +
        '\n\t\t<label id="size-label" for="size-input">px</label>\n\t</div>\n';

    // JavaScript links
    var scriptCode = '\t<script src="//code.jquery.com/jquery-2.1.0.min.js"></script>\n' +
        '\t<script src="lib/string-format.js"></script>\n' +
        '\t<script src="js/LUNWizard.window.min.js"></script>\n';

    // Closing HTML
    var endCode = "</body>\n</html>\n";

    // Initial line for the body
    var minifigDisplay = '\t<img class="the-big-picture" src="';

    for (var i = 0; i < myList.length; i += 1) {
        // Add the link to the image
        minifigDisplay += myList[i] + '" />\n';

        // Keep adding the images while there are images to display
        // AND if the image is not the drop shadow, do not assign the class
        if (i !== (myList.length - 1) && i !== 6) {
            minifigDisplay += '\t<img class="the-big-picture" src="';
        }
    }

    // Open a new popup window with the content
    //FUTURE Replace document.write() with existing page using parameters for image URLs
    var myOwnMinifig = window.open("", "My Own Minifigure", "width=600, height=600");
    myOwnMinifig.document.write(docuCode + minifigDisplay + tableCode + scriptCode + endCode);
    myOwnMinifig.document.close();
}

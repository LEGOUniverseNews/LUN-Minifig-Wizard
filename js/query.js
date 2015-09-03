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


(function() {
  "use strict";

  // Conversion chart for query strings
  var _rmap = {},
      _map  = {
        h : "heads",
        H : "Head",
        t : "torsos",
        T : "Torso",
        l : "legs",
        L : "Legs",
        ha: "hats",
        HA: "Hat",
        sh: "shield",
        SH: "Shield",
        sw: "sword",
        SW: "Sword",
        sp: "special",
        SP: "Special"
      };

  // Dynamically create a reverse lookup object
  (function() {
    for (var k in _map) {
      if (_map.hasOwnProperty(k)) {
        _rmap[_map[k]] = k;
      }
    }
  })();

  /**
   * Display an error message related to query string parsing,
   * incomplete minifigure creation, or browser support errors.
   * @param {String}  err The error type.
   * @returns {Boolean} Always returns false.
   */
  function _throwError(err) {
    var messages = {
      spark: "You need to finish creating your minifigure!",
      notfound: "That Minifigure part was not found!",
      internal: "An internal error has occurred"
    };

//    document.querySelector(".message-error").innerHTML = messages[err];
    console.log(messages[err]);
    return false;
  }


  /**
   * @private
   * Check if a query string is valid.
   * @param {String} query A query string.
   * @returns {Boolean} True if valid, otherwise false.
   */
  function _isValid(query) {
    var parts = query.split("=");
    return (_map[parts[0]] !== undefined) &&
      (/^h(?=a)?(?![b-z])|^a|^e|^l|^t|^s(?:p|h|w)\/\d{1,2}$/gi.test(parts[1]));
  }


  /**
   * Check if a query string is valid.
   * @param {String} query A query string.
   * @returns {Boolean} True if valid
   */
  function _testQuery(query) {
    // Only relative paths are supported
    var protos = /(?:h|f)(?:tt?ps?|ile):?/gi;

    // No query strings were given,
    // an absolute path was used,
    // or invalid characters were used.
    if (query === undefined || protos.test(query) ||
        (!query.substr(1).split("&").every(_isValid))) {
      _throwError("internal");
      return false;
    }
    return true;
  }


  /**
   * Decode query strings.
   * @returns {Array.<String>|Boolean} Fully decoded URLs, otherwise false.
   */
  function _decodeQuery() {
    var qs = window.location.search;

    // Make sure it is valid
    if (!_testQuery(qs)) {
      _throwError("internal");
      return false;
    }

    // Split up the query string
    // http://stackoverflow.com/a/21167255 ("tl;dr solution")
    var images  = [],
        qparts  = {},
        numKeys = Object.keys(qparts).length;
    qs.substr(1).split("&").forEach(function(item) {
      qparts[item.split("=")[0]] = item.split("=")[1];
    });

    // Make sure we have enough items
    if (numKeys === 6 || numKeys === 7) {
      _throwError("spark");
      return false;
    }

    for (var fold in qparts) {
      if (qparts.hasOwnProperty(fold)) {
        var part = qparts[fold];
        // For easier splitting and decoding
        part = "/" + part;
        part = part.split("/");

        // Prefix with path
        part[0] = window.location.pathname.split("/")[0] + "img";

        // Special and empty items are stored
        // in a different location than everything else
        if (part[1] === "e") {
          part[1] = part[1].replace(/e/, "spark");
        } else if (fold !== "sp") {
          part[1] = _map[fold] + "/full";
        } else if (fold === "sp") {
          part[1] = _map[fold];
        }

        // Add extra zeros to part number as needed
        if (part[1] === "spark") {
          part[2] = "empty";
        } else if (part[2].length === 2) {
          part[2] = "0" + part[2];
        } else if (part[2].length === 1) {
          part[2] = "00" + part[2];
        }

        // Get full image name, merge everything back into a string,
        // add it to array for displaying on page
        if (part[2] !== "empty") {
          part[2] = _map[fold.toUpperCase()] + part[2];
        }
        part[2] += ".png";
        part = part.join("/");
        images.push(part);
      }
    }
    return images;
  }


  /**
   * Create a query string.
   * @returns {String|Boolean} Fully encoded URL, otherwise false.
   */
  function _encodeQuery() {
    // Initialization
    var query  = "",
        number = "",
        images = {
          heads  : document.querySelector(document.LUN.getVariable("imgHead")).src,
          hats   : document.querySelector(document.LUN.getVariable("imgHat")).src,
          legs   : document.querySelector(document.LUN.getVariable("imgLeg")).src,
          torso  : document.querySelector(document.LUN.getVariable("imgTorso")).src,
          sword  : document.querySelector(document.LUN.getVariable("imgSword")).src,
          shield : document.querySelector(document.LUN.getVariable("imgShield")).src,
          special: document.querySelector(document.LUN.getVariable("imgSpecial")).src
        };

    for (var value in images) {
      if (images.hasOwnProperty(value)) {
        var v = images[value];
        var isSpark = /-spark/gi.test(v),
            isEmpty = /empty.png/i.test(v);

        // Do not permit an incomplete minifigure
        if (isSpark && !isEmpty) {
          _throwError("spark");
          return false;
        }

        // Perform initial sanitizing, split into array
        var qs = v.replace(window.location.origin, "");

        // If we are not running from the domain root, remove the subpath
        if (window.location.pathname !== "/") {
          qs = qs.replace("/" + window.location.pathname.split("/")[1], "");
        }
        qs = qs.replace(/img\/|full\/|.png/g, "").split("/");

        // Prefix the proper separator, substitute the folder value, remove zeros
        qs[0] = value !== "heads" ? "&" : "?";
        qs[1] = /ha|s(?:h|p|w)/i.test(qs[1]) ? _rmap[value] : _rmap[qs[1]];
        qs[1] += "=";
        qs[2] = qs[2].replace(/0/g, "");

        // Extract the remaining numbers
        if (!isNaN(qs[2].substr(-2))) {
          number = qs[2].substr(-2);
        } else if (!isNaN(qs[2].substr(-1))){
          number = qs[2].substr(-1);
        }

        // Substitute the image name, restore the numbers, merge into one string
        qs[2] = /empty/.test(qs[2]) ? "e/1" : _rmap[qs[2].replace(number, "")].toLowerCase() + "/" + number;
        query += qs.join("");
      }
    }

    // Make sure it is valid
    if (!_testQuery(query)) {
      _throwError("internal");
      return false;
    }
    return query;
  }


  // Public exports
  document.LUN.throwError  = _throwError;
  document.LUN.decodeQuery = _decodeQuery;
  document.LUN.encodeQuery = _encodeQuery;
})();

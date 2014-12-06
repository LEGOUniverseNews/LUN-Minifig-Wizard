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
      notfound: "Minifigure part 404 was not found!",
      internal: "An internal error has occurred (500).",
    };

//    document.querySelector(".message-error").innerHTML = messages[err];
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
      (/^h(?=a)?(?![b-z])|^l|^a|^t|^s(?:p|h|w)\/\d{1,2}$/gi.test(parts[1]));
  }


  /**
   * Check if a query string is valid.
   * @param {String} query A query string.
   * @returns {Boolean} True if valid
   */
  function _testQuery(query) {
    // Only relative paths are supported
    var protos = new RegExp(/(?:h|f)(?:tt?ps?|ile):?/gi);

    // Accept only one structure
    var format = new RegExp(/^\?h=h\/\d{1,2}(?:&sp=sp\/\d{1,2})?&ha=ha\/\d{1,2}&l=l\/\d{1,2}&t=t\/\d{1,2}&sh=sh\/\d{1,2}&sw=sw\/\d{1,2}$/i);

    // No query strings were given,
    // an absolute path was used,
    // or invalid characters were used.
    if (!format.test(query) || protos.test(query) || query === undefined ||
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

    for (var part in qparts) {
      if (qparts.hasOwnProperty(part)) {
        part = qparts[part];

        // For easier splitting and decoding
        part = "/" + part;
        part = part.split("/");

        // Prefix with root path, get part type, expand to proper path
        part[0] = "/img";
        var fold = part[1].toUpperCase();
        part[1] = _map[part[1]] + "/full";

        // Special items are stored in a different location
        if (fold === "SP") {
          part[1] = part[1].replace(/\/full/, "");
        }

        // Add extra zeros to part number as needed
        if (part[2].length === 2) {
          part[2] = "0" + part[2];
        } else if (part[2].length === 1) {
          part[2] = "00" + part[2];
        }

        // Get full image name, merge everything back into a string,
        // add it to array for displaying on page
        part[2] = _map[fold] + part[2] + ".png";
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
        images = [
          document.querySelector(_getVariable("imgHead")).src,
          document.querySelector(_getVariable("imgSpecial")).src,
          document.querySelector(_getVariable("imgHat")).src,
          document.querySelector(_getVariable("imgLeg")).src,
          document.querySelector(_getVariable("imgTorso")).src,
          document.querySelector(_getVariable("imgSword")).src,
          document.querySelector(_getVariable("imgShield")).src
        ];


    // Check if any "creation spark" images are present
    for (var hasSpark = 0; hasSpark < images.length; hasSpark += 1) {
      var value    = images[hasSpark],
          hasUI    = new RegExp(/\/ui\//i).test(value),
          hasEmpty = new RegExp(/empty.png/i).test(value);

      // Do not permit an incomplete minifigure
      if (hasUI && !hasEmpty) {
        _throwError("spark");
        return false;

        // This part can be left blank
      } else if (hasUI && hasEmpty) {
        continue;
      }
    }

    // Remove unneeded parts of the string
    images.forEach(function(v, i) {
      // Perform initial sanitizing, split into array
      var qs = v.replace(window.location.origin, "").replace(/img\/|full\/|.png/g, "").split("/");

      // Prefix the proper separator, substitute the folder value, remove zeros
      qs[0] = i === 0 ? "?" : "&";
      qs[1] = _rmap[qs[1]] + "=";
      qs[2] = qs[2].replace(/0/g, "");

      // Extract the remaining numbers
      if (!isNaN(qs[2].substr(-2))) {
        number = qs[2].substr(-2);
      } else if (!isNaN(qs[2].substr(-1))){
        number = qs[2].substr(-1);
      }

      // Substitute the image name, restore /numbers, merge into one string
      qs[2] = _rmap[qs[2].replace(number, "")].toLowerCase() + "/" + number;
      query += qs.join("");
     });

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

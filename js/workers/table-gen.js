"use strict";

/**
 * @constructs Item
 * Create part item for the selection table.
 *
 * @param {Number} id   The part ID.
 * @param {String} name The category name (e.g, head).
 * @param {String} url  The URL to the thumbnail image.
 */
function Item(id, name, url) {
  this.id = id;
  this.name = name;
  this.url = url;
}

/**
 * Capitalize the first letter of the given text.
 *
 * @param {String} text
 * @returns {String}
 */
Item.prototype.capitalize = function() {
  return this.name.charAt(0).toUpperCase() + this.name.substr(1);
};

/**
 * Construct a complete table cell.
 * @returns {String}
 */
Item.prototype.toString = function(curPart) {
  // If a part was previously selected, keep it selected
  var string   = ["<td class='selector {selected}' "],
      selected = (curPart && curPart.substr(1) === this.name + "-" + this.id) ? "selected" : "";
  string[0] = string[0].replace(/{selected}/, selected);

  string.push("id='", this.name, "-", this.id, "'>");
  string.push("<img width='64' height='64' alt='", this.capitalize(),
              " #", (this.id + 1), "' src='", this.url, "'>");
  string.push("</td>");
  return string.join("").replace(/'/g, "\"");
};

/**
 * Generate the selection table.
 *
 * @param {Object} e The information needed to generate.
 */
onmessage = function(e) {
  // Calculate the information needed
  var numOfRows  = Math.ceil(e.data.number / e.data.size),
      result     = {
        table: new Array(e.data.number + ((numOfRows * 2) + 2)),
        fullsize: []
      };

  // Start and end rows in the correct locations
  for (var i = 1, len1 = result.table.length - 1; i < len1; i += (e.data.size + 2)) {
    result.table[i] = "<tr>";
    result.table[i + (e.data.size + 1)] = "</tr>";
  }

  // Fill in each image
  for (var j = 2, k = 0, len2 = result.table.length; j < len2; j++) {
    if (result.table[j] === undefined && k < e.data.number) {
      result.table[j] = new Item(k, e.data.name, e.data.images[k].thumbnail).toString(e.data.curPart);
      result.fullsize.push(e.data.images[k].fullsize);
      k++;
    }
  }

  // Finish the table
  result.table[0] = "<table>";
  result.table[result.table.length - 1] = "</table>";

  result.table = result.table.join("");
  postMessage(result);
};

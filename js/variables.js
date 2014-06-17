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
  * @private
  * Parameter variable: Key to access common variable
  * @return {String}
  */
function getVariable(variable) {
  "use strict";
  var _variables = {
    "imgHead"           : "#head-img",
    "imgSpecial"        : "#the-special",
    "imgHat"            : "#hat-img",
    "imgLeg"            : "#leg-img",
    "imgTorso"          : "#torso-img",
    "imgSword"          : "#sword-img",
    "imgShield"         : "#shield-img",
    "buttonResize"      : "#button-resize",
    "buildArea"         : "#area-minifig-built",
    "background"        : "#background",
    "categoryButtonsTh" : ".category-buttons-th",
    "categoryButtonsDiv": ".category-buttons-div",
    "categoryButtonsImg": ".category-buttons-img",
    };

  return _variables[variable];
}

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


/**
 * @private
 * @param variable Key to access common variables
 * @return {string}
 */
function getVariable(elementName) {
  "use strict";
  var _variables = {
    "imgHat"            : "#img-hat",
    "imgLeg"            : "#img-leg",
    "imgHead"           : "#img-head",
    "imgTorso"          : "#img-torso",
    "imgSword"          : "#img-sword",
    "buildArea"         : "#area-minifig-built",
    "imgShield"         : "#img-shield",
    "imgShadow"         : "#img-shadow",
    "background"        : "#background",
    "imgSpecial"        : "#img-special",
    "buttonResize"      : "#button-resize",
    "minifigItems"      : "#minifig-items",
    "areaMinifigParts"  : ".area-minifig-parts",
    "categoryButtonsTh" : ".category-buttons-th",
    "categoryButtonsDiv": "#category-buttons-div",
    "categoryButtonsImg": ".category-buttons-img"
    };

  return _variables[elementName];
}

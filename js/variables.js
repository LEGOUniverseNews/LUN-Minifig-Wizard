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
 * @type {Object}
 * Minifig Wizard-specific details
 */
document.LUN = {};


/**
 * Provide abstract access to common DOM elements.
 * @param   {String} elementName Key to access common variables.
 * @returns {String} jQuery/querySelector* selection.
 */
function _getVariable(elementName) {
  "use strict";
  var variables = {
    imgHat            : "#img-hat",
    imgLeg            : "#img-leg",
    imgHead           : "#img-head",
    imgTorso          : "#img-torso",
    imgSword          : "#img-sword",
    buildArea         : "#area-minifig-built",
    imgShield         : "#img-shield",
    imgShadow         : "#img-shadow",
    background        : "#background",
    imgSpecial        : "#img-special",
    buttonResize      : "#btn-resize",
    minifigItems      : "#minifig-items",
    buttonNewWindow   : "#btn-new-window",
    areaMinifigParts  : ".area-minifig-parts",
    categoryButtonsTh : ".category-buttons-th",
    categoryButtonsDiv: "#category-buttons-div",
    categoryButtonsImg: ".category-buttons-img"
  };
  return variables[elementName];
}

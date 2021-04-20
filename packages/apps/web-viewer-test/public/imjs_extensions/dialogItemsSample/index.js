/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

  module.exports = (() => {
    if (!window.__IMODELJS_INTERNALS_DO_NOT_USE || !window.__IMODELJS_INTERNALS_DO_NOT_USE.SHARED_LIBS_VERS || !window.__IMODELJS_INTERNALS_DO_NOT_USE.SHARED_LIBS)
      throw new Error("Expected globals are missing!");
    if (window.__IMODELJS_INTERNALS_DO_NOT_USE.SHARED_LIBS_VERS["@bentley/imodeljs-frontend"] >= "2.0.0-dev.84")
      return window.__IMODELJS_INTERNALS_DO_NOT_USE.SHARED_LIBS["@bentley/imodeljs-frontend"];
    if (window.__IMODELJS_INTERNALS_DO_NOT_USE.SHARED_LIBS["@bentley/imodeljs-frontend"])
      throw new Error("iModel.js Shared Library " + "@bentley/imodeljs-frontend" + " is loaded, but is an incompatible version." )
    throw new Error("iModel.js Shared Library " + "@bentley/imodeljs-frontend" + " is not yet loaded." )
  })();

/***/ }),
/* 1 */
/***/ (function(module, exports) {

  module.exports = (() => {
    if (!window.__IMODELJS_INTERNALS_DO_NOT_USE || !window.__IMODELJS_INTERNALS_DO_NOT_USE.SHARED_LIBS_VERS || !window.__IMODELJS_INTERNALS_DO_NOT_USE.SHARED_LIBS)
      throw new Error("Expected globals are missing!");
    if (window.__IMODELJS_INTERNALS_DO_NOT_USE.SHARED_LIBS_VERS["@bentley/ui-abstract"] >= "2.0.0-dev.84")
      return window.__IMODELJS_INTERNALS_DO_NOT_USE.SHARED_LIBS["@bentley/ui-abstract"];
    if (window.__IMODELJS_INTERNALS_DO_NOT_USE.SHARED_LIBS["@bentley/ui-abstract"])
      throw new Error("iModel.js Shared Library " + "@bentley/ui-abstract" + " is loaded, but is an incompatible version." )
    throw new Error("iModel.js Shared Library " + "@bentley/ui-abstract" + " is not yet loaded." )
  })();

/***/ }),
/* 2 */
/***/ (function(module, exports) {

  module.exports = (() => {
    if (!window.__IMODELJS_INTERNALS_DO_NOT_USE || !window.__IMODELJS_INTERNALS_DO_NOT_USE.SHARED_LIBS_VERS || !window.__IMODELJS_INTERNALS_DO_NOT_USE.SHARED_LIBS)
      throw new Error("Expected globals are missing!");
    if (window.__IMODELJS_INTERNALS_DO_NOT_USE.SHARED_LIBS_VERS["@bentley/ui-framework"] >= "2.0.0-dev.84")
      return window.__IMODELJS_INTERNALS_DO_NOT_USE.SHARED_LIBS["@bentley/ui-framework"];
    if (window.__IMODELJS_INTERNALS_DO_NOT_USE.SHARED_LIBS["@bentley/ui-framework"])
      throw new Error("iModel.js Shared Library " + "@bentley/ui-framework" + " is loaded, but is an incompatible version." )
    throw new Error("iModel.js Shared Library " + "@bentley/ui-framework" + " is not yet loaded." )
  })();

/***/ }),
/* 3 */
/***/ (function(module, exports) {

  module.exports = (() => {
    if (!window.__IMODELJS_INTERNALS_DO_NOT_USE || !window.__IMODELJS_INTERNALS_DO_NOT_USE.SHARED_LIBS_VERS || !window.__IMODELJS_INTERNALS_DO_NOT_USE.SHARED_LIBS)
      throw new Error("Expected globals are missing!");
    if (window.__IMODELJS_INTERNALS_DO_NOT_USE.SHARED_LIBS_VERS["react"] >= "16.13.1")
      return window.__IMODELJS_INTERNALS_DO_NOT_USE.SHARED_LIBS["react"];
    if (window.__IMODELJS_INTERNALS_DO_NOT_USE.SHARED_LIBS["react"])
      throw new Error("iModel.js Shared Library " + "react" + " is loaded, but is an incompatible version." )
    throw new Error("iModel.js Shared Library " + "react" + " is not yet loaded." )
  })();

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
// cSpell:ignore picklist
Object.defineProperty(exports, "__esModule", { value: true });
const imodeljs_frontend_1 = __webpack_require__(0);
const ui_abstract_1 = __webpack_require__(1);
const bentleyjs_core_1 = __webpack_require__(8);
const imodeljs_common_1 = __webpack_require__(9);
const ui_framework_1 = __webpack_require__(2);
var ToolOptions;
(function (ToolOptions) {
    ToolOptions[ToolOptions["Red"] = 0] = "Red";
    ToolOptions[ToolOptions["White"] = 1] = "White";
    ToolOptions[ToolOptions["Blue"] = 2] = "Blue";
    ToolOptions[ToolOptions["Yellow"] = 3] = "Yellow";
})(ToolOptions || (ToolOptions = {}));
class SampleTool extends imodeljs_frontend_1.PrimitiveTool {
    constructor() {
        super(...arguments);
        this.points = [];
        this._showCoordinatesOnPointerMove = false;
        this._lengthDescription = new imodeljs_frontend_1.LengthDescription();
        this._surveyLengthDescription = new imodeljs_frontend_1.SurveyLengthDescription(SampleTool._surveyLengthName, "Survey");
        this._optionsValue = { value: ToolOptions.Blue };
        this._colorValue = { value: imodeljs_common_1.ColorByName.blue };
        this._weightValue = { value: 3 };
        this._lockValue = { value: true };
        this._cityValue = { value: "Exton" };
        this._stateValue = { value: "PA" };
        this._coordinateValue = { value: "0.0, 0.0, 0.0" };
        this._stationValue = { value: this.formatStation(0.0) };
        this._useLengthValue = { value: true };
        // if _lengthValue also sets up display value then the "number-custom" type editor would not need to format the value before initially displaying it.
        this._lengthValue = { value: 1.5 }; // value in meters
        // if _surveyLengthValue also sets up display value then the "number-custom" type editor would not need to format the value before initially displaying it.
        this._surveyLengthValue = { value: 51.25 }; // value in meters
        // ------------- Angle ---------------
        // if _angleValue also sets up display value then the "number-custom" type editor would not need to format the value before initially displaying it.
        this._angleValue = { value: 0.0 };
    }
    toggleCoordinateUpdate() {
        this._showCoordinatesOnPointerMove = !this._showCoordinatesOnPointerMove;
    }
    // Tool Setting Properties
    // ------------- Enum based picklist ---------------
    static enumAsPicklistMessage(str) { return SampleTool.i18n.translate("dialogItemsSample:tools.SampleTool.Options." + str); }
    get option() {
        return this._optionsValue.value;
    }
    set option(option) {
        this._optionsValue.value = option;
    }
    get colorValue() {
        return this._optionsValue.value;
    }
    set colorValue(colorVal) {
        this._optionsValue.value = colorVal;
    }
    get colorDef() {
        return imodeljs_common_1.ColorDef.create(this._optionsValue.value);
    }
    set colorDef(colorVal) {
        this._optionsValue.value = colorVal.tbgr;
    }
    get weight() {
        return this._weightValue.value;
    }
    set weight(weightVal) {
        this._weightValue.value = weightVal;
    }
    get lock() {
        return this._lockValue.value;
    }
    set lock(option) {
        this._lockValue.value = option;
    }
    get city() {
        return this._cityValue.value;
    }
    set city(option) {
        this._cityValue.value = option;
    }
    get state() {
        return this._stateValue.value;
    }
    set state(option) {
        this._stateValue.value = option;
    }
    get coordinate() {
        return this._coordinateValue.value;
    }
    set coordinate(option) {
        this._coordinateValue.value = option;
    }
    // ------------- display station value as text  ---------------
    get stationFormatterSpec() {
        if (this._stationFormatterSpec)
            return this._stationFormatterSpec;
        const formatterSpec = imodeljs_frontend_1.IModelApp.quantityFormatter.findFormatterSpecByQuantityType(imodeljs_frontend_1.QuantityType.Stationing);
        if (formatterSpec) {
            this._stationFormatterSpec = formatterSpec;
            return formatterSpec;
        }
        bentleyjs_core_1.Logger.logError("UITestApp.SampleTool", "Station formatterSpec was expected to be set before tool started.");
        return undefined;
    }
    formatStation(numberValue) {
        if (this.stationFormatterSpec) {
            return imodeljs_frontend_1.IModelApp.quantityFormatter.formatQuantity(numberValue, this.stationFormatterSpec);
        }
        return numberValue.toFixed(2);
    }
    get station() {
        return this._stationValue.value;
    }
    set station(option) {
        this._stationValue.value = option;
    }
    get useLength() {
        return this._useLengthValue.value;
    }
    set useLength(option) {
        this._useLengthValue.value = option;
    }
    get length() {
        return this._lengthValue.value;
    }
    set length(option) {
        this._lengthValue.value = option;
    }
    get surveyLength() {
        return this._surveyLengthValue.value;
    }
    set surveyLength(option) {
        this._surveyLengthValue.value = option;
    }
    get angle() {
        return this._angleValue.value;
    }
    set angle(option) {
        this._angleValue.value = option;
    }
    // -------- end of ToolSettings ----------
    requireWriteableTarget() { return false; }
    onPostInstall() { super.onPostInstall(); this.setupAndPromptForNextAction(); }
    onUnsuspend() { this.provideToolAssistance(); }
    /** Establish current tool state and initialize drawing aides following onPostInstall, onDataButtonDown, onUndoPreviousStep, or other events that advance or back up the current tool state.
     * Enable snapping or auto-locate for AccuSnap.
     * Setup AccuDraw using AccuDrawHintBuilder.
     * Set view cursor when default cursor isn't applicable.
     * Provide tool assistance.
     */
    setupAndPromptForNextAction() {
        this.provideToolAssistance();
    }
    /** A tool is responsible for providing tool assistance appropriate to the current tool state following significant events.
     * After onPostInstall to establish instructions for the initial tool state.
     * After onUnsuspend to reestablish instructions when no longer suspended by a ViewTool or InputCollector.
     * After onDataButtonDown (or other tool event) advances or backs up the current tool state.
     * After onUndoPreviousStep or onRedoPreviousStep modifies the current tool state.
     */
    provideToolAssistance() {
        const mainInstruction = imodeljs_frontend_1.ToolAssistance.createInstruction(imodeljs_frontend_1.ToolAssistanceImage.CursorClick, SampleTool.i18n.translate("dialogItemsSample:tools.SampleTool.Prompts.GetPoint"));
        const instructions = imodeljs_frontend_1.ToolAssistance.createInstructions(mainInstruction);
        imodeljs_frontend_1.IModelApp.notifications.setToolAssistance(instructions);
    }
    showInfoFromCursorMenu(label) {
        const msg = `Context Menu selection - ${label}`;
        imodeljs_frontend_1.IModelApp.notifications.outputMessage(new imodeljs_frontend_1.NotifyMessageDetails(imodeljs_frontend_1.OutputMessagePriority.Info, msg));
    }
    async onDataButtonDown(ev) {
        // Used to test Cursor Menu
        if (ev.isAltKey) {
            const menuItems = [];
            menuItems.push({ id: "entry1", item: { label: "Label1", icon: "icon-placeholder", execute: () => { this.showInfoFromCursorMenu("hello from entry1"); } } });
            menuItems.push({ id: "entry2", item: { label: "Label2", execute: () => { this.showInfoFromCursorMenu("hello from entry2"); } } });
            menuItems.push({ id: "entry3", item: { label: "Label3", icon: "icon-placeholder", execute: () => { this.showInfoFromCursorMenu("hello from entry3"); } } });
            ui_framework_1.UiFramework.openCursorMenu({ items: menuItems, position: { x: ui_framework_1.CursorInformation.cursorX, y: ui_framework_1.CursorInformation.cursorY } });
            return imodeljs_frontend_1.EventHandled.No;
        }
        if (this.points.length < 2)
            this.points.push(ev.point.clone());
        else
            this.points[1] = ev.point.clone();
        this.toggleCoordinateUpdate();
        this.setupAndPromptForNextAction();
        return imodeljs_frontend_1.EventHandled.No;
    }
    async onResetButtonUp(_ev) {
        /* Common reset behavior for primitive tools is calling onReinitialize to restart or exitTool to terminate. */
        this.onReinitialize();
        return imodeljs_frontend_1.EventHandled.No;
    }
    syncCoordinateValue(coordinate, station, distance) {
        const coordinateValue = { value: coordinate };
        // clone coordinateValue if storing value within tool - in this case we are not
        const syncItem = { value: coordinateValue, propertyName: SampleTool._coordinateName, isDisabled: true };
        const stationValue = { value: station };
        const stationSyncItem = { value: stationValue, propertyName: SampleTool._stationName, isDisabled: true };
        const surveyLengthValue = { value: distance, displayValue: this._surveyLengthDescription.format(distance) };
        const surveySyncItem = { value: surveyLengthValue, propertyName: SampleTool._surveyLengthName, isDisabled: true };
        this.syncToolSettingsProperties([syncItem, stationSyncItem, surveySyncItem]);
    }
    async onMouseMotion(ev) {
        if (!this._showCoordinatesOnPointerMove)
            return;
        const point = ev.point.clone();
        const formattedString = `${point.x.toFixed(2)}, ${point.y.toFixed(2)}, ${point.z.toFixed(2)}`;
        let distance = 0;
        if (this.points.length > 0)
            distance = point.distance(this.points[0]);
        this.syncCoordinateValue(formattedString, this.formatStation(distance), distance);
    }
    onRestartTool() {
        const tool = new SampleTool();
        if (!tool.run())
            this.exitTool();
    }
    /** Used to supply DefaultToolSettingProvider with a list of properties to use to generate ToolSettings.  If undefined then no ToolSettings will be displayed */
    supplyToolSettingsProperties() {
        const readonly = true;
        const toolSettings = new Array();
        toolSettings.push({ value: this._optionsValue, property: SampleTool._getEnumAsPicklistDescription(), editorPosition: { rowPriority: 0, columnIndex: 2 } });
        toolSettings.push({ value: this._colorValue, property: SampleTool._getColorDescription(), editorPosition: { rowPriority: 2, columnIndex: 2 } });
        toolSettings.push({ value: this._weightValue, property: SampleTool._getWeightDescription(), editorPosition: { rowPriority: 3, columnIndex: 2 } });
        toolSettings.push({ value: this._lockValue, property: SampleTool._getLockToggleDescription(), editorPosition: { rowPriority: 5, columnIndex: 2 } });
        toolSettings.push({ value: this._cityValue, property: SampleTool._getCityDescription(), editorPosition: { rowPriority: 10, columnIndex: 2 } });
        toolSettings.push({ value: this._stateValue, property: SampleTool._getStateDescription(), editorPosition: { rowPriority: 10, columnIndex: 4 } });
        toolSettings.push({ value: this._coordinateValue, property: SampleTool._getCoordinateDescription(), editorPosition: { rowPriority: 15, columnIndex: 2, columnSpan: 3 }, isDisabled: readonly });
        toolSettings.push({ value: this._stationValue, property: SampleTool._getStationDescription(), editorPosition: { rowPriority: 16, columnIndex: 2, columnSpan: 3 }, isDisabled: readonly });
        const lengthLock = { value: this._useLengthValue, property: SampleTool._getUseLengthDescription(), editorPosition: { rowPriority: 20, columnIndex: 0 } };
        toolSettings.push({ value: this._lengthValue, property: this._lengthDescription, editorPosition: { rowPriority: 20, columnIndex: 2 }, isDisabled: false, lockProperty: lengthLock });
        toolSettings.push({ value: this._surveyLengthValue, property: this._surveyLengthDescription, editorPosition: { rowPriority: 21, columnIndex: 2 }, isDisabled: readonly });
        toolSettings.push({ value: this._angleValue, property: new imodeljs_frontend_1.AngleDescription(), editorPosition: { rowPriority: 25, columnIndex: 2 } });
        return toolSettings;
    }
    showColorInfoFromUi(updatedValue) {
        const msg = `Property '${updatedValue.propertyName}' updated to value ${this.colorDef.toRgbString()}`;
        imodeljs_frontend_1.IModelApp.notifications.outputMessage(new imodeljs_frontend_1.NotifyMessageDetails(imodeljs_frontend_1.OutputMessagePriority.Info, msg));
    }
    showInfoFromUi(updatedValue) {
        const msg = `Property '${updatedValue.propertyName}' updated to value ${updatedValue.value.value}`;
        imodeljs_frontend_1.IModelApp.notifications.outputMessage(new imodeljs_frontend_1.NotifyMessageDetails(imodeljs_frontend_1.OutputMessagePriority.Info, msg));
    }
    syncLengthState() {
        const lengthValue = { value: this.length, displayValue: this._lengthDescription.format(this.length) };
        const syncItem = { value: lengthValue, propertyName: SampleTool._lengthName, isDisabled: !this.useLength };
        this.syncToolSettingsProperties([syncItem]);
    }
    /** Used to send changes from UI back to Tool */
    applyToolSettingPropertyChange(updatedValue) {
        if (updatedValue.propertyName === SampleTool._optionsName) {
            if (this._optionsValue.value !== updatedValue.value.value) {
                this.option = updatedValue.value.value;
                this.showInfoFromUi(updatedValue);
            }
        }
        else if (updatedValue.propertyName === SampleTool._lockToggleName) {
            this.lock = updatedValue.value.value;
            this.showInfoFromUi(updatedValue);
        }
        else if (updatedValue.propertyName === SampleTool._cityName) {
            this.city = updatedValue.value.value;
            this.showInfoFromUi(updatedValue);
        }
        else if (updatedValue.propertyName === SampleTool._stateName) {
            this.state = updatedValue.value.value;
            this.showInfoFromUi(updatedValue);
        }
        else if (updatedValue.propertyName === SampleTool._useLengthName) {
            this.useLength = updatedValue.value.value;
            this.showInfoFromUi(updatedValue);
            this.syncLengthState();
        }
        else if (updatedValue.propertyName === SampleTool._lengthName) {
            this.length = updatedValue.value.value;
            this.showInfoFromUi(updatedValue);
        }
        else if (updatedValue.propertyName === SampleTool._surveyLengthName) {
            this.surveyLength = updatedValue.value.value;
            this.showInfoFromUi(updatedValue);
        }
        else if (updatedValue.propertyName === SampleTool._colorName) {
            this.colorValue = updatedValue.value.value;
            this.showColorInfoFromUi(updatedValue);
        }
        else if (updatedValue.propertyName === SampleTool._weightName) {
            this.weight = updatedValue.value.value;
            this.showInfoFromUi(updatedValue);
        }
        // return true is change is valid
        return true;
    }
}
exports.SampleTool = SampleTool;
SampleTool.toolId = "SampleTool";
SampleTool._optionsName = "enumAsPicklist";
SampleTool._getEnumAsPicklistDescription = () => {
    return {
        name: SampleTool._optionsName,
        displayLabel: SampleTool.i18n.translate("dialogItemsSample:tools.SampleTool.Prompts.Options"),
        typename: "enum",
        enum: {
            choices: [
                { label: SampleTool.enumAsPicklistMessage("Red"), value: ToolOptions.Red },
                { label: SampleTool.enumAsPicklistMessage("White"), value: ToolOptions.White },
                { label: SampleTool.enumAsPicklistMessage("Blue"), value: ToolOptions.Blue },
                { label: SampleTool.enumAsPicklistMessage("Yellow"), value: ToolOptions.Yellow },
            ],
        },
    };
};
// ------------- Color ---------------
SampleTool._colorName = "color";
SampleTool._getColorDescription = () => {
    return {
        name: SampleTool._colorName,
        displayLabel: SampleTool.i18n.translate("dialogItemsSample:tools.SampleTool.Prompts.Color"),
        typename: "number",
        editor: {
            name: "color-picker",
            params: [{
                    type: ui_abstract_1.PropertyEditorParamTypes.ColorData,
                    colorValues: [
                        imodeljs_common_1.ColorByName.blue,
                        imodeljs_common_1.ColorByName.red,
                        imodeljs_common_1.ColorByName.green,
                        imodeljs_common_1.ColorByName.yellow,
                        imodeljs_common_1.ColorByName.black,
                        imodeljs_common_1.ColorByName.gray,
                        imodeljs_common_1.ColorByName.purple,
                        imodeljs_common_1.ColorByName.pink,
                    ],
                    numColumns: 2,
                },
            ],
        },
    };
};
// ------------- Weight ---------------
SampleTool._weightName = "weight";
SampleTool._getWeightDescription = () => {
    return {
        name: SampleTool._weightName,
        displayLabel: SampleTool.i18n.translate("dialogItemsSample:tools.SampleTool.Prompts.Weight"),
        typename: "number",
        editor: {
            name: "weight-picker",
        },
    };
};
// ------------- boolean based toggle button ---------------
SampleTool._lockToggleName = "lockToggle";
SampleTool._getLockToggleDescription = () => {
    return {
        name: SampleTool._lockToggleName,
        displayLabel: SampleTool.i18n.translate("dialogItemsSample:tools.SampleTool.Prompts.Lock"),
        typename: "boolean",
        editor: { name: "toggle" },
    };
};
// ------------- text based edit field ---------------
SampleTool._cityName = "city";
SampleTool._getCityDescription = () => {
    return {
        name: SampleTool._cityName,
        displayLabel: SampleTool.i18n.translate("dialogItemsSample:tools.SampleTool.Prompts.City"),
        typename: "string",
    };
};
// ------------- text based edit field ---------------
SampleTool._stateName = "state";
SampleTool._getStateDescription = () => {
    return {
        name: SampleTool._stateName,
        displayLabel: SampleTool.i18n.translate("dialogItemsSample:tools.SampleTool.Prompts.State"),
        typename: "string",
        editor: {
            params: [{
                    type: ui_abstract_1.PropertyEditorParamTypes.InputEditorSize,
                    size: 4,
                },
            ],
        },
    };
};
// ------------- text based edit field ---------------
SampleTool._coordinateName = "coordinate";
SampleTool._getCoordinateDescription = () => {
    return {
        name: SampleTool._coordinateName,
        displayLabel: SampleTool.i18n.translate("dialogItemsSample:tools.SampleTool.Prompts.Coordinate"),
        typename: "string",
    };
};
SampleTool._stationName = "station";
SampleTool._getStationDescription = () => {
    return {
        name: SampleTool._stationName,
        displayLabel: SampleTool.i18n.translate("dialogItemsSample:tools.SampleTool.Prompts.Station"),
        typename: "string",
    };
};
// ------------- use length toggle  ---------------
SampleTool._useLengthName = "useLength";
SampleTool._getUseLengthDescription = () => {
    return {
        name: SampleTool._useLengthName,
        displayLabel: "",
        typename: "boolean",
        editor: {
            params: [{
                    type: ui_abstract_1.PropertyEditorParamTypes.SuppressEditorLabel,
                    suppressLabelPlaceholder: true,
                },
            ],
        },
    };
};
// ------------- Length ---------------
SampleTool._lengthName = "length";
// ------------- Survey Length ---------------
SampleTool._surveyLengthName = "surveyLength";


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(6);


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const imodeljs_frontend_1 = __webpack_require__(0);
const SampleUiItemsProvider_1 = __webpack_require__(7);
const ui_abstract_1 = __webpack_require__(1);
const SampleTool_1 = __webpack_require__(4);
/** DialogItemsSample is an iModel.js Extension that adds some user interface to the iModel.js app into which its loaded.
 * Included in the sample are: 1) a Sample Tool (SampleTool.ts), showing how implement a tool with a variety to tool settings items.
 *                             2) a StatusBarItem (created in SampleUiItemsProvider.provideStatusBarItems()) that opens a modal dialog when clicked.
 *
 * Both the SampleTool and the modal dialog opened from the StatusBarItem (UnitsPopup.tsx) use the DialogItemsManager to generate react code from an array of DialogItem interfaces.
 *
 * For more information about Extensions, see Extension in the iModel.js documentation. *
 */
class DialogItemsSample extends imodeljs_frontend_1.Extension {
    constructor(name) {
        super(name);
        // args might override this.
    }
    /** Invoked the first time this extension is loaded. */
    async onLoad(_args) {
        /** Register the localized strings for this extension
         * We'll pass the i18n member to the rest of the classes in the Extension to allow them to translate strings in the UI they implement.
         */
        this._i18NNamespace = this.i18n.registerNamespace("dialogItemsSample");
        await this._i18NNamespace.readFinished;
        const message = this.i18n.translate("dialogItemsSample:Messages.Start");
        const msgDetails = new imodeljs_frontend_1.NotifyMessageDetails(imodeljs_frontend_1.OutputMessagePriority.Info, message);
        imodeljs_frontend_1.IModelApp.notifications.outputMessage(msgDetails);
        if (undefined === this.uiProvider) {
            this.uiProvider = new SampleUiItemsProvider_1.SampleUiItemsProvider(this.i18n);
            ui_abstract_1.UiItemsManager.register(this.uiProvider);
        }
        SampleTool_1.SampleTool.register(this._i18NNamespace, this.i18n);
    }
    /** Invoked each time this extension is loaded. */
    async onExecute(_args) {
        // currently, everything is done in onLoad.
    }
}
exports.DialogItemsSample = DialogItemsSample;
imodeljs_frontend_1.IModelApp.extensionAdmin.register(new DialogItemsSample("dialogItemsSample"));


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(3);
const ui_abstract_1 = __webpack_require__(1);
const imodeljs_frontend_1 = __webpack_require__(0);
const SampleTool_1 = __webpack_require__(4);
const UnitsPopup_1 = __webpack_require__(10);
const SampleTool_svg_sprite_1 = __webpack_require__(12);
const StatusField_svg_sprite_1 = __webpack_require__(13);
const ui_framework_1 = __webpack_require__(2);
class SampleUiItemsProvider {
    constructor(i18n) {
        this.id = "SampleUiItemsProvider";
        SampleUiItemsProvider.i18n = i18n;
    }
    /** provideToolbarButtonItems() is called for each registered UI provider as the Frontstage is building toolbars. We are adding an action button to the ContentManipulation Horizontal toolbar
     * in General use Frontstages. For more information, refer to the UiItemsProvider and Frontstage documentation on imodeljs.org.
     */
    provideToolbarButtonItems(_stageId, stageUsage, toolbarUsage, toolbarOrientation) {
        if (stageUsage === ui_abstract_1.StageUsage.General && toolbarUsage === ui_abstract_1.ToolbarUsage.ContentManipulation && toolbarOrientation === ui_abstract_1.ToolbarOrientation.Horizontal) {
            const simpleActionSpec = ui_abstract_1.ToolbarItemUtilities.createActionButton("dialogItemsSample:sampleTool", 1000, `svg:${SampleTool_svg_sprite_1.default}`, "Sample Tool", this.startSampleTool);
            return [simpleActionSpec];
        }
        return [];
    }
    /** provideStatusBarItems() is called for each registered UI provider to allow the provider to add items to the StatusBar. For more information, see the UiItemsProvider and StatusBar
     * documentation on imodeljs.org.
     */
    provideStatusBarItems(_stageId, stageUsage) {
        const statusBarItems = [];
        if (stageUsage === ui_abstract_1.StageUsage.General) {
            statusBarItems.push(ui_abstract_1.AbstractStatusBarItemUtilities.createActionItem("DialogItemsSample:UnitsStatusBarItem", ui_abstract_1.StatusBarSection.Center, 100, `svg:${StatusField_svg_sprite_1.default}`, SampleTool_1.SampleTool.i18n.translate("dialogItemsSample:StatusBar.UnitsFlyover"), () => {
                ui_framework_1.ModalDialogManager.openDialog(this.unitsPopup());
            }));
        }
        return statusBarItems;
    }
    unitsPopup() {
        return (React.createElement(UnitsPopup_1.UnitsPopup, { opened: true, i18N: SampleUiItemsProvider.i18n }));
    }
    startSampleTool() {
        imodeljs_frontend_1.IModelApp.tools.run(SampleTool_1.SampleTool.toolId);
    }
}
exports.SampleUiItemsProvider = SampleUiItemsProvider;


/***/ }),
/* 8 */
/***/ (function(module, exports) {

  module.exports = (() => {
    if (!window.__IMODELJS_INTERNALS_DO_NOT_USE || !window.__IMODELJS_INTERNALS_DO_NOT_USE.SHARED_LIBS_VERS || !window.__IMODELJS_INTERNALS_DO_NOT_USE.SHARED_LIBS)
      throw new Error("Expected globals are missing!");
    if (window.__IMODELJS_INTERNALS_DO_NOT_USE.SHARED_LIBS_VERS["@bentley/bentleyjs-core"] >= "2.0.0-dev.84")
      return window.__IMODELJS_INTERNALS_DO_NOT_USE.SHARED_LIBS["@bentley/bentleyjs-core"];
    if (window.__IMODELJS_INTERNALS_DO_NOT_USE.SHARED_LIBS["@bentley/bentleyjs-core"])
      throw new Error("iModel.js Shared Library " + "@bentley/bentleyjs-core" + " is loaded, but is an incompatible version." )
    throw new Error("iModel.js Shared Library " + "@bentley/bentleyjs-core" + " is not yet loaded." )
  })();

/***/ }),
/* 9 */
/***/ (function(module, exports) {

  module.exports = (() => {
    if (!window.__IMODELJS_INTERNALS_DO_NOT_USE || !window.__IMODELJS_INTERNALS_DO_NOT_USE.SHARED_LIBS_VERS || !window.__IMODELJS_INTERNALS_DO_NOT_USE.SHARED_LIBS)
      throw new Error("Expected globals are missing!");
    if (window.__IMODELJS_INTERNALS_DO_NOT_USE.SHARED_LIBS_VERS["@bentley/imodeljs-common"] >= "2.0.0-dev.84")
      return window.__IMODELJS_INTERNALS_DO_NOT_USE.SHARED_LIBS["@bentley/imodeljs-common"];
    if (window.__IMODELJS_INTERNALS_DO_NOT_USE.SHARED_LIBS["@bentley/imodeljs-common"])
      throw new Error("iModel.js Shared Library " + "@bentley/imodeljs-common" + " is loaded, but is an incompatible version." )
    throw new Error("iModel.js Shared Library " + "@bentley/imodeljs-common" + " is not yet loaded." )
  })();

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const React = __webpack_require__(3);
const ui_core_1 = __webpack_require__(11);
const ui_framework_1 = __webpack_require__(2);
const ui_abstract_1 = __webpack_require__(1);
const imodeljs_frontend_1 = __webpack_require__(0);
var UnitsOptions;
(function (UnitsOptions) {
    UnitsOptions[UnitsOptions["Metric"] = 0] = "Metric";
    UnitsOptions[UnitsOptions["Imperial"] = 1] = "Imperial";
})(UnitsOptions || (UnitsOptions = {}));
/** UnitsPopup is a modal dialog with only one DialogItem. It is intended to be a very basic example of using DialogItem interfaces and the DialogItemsManager to create React UI
 * in an iModel.js app and to apply changes only when the user hits the OK button.
 */
class UnitsPopup extends React.Component {
    constructor(props, context) {
        super(props, context);
        this._handleOK = () => {
            imodeljs_frontend_1.IModelApp.quantityFormatter.useImperialFormats = (this.option === UnitsOptions.Metric ? false : true);
            this._closeDialog();
        };
        this._handleCancel = () => {
            this._closeDialog();
        };
        this._closeDialog = () => {
            this.setState((_prevState) => ({
                opened: false,
            }), () => {
                if (!this.state.opened)
                    ui_framework_1.ModalDialogManager.closeDialog();
            });
        };
        this._optionsValue = imodeljs_frontend_1.IModelApp.quantityFormatter.useImperialFormats ? { value: UnitsOptions.Imperial } : { value: UnitsOptions.Metric };
        this.applyUiPropertyChange = (updatedValue) => {
            this.option = updatedValue.value.value;
        };
        UnitsPopup.i18n = props.i18N;
        this.state = {
            opened: this.props.opened,
        };
        this._itemsManager = new ui_abstract_1.DialogItemsManager();
        this._itemsManager.applyUiPropertyChange = this.applyUiPropertyChange;
    }
    /** The DefaultDialogGridContainer lays out a grid React components generated from DialogItem interfaces.  */
    render() {
        const item = { value: this._optionsValue, property: UnitsPopup._getEnumAsPicklistDescription(), editorPosition: { rowPriority: 0, columnIndex: 2 } };
        this._itemsManager.items = [item];
        return (React.createElement(ui_core_1.Dialog, { title: UnitsPopup.i18n.translate("dialogItemsSample:StatusBar.Units"), opened: this.state.opened, modal: true, buttonCluster: [
                { type: ui_core_1.DialogButtonType.OK, onClick: () => { this._handleOK(); } },
                { type: ui_core_1.DialogButtonType.Cancel, onClick: () => { this._handleCancel(); } },
            ], onClose: () => this._handleCancel(), onEscape: () => this._handleCancel(), maxWidth: 150 },
            React.createElement(ui_framework_1.DefaultDialogGridContainer, { itemsManager: this._itemsManager, key: Date.now() })));
    }
    get option() {
        return this._optionsValue.value;
    }
    set option(option) {
        this._optionsValue = { value: option };
    }
}
exports.UnitsPopup = UnitsPopup;
// ------------- Enum based picklist ---------------
UnitsPopup._optionsName = "enumAsPicklist";
UnitsPopup._getEnumAsPicklistDescription = () => {
    return {
        name: UnitsPopup._optionsName,
        displayLabel: UnitsPopup.i18n.translate("dialogItemsSample:StatusBar.Units"),
        typename: "enum",
        enum: {
            choices: [
                { label: UnitsPopup.i18n.translate("dialogItemsSample:StatusBar.Metric"), value: UnitsOptions.Metric },
                { label: UnitsPopup.i18n.translate("dialogItemsSample:StatusBar.Imperial"), value: UnitsOptions.Imperial },
            ],
        },
    };
};


/***/ }),
/* 11 */
/***/ (function(module, exports) {

  module.exports = (() => {
    if (!window.__IMODELJS_INTERNALS_DO_NOT_USE || !window.__IMODELJS_INTERNALS_DO_NOT_USE.SHARED_LIBS_VERS || !window.__IMODELJS_INTERNALS_DO_NOT_USE.SHARED_LIBS)
      throw new Error("Expected globals are missing!");
    if (window.__IMODELJS_INTERNALS_DO_NOT_USE.SHARED_LIBS_VERS["@bentley/ui-core"] >= "2.0.0-dev.84")
      return window.__IMODELJS_INTERNALS_DO_NOT_USE.SHARED_LIBS["@bentley/ui-core"];
    if (window.__IMODELJS_INTERNALS_DO_NOT_USE.SHARED_LIBS["@bentley/ui-core"])
      throw new Error("iModel.js Shared Library " + "@bentley/ui-core" + " is loaded, but is an incompatible version." )
    throw new Error("iModel.js Shared Library " + "@bentley/ui-core" + " is not yet loaded." )
  })();

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyMi4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiDQoJIHZpZXdCb3g9IjAgMCAxNiAxNiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMTYgMTY7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxwYXRoIGQ9Ik01LjIzNzgsMEMyLjM1NDEsMCwwLjAxMTcsMi4zMzksMC4wMTE3LDUuMjE4NHMyLjM0MjQsNS4yMDg2LDUuMjI2MSw1LjIwODZjMC4zNzQsMCwwLjczODEtMC4wMzkzLDEuMDgyNi0wLjExNzkNCglDNi4zMzAyLDkuODk2NCw2LjQwOSw5LjUwMzMsNi41NDY3LDkuMTM5NkM2LjE4MjYsOS4yNjc0LDUuNzg4OSw5LjMzNjIsNS4zNzU2LDkuMzQ2QzUuMzI2Myw5LjM1NTgsNS4yODcsOS4zNTU4LDUuMjM3OCw5LjM1NTgNCgljLTIuMjkzMiwwLTQuMTUzMy0xLjg1NzQtNC4xNTMzLTQuMTM3NGMwLTIuMjg5OCwxLjg2MDEtNC4xNDcyLDQuMTUzMy00LjE0NzJjMi4yODMzLDAsNC4xNDM1LDEuODU3NCw0LjE0MzUsNC4xNDcyDQoJYzAsMC4wNjg4LDAsMC4xMjc4LTAuMDA5NywwLjE5NjZDOS4zNjE1LDUuODI3Nyw5LjI4MjgsNi4yMjA4LDkuMTQ1LDYuNTg0NWMwLjM2NDItMC4xMjc4LDAuNzU3OC0wLjE5NjYsMS4xNzEyLTAuMjA2NA0KCWMwLjA4ODYtMC4zNDQsMC4xMjc5LTAuNzA3NiwwLjEzNzgtMS4wODFWNS4yMTg0QzEwLjQ1NCwyLjMzOSw4LjEyMTUsMCw1LjIzNzgsMHoiLz4NCjxjaXJjbGUgY3g9IjguOTAxIiBjeT0iOS42MjYyIiByPSIwLjcwNzYiLz4NCjxjaXJjbGUgY3g9IjEyLjQ4NDYiIGN5PSI5LjY5NzMiIHI9IjAuNzA3NiIvPg0KPGNpcmNsZSBjeD0iMy40NjU5IiBjeT0iMy44MjUiIHI9IjAuNjk1NCIvPg0KPGNpcmNsZSBjeD0iNi45ODc4IiBjeT0iMy44OTQ5IiByPSIwLjY5NTQiLz4NCjxnPg0KCTxwYXRoIGQ9Ik03LjgyNjIsNy4zMjE1Yy0wLjE2NzMsMC4xMjc4LTAuMzI0OCwwLjI4NS0wLjQ2MjYsMC40NDIyQzcuMzI0Myw3LjczNDMsNy4yOTQ3LDcuNjk1LDcuMjY1Miw3LjY0NTgNCgkJYy0wLjE0NzYtMC4yODUtMC4zNTQzLTAuNTMwNy0wLjYwMDQtMC43MjcyQzYuMjQxNiw2LjU3NDYsNS43MTAyLDYuMzg3OSw1LjE1OSw2LjM5NzdjLTAuODU2MiwwLjAxOTctMS42MjM5LDAuNTExLTIuMDA3OCwxLjI3NzYNCgkJQzMuMDcyNSw3Ljg0MjQsMi44NzU3LDcuOTExMiwyLjcwODQsNy44MjI3QzIuNTUwOSw3Ljc0NDEsMi40ODIsNy41NDc2LDIuNTYwOCw3LjM5MDNjMC40OTIxLTAuOTkyNiwxLjQ3NjMtMS42MjE1LDIuNTc4Ni0xLjY1MQ0KCQloMC4wNzg3YzAuNzE4NSwwLDEuMzk3NiwwLjI2NTMsMS45MjksMC43MzcxQzcuNDIyNyw2LjcwMjQsNy42NTg5LDYuOTk3Miw3LjgyNjIsNy4zMjE1eiIvPg0KPC9nPg0KPGc+DQoJPHBhdGggZD0iTTEwLjY4NjEsMTMuNTYzNGMtMS4xMTY2LDAtMi4xNjE2LTAuNjM2OC0yLjY3NzktMS42Mzk1Yy0wLjA4MzktMC4xNjM1LTAuMDE5NS0wLjM2NDMsMC4xNDQxLTAuNDQ4MQ0KCQljMC4xNjQ1LTAuMDg1NCwwLjM2NDgtMC4wMjAzLDAuNDQ5NiwwLjE0MzljMC40MTEzLDAuNzk4NiwxLjI1NDIsMS4yODA5LDIuMTQzNiwxLjI3NjhjMC44NjktMC4wMjM2LDEuNjUtMC41MjM3LDIuMDM4Ni0xLjMwNzcNCgkJYzAuMDgwNi0wLjE2NTEsMC4yODAyLTAuMjMzNCwwLjQ0NzItMC4xNTA1YzAuMTY0NSwwLjA4MTMsMC4yMzIxLDAuMjgxNCwwLjE1MDcsMC40NDY1DQoJCWMtMC40OTg0LDEuMDA1Mi0xLjUwMTgsMS42NDc2LTIuNjE4NCwxLjY3NjlDMTAuNzM3NCwxMy41NjI2LDEwLjcxMjEsMTMuNTYzNCwxMC42ODYxLDEzLjU2MzR6Ii8+DQo8L2c+DQo8Zz4NCgk8cGF0aCBkPSJNMTAuNjk4OSw2LjM5MDdjMi4zNzc3LDAsNC4zMTIsMS45MzA5LDQuMzEyLDQuMzA0M3MtMS45MzQ0LDQuMzA0My00LjMxMiw0LjMwNDNzLTQuMzEyLTEuOTMwOS00LjMxMi00LjMwNDMNCgkJUzguMzIxMyw2LjM5MDcsMTAuNjk4OSw2LjM5MDcgTTEwLjY5ODksNS4zOWMtMi45MzQyLDAtNS4zMTI4LDIuMzc1MS01LjMxMjgsNS4zMDVTNy43NjQ4LDE2LDEwLjY5ODksMTYNCgkJczUuMzEyOC0yLjM3NTEsNS4zMTI4LTUuMzA1UzEzLjYzMzEsNS4zOSwxMC42OTg5LDUuMzlMMTAuNjk4OSw1LjM5eiIvPg0KPC9nPg0KPC9zdmc+DQo="

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiAxNiI+PHBhdGggZD0iTTEwIDE0YTIgMiAwIDAgMSAtNCAwTTYuNSAxMmgzYS41IC41IDAgMCAxIDAgMWgtM2EuNSAuNSAwIDAgMSAwIC0xTTExIDUuNDk5ODFBMy43NzIxMyAzLjc3MjEzIDAgMCAwIDguNzEwNjMgMi4wNDQ2OGEuNTAzNzEgLjUwMzcxIDAgMCAwIC0uNjY1ODMgLjI0OTQ4IC40OTg2NiAuNDk4NjYgMCAwIDAgLjI1MTEgLjY2MTU0QTIuNzgzNjQgMi43ODM2NCAwIDAgMSA5Ljk5MzY0IDUuNDk5ODFhLjUwMzE5IC41MDMxOSAwIDAgMCAxLjAwNjM2IDBNOCAxYTMuOTk4IDMuOTk4IDAgMCAxIDMuMzI0NzggNi4yMjEzNUwxMC4yODUgOC43NzggOS40NjYgMTBINi41MzRMNS43MTYgOC43NzhoLjAwMkw0LjY3NSA3LjIyMUEzLjk5ODEgMy45OTgxIDAgMCAxIDggMU04IDBBNC45OTgxIDQuOTk4MSAwIDAgMCAzLjg0NDQyIDcuNzc4SDMuODQybC4wMTEuMDE3di4wMDFMNiAxMWg0bDIuMTU4LTMuMjIyaC0uMDAyQTQuOTk4IDQuOTk4IDAgMCAwIDggMCIgZmlsbC1ydWxlPSJldmVub2RkIi8+PC9zdmc+"

/***/ })
/******/ ]);
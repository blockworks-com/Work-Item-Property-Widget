define(["TFS/Work/RestClient","TFS/WorkItemTracking/RestClient","q","TFS/WorkItemTracking/Contracts"], function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_137__, __WEBPACK_EXTERNAL_MODULE_138__) { return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(137), __webpack_require__(1), __webpack_require__(138), __webpack_require__(2)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, Q, RestClient, Contracts, RestClientWI) {
	    "use strict";
	    Object.defineProperty(exports, "__esModule", { value: true });
	    var Configuration = (function () {
	        function Configuration(WidgetHelpers) {
	            this.WidgetHelpers = WidgetHelpers;
	            this.widgetConfigurationContext = null;
	            this.$wiid = $("#wiid");
	            this.$wipropertyname = $("#wipropertyname");
	            this.$wicolorpropertyname = $("#wicolorpropertyname");
	            this.$color = $("#color");
	            this.$title = $("#title");
	            this.$dateFormat = $("dateFormat");
	            this.client = RestClient.getClient();
	            this.clientwi = RestClientWI.getClient();
	            this.clickOnSave = false;
	        }
	        Configuration.prototype.load = function (widgetSettings, widgetConfigurationContext) {
	            var _this = this;
	            var _that = this;
	            var $wiid = $("#wiid");
	            var $wipropertyname = $("#wipropertyname");
	            var $wicolorpropertyname = $("#wicolorpropertyname");
	            var $color = $("#color");
	            var $title = $("#title");
	            var $dateFormat = $("dateFormat");
	            this.widgetConfigurationContext = widgetConfigurationContext;
	            var settings = JSON.parse(widgetSettings.customSettings.data);
	            if (settings && settings.wiId) {
	                $wiid.val(settings.wiId);
	            }
	            else {
	                $wiid.val("");
	            }
	            if (settings && settings.wiPropertyName) {
	                $wipropertyname.val(settings.wiPropertyName);
	            }
	            else {
	                $wipropertyname.val("");
	            }
	            if (settings && settings.wiColorPropertyName) {
	                $wicolorpropertyname.val(settings.wiColorPropertyName);
	            }
	            else {
	                $wicolorpropertyname.val("");
	            }
	            if (settings && settings.color) {
	                $color.val(settings.color);
	            }
	            else {
	                $color.val("");
	            }
	            if (settings && settings.title) {
	                $title.val(settings.title);
	            }
	            else {
	                $title.val("");
	            }
	            if (settings && settings.dateFormat) {
	                $dateFormat.val(settings.dateFormat);
	            }
	            else {
	                $dateFormat.val("");
	            }
	            var $errorSingleLineInput = $("#linewi .validation-error-text");
	            _that.$wiid.blur(function () {
	                _this.clientwi.getWorkItem($wiid.val()).then(function (wi) {
	                    console.log("Config:load step 10");
	                    $errorSingleLineInput.parent().css("visibility", "hidden");
	                    console.log("Config:load step 20");
	                    _this.getSortedFieldsList2(wi).then(function (fieldList) {
	                        for (var _i = 0, fieldList_1 = fieldList; _i < fieldList_1.length; _i++) {
	                            var field = fieldList_1[_i];
	                            var opt = document.createElement("option");
	                            opt.innerHTML = field;
	                            opt.value = field;
	                            _this.$wipropertyname[0].appendChild(opt);
	                        }
	                        if (settings && settings.wiPropertyName) {
	                            $wipropertyname.val(settings.wiPropertyName);
	                        }
	                        else {
	                            $wipropertyname.val("");
	                        }
	                    });
	                    console.log("Config:load step 25");
	                    _this.getSortedFieldsList2(wi).then(function (fieldList) {
	                        for (var _i = 0, fieldList_2 = fieldList; _i < fieldList_2.length; _i++) {
	                            var field = fieldList_2[_i];
	                            var opt = document.createElement("option");
	                            opt.innerHTML = field;
	                            opt.value = field;
	                            _this.$wicolorpropertyname[0].appendChild(opt);
	                        }
	                        if (settings && settings.wiColorPropertyName) {
	                            $wicolorpropertyname.val(settings.wiColorPropertyName);
	                        }
	                        else {
	                            $wicolorpropertyname.val("");
	                        }
	                    });
	                    console.log("Config:load step 30");
	                    _that.widgetConfigurationContext.notify(_that.WidgetHelpers.WidgetEvent.ConfigurationChange, _that.WidgetHelpers.WidgetEvent.Args(_that.getCustomSettings()));
	                }, function (reject) {
	                    if (reject.status = "404") {
	                        $errorSingleLineInput.text("This Work item dosn't exist.");
	                        $errorSingleLineInput.parent().css("visibility", "visible");
	                        $(".btn-cta").attr("disabled", "disabled");
	                        return _that.WidgetHelpers.WidgetStatusHelper.Failure();
	                    }
	                });
	            });
	            $errorSingleLineInput = $("#linetitle .validation-error-text");
	            _that.$title.blur(function () {
	                console.log("Config:load linetitle:blur");
	                _this.clientwi.getWorkItem($wiid.val()).then(function (wi) {
	                    $errorSingleLineInput.parent().css("visibility", "hidden");
	                    _that.widgetConfigurationContext.notify(_that.WidgetHelpers.WidgetEvent.ConfigurationChange, _that.WidgetHelpers.WidgetEvent.Args(_that.getCustomSettings()));
	                }, function (reject) {
	                    if (reject.status = "404") {
	                        $errorSingleLineInput.text("This Work item dosn't exist.");
	                        $errorSingleLineInput.parent().css("visibility", "visible");
	                        $(".btn-cta").attr("disabled", "disabled");
	                        return _that.WidgetHelpers.WidgetStatusHelper.Failure();
	                    }
	                });
	            });
	            $errorSingleLineInput = $("#dropdownproperty .validation-error-text");
	            _that.$wipropertyname.blur(function () {
	                console.log("Config:load dropdownproperty:blur");
	                _this.clientwi.getWorkItem($wiid.val()).then(function (wi) {
	                    $errorSingleLineInput.parent().css("visibility", "hidden");
	                    _that.widgetConfigurationContext.notify(_that.WidgetHelpers.WidgetEvent.ConfigurationChange, _that.WidgetHelpers.WidgetEvent.Args(_that.getCustomSettings()));
	                }, function (reject) {
	                    if (reject.status = "404") {
	                        $errorSingleLineInput.text("This Work item dosn't exist.");
	                        $errorSingleLineInput.parent().css("visibility", "visible");
	                        $(".btn-cta").attr("disabled", "disabled");
	                        return _that.WidgetHelpers.WidgetStatusHelper.Failure();
	                    }
	                });
	            });
	            $errorSingleLineInput = $("#dropdowncolorproperty .validation-error-text");
	            _that.$wicolorpropertyname.blur(function () {
	                _this.clientwi.getWorkItem($wiid.val()).then(function (wi) {
	                    $errorSingleLineInput.parent().css("visibility", "hidden");
	                    _that.widgetConfigurationContext.notify(_that.WidgetHelpers.WidgetEvent.ConfigurationChange, _that.WidgetHelpers.WidgetEvent.Args(_that.getCustomSettings()));
	                }, function (reject) {
	                    if (reject.status = "404") {
	                        $errorSingleLineInput.text("This Work item dosn't exist.");
	                        $errorSingleLineInput.parent().css("visibility", "visible");
	                        $(".btn-cta").attr("disabled", "disabled");
	                        return _that.WidgetHelpers.WidgetStatusHelper.Failure();
	                    }
	                });
	            });
	            $errorSingleLineInput = $("#linedateformat .validation-error-text");
	            _that.$dateFormat.blur(function () {
	                console.log("Config:load linedateformat:blur");
	                _this.clientwi.getWorkItem($wiid.val()).then(function (wi) {
	                    $errorSingleLineInput.parent().css("visibility", "hidden");
	                    _that.widgetConfigurationContext.notify(_that.WidgetHelpers.WidgetEvent.ConfigurationChange, _that.WidgetHelpers.WidgetEvent.Args(_that.getCustomSettings()));
	                }, function (reject) {
	                    if (reject.status = "404") {
	                        $errorSingleLineInput.text("This Work item dosn't exist.");
	                        $errorSingleLineInput.parent().css("visibility", "visible");
	                        $(".btn-cta").attr("disabled", "disabled");
	                        return _that.WidgetHelpers.WidgetStatusHelper.Failure();
	                    }
	                });
	            });
	            console.log("Config:load step 100");
	            this.clientwi.getWorkItem($wiid.val()).then(function (wi) {
	                console.log("Config:load step 110");
	                _this.getSortedFieldsList2(wi).then(function (fieldList) {
	                    for (var _i = 0, fieldList_3 = fieldList; _i < fieldList_3.length; _i++) {
	                        var field = fieldList_3[_i];
	                        var opt = document.createElement("option");
	                        opt.innerHTML = field;
	                        opt.value = field;
	                        _this.$wipropertyname[0].appendChild(opt);
	                    }
	                    if (settings && settings.wiPropertyName) {
	                        $wipropertyname.val(settings.wiPropertyName);
	                    }
	                    else {
	                        $wipropertyname.val("");
	                    }
	                });
	                _this.getSortedFieldsList2(wi).then(function (fieldList) {
	                    for (var _i = 0, fieldList_4 = fieldList; _i < fieldList_4.length; _i++) {
	                        var field = fieldList_4[_i];
	                        var opt = document.createElement("option");
	                        opt.innerHTML = field;
	                        opt.value = field;
	                        _this.$wicolorpropertyname[0].appendChild(opt);
	                    }
	                    if (settings && settings.wiColorPropertyName) {
	                        $wicolorpropertyname.val(settings.wiColorPropertyName);
	                    }
	                    else {
	                        $wicolorpropertyname.val("");
	                    }
	                });
	            });
	            return _that.WidgetHelpers.WidgetStatusHelper.Success();
	        };
	        Configuration.prototype.isValidWI = function () {
	            console.log("Config:isValidWI step 10");
	            var deferred = $.Deferred();
	            if ($("#wiid").val() !== "") {
	                this.clientwi.getWorkItem($("#wiid").val()).then(function (wi) {
	                    deferred.resolve(true);
	                }, function (reject) {
	                    if (reject.status = "404") {
	                        deferred.resolve(false);
	                    }
	                });
	            }
	            else {
	                deferred.resolve(false);
	            }
	            return deferred.promise();
	        };
	        Configuration.prototype.getSortedFieldsList = function () {
	            var _this = this;
	            console.log("Config:getSortedFieldList step 10");
	            var deferred = Q.defer();
	            var client = RestClientWI.getClient();
	            client.getFields().then(function (fields) {
	                _this._fields = fields.filter(function (field) { return (field.type === Contracts.FieldType.Double || field.type === Contracts.FieldType.Integer); });
	                var sortedFields = _this._fields.map(function (field) { return field.name; }).sort(function (field1, field2) {
	                    if (field1 > field2) {
	                        return 1;
	                    }
	                    if (field1 < field2) {
	                        return -1;
	                    }
	                    return 0;
	                });
	                deferred.resolve(sortedFields);
	            });
	            return deferred.promise;
	        };
	        Configuration.prototype.getSortedFieldsList2 = function (wi) {
	            var _this = this;
	            console.log("Config:getSortedFieldList2 step 10");
	            var deferred = Q.defer();
	            var client = RestClientWI.getClient();
	            client.getFields(wi.project).then(function (fields) {
	                _this._fields = fields.filter(function (field) { return (field.type === field.type); });
	                var sortedFields = _this._fields.map(function (field) { return field.referenceName; }).sort(function (field1, field2) {
	                    if (field1 > field2) {
	                        return 1;
	                    }
	                    if (field1 < field2) {
	                        return -1;
	                    }
	                    return 0;
	                });
	                deferred.resolve(sortedFields);
	            });
	            return deferred.promise;
	        };
	        Configuration.prototype.getSortedFieldsList3 = function (wi) {
	            var _this = this;
	            console.log("Config:getSortedFieldList3 step 10");
	            var deferred = Q.defer();
	            var client = RestClientWI.getClient();
	            client.getFields(wi.project).then(function (fields) {
	                _this._fields = fields.filter(function (field) { return (field.type === field.type); });
	                var sortedFields = _this._fields.map(function (field) { return field.referenceName; }).sort(function (field1, field2) {
	                    if (field1 > field2) {
	                        return 1;
	                    }
	                    if (field1 < field2) {
	                        return -1;
	                    }
	                    return 0;
	                });
	                deferred.resolve(sortedFields);
	            });
	            return deferred.promise;
	        };
	        Configuration.prototype.getFieldName = function (fieldReferenceName) {
	            var matchingFields = this._fields.filter(function (field) { return field.referenceName === fieldReferenceName; });
	            return (matchingFields.length > 0) ? matchingFields[0].name : null;
	        };
	        Configuration.prototype.getFieldReferenceName = function (fieldName) {
	            var matchingFields = this._fields.filter(function (field) { return field.name === fieldName; });
	            return (matchingFields.length > 0) ? matchingFields[0].referenceName : null;
	        };
	        Configuration.prototype.getComboOptions = function (id, fieldsList, initialField) {
	            console.log("Config:getComboOptions step 10");
	            console.log("Config:getComboOptions step 11");
	            console.log("Config:getComboOptions initialField: " + initialField);
	            var that = this;
	            console.log("Config:getComboOptions getFieldName(initialField): " + that.getFieldName(initialField));
	            return {
	                id: id,
	                mode: "drop",
	                source: fieldsList,
	                enabled: true,
	                value: initialField,
	                change: function () {
	                    that.widgetConfigurationContext.notify(that.WidgetHelpers.WidgetEvent.ConfigurationChange, that.WidgetHelpers.WidgetEvent.Args(that.getCustomSettings()));
	                    var fieldName = this.value;
	                    var fieldReferenceName = (this.getSelectedIndex() < 0) ? null : that.getFieldReferenceName(fieldName);
	                    switch (this._id) {
	                        case "colorpropertyname":
	                            console.log("Config:getComboOptions fieldName: " + fieldName + "; refname: " + fieldReferenceName);
	                            that.$wicolorpropertyname.val(fieldName);
	                            break;
	                    }
	                }
	            };
	        };
	        Configuration.prototype.getCustomSettings = function () {
	            console.log("Config:onSave wipropertyname: " + this.$wipropertyname.val() + "; wicolorpropertyname: " + this.$wicolorpropertyname.val());
	            var result = { data: JSON.stringify({
	                    wiId: $("#wiid").val(),
	                    wiPropertyName: $("#wipropertyname").val(),
	                    wiColorPropertyName: $("#wicolorpropertyname").val(),
	                    color: $("#color").val(),
	                    title: $("#title").val(),
	                    dateFormat: $("#dateFormat").val()
	                })
	            };
	            return result;
	        };
	        Configuration.prototype.onSave = function () {
	            if ($("#wiid").val() === "") {
	                var $errorSingleLineInput = $("#linewi .validation-error-text");
	                $errorSingleLineInput.text("The Id is required");
	                $errorSingleLineInput.parent().css("visibility", "visible");
	                return this.WidgetHelpers.WidgetConfigurationSave.Invalid();
	            }
	            if ($("#title").val() === "") {
	            }
	            if ($("#wipropertyname").val() === "") {
	                var $errorSingleLineInput = $("#lineproperty .validation-error-text");
	                $errorSingleLineInput.text("The Property Name is required");
	                $errorSingleLineInput.parent().css("visibility", "visible");
	                return this.WidgetHelpers.WidgetConfigurationSave.Invalid();
	            }
	            if ($("#wicolorpropertyname").val() === "") {
	            }
	            if ($("#color").val() === "") {
	            }
	            if ($("#dateFormat").val() === "") {
	            }
	            console.log("Config:onSave wipropertyname: " + this.$wipropertyname.val());
	            console.log("Config:onSave wicolorpropertyname: " + this.$wicolorpropertyname.val());
	            console.log("Config:onSave wipropertyname: " + $("#wipropertyname").val());
	            var customSettings = this.getCustomSettings();
	            return this.WidgetHelpers.WidgetConfigurationSave.Valid(customSettings);
	        };
	        return Configuration;
	    }());
	    exports.Configuration = Configuration;
	    VSS.require(["TFS/Dashboards/WidgetHelpers"], function (WidgetHelpers) {
	        WidgetHelpers.IncludeWidgetConfigurationStyles();
	        VSS.register("wipropertywidget-Configuration", function () {
	            var configuration = new Configuration(WidgetHelpers);
	            return configuration;
	        });
	        VSS.notifyLoadSucceeded();
	    });
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 1:
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ }),

/***/ 2:
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ }),

/***/ 137:
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_137__;

/***/ }),

/***/ 138:
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_138__;

/***/ })

/******/ })});;
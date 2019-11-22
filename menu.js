define(["VSS/Authentication/Services"], function(__WEBPACK_EXTERNAL_MODULE_139__) { return /******/ (function(modules) { // webpackBootstrap
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

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(139), __webpack_require__(4), __webpack_require__(6)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, Services, tc, telemetryClientSettings) {
	    "use strict";
	    Object.defineProperty(exports, "__esModule", { value: true });
	    var WiMenu = (function () {
	        function WiMenu() {
	        }
	        WiMenu.prototype.getDashboards = function () {
	            var deferred = $.Deferred();
	            var authTokenManager = Services.authTokenManager;
	            VSS.getAccessToken().then(function (token) {
	                var header = authTokenManager.getAuthorizationHeader(token);
	                $.ajaxSetup({
	                    headers: { "Authorization": header }
	                });
	                var collectionUri = VSS.getWebContext().collection.uri;
	                $.ajax({
	                    url: collectionUri + VSS.getWebContext().project.id + "/" + VSS.getWebContext().team.id + "/_apis/dashboard/dashboards",
	                    type: "GET",
	                    dataType: "json",
	                    data: "api-version=3.0-preview.2",
	                    success: function (c) {
	                        deferred.resolve(c.dashboardEntries);
	                    },
	                    error: function (e) {
	                        tc.TelemetryClient.getClient(telemetryClientSettings.settings).trackException(e.response);
	                    }
	                });
	            });
	            return deferred.promise();
	        };
	        WiMenu.prototype.getDashboard = function (dashboardId) {
	            var deferred = $.Deferred();
	            var authTokenManager = Services.authTokenManager;
	            VSS.getAccessToken().then(function (token) {
	                var header = authTokenManager.getAuthorizationHeader(token);
	                $.ajaxSetup({
	                    headers: { "Authorization": header }
	                });
	                var collectionUri = VSS.getWebContext().collection.uri;
	                $.ajax({
	                    url: collectionUri + VSS.getWebContext().project.id + "/" + VSS.getWebContext().team.id + "/_apis/dashboard/dashboards/" + dashboardId,
	                    type: "GET",
	                    dataType: "json",
	                    data: "api-version=3.0-preview.2",
	                    success: function (c) {
	                        deferred.resolve(c);
	                    },
	                    error: function (e) {
	                        tc.TelemetryClient.getClient(telemetryClientSettings.settings).trackException(e.response);
	                    }
	                });
	            });
	            return deferred.promise();
	        };
	        WiMenu.prototype.addWidgetToDashboard = function (dashboardid, wiid) {
	            var deferred = $.Deferred();
	            var authTokenManager = Services.authTokenManager;
	            VSS.getAccessToken().then(function (token) {
	                var header = authTokenManager.getAuthorizationHeader(token);
	                $.ajaxSetup({
	                    headers: { "Authorization": header }
	                });
	                var w = new WiMenu();
	                w.getDashboard(dashboardid).then(function (dashboard) {
	                    var Widgetobj = {
	                        "name": "Work Item Property details", "position": { "row": 0, "column": 0 }, "size": { "rowSpan": 1, "columnSpan": 2 }, "settings": "{\"wiId\":\"" + wiid + "\"}", "settingsVersion": { "major": 1, "minor": 0, "patch": 0 }, "dashboard": { "eTag": "" + dashboard.eTag + "" }, "contributionId": "" + VSS.getExtensionContext().publisherId + "." + VSS.getExtensionContext().extensionId + ".wipropertywidget"
	                    };
	                    var toSend = JSON.stringify(Widgetobj);
	                    var collectionUri = VSS.getWebContext().collection.uri;
	                    $.ajax({
	                        url: collectionUri + VSS.getWebContext().project.id + "/" + VSS.getWebContext().team.id + "/_apis/dashboard/dashboards/" + dashboardid + "/widgets?api-version=3.0-preview.2",
	                        type: "POST",
	                        dataType: "json",
	                        contentType: "application/json; charset=utf-8",
	                        data: toSend,
	                        success: function (c) {
	                            console.log("menu:addWidgetToDashboard: WI " + wiid + " is added to Dashboard " + dashboard.name);
	                            deferred.resolve(c);
	                        },
	                        error: function (e) {
	                            tc.TelemetryClient.getClient(telemetryClientSettings.settings).trackException(e.response);
	                        }
	                    });
	                });
	            });
	            return deferred.promise();
	        };
	        return WiMenu;
	    }());
	    exports.WiMenu = WiMenu;
	    ;
	    var contributionId = VSS.getExtensionContext().publisherId + "." + VSS.getExtensionContext().extensionId + ".addToDashboard-work-item-menu";
	    VSS.register(contributionId, {
	        getMenuItems: function (context) {
	            var ids = context.ids || context.workItemIds;
	            if (!ids && context.id) {
	                ids = [context.id];
	            }
	            var calledWithActiveForm = false;
	            if (!ids && context.workItemId) {
	                ids = [context.workItemId];
	                calledWithActiveForm = true;
	            }
	            var childItems = [];
	            var w = new WiMenu();
	            return w.getDashboards().then(function (dashboards) {
	                dashboards.forEach(function (dashboard) {
	                    childItems.push({
	                        text: dashboard.name,
	                        title: dashboard.name,
	                        action: function () {
	                            tc.TelemetryClient.getClient(telemetryClientSettings.settings).trackPageView("ContextMenuAddToDashboard");
	                            ids.forEach(function (value, index) {
	                                w.addWidgetToDashboard(dashboard.id, value).then(function () { });
	                            });
	                        }
	                    });
	                });
	                return [{
	                        "text": "Add Property Widget to dashboard",
	                        title: "Add Property Widget to dashboard",
	                        icon: "static/images/adddashboard.png",
	                        childItems: childItems
	                    }];
	            });
	        }
	    });
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 4:
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports, __webpack_require__(5)], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, applicationinsights_js_1) {
	    "use strict";
	    Object.defineProperty(exports, "__esModule", { value: true });
	    var TelemetryClientSettings = (function () {
	        function TelemetryClientSettings() {
	            this.disableTelemetry = "false";
	            this.disableAjaxTracking = "false";
	            this.enableDebug = "false";
	        }
	        return TelemetryClientSettings;
	    }());
	    exports.TelemetryClientSettings = TelemetryClientSettings;
	    var TelemetryClient = (function () {
	        function TelemetryClient() {
	            this.IsAvailable = true;
	        }
	        TelemetryClient.getClient = function (settings) {
	            if (!this._instance) {
	                console.log("Creating new TelemetryClient!");
	                this._instance = new TelemetryClient();
	                this._instance.Init(settings);
	            }
	            return this._instance;
	        };
	        TelemetryClient.prototype.Init = function (settings) {
	            console.log("TelemetryClient settings key: " + settings.key.substring(0, 8) + "************");
	            console.log("TelemetryClient settings extension context: " + settings.extensioncontext);
	            console.log("TelemetryClient settings disableTelemetry: " + (settings.disableTelemetry === "true"));
	            console.log("TelemetryClient settings disableAjaxTracking: " + (settings.disableAjaxTracking === "true"));
	            console.log("TelemetryClient settings enableDebug: " + (settings.enableDebug === "true"));
	            var config = {
	                instrumentationKey: settings.key,
	                disableTelemetry: (settings.disableTelemetry === "true"),
	                disableAjaxTracking: (settings.disableAjaxTracking === "true"),
	                enableDebug: (settings.enableDebug === "true")
	            };
	            this.ExtensionContext = settings.extensioncontext;
	            try {
	                var webContext = VSS.getWebContext();
	                applicationinsights_js_1.AppInsights.downloadAndSetup(config);
	                applicationinsights_js_1.AppInsights.setAuthenticatedUserContext(webContext.user.id, webContext.collection.id);
	            }
	            catch (e) {
	                console.log(e);
	            }
	        };
	        TelemetryClient.prototype.trackPageView = function (name, url, properties, measurements, duration) {
	            try {
	                applicationinsights_js_1.AppInsights.trackPageView(this.ExtensionContext + "." + name, url, properties, measurements, duration);
	                applicationinsights_js_1.AppInsights.flush();
	            }
	            catch (e) {
	                console.log(e);
	            }
	        };
	        TelemetryClient.prototype.trackEvent = function (name, properties, measurements) {
	            try {
	                console.log("Tracking event: " + this.ExtensionContext + "." + name);
	                applicationinsights_js_1.AppInsights.trackEvent(this.ExtensionContext + "." + name, properties, measurements);
	                applicationinsights_js_1.AppInsights.flush();
	            }
	            catch (e) {
	                console.log(e);
	            }
	        };
	        TelemetryClient.prototype.trackException = function (exceptionMessage, handledAt, properties, measurements) {
	            try {
	                console.error(exceptionMessage);
	                var error = {
	                    name: this.ExtensionContext + "." + handledAt,
	                    message: exceptionMessage
	                };
	                applicationinsights_js_1.AppInsights.trackException(error, handledAt, properties, measurements);
	                applicationinsights_js_1.AppInsights.flush();
	            }
	            catch (e) {
	                console.log(e);
	            }
	        };
	        TelemetryClient.prototype.trackMetric = function (name, average, sampleCount, min, max, properties) {
	            try {
	                applicationinsights_js_1.AppInsights.trackMetric(this.ExtensionContext + "." + name, average, sampleCount, min, max, properties);
	                applicationinsights_js_1.AppInsights.flush();
	            }
	            catch (e) {
	                console.log(e);
	            }
	        };
	        return TelemetryClient;
	    }());
	    exports.TelemetryClient = TelemetryClient;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	//# sourceMappingURL=telemetryclient.js.map

/***/ }),

/***/ 5:
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/// <reference path="../JavaScriptSDK.Interfaces/IConfig.ts"/>
	/// <reference path="../JavaScriptSDK.Interfaces/IAppInsights.ts"/>
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
	    "use strict";
	    Object.defineProperty(exports, "__esModule", { value: true });
	    var AppInsightsModule = (function () {
	        function AppInsightsModule() {
	        }
	        AppInsightsModule._createLazyMethod = function (name) {
	            var aiObject = window[AppInsightsModule.appInsightsName];
	            // Define a temporary method that queues-up a the real method call
	            aiObject[name] = function () {
	                // Capture the original arguments passed to the method
	                var originalArguments = arguments;
	                // If the queue is available, it means that the function wasn't yet replaced with actual function value
	                if (aiObject.queue) {
	                    aiObject.queue.push(function () { return aiObject[name].apply(aiObject, originalArguments); });
	                }
	                else {
	                    // otherwise execute the function
	                    aiObject[name].apply(aiObject, originalArguments);
	                }
	            };
	        };
	        ;
	        AppInsightsModule._defineLazyMethods = function () {
	            var aiObject = window[AppInsightsModule.appInsightsName];
	            // capture initial cookie if possible
	            try {
	                aiObject.cookie = document.cookie;
	            }
	            catch (e) {
	            }
	            aiObject.queue = [];
	            var method = [
	                "clearAuthenticatedUserContext",
	                "flush",
	                "setAuthenticatedUserContext",
	                "startTrackEvent",
	                "startTrackPage",
	                "stopTrackEvent",
	                "stopTrackPage",
	                "trackDependency",
	                "trackEvent",
	                "trackException",
	                "trackMetric",
	                "trackPageView",
	                "trackTrace"
	            ];
	            while (method.length) {
	                AppInsightsModule._createLazyMethod(method.pop());
	            }
	        };
	        AppInsightsModule._download = function (aiConfig) {
	            AppInsightsModule.appInsightsInstance.config = aiConfig;
	            var aiObject = window[AppInsightsModule.appInsightsName];
	            // if script was previously downloaded and initialized, queue will be deleted, reinitialize it
	            if (!aiObject.queue) {
	                aiObject.queue = [];
	            }
	            setTimeout(function () {
	                var scriptElement = document.createElement("script");
	                scriptElement.src = aiConfig.url || "https://az416426.vo.msecnd.net/scripts/a/ai.0.js";
	                document.head.appendChild(scriptElement);
	            });
	            // collect global errors by wrapping the window.onerror method
	            if (!aiConfig.disableExceptionTracking) {
	                var method_1 = "onerror";
	                AppInsightsModule._createLazyMethod("_" + method_1);
	                var originalOnError = window[method_1];
	                window[method_1] = function (message, url, lineNumber, columnNumber, error) {
	                    var handled = originalOnError && originalOnError(message, url, lineNumber, columnNumber, error);
	                    if (handled !== true) {
	                        aiObject["_" + method_1](message, url, lineNumber, columnNumber, error);
	                    }
	                    return handled;
	                };
	            }
	        };
	        Object.defineProperty(AppInsightsModule, "appInsightsInstance", {
	            get: function () {
	                if (typeof window === 'undefined') {
	                    return;
	                }
	                if (!window[AppInsightsModule.appInsightsName]) {
	                    window[AppInsightsModule.appInsightsName] = {
	                        downloadAndSetup: AppInsightsModule._download,
	                        // exposing it for unit tests only, not part of interface
	                        _defineLazyMethods: AppInsightsModule._defineLazyMethods
	                    };
	                    AppInsightsModule._defineLazyMethods();
	                }
	                return window[AppInsightsModule.appInsightsName];
	            },
	            enumerable: true,
	            configurable: true
	        });
	        return AppInsightsModule;
	    }());
	    AppInsightsModule.appInsightsInitialized = false;
	    AppInsightsModule.appInsightsName = "appInsights";
	    exports.AppInsights = AppInsightsModule.appInsightsInstance;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	//# sourceMappingURL=AppInsightsModule.js.map

/***/ }),

/***/ 6:
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__, exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports) {
	    "use strict";
	    Object.defineProperty(exports, "__esModule", { value: true });
	    exports.settings = {
	        key: "__INSTRUMENTATIONKEY__",
	        extensioncontext: "WorkItemPropertyWidget",
	        disableTelemetry: "true",
	        disableAjaxTracking: "__disableAjaxTracking__",
	        enableDebug: "__enableDebug__"
	    };
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ }),

/***/ 139:
/***/ (function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_139__;

/***/ })

/******/ })});;
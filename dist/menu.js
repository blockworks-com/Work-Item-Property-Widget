define(["require", "exports", "VSS/Authentication/Services", "telemetryclient-team-services-extension", "./telemetryClientSettings"], function (require, exports, Services, tc, telemetryClientSettings) {
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
                        "name": "Work Item details", "position": { "row": 0, "column": 0 }, "size": { "rowSpan": 1, "columnSpan": 2 }, "settings": "{\"wiId\":\"" + wiid + "\"}", "settingsVersion": { "major": 1, "minor": 0, "patch": 0 }, "dashboard": { "eTag": "" + dashboard.eTag + "" }, "contributionId": "" + VSS.getExtensionContext().publisherId + "." + VSS.getExtensionContext().extensionId + ".widetailswidget"
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
                        "text": "Add to dashboard",
                        title: "Add to dashboard",
                        icon: "static/images/adddashboard.png",
                        childItems: childItems
                    }];
            });
        }
    });
});

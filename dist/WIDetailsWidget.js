define(["require", "exports", "TFS/Work/RestClient", "TFS/WorkItemTracking/RestClient", "TFS/WorkItemTracking/Services", "telemetryclient-team-services-extension", "./telemetryClientSettings"], function (require, exports, RestClient, RestClientWI, WorkItemServices, tc, telemetryClientSettings) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var WidgetWIDetails = (function () {
        function WidgetWIDetails(WidgetHelpers) {
            this.WidgetHelpers = WidgetHelpers;
            this.client = RestClient.getClient();
            this.clientwi = RestClientWI.getClient();
        }
        WidgetWIDetails.prototype.LoadWIDetails = function (widgetSettings) {
            var _this = this;
            tc.TelemetryClient.getClient(telemetryClientSettings.settings).trackPageView("Index");
            var customSettings = JSON.parse(widgetSettings.customSettings.data);
            var $title = $("h2");
            $title.text(widgetSettings.name);
            if (customSettings) {
                $("#configwidget").hide();
                $("#loadingwidget").show();
                $("#content").hide();
                $("#contentError").hide();
                this.clientwi.getWorkItem(customSettings.wiId).then(function (wi) {
                    console.log("WorkItemDetailWidget:LoadWIDetails step 1");
                    console.log("WorkItemDetailWidget:LoadWIDetails propertyName: " + customSettings.wiPropertyName
                        + "; color prop: " + customSettings.wiColorPropertyName + "; color: " + customSettings.color
                        + "; title: " + customSettings.title);
                    _this.DisplayWIDetails(wi, customSettings.wiPropertyName, customSettings.wiColorPropertyName, customSettings.color, customSettings.title);
                    $("#loadingwidget").hide();
                    $("#content").show();
                    $("#wi-title").dotdotdot();
                    $("#wi-desc").dotdotdot();
                    $(".widget").off();
                    $(".widget").on("click", function () {
                        WorkItemServices.WorkItemFormNavigationService.getService().then(function (service) {
                            service.openWorkItem(customSettings.wiId, false);
                        });
                    });
                }, function (reject) {
                    $("#loadingwidget").hide();
                    $("#contentError").attr("style", "display:block;margin:10px;");
                    $("#contentError").addClass("error");
                    if (reject.status === "404") {
                        $("#contentError").html("TF401232: Work item Id: " + customSettings.wiId + " does not exist, or you do not have permissions to read it.");
                    }
                    else {
                        $("#contentError").html(reject.message);
                    }
                    tc.TelemetryClient.getClient(telemetryClientSettings.settings).trackException(reject.message);
                });
            }
            else {
                $title.attr("style", "color:grey");
                $("#content").hide();
                $("#loadingwidget").hide();
                $("#contentError").hide();
                $("#configwidget").show();
            }
            return this.WidgetHelpers.WidgetStatusHelper.Success();
        };
        WidgetWIDetails.prototype.DisplayWIDetails = function (wi, fieldname, colorfield, colorstring, titlestring) {
            $("#wi-header").attr("style", "height: " + 30 + "px;");
            $("#wi-type").attr("style", "height: " + 10 + "px;");
            $("#updated").attr("style", "height: " + 0 + "px;");
            $("#assignuser").attr("style", "height: " + 0 + "px;");
            $("#statecircle").attr("style", "height: " + 0 + "px;");
            $("#wi-desc").attr("style", "height: calc(100vh - " + 30 + "px); min-height: calc(100vh - " + 30 + "px);");
            var witype = wi.fields[colorfield];
            var wititle = wi.fields["System.Title"];
            var stringParts = fieldname.split(".");
            wititle = stringParts.pop();
            wititle = titlestring;
            var color = this.getWorkItemColor(witype);
            if (colorstring !== "") {
                $("#content").attr("style", "background-color: " + colorstring + ";");
                color = colorstring;
                console.log("WorkItemDetailWidget:DisplayWIDetails color prop: " + colorfield + "; value: " + color + "; color: " + colorstring);
            }
            $("#wi-header").attr("style", "background-color: " + color + ";");
            $("#wi-title").text(wititle);
            var desc = wi.fields[fieldname];
            if (desc !== undefined) {
                $("#wi-desc").html(desc);
            }
            else {
                $("#wi-desc").html("");
            }
            $("#updateby").html("Updated by ".concat(wi.fields["System.ChangedBy"]));
            $("#updatedate").html(this.DeltaDate(new Date(wi.fields["System.ChangedDate"])).text);
            var assign = wi.fields["System.AssignedTo"];
            if (assign !== undefined) {
                $("#assignuser").html(assign);
                $("#assignavatar").attr("src", this.getMemberAvatarUrl(assign));
            }
            else {
                $("#assignuser").html("Unassigned");
                $("#assignavatar").hide();
            }
            var state = wi.fields["System.State"];
            $("#state").html(state);
            var statecolor = this.getStateColor(state);
            var backgroundcolor = statecolor;
            if (state === "Removed") {
                backgroundcolor = "transparent";
            }
            $("#statecircle").attr("style", "border-color:" + statecolor + ";background-color:" + backgroundcolor + "");
        };
        WidgetWIDetails.prototype.noHtml = function (txt) {
            var a = txt.indexOf("<");
            var b = txt.indexOf(">");
            var len = txt.length;
            var c = txt.substring(0, a);
            if (b === -1) {
                b = a;
            }
            var d = txt.substring((b + 1), len);
            txt = c + d;
            if (a !== b) {
                txt = this.noHtml(txt);
            }
            return (txt);
        };
        WidgetWIDetails.prototype.getWorkItemColor = function (workItemType) {
            var witColor = "";
            switch (workItemType) {
                case "AMBER":
                    witColor = "#ffbf00";
                    break;
                default:
                    witColor = workItemType;
            }
            console.log("WorkItemDetailWidget:getWorkItemColor result: " + witColor);
            return witColor;
        };
        WidgetWIDetails.prototype.getStateColor = function (state) {
            var statecolor = "";
            switch (state) {
                case "Approved":
                case "New":
                case "To Do":
                case "Design":
                    statecolor = "#b2b2b2";
                    break;
                case "In Progress":
                case "Committed":
                case "Open":
                case "Ready":
                case "Active":
                case "In Planning":
                    statecolor = "#007acc";
                    break;
                case "Done":
                case "Closed":
                case "Inactive":
                case "Completed":
                    statecolor = "#393";
                    break;
                case "Removed":
                    statecolor = "#5688e0";
                    break;
                default:
                    statecolor = "#b2b2b2";
            }
            return statecolor;
        };
        WidgetWIDetails.prototype.DeltaDate = function (date) {
            var now = Date.now();
            var past = date.getTime();
            var days = Math.floor((now - past) / (1000 * 60 * 60 * 24));
            var result = {
                days: days,
                text: ""
            };
            if (days > 365) {
                var years = Math.floor(days / 365);
                if (years === 1) {
                    result.text = "A year ago";
                }
                else {
                    result.text = years + " year(s) ago";
                }
            }
            else if (days > 30) {
                var months = Math.floor(days / 30);
                if (months === 1) {
                    result.text = "A month ago";
                }
                else {
                    result.text = months + " month(s) ago";
                }
            }
            else if (days > 7) {
                result.text = "This month";
            }
            else if (days <= 7 && days > 1) {
                result.text = days + " days ago";
            }
            else if (days === 1) {
                result.text = "Yesterday";
            }
            else {
                result.text = "Today";
            }
            return result;
        };
        WidgetWIDetails.prototype.getMemberAvatarUrl = function (memberIdentity) {
            var i = memberIdentity.lastIndexOf("<");
            var j = memberIdentity.lastIndexOf(">");
            var uniqueName = $.trim(memberIdentity.substr(i + 1, j - i - 1));
            return VSS.getWebContext().host.uri + "_api/_common/IdentityImage?id=&identifier=" + uniqueName;
        };
        WidgetWIDetails.prototype.load = function (widgetSettings) {
            return this.LoadWIDetails(widgetSettings);
        };
        WidgetWIDetails.prototype.reload = function (widgetSettings) {
            return this.LoadWIDetails(widgetSettings);
        };
        return WidgetWIDetails;
    }());
    exports.WidgetWIDetails = WidgetWIDetails;
    VSS.require("TFS/Dashboards/WidgetHelpers", function (WidgetHelpers) {
        WidgetHelpers.IncludeWidgetStyles();
        VSS.register("widetailswidget", function () {
            var widgetDetails = new WidgetWIDetails(WidgetHelpers);
            return widgetDetails;
        });
        VSS.notifyLoadSucceeded();
    });
});

// ---------------------------------------------------------------------
// <copyright file="app.ts">
//    This code is licensed under the MIT License.
//    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF
//    ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
//    TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
//    PARTICULAR PURPOSE AND NONINFRINGEMENT.
// </copyright>
// <summary>
// </summary>
// ---------------------------------------------------------------------

/// <reference path="jquery.dotdotdot.d.ts" />
"use strict";
let DEBUG: boolean = true;
let logger = function(a: any, b: any) { if (DEBUG) { console.log(a, b || ""); } };

import RestClient = require("TFS/Work/RestClient");
import CoreContracts = require("TFS/Core/Contracts");
import WorkContracts = require("TFS/Work/Contracts");
import RestClientWI = require("TFS/WorkItemTracking/RestClient");
import WorkItemsContracts = require("TFS/WorkItemTracking/Contracts");
import WorkItemServices = require("TFS/WorkItemTracking/Services");
import * as tc from "telemetryclient-team-services-extension";
import telemetryClientSettings = require("./telemetryClientSettings");
import * as moment from "moment";
import { CustomTransportDataTypes } from "VSS/Ajax";

export class WidgetWIProperty {

    constructor(public WidgetHelpers) {
    }

    public client = RestClient.getClient();
    public clientwi = RestClientWI.getClient();

    public LoadWI(widgetSettings) {
        tc.TelemetryClient.getClient(telemetryClientSettings.settings).trackPageView("Starting to load Work Item");
        logger("LoadWI", "step 10");
        let customSettings = <ISettings>JSON.parse(widgetSettings.customSettings.data);
        logger("LoadWI", "step 12");
        let $title = $("h2");
        $title.text(widgetSettings.name);
        if (customSettings) {
            if (typeof customSettings.enableDebug === "undefined") {
                customSettings.enableDebug = true;
                logger("LoadWI", "enableDebug is undefined so set to " + customSettings.enableDebug);
            }
            logger("LoadWI", "debug = " + customSettings.enableDebug);
            DEBUG = customSettings.enableDebug;

            if (typeof customSettings.enableTelemetry === "undefined") {
                customSettings.enableTelemetry = true;
                logger("LoadWI", "enableTelemtry is undefined so set to " + customSettings.enableTelemetry);
            }
            logger("LoadWI", "enableTelemetry = " + customSettings.enableTelemetry);
//            if (customSettings.enableTelemetry) {
//                logger("LoadWI", "before call to telemetry");
//                tc.TelemetryClient.getClient(telemetryClientSettings.settings).trackPageView("Index");
//                logger("LoadWI", "after call to telemetry");
//            }

            $("#configwidget").hide();
            $("#loadingwidget").show();
            $("#content").hide();
            $("#contentError").hide();

            // Main
            logger("LoadWI", "wiId = " + customSettings.wiId);
            this.clientwi.getWorkItem(customSettings.wiId).then((wi) => {
                let $msg = "propertyName = " + customSettings.wiPropertyName + ";"
                    + " color prop = " + customSettings.wiColorPropertyName + ";"
                    + " color = " + customSettings.color + ";"
                    + " title = " + customSettings.title + ";"
                    + " dateFormat = " + customSettings.dateFormat + ";"
                    + " enableTelemetry = " + customSettings.enableTelemetry + ";"
                    + " enableDebug = " + customSettings.enableDebug + ";"
                    ;
                logger("LoadWI", "values: " + $msg);

                if (customSettings.enableTelemetry) {
                    if (customSettings.color !== "") { tc.TelemetryClient.getClient(telemetryClientSettings.settings).trackPageView("Color is being used"); }
                    if (customSettings.dateFormat !== "") { tc.TelemetryClient.getClient(telemetryClientSettings.settings).trackPageView("DateFormat is being used"); }
                    if (customSettings.title !== "") { tc.TelemetryClient.getClient(telemetryClientSettings.settings).trackPageView("Title is being used"); }
                    if (customSettings.wiColorPropertyName !== "") { tc.TelemetryClient.getClient(telemetryClientSettings.settings).trackPageView("ColorProperty is being used"); }
                    // Do not log wiPropertyName because it's required
                    // Do not log wiid because it's required
                    // Do not log enableTelemetry because if usage is logged then we know telemetry is enabled.
                    // Do not log enableDebug because usage doesn't matter
                }

                this.DisplayWI(wi, customSettings.wiPropertyName, customSettings.wiColorPropertyName, customSettings.color, customSettings.title, customSettings.dateFormat);

                $("#loadingwidget").hide();
                $("#content").show();

                $("#wi-title").dotdotdot();
                $("#wi-desc").dotdotdot();

                $(".widget").off(); // remove other click event load+reload where configure => prevent multiple windows
                $(".widget").on("click", function () {
                    WorkItemServices.WorkItemFormNavigationService.getService().then(service => {
                        service.openWorkItem(customSettings.wiId, false); // open the wi dialog
                    });
                });

            }, (reject) => {
                $("#loadingwidget").hide();
                $("#contentError").attr("style", "display:block;margin:10px;");
                $("#contentError").addClass("error");
                if (reject.status === "404") {
                    $("#contentError").html("TF401232: Work item Id: " + customSettings.wiId + " does not exist, or you do not have permissions to read it.");
                } else {
                    $("#contentError").html(reject.message);
                }
                logger("LoadWI", "Exception: " + reject.message);
                tc.TelemetryClient.getClient(telemetryClientSettings.settings).trackException(reject.message);
            });
        } else {
            $title.attr("style", "color:grey");
            $("#content").hide();
            $("#loadingwidget").hide();
            $("#contentError").hide();
            $("#configwidget").show();

            logger("LoadWI", "no settings");
            tc.TelemetryClient.getClient(telemetryClientSettings.settings).trackPageView("No settings configured");
        }

        tc.TelemetryClient.getClient(telemetryClientSettings.settings).trackPageView("Finished loading Work Item");
        return this.WidgetHelpers.WidgetStatusHelper.Success();
    }

    private DisplayWI(wi: WorkItemsContracts.WorkItem, fieldname: string, colorfield: string, colorstring: string, titlestring: string, dateFormat: string) {
        logger("DisplayWI", "step 1");

        $("#wi-header").attr("style", "height: " + 30 + "px;");
//        $("#wi-title").attr("style", "height: " + 0 + "px;");
        $("#wi-type").attr("style", "height: " + 10 + "px;");
        $("#updated").attr("style", "height: " + 0 + "px;");
        $("#assignuser").attr("style", "height: " + 0 + "px;");
        $("#statecircle").attr("style", "height: " + 0 + "px;");
        $("#wi-desc").attr("style", "height: calc(100vh - " + 30 + "px); min-height: calc(100vh - " + 30 + "px);");

//        let witype = wi.fields["System.WorkItemType"];
        let witype = wi.fields[colorfield];
        let wititle = wi.fields["System.Title"];

        let stringParts = fieldname.split(".");
        wititle = stringParts.pop();

        wititle = titlestring;

        let color = this.getWorkItemColor(witype);
        if (colorstring !== "") {
            $("#content").attr("style", "background-color: " + colorstring + ";");
            color = colorstring;
            logger("DisplayWI", "color prop: " + colorfield + "; value: " + color + "; color: " + colorstring);
        }

//        $("#wi-header").attr("style", "border-left-color: " + color + ";");
        $("#wi-header").attr("style", "background-color: " + color + ";");
//        $("#wi-type").html(witype + " " + wi.id);
        $("#wi-title").text(wititle);

        let desc = wi.fields[fieldname];
        if (desc !== undefined) {
            // desc = this.noHtml(desc);

            $("#wi-desc").html(desc);
            if (dateFormat !== "") {
                if (moment(desc).isValid()) {
                    logger("DisplayWI", "format date: " + moment(desc).format(dateFormat));
                    logger("DisplayWI", "check if valid date: " + moment(desc).isValid() + "; " + desc);
                    $("#wi-desc").html(moment(desc).format(dateFormat));
                }
            }
        } else {
            $("#wi-desc").html("");
        }

        $("#updateby").html("Updated by ".concat(wi.fields["System.ChangedBy"]));
        $("#updatedate").html(this.DeltaDate(new Date(wi.fields["System.ChangedDate"])).text);

        let assign = wi.fields["System.AssignedTo"];

        if (assign !== undefined) {
            $("#assignuser").html(assign);
            $("#assignavatar").attr("src", this.getMemberAvatarUrl(assign));
        } else {
            $("#assignuser").html("Unassigned");
            $("#assignavatar").hide();
        }

        let state = wi.fields["System.State"];
        $("#state").html(state);

        let statecolor = this.getStateColor(state);
        let backgroundcolor = statecolor;
        if (state === "Removed") {
            backgroundcolor = "transparent";
        }
        $("#statecircle").attr("style", "border-color:" + statecolor + ";background-color:" + backgroundcolor + "");
    }

    private isValidDate(date) {
        logger("isValidDate", "step 1");
        return date && Object.prototype.toString.call(date) === "[object Date]" && !isNaN(date);
      }

    private noHtml(txt) {
        logger("noHtml", "step 1");
        let a = txt.indexOf("<");
        let b = txt.indexOf(">");
        let len = txt.length;
        let c = txt.substring(0, a);
        if (b === -1) {
            b = a;
        }
        let d = txt.substring((b + 1), len);
        txt = c + d;
        if (a !== b) {
            txt = this.noHtml(txt);
        }
        return (txt);
    }

    private getWorkItemColor(workItemType: string): string {
        logger("getWorkItemColor", "step 1");
        let witColor = "";
        switch (workItemType) {
            case "AMBER":
                witColor = "#ffbf00";
                break;
            default:
                witColor = workItemType;
        }
        logger("getWorkItemColor", "result: " + witColor);
        return witColor;
    }

    private getStateColor(state: string): string {
        logger("getStateColor", "step 1");
        let statecolor = "";
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
    }

    private DeltaDate(date: Date): IDeltaDateInfo {
        logger("DeltaDate", "step 1");
        let now = Date.now();
        let past = date.getTime();

        let days = Math.floor((now - past) / (1000 * 60 * 60 * 24));

        let result = {
            days: days,
            text: ""
        };

        if (days > 365) {
            let years = Math.floor(days / 365);
            if (years === 1) {
                result.text = `A year ago`;
            } else {
                result.text = `${years} year(s) ago`;
            }

        } else if (days > 30) {
            let months = Math.floor(days / 30);
            if (months === 1) {
                result.text = `A month ago`;
            } else {
                result.text = `${months} month(s) ago`;
            }

        }
        else if (days > 7) {
            result.text = "This month";
        }
        else if (days <= 7 && days > 1) {
            result.text = `${days} days ago`;
        }
        else if (days === 1) {
            result.text = "Yesterday";
        } else {
            result.text = "Today";
        }
        return result;
    }

    private getMemberAvatarUrl(memberIdentity: string): string {
        logger("getMemberAvatarUrl", "step 1");

        let i = memberIdentity.lastIndexOf("<");
        let j = memberIdentity.lastIndexOf(">");
        let uniqueName = $.trim(memberIdentity.substr(i + 1, j - i - 1));

        return VSS.getWebContext().host.uri + "_api/_common/IdentityImage?id=&identifier=" + uniqueName;
    }

    // Load and Reload Methods
    public load(widgetSettings) {
        logger("load", "step 1");
        return this.LoadWI(widgetSettings);
    }
    public reload(widgetSettings) {
        logger("reload", "step 1");
        return this.LoadWI(widgetSettings);
    }
}

VSS.require("TFS/Dashboards/WidgetHelpers", function (WidgetHelpers) {
    logger("", "step 1");
    WidgetHelpers.IncludeWidgetStyles();
    VSS.register("wipropertywidget", () => {
        let widgetProperty = new WidgetWIProperty(WidgetHelpers);
        return widgetProperty;
    });
    VSS.notifyLoadSucceeded();
});

interface IDeltaDateInfo {
    text: string;
    days: number;
}
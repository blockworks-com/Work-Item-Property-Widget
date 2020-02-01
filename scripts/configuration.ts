// ---------------------------------------------------------------------
// <copyright file="configuration.ts">
//    This code is licensed under the MIT License.
//    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF
//    ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
//    TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
//    PARTICULAR PURPOSE AND NONINFRINGEMENT.
// </copyright>
// <summary>
// </summary>
// ---------------------------------------------------------------------

/// <reference path='isettings.d.ts' />
"use strict";
let DEBUG: boolean = true;
let logger = function(a: any, b: any) { if (DEBUG) { console.log(a, b || ""); } };

import Q = require("q");
import Controls = require("VSS/Controls");
import {Combo, IComboOptions} from "VSS/Controls/Combos";
import Combos = require("VSS/Controls/Combos");
import RestClient = require("TFS/Work/RestClient");
import CoreClient = require("TFS/Core/RestClient");
import CoreContracts = require("TFS/Core/Contracts");
import WorkContracts = require("TFS/Work/Contracts");
import Contracts = require("TFS/WorkItemTracking/Contracts");
import RestClientWI = require("TFS/WorkItemTracking/RestClient");
import { enableElement } from "VSS/Utils/UI";
import * as tc from "telemetryclient-team-services-extension";
import telemetryClientSettings = require("./telemetryClientSettings");

export class Configuration {
    widgetConfigurationContext = null;

    private _fields: Contracts.WorkItemField[];
    $wiid = $("#wiid");
    $wipropertyname = $("#wipropertyname");
    $wicolorpropertyname = $("#wicolorpropertyname");
    $color = $("#color");
    $title = $("#title");
    $dateFormat = $("#dateFormat");
    $enableTelemetry = $("#enableTelemetry");
    $enableDebug = $("#enableDebug");

    public client = RestClient.getClient();
    public clientwi = RestClientWI.getClient();
    public clickOnSave = false;

    public _widgetHelpers;
    constructor(public WidgetHelpers) {
    }

    public load(widgetSettings, widgetConfigurationContext) {
        let _that = this;

        let $wiid = $("#wiid");
        let $wipropertyname = $("#wipropertyname");
        let $wicolorpropertyname = $("#wicolorpropertyname");
        let $color = $("#color");
        let $title = $("#title");
        let $dateFormat = $("#dateFormat");
        let $enableTelemetry = $("#enableTelemetry");
        let $enableDebug = $("#enableDebug");

        logger("load", "enabletelemetry (using settings) = " + _that.$enableTelemetry);
        if (_that.$enableTelemetry) {
            tc.TelemetryClient.getClient(telemetryClientSettings.settings).trackPageView("Starting Configuration");
        }

        this.widgetConfigurationContext = widgetConfigurationContext;

        let settings = JSON.parse(widgetSettings.customSettings.data);
        if (settings && settings.wiId) {
            $wiid.val(settings.wiId);
        } else {
            // first load
            $wiid.val("");
        }
        if (settings && settings.wiPropertyName) {
            $wipropertyname.val(settings.wiPropertyName);
        } else {
            // first load
            $wipropertyname.val("");
        }
        if (settings && settings.wiColorPropertyName) {
            $wicolorpropertyname.val(settings.wiColorPropertyName);
        } else {
            // first load
            $wicolorpropertyname.val("");
        }
        if (settings && settings.color) {
            $color.val(settings.color);
        } else {
            // first load
            $color.val("");
        }
        if (settings && settings.title) {
            $title.val(settings.title);
        } else {
            // first load
            $title.val("");
        }
        if (settings && settings.dateFormat) {
            logger("load", "dateFormat: " + settings.dateFormat);
            $dateFormat.val(settings.dateFormat);
        } else {
            logger("load", "dateFormat does not exist in settings");
            // first load
            $dateFormat.val("");
        }
        if (settings && settings.enableTelemetry !== null) {
            $enableTelemetry.prop("checked", settings.enableTelemetry);
        } else {
            $enableTelemetry.prop("checked", true);
        }
        if (settings && settings.enableDebug !== null) {
            DEBUG = settings.enableDebug;
            $enableDebug.prop("checked", settings.enableDebug);
        } else {
            $enableDebug.prop("checked", true);
        }

        let $errorSingleLineInput = $("#linewi .validation-error-text");
        _that.$wiid.blur(() => {
            logger("load", "linewi:blur");
            this.clientwi.getWorkItem($wiid.val()).then((wi) => {
                $errorSingleLineInput.parent().css("visibility", "hidden");

                this.getSortedFieldsList2(wi).then((fieldList) => {
                    for (const field of fieldList) {
                        const opt = document.createElement("option");
                        opt.innerHTML = field;
                        opt.value = field;
                        this.$wipropertyname[0].appendChild(opt);
                    }

                    if (settings && settings.wiPropertyName) {
                        $wipropertyname.val(settings.wiPropertyName);
                    } else {
                        // first load
                        $wipropertyname.val("");
                    }
                });

                this.getSortedFieldsList2(wi).then((fieldList) => {
                    for (const field of fieldList) {
                        const opt = document.createElement("option");
                        opt.innerHTML = field;
                        opt.value = field;
                        this.$wicolorpropertyname[0].appendChild(opt);
                    }

                    if (settings && settings.wiColorPropertyName) {
                        $wicolorpropertyname.val(settings.wiColorPropertyName);
                    } else {
                        // first load
                        $wicolorpropertyname.val("");
                    }
                });

                _that.widgetConfigurationContext.notify(_that.WidgetHelpers.WidgetEvent.ConfigurationChange,
                    _that.WidgetHelpers.WidgetEvent.Args(_that.getCustomSettings()));

            }, (reject) => {
                if (reject.status = "404") {
                    $errorSingleLineInput.text("This Work item doesn't exist.");
                    $errorSingleLineInput.parent().css("visibility", "visible");
                    $(".btn-cta").attr("disabled", "disabled");

                    logger("linewi.blur", "Error: " + $errorSingleLineInput.text());
                    tc.TelemetryClient.getClient(telemetryClientSettings.settings).trackException($errorSingleLineInput.text());

                    return _that.WidgetHelpers.WidgetStatusHelper.Failure();

                }
            });
        });

        $errorSingleLineInput = $("#linetitle .validation-error-text");
        _that.$title.blur(() => {
            logger("load", "linetitle:blur");
            _that.widgetConfigurationContext.notify(_that.WidgetHelpers.WidgetEvent.ConfigurationChange,
                _that.WidgetHelpers.WidgetEvent.Args(_that.getCustomSettings()));
        });

        $errorSingleLineInput = $("#linedropdownproperty .validation-error-text");
        _that.$wipropertyname.blur(() => {
            logger("load", "dropdownproperty:blur");
            _that.widgetConfigurationContext.notify(_that.WidgetHelpers.WidgetEvent.ConfigurationChange,
                _that.WidgetHelpers.WidgetEvent.Args(_that.getCustomSettings()));
        });

        $errorSingleLineInput = $("#dropdowncolorproperty .validation-error-text");
        _that.$wicolorpropertyname.blur(() => {
            logger("load", "dropdowncolorproperty:blur");
            _that.widgetConfigurationContext.notify(_that.WidgetHelpers.WidgetEvent.ConfigurationChange,
                _that.WidgetHelpers.WidgetEvent.Args(_that.getCustomSettings()));
        });

        $errorSingleLineInput = $("#linedateformat .validation-error-text");
        _that.$dateFormat.blur(() => {
            logger("load", "linedateformat:blur");
            _that.widgetConfigurationContext.notify(_that.WidgetHelpers.WidgetEvent.ConfigurationChange,
                _that.WidgetHelpers.WidgetEvent.Args(_that.getCustomSettings()));
        });

        $errorSingleLineInput = $("#lineenableTelemetry .validation-error-text");
        _that.$enableTelemetry.blur(() => {
            logger("load", "lineenableTelemetry:blur");

            if (_that.$enableTelemetry) {
                tc.TelemetryClient.getClient(telemetryClientSettings.settings).trackEvent("Telemetry Disabled");
            } else {
                tc.TelemetryClient.getClient(telemetryClientSettings.settings).trackEvent("Telemetry Enabled");
            }

            _that.widgetConfigurationContext.notify(_that.WidgetHelpers.WidgetEvent.ConfigurationChange,
                _that.WidgetHelpers.WidgetEvent.Args(_that.getCustomSettings()));
        });

        $errorSingleLineInput = $("#lineenableDebug .validation-error-text");
        _that.$enableDebug.blur(() => {
            logger("load", "lineenableDebug:blur");
            _that.widgetConfigurationContext.notify(_that.WidgetHelpers.WidgetEvent.ConfigurationChange,
                _that.WidgetHelpers.WidgetEvent.Args(_that.getCustomSettings()));
        });

        this.clientwi.getWorkItem($wiid.val()).then((wi) => {

            this.getSortedFieldsList2(wi).then((fieldList) => {
                for (const field of fieldList) {
                    const opt = document.createElement("option");
                    opt.innerHTML = field;
                    opt.value = field;
                    this.$wipropertyname[0].appendChild(opt);
                }

                if (settings && settings.wiPropertyName) {
                    $wipropertyname.val(settings.wiPropertyName);
                } else {
                    // first load
                    $wipropertyname.val("");
                }
            });

            this.getSortedFieldsList2(wi).then((fieldList) => {
                for (const field of fieldList) {
                    const opt = document.createElement("option");
                    opt.innerHTML = field;
                    opt.value = field;
                    this.$wicolorpropertyname[0].appendChild(opt);
                }

                if (settings && settings.wiColorPropertyName) {
                    $wicolorpropertyname.val(settings.wiColorPropertyName);
                } else {
                    // first load
                    $wicolorpropertyname.val("");
                }
            });
        });

        if (_that.$enableTelemetry) {
            tc.TelemetryClient.getClient(telemetryClientSettings.settings).trackPageView("Finished Configuration");
        }
        return _that.WidgetHelpers.WidgetStatusHelper.Success();
    }

    private isValidWI(): IPromise<boolean> {
        logger("isValidWI", "step 10");
        let deferred = $.Deferred<boolean>();

        if ($("#wiid").val() !== "") {
            this.clientwi.getWorkItem($("#wiid").val()).then((wi) => {
                deferred.resolve(true);
            }, (reject) => {
                logger("isValidWI", "Error: " + reject.Status);
                if (reject.status = "404") {
                    deferred.resolve(false);
                }
            });
        } else {
            deferred.resolve(false);
        }

        return deferred.promise();
    }

    private getSortedFieldsList(): IPromise<any> {
        logger("getSortedFieldList", "step 10");
        let deferred = Q.defer();
        let client = RestClientWI.getClient();
        client.getFields().then((fields: Contracts.WorkItemField[]) => {
            this._fields = fields.filter(field => (field.type === Contracts.FieldType.Double || field.type === Contracts.FieldType.Integer));
            let sortedFields = this._fields.map(field => field.name).sort((field1, field2) => {
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
    }

    private getSortedFieldsList2(wi): IPromise<any> {
        logger("getSortedFieldList2", "step 10");
        let deferred = Q.defer();
        let client = RestClientWI.getClient();
        client.getFields(wi.project).then((fields: Contracts.WorkItemField[]) => {
            this._fields = fields.filter(field => (field.type === field.type));
            let sortedFields = this._fields.map(field => field.referenceName).sort((field1, field2) => {
                if (field1 > field2) {
                    return 1;
                }

                if (field1 < field2) {
                    return -1;
                }

                return 0;
            });
            sortedFields.unshift("");
            deferred.resolve(sortedFields);
        });

        return deferred.promise;
    }

    private getSortedFieldsList3(wi): IPromise<any> {
        logger("getSortedFieldList3", "step 10");
        let deferred = Q.defer();
        let client = RestClientWI.getClient();
        client.getFields(wi.project).then((fields: Contracts.WorkItemField[]) => {
            this._fields = fields.filter(field => (field.type === field.type));
            let sortedFields = this._fields.map(field => field.referenceName).sort((field1, field2) => {
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
    }

    private getFieldName(fieldReferenceName): string {
        let matchingFields = this._fields.filter(field => field.referenceName === fieldReferenceName);
        return (matchingFields.length > 0) ? matchingFields[0].name : null;
    }

    private getFieldReferenceName(fieldName): string {
        let matchingFields = this._fields.filter(field => field.name === fieldName);
        return (matchingFields.length > 0) ? matchingFields[0].referenceName : null;
    }

    // getComboOptions("colorpropertyname", fieldList, $wicolorpropertyname.val())
    private getComboOptions(id, fieldsList, initialField): IComboOptions {
        logger("getComboOptions", "step 10");
        logger("getComboOptions", "initialField: " + initialField);
        let that = this;
        logger("getComboOptions", "getFieldName(initialField): " + that.getFieldName(initialField));
        return {
            id: id,
            mode: "drop",
            source: fieldsList,
            enabled: true,
//            value: that.getFieldName(initialField),
            value: initialField,
            change: function () {
                that.widgetConfigurationContext.notify(that.WidgetHelpers.WidgetEvent.ConfigurationChange,
                    that.WidgetHelpers.WidgetEvent.Args(that.getCustomSettings()));
//                let fieldName = this.getText();
                let fieldName = this.value;
                let fieldReferenceName: string = (this.getSelectedIndex() < 0) ? null : that.getFieldReferenceName(fieldName);

                switch (this._id) {
                    case "colorpropertyname":
                        logger("getComboOptions", "fieldName: " + fieldName + "; refname: " + fieldReferenceName);
                        that.$wicolorpropertyname.val(fieldName);
                        break;
                }
//                that.updateSaveButton();
            }
        };
    }

    public getCustomSettings() {
        logger("getCustomSettings", "wiId: " + $("#wiid").val() + "; wipropertyname: " + this.$wipropertyname.val() + "; wicolorpropertyname: " + this.$wicolorpropertyname.val() + "; dateFormat: " + this.$dateFormat.val() + "; enableTelemetry: " + this.$enableTelemetry.is(":checked") + "; enableDebug: " + this.$enableDebug.is(":checked"));
        let result = { data: JSON.stringify(<ISettings>{
            wiId: $("#wiid").val(),
            wiPropertyName: $("#wipropertyname").val(),
            wiColorPropertyName: $("#wicolorpropertyname").val(),
            color: $("#color").val(),
            title: $("#title").val(),
            dateFormat: $("#dateFormat").val(),
            enableTelemetry: $("#enableTelemetry").is(":checked"),
            enableDebug: $("#enableDebug").is(":checked")
            })
        };
        logger("getCustomSettings", result);
        return result;
    }

    public onSave() {
        if ($("#wiid").val() === "") {
            let $errorSingleLineInput = $("#linewi .validation-error-text");
            $errorSingleLineInput.text("The Id is required");
            $errorSingleLineInput.parent().css("visibility", "visible");
            return this.WidgetHelpers.WidgetConfigurationSave.Invalid();
        }
        if ($("#title").val() === "") {
            // let $errorSingleLineInput = $("#lineproperty .validation-error-text");
            // $errorSingleLineInput.text("The Property Name is required");
            // $errorSingleLineInput.parent().css("visibility", "visible");
            // return this.WidgetHelpers.WidgetConfigurationSave.Invalid();
        }
        if ($("#wipropertyname").val() === "") {
            // let $errorSingleLineInput = $("#linedropdownproperty .validation-error-text");
            // $errorSingleLineInput.text("The Property Name is required");
            // $errorSingleLineInput.parent().css("visibility", "visible");
            // return this.WidgetHelpers.WidgetConfigurationSave.Invalid();
        }
        if ($("#wicolorpropertyname").val() === "") {
            // let $errorSingleLineInput = $("#linecolor .validation-error-text");
            // $errorSingleLineInput.text("The Status Color Property Name is required");
            // $errorSingleLineInput.parent().css("visibility", "visible");
            // return this.WidgetHelpers.WidgetConfigurationSave.Invalid();
        }
        if ($("#color").val() === "") {
            // let $errorSingleLineInput = $("#linecolor .validation-error-text");
            // $errorSingleLineInput.text("The Background Color is required");
            // $errorSingleLineInput.parent().css("visibility", "visible");
            // return this.WidgetHelpers.WidgetConfigurationSave.Invalid();
        }
        if ($("#dateFormat").val() === "") {
            // let $errorSingleLineInput = $("#linedateFormat .validation-error-text");
            // $errorSingleLineInput.text("The Date Format is required");
            // $errorSingleLineInput.parent().css("visibility", "visible");
            // return this.WidgetHelpers.WidgetConfigurationSave.Invalid();
        }
        if ($("#enableTelemetry").val() === "") {
            // let $errorSingleLineInput = $("#lineenableTelemetry .validation-error-text");
            // $errorSingleLineInput.text("The Enable Telemetry is required");
            // $errorSingleLineInput.parent().css("visibility", "visible");
            // return this.WidgetHelpers.WidgetConfigurationSave.Invalid();
        }
        if ($("#enableDebug").val() === "") {
            // let $errorSingleLineInput = $("#lineenableDebug .validation-error-text");
            // $errorSingleLineInput.text("The Enable Debug is required");
            // $errorSingleLineInput.parent().css("visibility", "visible");
            // return this.WidgetHelpers.WidgetConfigurationSave.Invalid();
        }

        logger("onSave", "wipropertyname: " + this.$wipropertyname.val());
        logger("onSave", "wicolorpropertyname: " + this.$wicolorpropertyname.val());
        logger("onSave", "wipropertyname: " + $("#wipropertyname").val());

        let customSettings = this.getCustomSettings();
        return this.WidgetHelpers.WidgetConfigurationSave.Valid(customSettings);
    }
}

VSS.require(["TFS/Dashboards/WidgetHelpers"], (WidgetHelpers) => {
    WidgetHelpers.IncludeWidgetConfigurationStyles();
    VSS.register("wipropertywidget-Configuration", () => {
        let configuration = new Configuration(WidgetHelpers);
        return configuration;
    });

    VSS.notifyLoadSucceeded();
});
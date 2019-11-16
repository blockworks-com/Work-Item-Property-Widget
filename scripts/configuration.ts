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

export class Configuration {
    widgetConfigurationContext = null;

    private _fields: Contracts.WorkItemField[];
    $wiid = $("#wiid");
    $wipropertyname = $("#wipropertyname");
    $wicolorpropertyname = $("#wicolorpropertyname");
    $color = $("#color");
    $title = $("#title");

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

        let $errorSingleLineInput = $("#linewi .validation-error-text");
        _that.$wiid.blur(() => {
            this.clientwi.getWorkItem($wiid.val()).then((wi) => {

        console.log("Config:load step 10");

                $errorSingleLineInput.parent().css("visibility", "hidden");

                console.log("Config:load step 20");
                this.getSortedFieldsList2(wi).then((fieldList) => {
                    Controls.create(Combo, $wipropertyname, this.getComboOptions("wipropertyname",
                    fieldList, $wipropertyname.val()));
                });

                console.log("Config:load step 25");
                this.getSortedFieldsList2(wi).then((fieldList) => {
                    Controls.create(Combo, $wicolorpropertyname, this.getComboOptions("colorpropertyname",
                    fieldList, $wipropertyname.val()));
                });

                console.log("Config:load step 30");
                _that.widgetConfigurationContext.notify(_that.WidgetHelpers.WidgetEvent.ConfigurationChange,
                    _that.WidgetHelpers.WidgetEvent.Args(_that.getCustomSettings()));

            }, (reject) => {
                if (reject.status = "404") {
                    $errorSingleLineInput.text("This Work item dosn't exist.");
                    $errorSingleLineInput.parent().css("visibility", "visible");
                    $(".btn-cta").attr("disabled", "disabled");

                    return _that.WidgetHelpers.WidgetStatusHelper.Failure();

                }
            });
        });

        $errorSingleLineInput = $("#linetitle .validation-error-text");
        _that.$title.blur(() => {
            this.clientwi.getWorkItem($wiid.val()).then((wi) => {

                $errorSingleLineInput.parent().css("visibility", "hidden");

                _that.widgetConfigurationContext.notify(_that.WidgetHelpers.WidgetEvent.ConfigurationChange,
                    _that.WidgetHelpers.WidgetEvent.Args(_that.getCustomSettings()));

            }, (reject) => {
                if (reject.status = "404") {
                    $errorSingleLineInput.text("This Work item dosn't exist.");
                    $errorSingleLineInput.parent().css("visibility", "visible");
                    $(".btn-cta").attr("disabled", "disabled");

                    return _that.WidgetHelpers.WidgetStatusHelper.Failure();

                }
            });
        });

        $errorSingleLineInput = $("#lineproperty .validation-error-text");
        _that.$wipropertyname.blur(() => {
            this.clientwi.getWorkItem($wiid.val()).then((wi) => {

                $errorSingleLineInput.parent().css("visibility", "hidden");

                _that.widgetConfigurationContext.notify(_that.WidgetHelpers.WidgetEvent.ConfigurationChange,
                    _that.WidgetHelpers.WidgetEvent.Args(_that.getCustomSettings()));

            }, (reject) => {
                if (reject.status = "404") {
                    $errorSingleLineInput.text("This Work item dosn't exist.");
                    $errorSingleLineInput.parent().css("visibility", "visible");
                    $(".btn-cta").attr("disabled", "disabled");

                    return _that.WidgetHelpers.WidgetStatusHelper.Failure();

                }
            });
        });

        $errorSingleLineInput = $("#linecolor .validation-error-text");
        _that.$wicolorpropertyname.blur(() => {
            this.clientwi.getWorkItem($wiid.val()).then((wi) => {

                $errorSingleLineInput.parent().css("visibility", "hidden");

                _that.widgetConfigurationContext.notify(_that.WidgetHelpers.WidgetEvent.ConfigurationChange,
                    _that.WidgetHelpers.WidgetEvent.Args(_that.getCustomSettings()));

            }, (reject) => {
                if (reject.status = "404") {
                    $errorSingleLineInput.text("This Work item dosn't exist.");
                    $errorSingleLineInput.parent().css("visibility", "visible");
                    $(".btn-cta").attr("disabled", "disabled");

                    return _that.WidgetHelpers.WidgetStatusHelper.Failure();

                }
            });
        });

        console.log("Config:load step 100");
        this.clientwi.getWorkItem($wiid.val()).then((wi) => {
            console.log("Config:load step 110");
//            for (let entry in wi.fields) {
//                console.log("Config:load entry: " + entry);
//            }

            this.getSortedFieldsList2(wi).then((fieldList) => {
                Controls.create(Combo, $wipropertyname, this.getComboOptions("wipropertyname",
                fieldList, $wipropertyname.val()));
            });

            this.getSortedFieldsList2(wi).then((fieldList) => {
                Controls.create(Combo, $wicolorpropertyname, this.getComboOptions("colorpropertyname",
                fieldList, $wicolorpropertyname.val()));
            });

        });

        return _that.WidgetHelpers.WidgetStatusHelper.Success();
    }

    private isValidWI(): IPromise<boolean> {
console.log("Config:isValidWI step 10");
        let deferred = $.Deferred<boolean>();

        if ($("#wiid").val() !== "") {
            this.clientwi.getWorkItem($("#wiid").val()).then((wi) => {
                deferred.resolve(true);
            }, (reject) => {
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
        console.log("Config:getSortedFieldList step 10");
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
console.log("Config:getSortedFieldList2 step 10");
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
        console.log("Config:getComboOptions step 10");
        console.log("Config:getComboOptions step 11");
        console.log("Config:getComboOptions initialField: " + initialField);
        let that = this;
        console.log("Config:getComboOptions getFieldName(initialField): " + that.getFieldName(initialField));
        return {
            id: id,
            mode: "drop",
            source: fieldsList,
            enabled: true,
            value: that.getFieldName(initialField),
            change: function () {
//                that._changeMade = true;
//                let fieldName = this.getText();
                let fieldName = this.value;
                let fieldReferenceName: string = (this.getSelectedIndex() < 0) ? null : that.getFieldReferenceName(fieldName);

                switch (this._id) {
                    case "colorpropertyname":
                        console.log("Config:getComboOptions fieldName: " + fieldName + "; refname: " + fieldReferenceName);
                        that.$wicolorpropertyname.val(fieldName);
                        break;
                }
//                that.updateSaveButton();
            }
        };
    }

    public getCustomSettings() {
console.log("Config:onSave wipropertyname: " + this.$wipropertyname.val() + "; wicolorpropertyname: " + this.$wicolorpropertyname.val());
        let result = { data: JSON.stringify(<ISettings>{
            wiId: $("#wiid").val(),
            wiPropertyName: $("#wipropertyname").val(),
            wiColorPropertyName: $("#wicolorpropertyname").val(),
            color: $("#color").val(),
            title: $("#title").val() }) };
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
            let $errorSingleLineInput = $("#lineproperty .validation-error-text");
            $errorSingleLineInput.text("The Property Name is required");
            $errorSingleLineInput.parent().css("visibility", "visible");
            return this.WidgetHelpers.WidgetConfigurationSave.Invalid();
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

        console.log("Config:onSave wipropertyname: " + this.$wipropertyname.val());
        console.log("Config:onSave wicolorpropertyname: " + this.$wicolorpropertyname.val());
        console.log("Config:onSave wipropertyname: " + $("#wipropertyname").val());

        let customSettings = this.getCustomSettings();
        return this.WidgetHelpers.WidgetConfigurationSave.Valid(customSettings);
    }
}

VSS.require(["TFS/Dashboards/WidgetHelpers"], (WidgetHelpers) => {
    WidgetHelpers.IncludeWidgetConfigurationStyles();
    VSS.register("widetailswidget-Configuration", () => {
        let configuration = new Configuration(WidgetHelpers);
        return configuration;
    });

    VSS.notifyLoadSucceeded();
});

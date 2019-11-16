define(["require", "exports", "q", "VSS/Controls", "VSS/Controls/Combos", "TFS/Work/RestClient", "TFS/WorkItemTracking/Contracts", "TFS/WorkItemTracking/RestClient"], function (require, exports, Q, Controls, Combos_1, RestClient, Contracts, RestClientWI) {
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
            var $errorSingleLineInput = $("#linewi .validation-error-text");
            _that.$wiid.blur(function () {
                _this.clientwi.getWorkItem($wiid.val()).then(function (wi) {
                    console.log("Config:load step 10");
                    $errorSingleLineInput.parent().css("visibility", "hidden");
                    console.log("Config:load step 20");
                    _this.getSortedFieldsList2(wi).then(function (fieldList) {
                        Controls.create(Combos_1.Combo, $wipropertyname, _this.getComboOptions("wipropertyname", fieldList, $wipropertyname.val()));
                    });
                    console.log("Config:load step 25");
                    _this.getSortedFieldsList2(wi).then(function (fieldList) {
                        Controls.create(Combos_1.Combo, $wicolorpropertyname, _this.getComboOptions("colorpropertyname", fieldList, $wicolorpropertyname.val()));
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
            $errorSingleLineInput = $("#lineproperty .validation-error-text");
            _that.$wipropertyname.blur(function () {
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
            $errorSingleLineInput = $("#linecolor .validation-error-text");
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
            console.log("Config:load step 100");
            this.clientwi.getWorkItem($wiid.val()).then(function (wi) {
                console.log("Config:load step 110");
                _this.getSortedFieldsList2(wi).then(function (fieldList) {
                    Controls.create(Combos_1.Combo, $wipropertyname, _this.getComboOptions("wipropertyname", fieldList, $wipropertyname.val()));
                });
                _this.getSortedFieldsList2(wi).then(function (fieldList) {
                    Controls.create(Combos_1.Combo, $wicolorpropertyname, _this.getComboOptions("colorpropertyname", fieldList, $wicolorpropertyname.val()));
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
            var that = this;
            return {
                id: id,
                mode: "drop",
                source: fieldsList,
                enabled: true,
                value: that.getFieldName(initialField),
                change: function () {
                    var fieldName = this.getText();
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
            var result = { data: JSON.stringify({
                    wiId: $("#wiid").val(),
                    wiPropertyName: $("#wipropertyname").val(),
                    wiColorPropertyName: $("#wicolorpropertyname").val(),
                    color: $("#color").val(),
                    title: $("#title").val()
                }) };
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
            console.log("Config:onSave " + this.$wipropertyname.val());
            console.log("Config:onSave " + this.$wicolorpropertyname.val());
            console.log("Config:onSave " + $("#wipropertyname").val());
            var customSettings = this.getCustomSettings();
            return this.WidgetHelpers.WidgetConfigurationSave.Valid(customSettings);
        };
        return Configuration;
    }());
    exports.Configuration = Configuration;
    VSS.require(["TFS/Dashboards/WidgetHelpers"], function (WidgetHelpers) {
        WidgetHelpers.IncludeWidgetConfigurationStyles();
        VSS.register("widetailswidget-Configuration", function () {
            var configuration = new Configuration(WidgetHelpers);
            return configuration;
        });
        VSS.notifyLoadSucceeded();
    });
});

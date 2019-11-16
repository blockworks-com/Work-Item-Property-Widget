define(["TFS/Work/RestClient","TFS/WorkItemTracking/RestClient","TFS/WorkItemTracking/Contracts","VSS/Controls","VSS/Controls/Combos","q"],function(e,t,i,o,n,r){return function(e){function t(o){if(i[o])return i[o].exports;var n=i[o]={exports:{},id:o,loaded:!1};return e[o].call(n.exports,n,n.exports,t),n.loaded=!0,n.exports}var i={};return t.m=e,t.c=i,t.p="",t(0)}([function(e,t,i){var o,n;o=[i,t,i(11),i(9),i(10),i(4),i(6),i(5)],n=function(e,t,i,o,n,r,l,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=function(){function e(e){this.WidgetHelpers=e,this.widgetConfigurationContext=null,this.$wiid=$("#wiid"),this.$wipropertyname=$("#wipropertyname"),this.$wicolorpropertyname=$("#wicolorpropertyname"),this.$color=$("#color"),this.$title=$("#title"),this.client=r.getClient(),this.clientwi=s.getClient(),this.clickOnSave=!1}return e.prototype.load=function(e,t){var i=this,r=this,l=$("#wiid"),s=$("#wipropertyname"),a=$("#wicolorpropertyname"),p=$("#color"),d=$("#title");this.widgetConfigurationContext=t;var g=JSON.parse(e.customSettings.data);g&&g.wiId?l.val(g.wiId):l.val(""),g&&g.wiPropertyName?s.val(g.wiPropertyName):s.val(""),g&&g.wiColorPropertyName?a.val(g.wiColorPropertyName):a.val(""),g&&g.color?p.val(g.color):p.val(""),g&&g.title?d.val(g.title):d.val("");var c=$("#linewi .validation-error-text");return r.$wiid.blur(function(){i.clientwi.getWorkItem(l.val()).then(function(e){console.log("Config:load step 10"),c.parent().css("visibility","hidden"),console.log("Config:load step 20"),i.getSortedFieldsList2(e).then(function(e){o.create(n.Combo,s,i.getComboOptions("wipropertyname",e,s.val()))}),console.log("Config:load step 25"),i.getSortedFieldsList2(e).then(function(e){o.create(n.Combo,a,i.getComboOptions("colorpropertyname",e,s.val()))}),console.log("Config:load step 30"),r.widgetConfigurationContext.notify(r.WidgetHelpers.WidgetEvent.ConfigurationChange,r.WidgetHelpers.WidgetEvent.Args(r.getCustomSettings()))},function(e){if(e.status="404")return c.text("This Work item dosn't exist."),c.parent().css("visibility","visible"),$(".btn-cta").attr("disabled","disabled"),r.WidgetHelpers.WidgetStatusHelper.Failure()})}),c=$("#linetitle .validation-error-text"),r.$title.blur(function(){i.clientwi.getWorkItem(l.val()).then(function(e){c.parent().css("visibility","hidden"),r.widgetConfigurationContext.notify(r.WidgetHelpers.WidgetEvent.ConfigurationChange,r.WidgetHelpers.WidgetEvent.Args(r.getCustomSettings()))},function(e){if(e.status="404")return c.text("This Work item dosn't exist."),c.parent().css("visibility","visible"),$(".btn-cta").attr("disabled","disabled"),r.WidgetHelpers.WidgetStatusHelper.Failure()})}),c=$("#lineproperty .validation-error-text"),r.$wipropertyname.blur(function(){i.clientwi.getWorkItem(l.val()).then(function(e){c.parent().css("visibility","hidden"),r.widgetConfigurationContext.notify(r.WidgetHelpers.WidgetEvent.ConfigurationChange,r.WidgetHelpers.WidgetEvent.Args(r.getCustomSettings()))},function(e){if(e.status="404")return c.text("This Work item dosn't exist."),c.parent().css("visibility","visible"),$(".btn-cta").attr("disabled","disabled"),r.WidgetHelpers.WidgetStatusHelper.Failure()})}),c=$("#linecolor .validation-error-text"),r.$wicolorpropertyname.blur(function(){i.clientwi.getWorkItem(l.val()).then(function(e){c.parent().css("visibility","hidden"),r.widgetConfigurationContext.notify(r.WidgetHelpers.WidgetEvent.ConfigurationChange,r.WidgetHelpers.WidgetEvent.Args(r.getCustomSettings()))},function(e){if(e.status="404")return c.text("This Work item dosn't exist."),c.parent().css("visibility","visible"),$(".btn-cta").attr("disabled","disabled"),r.WidgetHelpers.WidgetStatusHelper.Failure()})}),console.log("Config:load step 100"),this.clientwi.getWorkItem(l.val()).then(function(e){console.log("Config:load step 110"),i.getSortedFieldsList2(e).then(function(e){o.create(n.Combo,s,i.getComboOptions("wipropertyname",e,s.val()))}),i.getSortedFieldsList2(e).then(function(e){o.create(n.Combo,a,i.getComboOptions("colorpropertyname",e,a.val()))})}),r.WidgetHelpers.WidgetStatusHelper.Success()},e.prototype.isValidWI=function(){console.log("Config:isValidWI step 10");var e=$.Deferred();return""!==$("#wiid").val()?this.clientwi.getWorkItem($("#wiid").val()).then(function(t){e.resolve(!0)},function(t){(t.status="404")&&e.resolve(!1)}):e.resolve(!1),e.promise()},e.prototype.getSortedFieldsList=function(){var e=this;console.log("Config:getSortedFieldList step 10");var t=i.defer(),o=s.getClient();return o.getFields().then(function(i){e._fields=i.filter(function(e){return e.type===l.FieldType.Double||e.type===l.FieldType.Integer});var o=e._fields.map(function(e){return e.name}).sort(function(e,t){return e>t?1:e<t?-1:0});t.resolve(o)}),t.promise},e.prototype.getSortedFieldsList2=function(e){var t=this;console.log("Config:getSortedFieldList2 step 10");var o=i.defer(),n=s.getClient();return n.getFields(e.project).then(function(e){t._fields=e.filter(function(e){return e.type===e.type});var i=t._fields.map(function(e){return e.referenceName}).sort(function(e,t){return e>t?1:e<t?-1:0});o.resolve(i)}),o.promise},e.prototype.getFieldName=function(e){var t=this._fields.filter(function(t){return t.referenceName===e});return t.length>0?t[0].name:null},e.prototype.getFieldReferenceName=function(e){var t=this._fields.filter(function(t){return t.name===e});return t.length>0?t[0].referenceName:null},e.prototype.getComboOptions=function(e,t,i){console.log("Config:getComboOptions step 10"),console.log("Config:getComboOptions step 11"),console.log("Config:getComboOptions initialField: "+i);var o=this;return console.log("Config:getComboOptions getFieldName(initialField): "+o.getFieldName(i)),{id:e,mode:"drop",source:t,enabled:!0,value:i,change:function(){var e=this.value,t=this.getSelectedIndex()<0?null:o.getFieldReferenceName(e);switch(this._id){case"colorpropertyname":console.log("Config:getComboOptions fieldName: "+e+"; refname: "+t),o.$wicolorpropertyname.val(e)}}}},e.prototype.getCustomSettings=function(){console.log("Config:onSave wipropertyname: "+this.$wipropertyname.val()+"; wicolorpropertyname: "+this.$wicolorpropertyname.val());var e={data:JSON.stringify({wiId:$("#wiid").val(),wiPropertyName:$("#wipropertyname").val(),wiColorPropertyName:$("#wicolorpropertyname").val(),color:$("#color").val(),title:$("#title").val()})};return e},e.prototype.onSave=function(){if(""===$("#wiid").val()){var e=$("#linewi .validation-error-text");return e.text("The Id is required"),e.parent().css("visibility","visible"),this.WidgetHelpers.WidgetConfigurationSave.Invalid()}if(""===$("#title").val(),""===$("#wipropertyname").val()){var e=$("#lineproperty .validation-error-text");return e.text("The Property Name is required"),e.parent().css("visibility","visible"),this.WidgetHelpers.WidgetConfigurationSave.Invalid()}""===$("#wicolorpropertyname").val(),""===$("#color").val(),console.log("Config:onSave wipropertyname: "+this.$wipropertyname.val()),console.log("Config:onSave wicolorpropertyname: "+this.$wicolorpropertyname.val()),console.log("Config:onSave wipropertyname: "+$("#wipropertyname").val());var t=this.getCustomSettings();return this.WidgetHelpers.WidgetConfigurationSave.Valid(t)},e}();t.Configuration=a,VSS.require(["TFS/Dashboards/WidgetHelpers"],function(e){e.IncludeWidgetConfigurationStyles(),VSS.register("widetailswidget-Configuration",function(){var t=new a(e);return t}),VSS.notifyLoadSucceeded()})}.apply(t,o),!(void 0!==n&&(e.exports=n))},,,,function(t,i){t.exports=e},function(e,i){e.exports=t},function(e,t){e.exports=i},,,function(e,t){e.exports=o},function(e,t){e.exports=n},function(e,t){e.exports=r}])});
define(["VSS/Authentication/Services"],function(e){return function(e){function t(o){if(n[o])return n[o].exports;var i=n[o]={exports:{},id:o,loaded:!1};return e[o].call(i.exports,i,i.exports,t),i.loaded=!0,i.exports}var n={};return t.m=e,t.c=n,t.p="",t(0)}({0:function(e,t,n){var o,i;o=[n,t,n(138),n(3),n(4)],i=function(e,t,n,o,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=function(){function e(){}return e.prototype.getDashboards=function(){var e=$.Deferred(),t=n.authTokenManager;return VSS.getAccessToken().then(function(n){var a=t.getAuthorizationHeader(n);$.ajaxSetup({headers:{Authorization:a}});var r=VSS.getWebContext().collection.uri;$.ajax({url:r+VSS.getWebContext().project.id+"/"+VSS.getWebContext().team.id+"/_apis/dashboard/dashboards",type:"GET",dataType:"json",data:"api-version=3.0-preview.2",success:function(t){e.resolve(t.dashboardEntries)},error:function(e){o.TelemetryClient.getClient(i.settings).trackException(e.response)}})}),e.promise()},e.prototype.getDashboard=function(e){var t=$.Deferred(),a=n.authTokenManager;return VSS.getAccessToken().then(function(n){var r=a.getAuthorizationHeader(n);$.ajaxSetup({headers:{Authorization:r}});var s=VSS.getWebContext().collection.uri;$.ajax({url:s+VSS.getWebContext().project.id+"/"+VSS.getWebContext().team.id+"/_apis/dashboard/dashboards/"+e,type:"GET",dataType:"json",data:"api-version=3.0-preview.2",success:function(e){t.resolve(e)},error:function(e){o.TelemetryClient.getClient(i.settings).trackException(e.response)}})}),t.promise()},e.prototype.addWidgetToDashboard=function(t,a){var r=$.Deferred(),s=n.authTokenManager;return VSS.getAccessToken().then(function(n){var c=s.getAuthorizationHeader(n);$.ajaxSetup({headers:{Authorization:c}});var d=new e;d.getDashboard(t).then(function(e){var n={name:"Work Item Property details",position:{row:0,column:0},size:{rowSpan:1,columnSpan:2},settings:'{"wiId":"'+a+'"}',settingsVersion:{major:1,minor:0,patch:0},dashboard:{eTag:""+e.eTag},contributionId:""+VSS.getExtensionContext().publisherId+"."+VSS.getExtensionContext().extensionId+".wipropertywidget"},s=JSON.stringify(n),c=VSS.getWebContext().collection.uri;$.ajax({url:c+VSS.getWebContext().project.id+"/"+VSS.getWebContext().team.id+"/_apis/dashboard/dashboards/"+t+"/widgets?api-version=3.0-preview.2",type:"POST",dataType:"json",contentType:"application/json; charset=utf-8",data:s,success:function(t){console.log("menu:addWidgetToDashboard: WI "+a+" is added to Dashboard "+e.name),r.resolve(t)},error:function(e){o.TelemetryClient.getClient(i.settings).trackException(e.response)}})})}),r.promise()},e}();t.WiMenu=a;var r=VSS.getExtensionContext().publisherId+"."+VSS.getExtensionContext().extensionId+".addToDashboard-work-item-menu";VSS.register(r,{getMenuItems:function(e){var t=e.ids||e.workItemIds;!t&&e.id&&(t=[e.id]);var n=!1;!t&&e.workItemId&&(t=[e.workItemId],n=!0);var r=[],s=new a;return s.getDashboards().then(function(e){return e.forEach(function(e){r.push({text:e.name,title:e.name,action:function(){o.TelemetryClient.getClient(i.settings).trackPageView("ContextMenuAddToDashboard"),t.forEach(function(t,n){s.addWidgetToDashboard(e.id,t).then(function(){})})}})}),[{text:"Add Property Widget to dashboard",title:"Add Property Widget to dashboard",icon:"static/images/adddashboard.png",childItems:r}]})}})}.apply(t,o),!(void 0!==i&&(e.exports=i))},2:function(e,t,n){var o,i;o=[n,t],i=function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=function(){function e(){}return e._createLazyMethod=function(t){var n=window[e.appInsightsName];n[t]=function(){var e=arguments;n.queue?n.queue.push(function(){return n[t].apply(n,e)}):n[t].apply(n,e)}},e._defineLazyMethods=function(){var t=window[e.appInsightsName];try{t.cookie=document.cookie}catch(e){}t.queue=[];for(var n=["clearAuthenticatedUserContext","flush","setAuthenticatedUserContext","startTrackEvent","startTrackPage","stopTrackEvent","stopTrackPage","trackDependency","trackEvent","trackException","trackMetric","trackPageView","trackTrace"];n.length;)e._createLazyMethod(n.pop())},e._download=function(t){e.appInsightsInstance.config=t;var n=window[e.appInsightsName];if(n.queue||(n.queue=[]),setTimeout(function(){var e=document.createElement("script");e.src=t.url||"https://az416426.vo.msecnd.net/scripts/a/ai.0.js",document.head.appendChild(e)}),!t.disableExceptionTracking){var o="onerror";e._createLazyMethod("_"+o);var i=window[o];window[o]=function(e,t,a,r,s){var c=i&&i(e,t,a,r,s);return c!==!0&&n["_"+o](e,t,a,r,s),c}}},Object.defineProperty(e,"appInsightsInstance",{get:function(){if("undefined"!=typeof window)return window[e.appInsightsName]||(window[e.appInsightsName]={downloadAndSetup:e._download,_defineLazyMethods:e._defineLazyMethods},e._defineLazyMethods()),window[e.appInsightsName]},enumerable:!0,configurable:!0}),e}();n.appInsightsInitialized=!1,n.appInsightsName="appInsights",t.AppInsights=n.appInsightsInstance}.apply(t,o),!(void 0!==i&&(e.exports=i))},3:function(e,t,n){var o,i;o=[n,t,n(2)],i=function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=function(){function e(){this.disableTelemetry="false",this.disableAjaxTracking="false",this.enableDebug="false"}return e}();t.TelemetryClientSettings=o;var i=function(){function e(){this.IsAvailable=!0}return e.getClient=function(t){return this._instance||(console.log("Creating new TelemetryClient!"),this._instance=new e,this._instance.Init(t)),this._instance},e.prototype.Init=function(e){console.log("TelemetryClient settings key: "+e.key.substring(0,8)+"************"),console.log("TelemetryClient settings extension context: "+e.extensioncontext),console.log("TelemetryClient settings disableTelemetry: "+("true"===e.disableTelemetry)),console.log("TelemetryClient settings disableAjaxTracking: "+("true"===e.disableAjaxTracking)),console.log("TelemetryClient settings enableDebug: "+("true"===e.enableDebug));var t={instrumentationKey:e.key,disableTelemetry:"true"===e.disableTelemetry,disableAjaxTracking:"true"===e.disableAjaxTracking,enableDebug:"true"===e.enableDebug};this.ExtensionContext=e.extensioncontext;try{var o=VSS.getWebContext();n.AppInsights.downloadAndSetup(t),n.AppInsights.setAuthenticatedUserContext(o.user.id,o.collection.id)}catch(e){console.log(e)}},e.prototype.trackPageView=function(e,t,o,i,a){try{n.AppInsights.trackPageView(this.ExtensionContext+"."+e,t,o,i,a),n.AppInsights.flush()}catch(e){console.log(e)}},e.prototype.trackEvent=function(e,t,o){try{console.log("Tracking event: "+this.ExtensionContext+"."+e),n.AppInsights.trackEvent(this.ExtensionContext+"."+e,t,o),n.AppInsights.flush()}catch(e){console.log(e)}},e.prototype.trackException=function(e,t,o,i){try{console.error(e);var a={name:this.ExtensionContext+"."+t,message:e};n.AppInsights.trackException(a,t,o,i),n.AppInsights.flush()}catch(e){console.log(e)}},e.prototype.trackMetric=function(e,t,o,i,a,r){try{n.AppInsights.trackMetric(this.ExtensionContext+"."+e,t,o,i,a,r),n.AppInsights.flush()}catch(e){console.log(e)}},e}();t.TelemetryClient=i}.apply(t,o),!(void 0!==i&&(e.exports=i))},4:function(e,t,n){var o,i;o=[n,t],i=function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.settings={key:"__INSTRUMENTATIONKEY__",extensioncontext:"WorkItemPropertyWidget",disableTelemetry:"true",disableAjaxTracking:"__disableAjaxTracking__",enableDebug:"__enableDebug__"}}.apply(t,o),!(void 0!==i&&(e.exports=i))},138:function(t,n){t.exports=e}})});
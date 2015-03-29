/// <reference path="Common/CommonHelper" />
/// <reference path="Common/Promise" />
/// <reference path="Common/AsyncHelper" />
/// <reference path="Common/Res" />
/// <reference path="Common/IFrameStore" />
/// <reference path="Common/RealEstateHelper.ts" />
/// <reference path="Common/KoBindings" />
/// <reference path="Common/ExternalResources" />
/// <reference path="Common/DataSynchronizer.ts" />
/// <reference path="Common/DefaultSuspender.ts" />
/// <reference path="Products/Product.ts" />
/// <reference path="Products/TicketsLogic.ts" />
/// <reference path="Products/IFrameRightSlider.ts" />
/// <reference path="External/JSON3.d.ts" />
/// <reference path="AppParams.ts" />
/// <reference path="Context/AppContext.ts" />
/// <reference path="Context/Paths.ts" />
/// <reference path="Common/LooseUserSettings.ts" />
/// <reference path="Logger/Logger.ts" />
var BD;
(function (BD) {
    var APP;
    (function (APP) {
        var BestDealApp = (function () {
            function BestDealApp() {
            }
            BestDealApp.prototype.init = function (params, domain) {
                var _this = this;
                var paths = new APP.Context.Paths(domain);
                var context = new APP.Context.AppContext(paths, params);
                var externalRoot = context.paths().outerResourcesRoot() + "/";
                var json3Promise = APP.Common.Res.injectScript(externalRoot + 'json3.js').then(function () { return window['JSON3'] = JSON3.noConflict(); });
                var knockoutPromise = APP.Common.Res.injectScript(externalRoot + 'knockout-3.2.0.js').then(function () {
                    APP.Common.KoBindings.registerCustomBindings();
                });
                var jqueryAndPluginsPromise = APP.Common.ExternalResources.getJQuery(externalRoot).then(function () {
                    return APP.Common.when(APP.Common.Res.injectScript(externalRoot + 'jquery.xdr.js'), APP.Common.Res.injectScript(externalRoot + 'jquery.dotdotdot.js'));
                });
                var libraryPromises = [json3Promise, knockoutPromise, jqueryAndPluginsPromise];
                APP.Common.typedWhen()(libraryPromises).done(function () { return _this.loadApplicationSettings(context); }).fail(function (err) { return APP.Logger.error("Shared: Library load failed: " + err.message); });
            };
            BestDealApp.prototype.loadApplicationSettings = function (appCotext) {
                var _this = this;
                APP.Logger.log("Libraries loaded. Loading application context");
                var iframeStore = new APP.Common.IFrameStore(appCotext.paths(), true);
                var freshGeneratedUUID = APP.Common.generateUUID();
                var userSettingsPromise = APP.Common.LooseUserSettings.fromAsyncStorePromise(iframeStore, freshGeneratedUUID);
                var suspenderPromise = userSettingsPromise.then(function (userSettings) { return new APP.Common.DefaultSuspender(userSettings); });
                var contextPromise = APP.Context.DomainContext.initializePromise(appCotext, userSettingsPromise, suspenderPromise, iframeStore, null);
                var contextAndProductPromises = {};
                contextAndProductPromises["CTX"] = contextPromise;
                APP.Common.namedWhen2(contextAndProductPromises).done(function (res) {
                    _this.continueWithContextAndProducts(res, freshGeneratedUUID);
                }).fail(function (err) {
                    APP.Logger.error("Shared: preload failed: " + err.message);
                    //SharedApp.injectAlt(bootstrapContext, "fail-init");
                });
            };
            BestDealApp.prototype.continueWithContextAndProducts = function (resources, freshGeneratedUUID) {
                APP.Logger.log("Continuing with Context and Products");
                var context = resources["CTX"];
                var now = new Date();
                var dailyTimestamp = now.getFullYear() + '' + now.getMonth() + '' + now.getDate();
                var userType = (context.userSettings().uuid() == freshGeneratedUUID) ? "generated" : "active";
                //Logger.Analytics.notify(context, Logger.Analytics.USER, {
                //    t: dailyTimestamp, usertype: userType, hid: context.userSettings().uuid(),
                //    partid: context.params().partnerCode, subid: context.params().subId
                // }, 1.0, false);
                var products = new APP.Products.Product("tickets", new APP.Products.TicketsLogic(), new APP.Products.IFrameRightSlider());
                this.loadProduct(context, products);
            };
            BestDealApp.prototype.loadProduct = function (context, product) {
                var _this = this;
                APP.Logger.info("initializing Product");
                var realestateSuspendId = APP.Products.VisualRealEstate[product.visual.realEstate()];
                var isSuspended = context.suspender().isSuspended(realestateSuspendId);
                var visualContext = new APP.Context.VisualContext(context, product.name, product.visual);
                if (isSuspended) {
                    APP.Logger.info("Realestate " + realestateSuspendId + " Is suspended. Product " + product.name + " will not be displayed");
                    // todo: a visual context??
                    // Logger.Analytics.notify(visualContext, Logger.Analytics.NO_SHOW, {'reason': 'suspended'}, 0);
                    return;
                }
                var sync = new APP.Common.DataSynchronizer();
                var dataPromise = this.obtainProductData(context, product, sync).fail(function (err) {
                    APP.Logger.error("Failed retrieving data for product " + product.name + ": " + err.message);
                });
                var visualResourcesPromise = APP.Common.namedWhen2(product.visual.declareResourcesPromise(visualContext)).fail(function (err) {
                    APP.Logger.error("Failed retrieving visual resources for product " + product.name + ": " + err.message);
                });
                return APP.Common.namedWhen2({ 'data': dataPromise, 'visres': visualResourcesPromise }).then(function (results) {
                    return _this.displayProduct(visualContext, product, results['data'], results['visres']);
                }).done(function () {
                    APP.Logger.log("Product " + product.name + " displayed");
                });
            };
            BestDealApp.prototype.obtainProductData = function (appContext, product, sync) {
                var logic = product.logic;
                var context = new APP.Context.LVContext(appContext, product.name, logic, product.visual);
                var neededItemCount = product.visual.determineNeededItemCount(context);
                return logic.scrapeAndObtainData(context, neededItemCount, sync).then(function (result) {
                    return result;
                });
            };
            BestDealApp.prototype.displayProduct = function (visualContext, product, data, visualResources) {
                var hasAnyResults = data.hasData();
                var drawPromise = null;
                if (!hasAnyResults) {
                    APP.Logger.log(product.name + " will halt. no results returned");
                    drawPromise = APP.Common.reject(new Error("zero_results"));
                }
                else {
                    APP.Logger.log("Initializing visual for product " + product.name);
                    try {
                        drawPromise = product.visual.draw(product, data, visualResources);
                    }
                    catch (e) {
                        APP.Logger.error("Failed drawing " + product.name + ": " + e.message);
                        drawPromise = APP.Common.reject(new Error("Draw Failue: " + (e && e.message)));
                    }
                }
                drawPromise.fail(function (err) {
                    APP.Logger.warn("Failed drawing " + visualContext.productName + ": " + err.message);
                    //  Logger.Analytics.notify(visualContext, Logger.Analytics.NO_SHOW, {'reason': err.message}, 0);
                    var realEstateString = APP.Products.VisualRealEstate[product.visual.realEstate()];
                    APP.Common.RealEstateHelper.releaseRealestate(realEstateString);
                });
                return drawPromise;
            };
            return BestDealApp;
        })();
        APP.BestDealApp = BestDealApp;
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));

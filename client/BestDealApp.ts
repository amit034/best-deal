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

module BD.APP {
    import Promise = Common.Promise;


    export class BestDealApp {

        init(params:AppParams, domain:string):void {


            var paths = new Context.Paths(domain);
            var context:Context.AppContext = new Context.AppContext(paths, params);
            var externalRoot = context.paths().outerResourcesRoot() + "/";
            var json3Promise = Common.Res.injectScript(externalRoot + 'json3.js').then(() => window['JSON3'] = JSON3.noConflict());

            var knockoutPromise = Common.Res.injectScript(externalRoot + 'knockout-3.2.0.js').then(() => {
                Common.KoBindings.registerCustomBindings();
            });

            var jqueryAndPluginsPromise = Common.ExternalResources.getJQuery(externalRoot).then(() => {
                return Common.when(
                    Common.Res.injectScript(externalRoot + 'jquery.xdr.js'),
                    Common.Res.injectScript(externalRoot + 'jquery.dotdotdot.js')
                );
            });
            var libraryPromises = [json3Promise, knockoutPromise, jqueryAndPluginsPromise];

            Common.typedWhen<any>(libraryPromises)
                .done(() => this.loadApplicationSettings(context))
                .fail(err => Logger.error("Shared: Library load failed: " + err.message));
        }
        loadApplicationSettings(appCotext:Context.AppContext):void {
            Logger.log("Libraries loaded. Loading application context");


            var iframeStore = new Common.IFrameStore(appCotext.paths(), true);

            var freshGeneratedUUID = Common.generateUUID();
            var userSettingsPromise = Common.LooseUserSettings.fromAsyncStorePromise(iframeStore, freshGeneratedUUID);
            var suspenderPromise = userSettingsPromise.then((userSettings) => new Common.DefaultSuspender(userSettings));

            var contextPromise = Context.DomainContext.initializePromise(appCotext, userSettingsPromise, suspenderPromise, iframeStore, null);

            var contextAndProductPromises:{[index:string]: Common.Promise<any>} = {};
            contextAndProductPromises["CTX"] = contextPromise;

            Common.namedWhen2(contextAndProductPromises)
                .done(res => {
                    this.continueWithContextAndProducts(res, freshGeneratedUUID)
                })
                .fail(err => {
                    Logger.error("Shared: preload failed: " + err.message);
                    //SharedApp.injectAlt(bootstrapContext, "fail-init");
                });
        }

        continueWithContextAndProducts(resources:{[index: string]: any}, freshGeneratedUUID:string) {
            Logger.log("Continuing with Context and Products");

            var context:Context.IAppContext = resources["CTX"];

            var now = new Date();
            var dailyTimestamp:string = now.getFullYear() + '' + now.getMonth() + '' + now.getDate();

            var userType = (context.userSettings().uuid() == freshGeneratedUUID) ? "generated" : "active";
            //Logger.Analytics.notify(context, Logger.Analytics.USER, {
            //    t: dailyTimestamp, usertype: userType, hid: context.userSettings().uuid(),
            //    partid: context.params().partnerCode, subid: context.params().subId
           // }, 1.0, false);


            var products:Products.Product = new Products.Product("tickets", new Products.TicketsLogic(), new Products.IFrameRightSlider());

            this.loadProduct(context, products);
        }







        loadProduct(context:Context.IAppContext, product:Products.Product) {


            Logger.info("initializing Product");

            var realestateSuspendId = Products.VisualRealEstate[product.visual.realEstate()];
            var isSuspended = context.suspender().isSuspended(realestateSuspendId);
            var visualContext = new Context.VisualContext(context, product.name, product.visual);
            if (isSuspended) {
                Logger.info("Realestate " + realestateSuspendId + " Is suspended. Product " + product.name + " will not be displayed");
                // todo: a visual context??
               // Logger.Analytics.notify(visualContext, Logger.Analytics.NO_SHOW, {'reason': 'suspended'}, 0);

                return;
            }

            var sync = new Common.DataSynchronizer();

                var dataPromise = this.obtainProductData(context, product, sync).fail(err => {
                    Logger.error("Failed retrieving data for product " + product.name + ": " + err.message);
                });

                var visualResourcesPromise = Common.namedWhen2(product.visual.declareResourcesPromise(visualContext)).fail(err => {
                    Logger.error("Failed retrieving visual resources for product " + product.name + ": " + err.message);
                });

                return Common.namedWhen2({'data': dataPromise, 'visres': visualResourcesPromise}).then(results => {
                    return this.displayProduct(visualContext, product, results['data'], results['visres']);
                }).done(() => {
                    Logger.log("Product " + product.name + " displayed");
                });


        }


        obtainProductData(appContext:Context.IAppContext, product:Products.Product, sync:Common.DataSynchronizer):Common.Promise<Data.DataResult> {


                var logic = product.logic;
                var context = new Context.LVContext(appContext, product.name, logic, product.visual);
                var neededItemCount = product.visual.determineNeededItemCount(context);

                return logic.scrapeAndObtainData(context, neededItemCount, sync).then(result => {

                    return result;
                });


        }

        displayProduct(visualContext:Context.VisualContext, product:Products.Product, data:Data.DataResult, visualResources:{[index:string]: string}):Common.Promise<any> {


            var hasAnyResults:boolean =  data.hasData();
            var drawPromise:Common.Promise<any> = null;

            if (!hasAnyResults) {
                Logger.log(product.name + " will halt. no results returned");
                drawPromise = Common.reject(new Error("zero_results"));
            }
            else {
                Logger.log("Initializing visual for product " + product.name);

                try {
                    drawPromise = product.visual.draw(product, data, visualResources);
                }
                catch (e) {
                    Logger.error("Failed drawing " + product.name + ": " + e.message);
                    drawPromise = Common.reject(new Error("Draw Failue: " + (e && e.message)))

                }
            }

            drawPromise.fail(err => {
                Logger.warn("Failed drawing " + visualContext.productName + ": " + err.message);
              //  Logger.Analytics.notify(visualContext, Logger.Analytics.NO_SHOW, {'reason': err.message}, 0);

                var realEstateString:string = Products.VisualRealEstate[product.visual.realEstate()];
                Common.RealEstateHelper.releaseRealestate(realEstateString);
            });

            return drawPromise;


        }



    }
}

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

            for (var key in params.products) {

                if (params.products.hasOwnProperty(key) && window['BD_SKIP_' + key]) {
                    Logger.info("Skip flag was set for product: [" + key + "]. It will be removed from the list of products.");
                    delete params.products[key];
                }
            }

            if (Common.Collection.getKeys(params.products).length == 0) {
                Logger.info("No products exist. Possibly they were all skipped due to FO_SKIP flag.");
                return;
            }
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

            for (var productName in appCotext.params().products) {
                var productDefs =appCotext.params().products[productName];
                for (var l = 0; l < productDefs.length; l++) {

                    var productPromise = Common.Res.loadProduct(appCotext.paths(), productName, productDefs[l].logic, productDefs[l].visual);
                    contextAndProductPromises["PRODUCT_" + productName] = productPromise;
                }

            }

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


            var products:Products.Product[] = [];
            for (var key in resources) {
                if (key.indexOf("PRODUCT") == 0) products.push(resources[key]);
            }

            this.selectProducts(context, products);
        }



        selectProducts(context:Context.IAppContext, products:Products.Product[]):void {

            var productNames = Common.Collection.select(products, (p) => p.name).join(",");
            Logger.log("loaded product code for " + productNames);

            // Round up classification promises from product logics
            var classificationPromises:{[index:string]: Common.Promise<Common.INamedValue<number>>} = {};
            for (var p = 0; p < products.length; p++) {

                var product = products[p];
                var visualContext = new Context.VisualContext(context, product.name, product.visual);

                // Check suspension by realestate (single visual and therefore single realestate per visual)
                var realestateSuspendId = Products.VisualRealEstate[product.visual.realEstate()];
                var isSuspended = context.suspender().isSuspended(realestateSuspendId);

                if (isSuspended) {
                    Logger.info("Realestate " + realestateSuspendId + " Is suspended. Product " + product.name + " will not be displayed");



                    continue;
                }

                for (var l = 0; l < product.logics.length; l++) {
                    var logic:Products.IProductLogic = product.logics[l];


                        var lvContext = new Context.LVContext(context, product.name, logic, product.visual);
                        classificationPromises[logic.flag()] = logic.classify(lvContext)
                            .logPassthrough("Logic classification score for " + logic.flag());


                }
            }

            // Join all logic classification promises.
            var framedLogicsPromise = Common.namedWhen2(classificationPromises).fail((err) => {
                Logger.error("Failed classification: " + err.message);
                //SharedApp.injectAlt(context, "fail-cls");
            });


            // Round up all products with positive classifying logics
            var framedProductsPromise = framedLogicsPromise.then((results:{[index:string]: Common.INamedValue<number>}) => {
                var logicQualifyingProducts:{product: Products.Product; score:number}[] = [];

                for (var p = 0; p < products.length; p++) {
                    var product= products[p];
                    var visualContext = new Context.VisualContext(context, product.name, product.visual);

                    // Check suspension by realestate (single visual and therefore single realestate per visual)
                    var realestateSuspendId = Products.VisualRealEstate[product.visual.realEstate()];
                    var isSuspended = context.suspender().isSuspended(realestateSuspendId);
                    if (isSuspended) continue;

                    var highestScoringLogic = null;
                    var topLogicScore = 0;
                    var topScoreReason:string = null;
                    var validLogics:Products.IProductLogic[] = [];

                    for (var l = 0; l < product.logics.length; l++) {
                        var logic = product.logics[l];
                        var logicResult = results[logic.flag()];

                        if (logicResult) {
                            var logicScore = logicResult.value;
                            var scoreReason = logicResult.name;

                            if (logicScore > 0) {
                                validLogics.push(logic);

                            }

                            if (topScoreReason == null || logicScore > topLogicScore) {
                                topLogicScore = logicScore;
                                highestScoringLogic = logic;
                                topScoreReason = scoreReason;
                            }
                        }
                        else {
                            Logger.log("Skipping logic " + logic.flag() + ". Did not reach classification");
                        }
                    }

                    if (topLogicScore <= 0) {

                        Logger.log("Skipping product " + product.name + ". Top logic classification returned " + topLogicScore + " with reason " + topScoreReason);
                        //Logger.Analytics.notify(visualContext, Logger.Analytics.NO_SHOW, {'reason': topScoreReason}, 0);
                    }
                    else {
                        // IMPORTANT: only keep the qualifying logics in the product.
                        product.logics = validLogics;
                        logicQualifyingProducts.push({product: product, score: topLogicScore});
                    }
                }

                return logicQualifyingProducts;
            });


            // Select products based on classification scores and clashing realestate
            var selectedProductsPromise = framedProductsPromise.then((productScores) => Common.RealEstateHelper.resolveProductsByRealEstate(context, productScores))
                .fail((err) => {
                    Logger.error("Failed realestate resolution: " + err.message);
                });


            selectedProductsPromise.then((selectedproducts:Products.Product[]) => {
                // We set selected products so that they can be removed on refresh-less url change
               // this.selectedProducts = selectedproducts;

                if (selectedproducts.length == 0) {
                    Logger.info("FO complete: no products selected.");
                }
                else {
                    this.loadProducts(context,selectedproducts);
                }
            }).fail((err:Common.Rejection) => {
                Logger.error("Failed selected product initialization: " + err.message);
            });
        }

        loadProducts(context:Context.IAppContext, products:Products.Product[]) {


            var productNames = Common.Collection.select(products, (p) => p.name).join();
            Logger.info("initializing products " + productNames);



            var sync = new Common.DataSynchronizer();
            var displayProductsPromises = Common.Collection.select(products, (product) => {
                var visualContext = new Context.VisualContext(context, product.name, product.visual);
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
            });

            Common.typedWhen(displayProductsPromises).always(() => {
                Logger.info("BD complete: " + productNames);
                Logger.timeEnd("BD end to end");
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

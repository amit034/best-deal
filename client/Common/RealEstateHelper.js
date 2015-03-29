/// <reference path="../Products/IProductVisual"/>
/// <reference path="CommonHelper"/>
/// <reference path="GlobalSpace"/>
/// <reference path="Collection.ts"/>
var BD;
(function (BD) {
    var APP;
    (function (APP) {
        var Common;
        (function (Common) {
            var RealEstateHelper = (function () {
                function RealEstateHelper() {
                }
                RealEstateHelper.resolveProductsByRealEstate = function (context, productScores) {
                    var selectedProducts = [];
                    var groups = Common.Collection.groupByString(productScores, function (x) { return APP.Products.VisualRealEstate[x.product.visual.realEstate()]; });
                    for (var key in groups) {
                        var group = groups[key];
                        var selectedProduct = Common.Collection.maxBy(group, function (x) { return x.score; });
                        selectedProducts.push(selectedProduct.product);
                    }
                    // Eliminate any products requiring real estate already taken up by brother apps
                    // Real estate is registered in the global store
                    var reStore = new Common.GlobalSpace("RealEstate");
                    var validProducts = [];
                    for (var i = 0; i < selectedProducts.length; i++) {
                        var product = selectedProducts[i];
                        var realEstateString = APP.Products.VisualRealEstate[product.visual.realEstate()];
                        var isTaken = RealEstateHelper.isTaken(reStore, realEstateString);
                        if (isTaken) {
                            APP.Logger.info("Product " + product.name + " skipped. Its realestate " + realEstateString + " is occupied");
                        }
                        else {
                            RealEstateHelper.claimRealestate(reStore, realEstateString, product.name);
                            reStore.store(realEstateString, product.name);
                            validProducts.push(product);
                        }
                    }
                    return validProducts;
                };
                RealEstateHelper.isTaken = function (reStore, realEstateString) {
                    var newTaken = !!reStore.retrive(realEstateString);
                    if (newTaken)
                        return true;
                    var oldTakenMarker = RealEstateHelper.realEstateToOldMarker(realEstateString);
                    if (oldTakenMarker) {
                        var oldTaken = !!(window[oldTakenMarker]);
                        if (oldTaken)
                            return true;
                    }
                    return false;
                };
                RealEstateHelper.claimRealestate = function (reStore, realEstateString, productName) {
                    reStore.store(realEstateString, productName);
                    var oldTakenMarker = RealEstateHelper.realEstateToOldMarker(realEstateString);
                    if (oldTakenMarker) {
                        window[oldTakenMarker] = true;
                    }
                };
                RealEstateHelper.releaseRealestate = function (realEstateString) {
                    var reStore = new Common.GlobalSpace("RealEstate"); //todo: move to constant
                    reStore.remove(realEstateString);
                    var oldTakenMarker = RealEstateHelper.realEstateToOldMarker(realEstateString);
                    if (oldTakenMarker) {
                        window[oldTakenMarker] = false;
                    }
                    APP.Logger.log("Released realestate " + realEstateString);
                };
                RealEstateHelper.realEstateToOldMarker = function (realEstateString) {
                    var translation = {
                        RIGHT_PANEL: '__rsor',
                        BOTTOM_PANEL: '__bsor'
                    };
                    return translation[realEstateString];
                };
                return RealEstateHelper;
            })();
            Common.RealEstateHelper = RealEstateHelper;
        })(Common = APP.Common || (APP.Common = {}));
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));

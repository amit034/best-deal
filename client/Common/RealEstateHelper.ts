/// <reference path="../Products/IProductVisual"/>
/// <reference path="CommonHelper"/>
/// <reference path="GlobalSpace"/>
/// <reference path="Collection.ts"/>
module BD.APP.Common {

    export class RealEstateHelper {

        static resolveProductsByRealEstate(context:Context.IAppContext, productScores: {product: Products.Product; score: number}[]):Products.Product[] {

            var selectedProducts:Products.Product[] = [];
            var groups = Collection.groupByString(productScores, x => Products.VisualRealEstate[x.product.visual.realEstate()]);

            for (var key in groups) {
                var group:{product: Products.Product; score: number}[] = groups[key];

                var selectedProduct = Collection.maxBy(group, x => x.score);
                selectedProducts.push(selectedProduct.product);
            }


            // Eliminate any products requiring real estate already taken up by brother apps
            // Real estate is registered in the global store
            var reStore:IStore = new GlobalSpace("RealEstate");
            var validProducts:Products.Product[] = [];

            for (var i = 0; i < selectedProducts.length; i++) {
                var product = selectedProducts[i];

                var realEstateString = Products.VisualRealEstate[product.visual.realEstate()];
                var isTaken:boolean = RealEstateHelper.isTaken(reStore, realEstateString);

                if (isTaken) {
                    Logger.info("Product " + product.name + " skipped. Its realestate " +  realEstateString + " is occupied");
                //    Logger.Analytics.notify(context, Logger.Analytics.NO_SHOW, { 'reason': 'realestate_taken', 'w': product.visual.flag() }, 0);
                }
                else {
                    RealEstateHelper.claimRealestate(reStore, realEstateString, product.name);

                    reStore.store(realEstateString, product.name);
                    validProducts.push(product);
                }
            }

            return validProducts;
        }

        static isTaken(reStore:IStore, realEstateString:string):boolean {

            var newTaken = !!reStore.retrive(realEstateString);
            if (newTaken) return true;

            var oldTakenMarker = RealEstateHelper.realEstateToOldMarker(realEstateString);
            if (oldTakenMarker) {
                var oldTaken = !!(window[oldTakenMarker]);
                if (oldTaken) return true;
            }

            return false;
        }

        private static claimRealestate(reStore:IStore, realEstateString:string, productName:string):void {

            reStore.store(realEstateString, productName);

            var oldTakenMarker = RealEstateHelper.realEstateToOldMarker(realEstateString);
            if (oldTakenMarker) {
                window[oldTakenMarker] = true;
            }
        }

        static releaseRealestate(realEstateString:string):void {

            var reStore:IStore = new GlobalSpace("RealEstate"); //todo: move to constant
            reStore.remove(realEstateString);

            var oldTakenMarker = RealEstateHelper.realEstateToOldMarker(realEstateString);
            if (oldTakenMarker) {
                window[oldTakenMarker] = false;
            }

            Logger.log("Released realestate " + realEstateString);
        }

        private static realEstateToOldMarker(realEstateString:string):string {

            var translation = {
                RIGHT_PANEL: '__rsor',
                BOTTOM_PANEL: '__bsor'
            };

            return translation[realEstateString];
        }

    }
}

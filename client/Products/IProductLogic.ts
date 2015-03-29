/// <reference path="../Context/LVContext"/>
/// <reference path="../Common/Promise"/>
/// <reference path="../Data/DataResult"/>
/// <reference path="../Common/DataSynchronizer.ts"/>



module BD.APP.Products {

    export interface IProductLogic {

        supportsStickyClassification():boolean;

        dataKey():string;
        flag():string;

        /**
         * Classifies the relevancy of the Product to the current page. Values between -1 and 1.
         * @param context - current context.
         * @param scraper - scraper component with which to access page contents.
         */
        classify(context:Context.IAppContext):Common.Promise<Common.INamedValue<number>>;

        scrapeAndObtainData(context:Context.LVContext, count:number, sync:Common.DataSynchronizer): Common.Promise<Data.DataResult>;
    }
}

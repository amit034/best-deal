/// <reference path="../Context/LVContext"/>
/// <reference path="../Context/VisualContext"/>
/// <reference path="../Common/Promise"/>
/// <reference path="../Data/DataResult"/>
/// <reference path="Product"/>


module BD.APP.Products {


    export interface IProductVisual {
        realEstate():VisualRealEstate;

        flag():string;

        determineNeededItemCount(context:Context.VisualContext): number;

        declareResourcesPromise(context:Context.VisualContext):{[index:string]: Common.Promise<any>};
        draw(product:Product, result:Data.DataResultSet, resources:{[index:string]: string}):Common.Promise<any>;


    }



    export enum VisualRealEstate {
        LEFT_PANEL,
        RIGHT_PANEL,
        TOP_PANEL,
        BOTTOM_PANEL,
        MAIN_TABLE,
        MAIN_IMAGE,
        IMAGE_RIGHT,
        IMAGE_INNER,
        APPNEXUS_SPECIAL,
        BANNER_SQUERE,
        SEARCH_BAR

    }
}

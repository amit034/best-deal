/// <reference path="IProductVisual.ts"/>
/// <reference path="IProductLogic.ts"/>


module BD.APP.Products {

    export class Product {
        name:string;

        visual:IProductVisual;

        logic:IProductLogic = null;

        constructor(productName: string, logic: IProductLogic, visual: IProductVisual) {
            this.name = productName;
            this.logic = logic;
            this.visual = visual;
        }



        /**
         * Classifies the relevancy of the Product to the current page. Values between -1 and 1.
         * @param context - current context.
         * @param scraper - scraper component with which to access page contents.
         */
        classify(context:Context.IAppContext):Common.Promise<Common.INamedValue<number>> {
            return this.logic.classify(context);
        }

    }
}

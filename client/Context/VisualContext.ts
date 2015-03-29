/// <reference path="DomainContext"/>

module BD.APP.Context {


    export class VisualContext extends DomainContext {

        productName:string;
        visual: { flag():string };


        constructor(appContext:IAppContext, productName:string, visual: { flag():string }) {
            super(appContext, appContext.userSettings(), appContext.suspender(), appContext.iframe(), appContext.fnWindow());
            this.productName = productName;
            this.visual = visual;

        }

    }

}

/// <reference path="VisualContext"/>

module BD.APP.Context {


    export class LVContext extends VisualContext {

        private _logic:{ flag():string };

        logic():{ flag():string } {
            return this._logic;
        }

        constructor(appContext:IAppContext, productName:string, logic: { flag():string }, visual: { flag():string }) {
            super(appContext, productName, visual);
            this._logic = logic;
        }

        notificationParams():{[index:string]: string} {
            var contextParams = super.notificationParams();
            contextParams['pr'] = this.logic().flag();
            return contextParams;
        }

    }

}

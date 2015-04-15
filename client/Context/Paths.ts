/// <reference path="IPaths.ts"/>

module BD.APP.Context {

    export class Paths implements IPaths {

        constructor(domain:string) {
            this._domain = domain;
        }

        private _domain:string = null;

        domain() {
            return this._domain;
        }

        iframeStoreSrc():string {
            return (this.staticContentRoot() + "/Store.html");
        }


        outerResourcesRoot():string {
            return "//" + this._domain + "/External";
        }


        apiRoot():string {
            return "//"  + this._domain + "";
        }

        notifyRoot():string{
            return "//"  + this._domain + "/notify";
        }

        staticContentRoot():string {
            return "//mirai-client-assets.s3.amazonaws.com/public";
        }

        getProductQualifiedName(productComponentName:string){
            return "BD.APP.Products." + productComponentName;
        }

    }
}
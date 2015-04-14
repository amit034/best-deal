module BD.APP.Context {

    export interface IPaths {

        domain():string;

        outerResourcesRoot():string;

        apiRoot():string;

        staticContentRoot():string;

        iframeStoreSrc():string;

        notifyRoot():string;

        getProductQualifiedName(productComponentName:string);
    }
}
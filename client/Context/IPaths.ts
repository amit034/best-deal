module BD.APP.Context {

    export interface IPaths {

        domain():string;

        outerResourcesRoot():string;

        apiRoot():string;

        staticContentRoot():string;

        iframeStoreSrc():string;

        getProductQualifiedName(productComponentName:string);
    }
}
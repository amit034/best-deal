/// <reference path="../Common/HtmlHelper.ts"/>
/// <reference path="../Common/NativeJSHelper.ts"/>
/// <reference path="../Common/Promise.ts"/>
/// <reference path="../Common/Collection.ts"/>
module BD.APP.Common {

    export interface ISimplyConstructed {
        new(): any;
    }
    export class Res {

        // ResourcePromiseHelpers
        static bring(url:string):Promise<any> {
            return jqGetPromise(url);
        }

        static loadProduct(paths:Context.IPaths, productName:string, productLogics:string[], productVisual:string):Promise<Products.Product> {
            // Forcing casting by first casting to 'any' - never do this!!
            var visual = <Products.IProductVisual> <any> Res.instantiateFromQualifiedName(paths.getProductQualifiedName(productVisual));
            var logics = <Products.IProductLogic[]> <any> Collection.select(productLogics, (productLogic, i) => Res.instantiateFromQualifiedName(paths.getProductQualifiedName(productLogic)));

            var product = new Products.Product(productName, logics, visual);
            return resolve(product);
        }

        static injectCss(url:string, doc:HTMLDocument = document):Promise<any> {

            if (doc.createStyleSheet) {
                doc.createStyleSheet(url);
            }
            else {
                var cssElement = $('<link rel="stylesheet" type="text/css" href="' + url + '" />');
                HtmlHelper.appendToHead(cssElement, doc);
            }

            return resolve(null);
        }


        static injectScript(url:string):Promise<any> {
            return NativeJSHelper.injectScriptPromise(url);
        }

        static instantiateFromQualifiedName<T extends ISimplyConstructed>(qualifiedName:string):T {

            var hirearchy = qualifiedName.split(".");
            var cursor:any = window;

            for (var i = 0; i < hirearchy.length; i++) {
                if (!(hirearchy[i] in cursor)) {

                    throw Error("Cannot instantiate from qualified name. " + hirearchy[i] + " not found for path " + qualifiedName);
                }

                cursor = cursor[hirearchy[i]];
            }

            return new cursor;
        }
    }

}

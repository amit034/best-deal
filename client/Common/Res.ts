/// <reference path="../Common/HtmlHelper.ts"/>
/// <reference path="../Common/NativeJSHelper.ts"/>
/// <reference path="../Common/Promise.ts"/>

module BD.APP.Common {

    export interface ISimplyConstructed {
        new(): any;
    }
    export class Res {

        // ResourcePromiseHelpers
        static bring(url:string):Promise<any> {
            return jqGetPromise(url);
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
            return NativeJSHelper.injectScriptPromise(url, 2);
        }
    }

}

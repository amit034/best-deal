/// <reference path="Promise"/>

/// <reference path="../Bootstrap/Injector.ts"/>
module BD.APP.Common {

    interface ILoader {
        onload: (ev: Event) => any;
        onreadystatechange?: (ev: Event) => any;

        readyState?: any;

        onerror: (ev: Event) => any;
        ontimeout?: (ev: Event) => any;
    }
	
	import Injector = BD.APP.Bootstrap.Injector;
	
    export class NativeJSHelper {

		

        static injectScriptPromise(url:string):Promise<any> {

            var d = defer();
            Injector.injectScript(url,
                () => d.resolve(null),
                (e:ErrorEvent) => d.reject({message: "Failed script load " + url + ": " + (e && e.message)}));

            return d.promise();
        }



        private static promiseFromLoader<T extends ILoader>(loader: T, name:string):Promise<T> {
            var d = defer<T>();
            var done = false;

            loader.onload = loader.onreadystatechange = (e) => {
                if (!done && (!loader.readyState || loader.readyState == 4 || loader.readyState === "loaded" || loader.readyState === "complete") ) {
                    done = true;
                    d.resolve(loader);
                }
            };

            loader.onerror =  (e:ErrorEvent) => {
                done = true;
                d.reject({message: 'unknown load error'});
            };

            loader.ontimeout = (e:ErrorEvent) => {
                done = true;
                d.reject({message: 'timeout error'});
            };

            return d.promise();
        }



        static nativeAjax(url:string):Promise<string> {

            var promise:Promise<any> = null;

            if ("XDomainRequest" in window) {
                var xdr = new XDomainRequest();
                xdr.open("get", url);

                promise = NativeJSHelper.promiseFromLoader(xdr, url);
                xdr.send();
            }
            else {
                var xhr = new XMLHttpRequest();
                xhr.open("get", url, true);

                promise = NativeJSHelper.promiseFromLoader(xhr, url);
                xhr.send();
            }

            return promise.then((xr) => {
                if (xr.status == 200) {
                    return xr.responseText;
                }
                else {
                    throw Error(xr.statusText);
                }
            });


        }






    }
}

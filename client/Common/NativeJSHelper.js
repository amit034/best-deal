/// <reference path="Promise"/>
/// <reference path="../Bootstrap/Injector.ts"/>
var BD;
(function (BD) {
    var APP;
    (function (APP) {
        var Common;
        (function (Common) {
            var NativeJSHelper = (function () {
                function NativeJSHelper() {
                }
                NativeJSHelper.injectScriptPromise = function (url) {
                    var d = Common.defer();
                    Injector.injectScript(url, function () { return d.resolve(null); }, function (e) { return d.reject({ message: "Failed script load " + url + ": " + (e && e.message) }); });
                    return d.promise();
                };
                NativeJSHelper.promiseFromLoader = function (loader, name) {
                    var d = Common.defer();
                    var done = false;
                    loader.onload = loader.onreadystatechange = function (e) {
                        if (!done && (!loader.readyState || loader.readyState == 4 || loader.readyState === "loaded" || loader.readyState === "complete")) {
                            done = true;
                            d.resolve(loader);
                        }
                    };
                    loader.onerror = function (e) {
                        done = true;
                        d.reject({ message: 'unknown load error' });
                    };
                    loader.ontimeout = function (e) {
                        done = true;
                        d.reject({ message: 'timeout error' });
                    };
                    return d.promise();
                };
                NativeJSHelper.nativeAjax = function (url) {
                    var promise = null;
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
                    return promise.then(function (xr) {
                        if (xr.status == 200) {
                            return xr.responseText;
                        }
                        else {
                            throw Error(xr.statusText);
                        }
                    });
                };
                return NativeJSHelper;
            })();
            Common.NativeJSHelper = NativeJSHelper;
        })(Common = APP.Common || (APP.Common = {}));
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));

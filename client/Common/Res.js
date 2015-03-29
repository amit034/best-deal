/// <reference path="../Common/HtmlHelper.ts"/>
/// <reference path="../Common/NativeJSHelper.ts"/>
/// <reference path="../Common/Promise.ts"/>
var BD;
(function (BD) {
    var APP;
    (function (APP) {
        var Common;
        (function (Common) {
            var Res = (function () {
                function Res() {
                }
                // ResourcePromiseHelpers
                Res.bring = function (url) {
                    return Common.jqGetPromise(url);
                };
                Res.injectCss = function (url, doc) {
                    if (doc === void 0) { doc = document; }
                    if (doc.createStyleSheet) {
                        doc.createStyleSheet(url);
                    }
                    else {
                        var cssElement = BD.$('<link rel="stylesheet" type="text/css" href="' + url + '" />');
                        Common.HtmlHelper.appendToHead(cssElement, doc);
                    }
                    return Common.resolve(null);
                };
                Res.injectScript = function (url) {
                    return Common.NativeJSHelper.injectScriptPromise(url, 2);
                };
                return Res;
            })();
            Common.Res = Res;
        })(Common = APP.Common || (APP.Common = {}));
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));

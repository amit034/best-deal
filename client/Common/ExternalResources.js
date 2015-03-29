/// <reference path="Res" />
/// <reference path="NativeJSHelper" />
/// <reference path="Promise" />
/// <reference path="CommonHelper" />
var BD;
(function (BD) {
    var APP;
    (function (APP) {
        var Common;
        (function (Common) {
            var ExternalResources = (function () {
                function ExternalResources() {
                }
                ExternalResources.getJQuery = function (altExternalRoot) {
                    return ExternalResources.patchExternalOrFallback("//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js", -2041667497, ExternalResources.patchJQuery, altExternalRoot + 'jquery-1.11.1.js', ExternalResources.verifyJQuery).then(function () { return window['FO'].$ = window['$'].noConflict(true); });
                };
                ExternalResources.patchJQuery = function (original) {
                    var toRemove = ',"function"==typeof define&&define.amd&&define("jquery",[],function(){return m})';
                    var patched = original.replace(toRemove, '');
                    if (patched.length != original.length - toRemove.length)
                        throw new Error("Replace didnt take effect");
                    return patched;
                };
                ExternalResources.verifyJQuery = function () {
                    return window['$'].fn.jquery === "1.11.1";
                };
                ExternalResources.getKnockout = function (altExternalRoot) {
                    return ExternalResources.patchExternalOrFallback("//cdnjs.cloudflare.com/ajax/libs/knockout/3.2.0/knockout-min.js", 1918310268, ExternalResources.patchKnockout, altExternalRoot + 'knockout-3.2.0.js', ExternalResources.verifyKnockout);
                };
                ExternalResources.patchKnockout = function (original) {
                    var toRemove = '"function"===typeof require&&"object"===typeof exports&&"object"===typeof module?p(module.exports||exports,require):"function"===typeof define&&define.amd?define(["exports","require"],p):p(s';
                    var replacement = 'p(s["FO"]';
                    var patched = original.replace(toRemove, replacement);
                    if (patched.length != original.length - toRemove.length + replacement.length)
                        throw new Error("Replace didnt take effect");
                    return patched;
                };
                ExternalResources.verifyKnockout = function () {
                    return BD['ko']['version'] == "3.2.0";
                };
                ExternalResources.patchExternalOrFallback = function (externalUrl, verificationHash, patch, altUrl, verification) {
                    if (verification === void 0) { verification = function () { return true; }; }
                    return ExternalResources.loadAndPatchExternal(externalUrl, verificationHash, patch).then(function () {
                        if (!verification())
                            throw new Error("External patch failed verification");
                    }).alwaysThen(function (value, err) {
                        if (err) {
                            APP.Logger.warn("Failed external patching on " + externalUrl + ": " + err.message);
                        }
                        return Common.resolve(null);
                    });
                };
                ExternalResources.loadAndPatchExternal = function (externalUrl, verificationHash, patch) {
                    return Common.NativeJSHelper.nativeAjax(externalUrl).then(function (original) {
                        var originalHash = Common.stringHash(original);
                        if (originalHash != verificationHash)
                            throw new Error("Original didnt match verification hash");
                        var patched = patch(original);
                        eval(patched);
                    });
                };
                return ExternalResources;
            })();
            Common.ExternalResources = ExternalResources;
        })(Common = APP.Common || (APP.Common = {}));
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));

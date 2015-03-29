/// <reference path="IPaths.ts"/>
var BD;
(function (BD) {
    var APP;
    (function (APP) {
        var Context;
        (function (Context) {
            var Paths = (function () {
                function Paths(domain) {
                    this._domain = null;
                    this._domain = domain;
                }
                Paths.prototype.domain = function () {
                    return this._domain;
                };
                Paths.prototype.iframeStoreSrc = function () {
                    return (this.staticContentRoot() + "/Store.html");
                };
                Paths.prototype.outerResourcesRoot = function () {
                    return "//" +this._domain + "/External";
                };
                Paths.prototype.apiRoot = function () {
                    return "//" +this._domain + "//app";
                };
                Paths.prototype.staticContentRoot = function () {
                    return "//" +this._domain + "";
                };
                return Paths;
            })();
            Context.Paths = Paths;
        })(Context = APP.Context || (APP.Context = {}));
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));

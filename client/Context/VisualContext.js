/// <reference path="DomainContext"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var BD;
(function (BD) {
    var APP;
    (function (APP) {
        var Context;
        (function (Context) {
            var VisualContext = (function (_super) {
                __extends(VisualContext, _super);
                function VisualContext(appContext, productName, visual) {
                    _super.call(this, appContext, appContext.userSettings(), appContext.suspender(), appContext.iframe(), appContext.fnWindow());
                    this.productName = productName;
                    this.visual = visual;
                }
                return VisualContext;
            })(Context.DomainContext);
            Context.VisualContext = VisualContext;
        })(Context = APP.Context || (APP.Context = {}));
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));

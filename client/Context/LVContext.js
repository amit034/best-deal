/// <reference path="VisualContext"/>
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
            var LVContext = (function (_super) {
                __extends(LVContext, _super);
                function LVContext(appContext, productName, logic, visual) {
                    _super.call(this, appContext, productName, visual);
                    this._logic = logic;
                }
                LVContext.prototype.logic = function () {
                    return this._logic;
                };
                return LVContext;
            })(Context.VisualContext);
            Context.LVContext = LVContext;
        })(Context = APP.Context || (APP.Context = {}));
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));

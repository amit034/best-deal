var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="AppContext"/>
/// <reference path="IAppContext"/>
/// <reference path="IBaseContext.ts"/>
/// <reference path="../External/JSON3" />
/// <reference path="../Common/IUserStore" />
/// <reference path="../Common/ISuspender" />
/// <reference path="../Common/IPageScraper" />
/// <reference path="../Common/IFrameStore.ts" />
/// <reference path="../Common/DefaultPageScraper.ts" />
var BD;
(function (BD) {
    var APP;
    (function (APP) {
        var Context;
        (function (Context) {
            var DomainContext = (function (_super) {
                __extends(DomainContext, _super);
                function DomainContext(baseContext, userSettings, suspender, iframe, fnWindow) {
                    _super.call(this, baseContext.paths(), baseContext.params());
                    this._userSettings = userSettings;
                    this._suspender = suspender;
                    this._iframe = iframe;
                    this._scraper = new APP.Common.DefaultPageScraper();
                    this._fnWindow = window;
                }
                DomainContext.prototype.userSettings = function () {
                    return this._userSettings;
                };
                DomainContext.prototype.suspender = function () {
                    return this._suspender;
                };
                DomainContext.prototype.scraper = function () {
                    return this._scraper;
                };
                DomainContext.prototype.iframe = function () {
                    return this._iframe;
                };
                DomainContext.prototype.fnWindow = function () {
                    return this._fnWindow;
                };
                DomainContext.initializePromise = function (baseContext, userSettingsPromise, suspenderPromise, iframe, fnWindow) {
                    return APP.Common.namedWhen2({ 'US': userSettingsPromise, 'SU': suspenderPromise }).then(function (res) {
                        var userSettings = res['US'];
                        var suspender = res['SU'];
                        return new DomainContext(baseContext, userSettings, suspender, iframe, fnWindow);
                    });
                };
                return DomainContext;
            })(Context.AppContext);
            Context.DomainContext = DomainContext;
        })(Context = APP.Context || (APP.Context = {}));
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));

/// <reference path="ProductModelBase.ts" />
/// <reference path="../External/knockout.d.ts" />
/// <reference path="HoverTarget.ts"/>
/// <reference path="../Common/Collection.ts"/>
var BD;
(function (BD) {
    var APP;
    (function (APP) {
        var Model;
        (function (Model) {
            var GenericOffersModel = (function () {
                function GenericOffersModel(context, offers) {
                    this.offers = [];
                    var offerModels = APP.Common.Collection.select(offers, function (o) { return new GenericOfferModel(context, o); });
                    this.offers = offerModels;
                    this.context = context;
                }
                return GenericOffersModel;
            })();
            Model.GenericOffersModel = GenericOffersModel;
            var GenericOfferModel = (function () {
                function GenericOfferModel(context, offer) {
                    this.offer = null;
                    this.url = null;
                    this.clickNotified = false;
                    //(duration) => Logger.Analytics.notify(this.context, Logger.Analytics.HOVER, {'time': duration + '' })
                    this.hoverTarget = new Model.HoverTarget(4000, 60000, function (duration) {
                    });
                    this.context = context;
                    this.offer = offer;
                    this.url = offer.url;
                }
                GenericOfferModel.prototype.windowOpen = function (url, target) {
                    var fnIframe = BD.$('<iframe width="0" height="0" style="display: none"></iframe>')[0];
                    document.body.appendChild(fnIframe);
                    var win = fnIframe.contentWindow.open.apply(window, [url, target]);
                    document.body.removeChild(fnIframe);
                    return win;
                };
                GenericOfferModel.prototype.hoverStart = function (dataContext, event) {
                    this.hoverTarget.hoverStart(this.hoverTarget, dataContext, event);
                };
                GenericOfferModel.prototype.hoverEnd = function (dataContext, event) {
                    this.hoverTarget.hoverEnd(this.hoverTarget, dataContext, event);
                };
                return GenericOfferModel;
            })();
            Model.GenericOfferModel = GenericOfferModel;
        })(Model = APP.Model || (APP.Model = {}));
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));

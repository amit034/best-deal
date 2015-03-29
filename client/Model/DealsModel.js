var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="ProductModelBase.ts" />
/// <reference path="../External/knockout.d.ts" />
/// <reference path="HoverTarget.ts"/>
/// <reference path="GenericOffersModel"/>
/// <reference path="../Common/Collection"/>
var BD;
(function (BD) {
    var APP;
    (function (APP) {
        var Model;
        (function (Model) {
            var DealsModel = (function () {
                function DealsModel(context, offers) {
                    this.offers = [];
                    var offerModels = APP.Common.Collection.select(offers, function (o) { return new DealModel(context, o); });
                    this.offers = offerModels;
                    this.context = context;
                }
                return DealsModel;
            })();
            Model.DealsModel = DealsModel;
            var DealModel = (function (_super) {
                __extends(DealModel, _super);
                function DealModel(context, deal) {
                    _super.call(this, context, deal);
                    this.offer = null;
                    this.offer = deal;
                }
                DealModel.prototype.onClick = function (model, event) {
                    if (event) {
                        event.preventDefault();
                    }
                    var win = model.windowOpen(model.offer.url, '_blank');
                    ;
                    if (!model.clickNotified) {
                        model.clickNotified = true;
                        var clickData = {};
                        clickData['p'] = model.offer.part;
                        clickData['kwds'] = model.offer.keywords;
                        if (model.offer.url.indexOf("af_placement_id=") > -1) {
                            try {
                                var str = model.offer.url;
                                clickData['plid'] = str.match(/af_placement_id=([^&]+)/)[1];
                            }
                            catch (e) {
                                APP.Logger.info("Bad parse of placmentID");
                                clickData['plid'] = "0";
                            }
                        }
                        if (model.offer.price) {
                            clickData['prc'] = model.offer.price;
                        }
                        if (model.offer.begrp) {
                            clickData['begrp'] = model.offer.begrp;
                        }
                        //Logger.Analytics.notify(model.context, Logger.Analytics.CLICK, clickData);
                        if (model.offer.onClick)
                            model.offer.onClick();
                    }
                };
                return DealModel;
            })(Model.GenericOfferModel);
            Model.DealModel = DealModel;
        })(Model = APP.Model || (APP.Model = {}));
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));

/// <reference path="DealsModel" />
/// <reference path="GenericOffersModel" />
/// <reference path="../Data/Deal" />
/// <reference path="../Common/LocaleHelper" />
/// <reference path="../Locale/SliderStrings" />
/// <reference path="../Context/VisualContext.ts" />
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
        var Model;
        (function (Model) {
            var TicketsModel = (function (_super) {
                __extends(TicketsModel, _super);
                function TicketsModel(context, deals, ticketsContext, suspendIdentifier, onClose) {
                    var _this = this;
                    _super.call(this, context, suspendIdentifier, onClose);
                    this.hasDeals = BD.ko.computed(function () { return _this.deals && _this.deals.offers.length; });
                    this.dealScroll = BD.ko.computed(function () { return _this.deals && _this.deals.offers.length > 4; });
                    this.selectedTab = BD.ko.observable(0);
                    this.dealsDisplayed = false;
                    this.deals = deals ? new Model.DealsModel(ticketsContext, deals) : new Model.DealsModel(null, []);
                    this.setPanelVisibilityAndBadges(this.deals);
                    this.setMoreDealsTarget(this.deals);
                    this.strings = APP.Common.LocaleHelper.getStringMapForCountry("en", APP.Locale.sliderStrings);
                }
                TicketsModel.prototype.setPanelVisibilityAndBadges = function (deals) {
                    this.selectTab(0, false);
                };
                TicketsModel.prototype.setMoreDealsTarget = function (deals) {
                    if (deals.offers.length) {
                        this.moreDealsUrl = "http://bestdealwiz.com/productlist.html?q=" + deals.offers[0].offer.keywords.split(" ").join("+");
                    }
                    else {
                        this.moreDealsUrl = "http://bestdealwiz.com/index.html";
                    }
                };
                TicketsModel.prototype.selectTab = function (tab, forceDisplay) {
                    if (forceDisplay === void 0) { forceDisplay = true; }
                    this.selectedTab(tab);
                    if (forceDisplay)
                        this.collapsed(false);
                    if (tab == 0 && !this.dealsDisplayed) {
                        this.dealsDisplayed = true;
                    }
                };
                return TicketsModel;
            })(Model.ProductModelBase);
            Model.TicketsModel = TicketsModel;
        })(Model = APP.Model || (APP.Model = {}));
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));

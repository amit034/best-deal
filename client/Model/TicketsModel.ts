/// <reference path="EventsModel" />
/// <reference path="GenericBunnerModel" />
/// <reference path="../Data/Deal" />
/// <reference path="../Common/LocaleHelper" />
/// <reference path="../Locale/SliderStrings" />
/// <reference path="../Context/VisualContext.ts" />


module BD.APP.Model {

    import Deal = Data.Deal;


    export class TicketsModel extends ProductModelBase {

        bannersModel:BannersModel<Data.Deal>;


        hasDeals = ko.computed(() => this.bannersModel && this.bannersModel.banners.length);

        dealScroll = ko.computed(() => this.bannersModel && this.bannersModel.banners.length > 3);

        selectedTab:KnockoutObservable<number> = ko.observable(0);
        dealsDisplayed:boolean = false;

        moreDealsUrl:string;

        strings:{[key:string]: string};


        constructor(context:Context.VisualContext, deals:Data.Deal[], ticketsContext:Context.LVContext,
                    suspendIdentifier:string,  onClose:() => void) {
            super(context, suspendIdentifier, onClose);

            this.bannersModel = deals ? new BannersModel<Data.Deal>(ticketsContext,deals) : new BannersModel<Data.Deal>(null, []);

            this.setPanelVisibilityAndBadges(this.bannersModel);
            this.setMoreDealsTarget(this.bannersModel);

            this.strings = Common.LocaleHelper.getStringMapForCountry("US", Locale.sliderStrings);
        }

        private setPanelVisibilityAndBadges(bannersModel:BannersModel<Data.Deal>) {

            this.selectTab(0, false);

        }

        private setMoreDealsTarget(bannersModel:BannersModel<Data.Deal>) {

            if (bannersModel.banners.length) {
                this.moreDealsUrl = "http://bestdealwiz.com/productlist.html?q=" +  bannersModel.banners[0].banner.keywords.split(" ").join("+");
            }
            else {
                this.moreDealsUrl = "http://bestdealwiz.com/index.html";
            }
        }



        selectTab(tab:number, forceDisplay:boolean = true) {
            this.selectedTab(tab);

            if (forceDisplay)
               this.collapsed(false);

            if (tab == 0 && !this.dealsDisplayed) {
                this.dealsDisplayed = true;
                //Logger.Analytics.notify(this.deals.context, Logger.Analytics.IMPRESSION, {"kwds" : this.deals.offers[0].offer.keywords });
            }


        }

    }
}


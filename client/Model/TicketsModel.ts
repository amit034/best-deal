/// <reference path="EventsModel" />
/// <reference path="GenericBunnerModel" />
/// <reference path="CouponsModel" />
/// <reference path="../Data/Deal" />
/// <reference path="../Data/Coupon" />
/// <reference path="../Common/LocaleHelper" />
/// <reference path="../Locale/SliderStrings" />
/// <reference path="../Context/VisualContext.ts" />


module BD.APP.Model {

    import Deal = Data.Deal;
	import Coupon = Data.Coupon;

    export class TicketsModel extends ProductModelBase {

        bannersModel:BannersModel<Data.Deal>;


        hasDeals = ko.computed(() => this.bannersModel && this.bannersModel.banners.length);
	
        dealScroll = ko.computed(() => this.bannersModel && this.bannersModel.banners.length > 2);
		
		
        coupons:CouponsModel<Data.Coupon>;

        hasCoupons = ko.computed(() => this.coupons && this.coupons.offers.length);

        couponScroll = ko.computed(() => this.coupons && this.coupons.offers.length > 2);
       
     	selectedTab:KnockoutObservable<number> = ko.observable(0);
         dealsDisplayed:boolean = false;
        couponsDisplayed:boolean = false;

        moreDealsUrl:string;

        strings:{[key:string]: string};


        constructor(context:Context.VisualContext, deals:Data.Deal[], ticketsContext:Context.LVContext,
                    coupons:Coupon[], couponContext: Context.LVContext, suspendIdentifier:string,  onClose:() => void) {
            super(context, suspendIdentifier, onClose);

            this.bannersModel = deals ? new BannersModel<Data.Deal>(ticketsContext,deals) : new BannersModel<Data.Deal>(null, []);
			this.coupons = coupons ? new CouponsModel<Coupon>(couponContext, coupons) : new CouponsModel<Coupon>(null, []);

            this.setPanelVisibilityAndBadges(this.bannersModel,this.coupons);
            this.setMoreDealsTarget(this.bannersModel);

            this.strings = Common.LocaleHelper.getStringMapForCountry("US", Locale.sliderStrings);
        }

        private setPanelVisibilityAndBadges(bannersModel:BannersModel<Data.Deal> ,coupons:CouponsModel<Coupon>) {

            if (bannersModel && bannersModel.banners.length && coupons && coupons.offers.length) {
               
                this.selectTab(1, false);
          
            }
            else if (bannersModel && bannersModel.banners.length) {
                this.selectTab(0, false);
            }
            else if (coupons && coupons.offers.length) {
                this.selectTab(1, false);
            }
            else {
                throw new Error("Neither Deals or Coupons provided");
            }

        }

        private setMoreDealsTarget(bannersModel:BannersModel<Data.Deal>) {
            var context  = this.bannersModel.context ? this.bannersModel.context : this.coupons ? this.coupons.context : null;
            var logic = context ? context.logic().flag() : null;
            switch (logic){
                case "gambling" :
                    this.moreDealsUrl = "http://online.mik123.com/promoRedirect?key=ej0yMTkwNDA2MDc5Jmw9MzIyMjczMzMmcD0xMDI3MzQ3";
                    break;
                case "medical" :
                    this.moreDealsUrl = null;
                    break;
                default :
                    this.moreDealsUrl = "https://seatgeek.com/?aid=11188";
                    break;
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

            if (tab == 1 && !this.couponsDisplayed) {
                this.couponsDisplayed = true;
               // Logger.Analytics.notify(this.coupons.context, Logger.Analytics.IMPRESSION);
            }


        }

    }
}


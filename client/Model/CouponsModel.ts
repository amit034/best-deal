/// <reference path="GenericBunnerModel" />
/// <reference path="../Common/HtmlHelper" />
module BD.APP.Model {


    export interface ICouponImage{
        src : string;
        height:number;
        width:number;
    }
    export interface ICoupon extends IBanner {

        merchant: string;
        merchantImage: string;
		script:string;
		image:ICouponImage;
		link:string;
        revealed: boolean;
        code: string;
        isDirect: boolean;

        partialCode:string;
    }


    export class CouponsModel<T extends ICoupon>  {



        offers:CouponModel<T>[] = [];
        context:Context.LVContext;

        constructor(context:Context.LVContext, offers:T[]) {
           

            var offerModels = Common.Collection.select(offers, o => new CouponModel<T>(context, o));
            this.offers = offerModels;

            this.context = context;
        }
    }

    export class CouponModel<T extends ICoupon> extends GenericBannerModel<T> {

        isRevealed:KnockoutObservable<boolean> = ko.observable(false);


        constructor(context:Context.LVContext, banner:T) {
            super(context, banner);

            this.isRevealed(banner.revealed);
        }

        onClick(model:CouponModel<T>, event:Event):void {
            // IMPORTANT: A copy of many of these actions occurs in GenericOfferModel (the super). Reflect changes there

            if (event) event.preventDefault();

            if (!model.clickNotified) {
                model.clickNotified = true;
                //Logger.Analytics.notify(model.context, Logger.Analytics.CLICK, { 'p': model.banner.part });

                if (model.banner.onClick) model.banner.onClick();
            }

            if (model.banner.isDirect) {
                model.windowOpen(model.url, '_blank');

               
            }
            else if (!model.banner.revealed) {

                // window.open used to be here. Instead we create an iframe with the src
                var iframeElement:JQuery = $('<iframe width="0" height="0"></iframe>');
                iframeElement.attr('src', model.url);
                Common.HtmlHelper.appendToBody(iframeElement);

               
                model.isRevealed(true);
            }
        }

    }

}
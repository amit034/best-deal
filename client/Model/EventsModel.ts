/// <reference path="ProductModelBase.ts" />
/// <reference path="../External/knockout.d.ts" />
/// <reference path="HoverTarget.ts"/>
/// <reference path="GenericBunnerModel"/>
/// <reference path="../Common/Collection"/>
module BD.APP.Model {



    export interface IPricing{
        min:number;
        max:number;
        avg:number;
    }
    export interface IEvent extends IBanner{
        prices: IPricing;
		title:string;
        secondLine:string;

    }

    export class BannersModel<T extends IBanner>  {

        banners:BannerModel<T>[] = [];
        context:Context.LVContext;

        constructor(context:Context.LVContext, banners:T[]) {


            var bannerModels = Common.Collection.select(banners, o => new BannerModel<T>(context, o));
            this.banners = bannerModels;

            this.context = context;
        }
    }

    export class BannerModel<T extends IBanner> extends GenericBannerModel<IBanner> {

        banner:T = null;

        constructor(context:Context.LVContext, deal:T) {
            super(context, deal);
            this.banner = deal;
        }


        onClick(model:BannerModel<T>, event:Event):void {

            if (event) {
                event.preventDefault();
            }

            var win= model.windowOpen(model.banner.url, '_top');


            if (!model.clickNotified) {
                model.clickNotified = true;


                var clickData:{[index:string]: string} = {};


                clickData['kwds'] = model.banner.keywords;

                if (model.banner.url.indexOf("af_placement_id=") > -1){
                    try {
                        var str = model.banner.url;
                        clickData['plid'] = str.match(/af_placement_id=([^&]+)/)[1];
                    } catch (e){
                        Logger.info("Bad parse of placmentID");
                        clickData['plid'] = "0";
                    }
                }



                if (model.banner.onClick) model.banner.onClick();
            }
        }
    }
}
/// <reference path="ProductModelBase.ts" />
/// <reference path="../External/knockout.d.ts" />
/// <reference path="HoverTarget.ts"/>
/// <reference path="../Common/Collection.ts"/>
module BD.APP.Model {

    export interface IBanner  {
        
        url:string;
        keywords:string;
        onClick?:() => void;
    }

    export class GenericOffersModel<T extends IBanner> {

        banners:GenericBannerModel<T>[] = [];
        context:Context.LVContext;

        constructor(context:Context.LVContext, offers:T[]) {

            var bannerModels = Common.Collection.select(offers, o => new GenericBannerModel<T>(context, o));
            this.banners = bannerModels;
            this.context = context;
        }
    }

    export class GenericBannerModel<T extends IBanner> {

        banner:T = null;
        url:string = null;
        clickNotified = false;
        context:Context.LVContext;

        hoverTarget:HoverTarget;

        constructor(context:Context.LVContext, banner:T) {

            //(duration) => Logger.Analytics.notify(this.context, Logger.Analytics.HOVER, {'time': duration + '' })
            this.hoverTarget = new HoverTarget(4000, 60000, (duration) =>{});
            this.context = context;
            this.banner = banner;
            this.url = banner.url;
        }



        windowOpen(url:string, target:string):Window {

            var fnIframe = <HTMLIFrameElement>$('<iframe width="0" height="0" style="display: none"></iframe>')[0];
            document.body.appendChild(fnIframe);
            var win = fnIframe.contentWindow.open.apply(window, [url, target]);
            document.body.removeChild(fnIframe);

            return win;
        }

        hoverStart(dataContext:GenericBannerModel<T>, event:MouseEvent):void {
          this.hoverTarget.hoverStart(this.hoverTarget, dataContext, event);
        }

        hoverEnd(dataContext:GenericBannerModel<T>, event:MouseEvent):void {
            this.hoverTarget.hoverEnd(this.hoverTarget, dataContext, event);
        }


    }
}
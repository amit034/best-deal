/// <reference path="../Context/IBaseContext"/>

module BD.APP.Logger {


    export interface NotificationType {
        key:string;
    }

    export class Analytics {

        static INJECTION:NotificationType = { key: 'inj' };
        static INIT:NotificationType = { key: 'init' };
        static USER:NotificationType = { key: 'usr' };
        static NO_SHOW:NotificationType = { key: 'noshow' };
        static IMPRESSION:NotificationType = { key: 'wo' };
        static HOVER:NotificationType = { key: 'ho' };
        static CLICK:NotificationType = { key: 'c' };
        static EXCEPTION:NotificationType = { key: 'exception' };

//        static notify(context:Context.IBaseContext, notifyType:NotificationType, params:{[index:string]: string} = {}, defaultSamplingPercent:number = 1.0, useContextParams:boolean = true):boolean {
//            var notificationTypeKey = notifyType.key;
//            return Analytics.notifyX(context, notificationTypeKey, params, defaultSamplingPercent, useContextParams);
//        }
//
//        private static notifyX(context:Context.IBaseContext, notifyType:string, params:{[index:string]: string} = {}, defaultSamplingPercent:number = 1.0, useContextParams:boolean = true):boolean {
//
//            try {
//                // Determine if we should send this notification
//                var overrideKey:string = "notifyrate." + notifyType;
//                var samplingPercent:number =  defaultSamplingPercent;
//
//                var shouldNotify = (Math.random() < samplingPercent);
//                if (!shouldNotify) return false;
//
//
//                var url = Analytics.resolveUrl(context, notifyType, params, useContextParams);
//
//                // Inject an image with the url as source into the page - the most hassle free way to call a url
//                var img:HTMLImageElement = <HTMLImageElement>document.body.appendChild(document.createElement("img"));
//                img.style.zIndex = "-100";
//                img.style.position = "absolute";
//                img.style.left = "0";
//                img.style.top = "0";
//                img.src = url;
//
//                return true;
//            }
//            catch (e) {
//                return false;
//            }
//        }

//        static resolveUrl(context:Context.IBaseContext, notifyType:string, params:{[index:string]: string} = {}, useContextParams:boolean = true):string {
//
//            var mergedParams = Analytics.resolveParamaters(context, params, useContextParams);
//            var qs = "";
//
//            for (var key in mergedParams) {
//                if (qs.length > 0) qs += "&";
//                qs += key + "=" + encodeURIComponent(mergedParams[key]);
//            }
//
//            var url = context.paths().notifyRoot() + "/a/" + notifyType + "/logo.png?" + qs;
//            return url;
//        }
//
//        static resolveParamaters(context:Context.IBaseContext, params:{[index:string]: string} = {}, useContextParams:boolean = true):{[index:string]: string} {
//
//            var contextParams:{[index:string]: string} = context.notificationParams();
//            var mergedParams:{[index:string]: string} = {};
//
//            if (useContextParams) {
//                for (var key in contextParams) mergedParams[key] = contextParams[key];
//            }
//
//            for (var key in params) mergedParams[key] = params[key];
//
//            if (!('t' in mergedParams)) mergedParams['t'] = new Date().getTime() + '';
//
//            if (mergedParams['pr'] && mergedParams['w']) {
//                var rp = Analytics.resolveReportingProduct(mergedParams['pr'], mergedParams['w']);
//                if (rp) mergedParams['rp'] = rp;
//            }
//
//            return mergedParams;
//        }

        private static resolveReportingProduct(pr:string, w:string):string {

            if (pr == "pp" && w == "rs-dual") return "rs";
            if (pr == "pp" && w == "rsif") return "rs";

            if (pr == "pp" && w == "bs-dual") return "bs";
            if (pr == "pp" && w == "bsif") return "rs";

            if (pr == "pp" && w == "tb-dual") return "tb";
            if (pr == "universal-banner") return "ub";
            if (pr == "rb") return "rb";
            if (pr == "gb") return "gb";
            if (pr == "cpn") return "cpn";
            if (pr == "ppm") return "rs";

            return pr + "_" + w;
        }

        static notifyGenericUrl(url:string, params:{[index:string]: string} = {}):boolean {

            try {
                if (params) {
                    url = url + "?";
                    for (var key in params) {
                        var value = params[key] + '';
                        url = url + "&" + key + "=" + encodeURIComponent(value);
                    }
                }
                // Inject an image with the url as source into the page - the most hassle free way to call a url
                var img:HTMLImageElement = <HTMLImageElement>document.body.appendChild(document.createElement("img"));
                img.style.zIndex = "-100";
                img.style.position = "absolute";
                img.style.left = "0";
                img.style.top = "0";
                img.src = url;
                return true;
            }
            catch (e) {
                return false;
            }
        }
    }

}

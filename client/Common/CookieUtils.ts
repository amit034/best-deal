/// <reference path="Collection.ts"/>

module BD.APP.Common {

    export class CookieUtils {

        static getCookie(key:string):string {
            var name = key + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) != -1) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        }

        static setCookie(key:string, value:string, daysExpire?:number, domain?:string):void {
            var expires = "";
            if (daysExpire) {
                new Date((new Date().getTime() + (daysExpire * 24 * 60 * 60 * 1000))).toUTCString();
                expires = "; expires=" + new Date((new Date().getTime() + (daysExpire * 24 * 60 * 60 * 1000))).toUTCString();
            }

            var addDomain = "";
            if (domain) {
                addDomain = "; domain=" + domain;
            }
            document.cookie = key + "=" + value + expires + "; path=/" + addDomain;
        }

        static setBackendClickCookie(context:Context.IAppContext, params:{[index:string]: string} = {}):void {
            try {
                var url:string = context.paths().staticContentRoot() + "/c/clk/logo.png";
                var domain:string = context.paths().domain();
                url = url + "?";
                url = url + "&" + "domain" + "=" + encodeURIComponent(domain);
                if (params) {
                    for (var key in params) {
                        var value = params[key] + '';
                        url = url + "&" + key + "=" + encodeURIComponent(value);
                    }
                }
                Logger.Analytics.notifyGenericUrl(url);

            } catch (e) {}
        }

    }
}
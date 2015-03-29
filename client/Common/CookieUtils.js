/// <reference path="Collection.ts"/>
var BD;
(function (BD) {
    var APP;
    (function (APP) {
        var Common;
        (function (Common) {
            var CookieUtils = (function () {
                function CookieUtils() {
                }
                CookieUtils.getCookie = function (key) {
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
                };
                CookieUtils.setCookie = function (key, value, daysExpire, domain) {
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
                };
                CookieUtils.setBackendClickCookie = function (context, params) {
                    if (params === void 0) { params = {}; }
                    try {
                        var url = context.paths().staticContentRoot() + "/c/clk/logo.png";
                        var domain = context.paths().domain();
                        url = url + "?";
                        url = url + "&" + "domain" + "=" + encodeURIComponent(domain);
                        if (params) {
                            for (var key in params) {
                                var value = params[key] + '';
                                url = url + "&" + key + "=" + encodeURIComponent(value);
                            }
                        }
                        APP.Logger.Analytics.notifyGenericUrl(url);
                    }
                    catch (e) {
                    }
                };
                return CookieUtils;
            })();
            Common.CookieUtils = CookieUtils;
        })(Common = APP.Common || (APP.Common = {}));
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));

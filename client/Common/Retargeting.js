/// <reference path="../External/JSON3" />
/// <reference path="../External/jquery" />
/// <reference path="../Context/IAppContext" />
/// <reference path="../Common/Collection.ts" />
/// <reference path="../Common/CookieUtils" />
var BD;
(function (BD) {
    var APP;
    (function (APP) {
        var Common;
        (function (Common) {
            var Retargeting = (function () {
                function Retargeting() {
                }
                // Store
                Retargeting.storeImpressionKeywords = function (context, keywords) {
                    Retargeting.storeKeywords(context, keywords, Retargeting.RT_IMPRESSIONS_KEY);
                    context.iframe().postRequest("storeImpressionCookie", false, null, keywords);
                };
                Retargeting.storeClickKeywords = function (context, keywords) {
                    var rtString = Retargeting.storeKeywords(context, keywords, Retargeting.RT_CLICKS_KEY);
                    //store click cookie to Iframe
                    context.iframe().postRequest("storeClickCookie", false, null, keywords);
                    Common.CookieUtils.setBackendClickCookie(context, { clk: rtString });
                };
                Retargeting.storeKeywords = function (context, keywords, sourceKey) {
                    var rtString = localStorage.getItem(sourceKey);
                    var rtList = rtString ? JSON3.parse(rtString) : [];
                    rtList.push({ keywords: keywords.split(' '), when: new Date().getTime() });
                    rtList = Common.Collection.of(rtList).orderBy(function (e) { return e.when; }).take(10).toArray();
                    rtString = JSON3.stringify(rtList);
                    localStorage.setItem(sourceKey, rtString);
                    return rtString;
                };
                Retargeting.storeClickKeywordsToCookie = function (context, keywords, domain) {
                    Retargeting.storeKeywordsToCookie(context, keywords, Retargeting.RT_CLICKS_KEY, domain);
                };
                Retargeting.storeImpressionKeywordsToCookie = function (context, keywords, domain) {
                    Retargeting.storeKeywordsToCookie(context, keywords, Retargeting.RT_IMPRESSIONS_KEY, domain);
                };
                Retargeting.storeKeywordsToCookie = function (context, keywords, sourceKey, domain) {
                    var rtString = Common.CookieUtils.getCookie(sourceKey);
                    var rtList;
                    try {
                        rtString = rtString ? decodeURIComponent(rtString) : "";
                        rtList = rtString ? JSON3.parse(rtString) : [];
                    }
                    catch (e) {
                        APP.Logger.warn('error in Json.Parse on ' + rtString);
                        rtList = [];
                    }
                    rtList.push({ keywords: keywords.split(' '), when: new Date().getTime() });
                    rtList = Common.Collection.of(rtList).orderBy(function (e) { return e.when; }).take(10).toArray();
                    rtString = JSON3.stringify(rtList);
                    Common.CookieUtils.setCookie(sourceKey, rtString, 365, domain);
                };
                Retargeting.readRecentKewwordsFromSource = function (sourceKey) {
                    var now = new Date().getTime();
                    var rtString = localStorage.getItem(sourceKey);
                    var rtList = rtString ? JSON3.parse(rtString) : [];
                    return Common.Collection.of(rtList).orderByDesc(function (e) { return e.when; }); //.where((e) => now - e.when < 1000 * WEEK_SECONDS);
                };
                Retargeting.readRecentKewwordsFromCookieSource = function (sourceKey) {
                    var now = new Date().getTime();
                    var rtString = Common.CookieUtils.getCookie(sourceKey);
                    var rtList = rtString ? JSON3.parse(rtString) : [];
                    return Common.Collection.of(rtList).orderByDesc(function (e) { return e.when; }); //.where((e) => now - e.when < 1000 * WEEK_SECONDS);
                };
                Retargeting.RT_CLICKS_KEY = "fo-rt-clk";
                Retargeting.RT_IMPRESSIONS_KEY = "fo-rt-imp";
                Retargeting.POSITION_WEIGHT = 8;
                return Retargeting;
            })();
            Common.Retargeting = Retargeting;
        })(Common = APP.Common || (APP.Common = {}));
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));

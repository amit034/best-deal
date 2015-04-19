/// <reference path="../External/JSON3" />
/// <reference path="../External/jquery" />
/// <reference path="../Context/IAppContext" />
/// <reference path="../Common/Collection.ts" />
/// <reference path="../Common/CookieUtils" />

module BD.APP.Common {

    interface RetargetEntry {
        keywords:string[];
        when:number;
    }

    interface ScoredRetargetEntry {
        keywords:string[];
        when:number;

        typeScore: number;
        ageScore: number;
        repeatScore: number;
        matchScore: number;

        normTypeScore: number;
        normAgeScore: number;
        normRepeatScore: number;
        normMatchScore: number;

        totalScore:number;
    }

    export class Retargeting {

        private static RT_CLICKS_KEY = "bd-rt-clk";
        private static RT_IMPRESSIONS_KEY = "bd-rt-imp";

        private static POSITION_WEIGHT = 8;


        // Store

        static storeImpressionKeywords(context:Context.IAppContext, keywords:string):void {
            if (keywords ==null || keywords.length == 0 ) return ;
			Retargeting.storeKeywords(context, keywords, Retargeting.RT_IMPRESSIONS_KEY);
            context.iframe().postRequest("storeImpressionCookie" , false, null, keywords);
        }

        static storeClickKeywords(context:Context.IAppContext, keywords:string):void {
            if (keywords ==null || keywords.length == 0 ) return ;
			var rtString:string = Retargeting.storeKeywords(context, keywords, Retargeting.RT_CLICKS_KEY);
            //store click cookie to Iframe
            context.iframe().postRequest("storeClickCookie" , false, null, keywords);

            CookieUtils.setBackendClickCookie(context, {clk : rtString});
        }

        private static storeKeywords(context:Context.IAppContext, keywords:string, sourceKey:string):string {
			
            var rtString = localStorage.getItem(sourceKey);
            var rtList:RetargetEntry[] = rtString ? JSON3.parse(rtString) : [];

            rtList.push({keywords: keywords.split(' '), when: new Date().getTime()});
            rtList = Collection.of(rtList).orderBy(e => e.when).take(10).toArray();
            rtString = JSON3.stringify(rtList);
            localStorage.setItem(sourceKey, rtString);

            return rtString;
        }

        static storeClickKeywordsToCookie(context:Context.IBaseContext, keywords:string, domain?:string):void {
            if (keywords ==null || keywords.length == 0 ) return ;
			Retargeting.storeKeywordsToCookie(context, keywords, Retargeting.RT_CLICKS_KEY, domain);
        }

        static storeImpressionKeywordsToCookie(context:Context.IBaseContext, keywords:string, domain?:string):void {
		   if (keywords ==null || keywords.length == 0 ) return ;
		   Retargeting.storeKeywordsToCookie(context, keywords, Retargeting.RT_IMPRESSIONS_KEY, domain);
        }

        private static storeKeywordsToCookie(context:Context.IBaseContext, keywords:string, sourceKey:string, domain?:string ):void {
            var rtString:string = Common.CookieUtils.getCookie(sourceKey);
            var rtList:RetargetEntry[];
            try{
                rtString = rtString ? decodeURIComponent(rtString) : "";
                rtList = rtString ? JSON3.parse(rtString) : [];
            } catch (e){
                Logger.warn('error in Json.Parse on ' + rtString)
                rtList = [];
            }

            rtList.push({keywords: keywords.split(' '), when: new Date().getTime()});
            rtList = Collection.of(rtList).orderBy(e => e.when).take(10).toArray();

            rtString = JSON3.stringify(rtList);
            Common.CookieUtils.setCookie(sourceKey, rtString, 365, domain);
        }





        private static readRecentKewwordsFromSource(sourceKey:string):Collection<RetargetEntry> {

            var now = new Date().getTime();

            var rtString = localStorage.getItem(sourceKey);
            var rtList:RetargetEntry[] = rtString ? JSON3.parse(rtString) : [];

            return Collection.of(rtList).orderByDesc(e => e.when); //.where((e) => now - e.when < 1000 * WEEK_SECONDS);
        }

        private static readRecentKewwordsFromCookieSource(sourceKey:string):Collection<RetargetEntry> {

            var now = new Date().getTime();

            var rtString = Common.CookieUtils.getCookie(sourceKey);
            var rtList:RetargetEntry[] = rtString ? JSON3.parse(rtString) : [];

            return Collection.of(rtList).orderByDesc(e => e.when); //.where((e) => now - e.when < 1000 * WEEK_SECONDS);
        }





    }
}



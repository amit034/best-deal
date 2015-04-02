/// <reference path="../Common/BlackWhiteListHelper" />
/// <reference path="../Common/Collection.ts" />
module BD.APP.Vertical {

    export class TicketsHelper {

        private static blackRegex:RegExp = /tube|lazada|shopzilla.|beso.|kelkoo.|orange.|clickjogos|gameforge|pole-emploi|infojobs|snap.do|(stockinvestingbasics|allmyvideos|laposte|megafilmeshd|vidspot).net|(collectivites|sweet|jeux|voila|bilansgratuits|habbol|vente).fr|(abril|terra|ig|blogspot|hotelurbano|uol).com.br|www.easymobility.co.uk|gov.br|wikipedia.org|(pricegrabber|spardeingeld|snapdo|speedbit|loopnet|stackoverflow|stackexchange|hulu|bloomberg|blogger|dartybox|alexa|baidu|cj|cnn|facebook|flickr|history|hotmail|imdb|imvu|linkedin|microsoft|msn|myspace|netflix|nytimes|politico|picasa|pinterest|rue89|salon|searchenginewatch|delta-search|sfgate|shutterfly|techcrunch|verizon|venturebeat|wired|yankodesign|yahoo|youtube|bing|vk|live|tumblr|ask|apple|roblox|411answers|tagged|nickjr|opposingviews|truste|adobe|breakfastdailynews|.avg|espn.go|.aol|pogo|pornhub|youporn|pron|youjizz|xnxx|marca|elpais|juegos|surveysresearchgroup|dofus|adopteunmec|unique|22find|nationzoom|sncf|privee|awesomehp|updateflashplayer|stocktradingcenters|empowernetwork|regionalhealthreview|diyfood|websurveycentral|\.att|news788|411source|pandora|hsselite|verizonwireless|internetautoguide|symantec|\.pch|mobile|nortonpro|pchealthboost|voipo|contenko|seaworldparks|entrepreneur|ratezip|game321|boostmobile|cabelas|specialk|globo|yepi|jogatina|4shared|globo|ojogos|tudogostoso|netcartas|disney|voeazul|cartoonnetwork|\.tam|viajanet|vagalume|jogosdemeninas|^as|\.as|atrapalo|elconfidencial|lavanguardia|forocoches|peliculasyonkis|logitravel|freakshare|elperiodico|iberia|filmaffinity|chaturbate|expansion|todotest|antena3|cincodias|888).com|(elmundo|rtve|lavozdegalicia|sport|publico|game|online|eldiariomontanes|elcomercio|\.hoy|\.abc|telepizza|europapress).es|paypal|cam4|888poker|filmesonlinegratis|google|.gov|qvo6|cam4|surveyservers|ask.fm|games.la|jeu.info/i;





        static classifyByBlackWhiteList(context:Context.IAppContext):Common.Promise<number> {

            if (document.location.pathname.indexOf("/shop") == 0) {
                return Common.resolve(1);
            }

            var domainsToCheck = Common.BlackWhiteListHelper.breakdownHost();
            var isGoogle = Common.Collection.contains(domainsToCheck, "google");

            if (isGoogle && document.location.href.indexOf("tbm=shop") != -1) {
                return Common.resolve(1);
            }

            // Regex to be aligned with old method.
            if (context.host().toLowerCase().match(this.blackRegex)) {
                Logger.log("Host matched black REGEX - Classifying as non-commerce");
                return Common.resolve(-1);
            }

            return Common.resolve(1);
        }


    }
}

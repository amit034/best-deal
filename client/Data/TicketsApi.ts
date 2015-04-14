// <reference path="../Common/Base64" />

/// <reference path="../Common/Collection.ts" />
/// <reference path="../Context/IAppContext" />
/// <reference path="../Common/Promise.ts" />
/// <reference path="../External/JSON3" />
/// <reference path="../External/jquery.d.ts" />
/// <reference path="Deal" />
/// <reference path="../Common/MerchantHelper" />

module BD.APP.Data {

    export interface TicketsApiRequestData {
        wordCounts:Common.Map<number>
        price:number;
        specialContext?: string;
        source:string;
    }

    export interface QueryData {
        kwc: {w:string; c:number}[];
        t: string;
        clientPrice: number;
        source: string;
        //specialContext?: string;
    }

    export interface TicketsApiResult{
        events : EventApiResult [];
        performers :PerformersApiResult[];
        source:string;
    }

    export interface DealApiResult{
        title:string;
        merchant: string;
        merchantImage: string;
        url:string;
        onClick?:() => void;
        score:number;
        keywords: string;
    }
    export interface PricesApiResult{
        listing:number;
        avg:number;
        lowest:number;
        highest:number;
    }
    export interface ImageApiResult{
        largeImage:string;
        huge:string;
        small:string;
        medium:string;
    }

    export interface PerformersApiResult extends DealApiResult{
        image:string;
        images: ImageApiResult
        primary:boolean;
    }
    export interface EventApiResult extends DealApiResult{
        prices : PricesApiResult;
        image:string;
        performers : PerformersApiResult[]
        date:string;
        type:string;
    }


    export class TicketsApi {

        private static MIN_WORDS = 4;

        private static pruneQueryData(data:QueryData, remove:string[]):QueryData {

            var kwc = Common.Collection.of(data.kwc).where((x:{w:string; c:number}) => !Common.Collection.contains(remove, x.w))

            var newT = data.t;
            Common.Collection.of(remove).each(x => newT = newT.replace(x, ''));

            var newKwc = kwc.orderBy(x => newT.indexOf(x.w));

            return {
                kwc: newKwc.toArray(),
                t: newT,
                clientPrice: data.clientPrice,
                source: data.source + "-pruned"
            };

        }

        private static logQueryData(data:QueryData):void {

            var kwcString = Common.Collection.of(data.kwc).select(x => x.w + " (" + x.c + ")").stringJoin(" ");
            Logger.info("Requesting offers with\nSource:\t" + data.source + "\nPrice:\t" + data.clientPrice + "\nKwds:\t" + kwcString + "\n");
        }

        static queryApi(context:Context.IAppContext, quantity:number, specialContext:string, data:QueryData):Common.Promise<TicketsApiResult> {


            var params:{[index:string]: any } = {
                rootUrl: context.paths().apiRoot(),
                base64Data: encodeURIComponent(Common.Base64.encode(JSON3.stringify(data))),
                partnerId: context.params().partnerCode,
                hostName: context.host(),
                offers: quantity,
                apiContext: specialContext
            };

            var url = Common.namedStringFormat("{rootUrl}/tickets?partid={partnerId}&hn={hostName}&offers={offers}&{base64Data}", params);
            if (context.params().subId != null)
                url = url + "&subid=" + context.params().subId;

            if (specialContext != null)
                url = url + "&context=" + specialContext;


            return Common.jqGetPromise(url).then(resultString => {
                return JSON3.parse(resultString);
                //return [];
            });
        }



        static queryFromData(context:Context.IAppContext, data:TicketsApiRequestData):QueryData {

				
            var formattedWordCounts = data.wordCounts.select((x:Common.Keyed<number>) => {
                return {"w": x.key, "c": x.value};
            }).toArray();
			
			var wordsCollection:Common.Collection<any> = new Common.Collection<any>(formattedWordCounts);
			var sortedWordsCollection = wordsCollection.orderByDesc(e => e.c).toArray();
            var allWordString:string = Common.Collection.select(sortedWordsCollection, x => x.w).join(" ");

            var res = {kwc: sortedWordsCollection, t: allWordString, clientPrice: data.price, source: 'api-' + data.source};
            return res;


        }





        static eventsFromResult(eventResult:EventApiResult[]):Data.Event[] {


            var deals = Common.Collection.of(eventResult).orderByDesc(o => o.score).select((eventResult:EventApiResult, index:number) => {
                var merchant = Common.MerchantHelper.getOffersMerchant();
                var deal:Data.Event = { title:eventResult.title,
                merchant: eventResult.merchant || merchant.text,
                merchantImage: eventResult.merchantImage || merchant.image,
                url:eventResult.url,
                image: eventResult.image,
                date : eventResult.date,
                keywords:eventResult.keywords,
                prices : eventResult.prices
               };
                return deal;
            });

            return deals.toArray();

        }
        static dealsFromPerformers(performers:DealApiResult[]):Data.Performers[] {


            var deals = Common.Collection.of(performers).orderByDesc(o => o.score).select((performers:PerformersApiResult, index:number) => {
                var merchant = Common.MerchantHelper.getOffersMerchant();
                var deal:Data.Performers = {
                    title: performers.title,
                    merchant: performers.merchant || merchant.text,
                    merchantImage: performers.merchantImage || merchant.image,
                    url:performers.url,
                    keywords:performers.keywords,
                    image: performers.image,
                    images: performers.images,
                    onClick: performers.onClick
                };
                return deal;
            });

            return deals.toArray();

        }
    }
}
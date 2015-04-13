// <reference path="../Common/Base64" />

/// <reference path="../Common/Collection.ts" />
/// <reference path="../Context/IAppContext" />
/// <reference path="../Common/Promise.ts" />
/// <reference path="../External/JSON3" />
/// <reference path="../External/jquery.d.ts" />
/// <reference path="Deal" />


module BD.APP.Data {


    export class MedicalApi {

        private static MIN_WORDS = 4;

        private static pruneQueryData(data:CouponQueryData, remove:string[]):CouponQueryData {

            var kwc = Common.Collection.of(data.kwc).where((x:{w:string; c:number}) => !Common.Collection.contains(remove, x.w))



            return {
                kwc: kwc.toArray() ,

                source: data.source + "-pruned"
            };

        }

        private static logQueryData(data:CouponQueryData):void {

            var kwcString = Common.Collection.of(data.kwc).select(x => x.w + " (" + x.c + ")").stringJoin(" ");
            Logger.info("Requesting offers with\nSource:\t" + data.source +  "\nKwds:\t" + kwcString + "\n");
        }

        static queryApi(context:Context.IAppContext, quantity:number, specialContext:string, data:CouponQueryData):Common.Promise<CouponsApiResult> {


            var params:{[index:string]: any } = {
                rootUrl: context.paths().apiRoot(),
                base64Data: encodeURIComponent(Common.Base64.encode(JSON3.stringify(data))),
                partnerId: context.params().partnerCode,
                hostName: context.host(),
                offers: quantity,
                countryCode: context.countryCode().toLowerCase(),
                apiContext: specialContext
            };

            var url = Common.namedStringFormat("{rootUrl}/medical?partid={partnerId}&hn={hostName}&offers={offers}&{base64Data}&c={countryCode}", params);
            if (context.params().subId != null)
                url = url + "&subid=" + context.params().subId;

            if (specialContext != null)
                url = url + "&context=" + specialContext;


            return Common.jqGetPromise(url).then(resultString => {
                return JSON3.parse(resultString);
                //return [];
            });
        }



        static queryFromData(context:Context.IAppContext, data:CouponApiRequestData):CouponQueryData {


            var formattedWordCounts = data.wordCounts.select((x:Common.Keyed<number>) => {
                return {"w": x.key, "c": x.value};
            }).toArray();


            var allWordString:string = Common.Collection.select(formattedWordCounts, x => x.w).join(" ");

            var res = {kwc: formattedWordCounts, t: allWordString, source: 'api-' + data.source};
            return res;


        }





        static couponsFromResult(couponsResult:CouponApiResult[]):Data.Coupon[] {


            var deals = Common.Collection.of(couponsResult).orderByDesc(o => o.score).select((couponResult:CouponApiResult, index:number) => {
                var coupon:Data.Coupon = {
                    title:couponResult.title,
					script:couponResult.script,
					link:couponResult.link,
					image :couponResult.image,
                    url:couponResult.link,
                    onClick : couponResult.onClick,
                    score:null,
                    keywords: couponResult.keywords,
                merchant: couponResult.merchant,
                merchantImage: couponResult.merchantImage,
                revealed: couponResult.revealed,
                code: couponResult.code,
                isDirect: couponResult.isDirect,
                partialCode:couponResult.partialCode
                };
                return coupon;
            });

            return deals.toArray();

        }

    }
}
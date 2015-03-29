/// <reference path="../Common/Base64" />
/// <reference path="../Common/Collection.ts" />
/// <reference path="../Context/IAppContext" />
/// <reference path="../Common/Promise.ts" />
/// <reference path="../External/JSON3" />
/// <reference path="../External/jquery.d.ts" />
/// <reference path="Deal" />
var BD;
(function (BD) {
    var APP;
    (function (APP) {
        var Data;
        (function (Data) {
            var TicketsApi = (function () {
                function TicketsApi() {
                }
                TicketsApi.pruneQueryData = function (data, remove) {
                    var kwc = APP.Common.Collection.of(data.kwc).where(function (x) { return !APP.Common.Collection.contains(remove, x.w); });
                    var newT = data.t;
                    APP.Common.Collection.of(remove).each(function (x) { return newT = newT.replace(x, ''); });
                    var newKwc = kwc.orderBy(function (x) { return newT.indexOf(x.w); });
                    return {
                        kwc: newKwc.toArray(),
                        t: newT,
                        clientPrice: data.clientPrice,
                        source: data.source + "-pruned"
                    };
                };
                TicketsApi.logQueryData = function (data) {
                    var kwcString = APP.Common.Collection.of(data.kwc).select(function (x) { return x.w + " (" + x.c + ")"; }).stringJoin(" ");
                    APP.Logger.info("Requesting offers with\nSource:\t" + data.source + "\nPrice:\t" + data.clientPrice + "\nKwds:\t" + kwcString + "\n");
                };
                TicketsApi.queryApi = function (context, quantity, specialContext, data) {
                    var params = {
                        rootUrl: context.paths().apiRoot(),
                        base64Data: encodeURIComponent(APP.Common.Base64.encode(JSON3.stringify(data))),
                        partnerId: context.params().partnerCode,
                        hostName: context.host(),
                        offers: quantity,
                        apiContext: specialContext
                    };
                    var url = APP.Common.namedStringFormat("{rootUrl}/o/1234/{base64Data}?partid={partnerId}&hn={hostName}&offers={offers}", params);
                    if (context.params().subId != null)
                        url = url + "&subid=" + context.params().subId;
                    if (specialContext != null)
                        url = url + "&context=" + specialContext;
                    return APP.Common.jqGetPromise(url).then(function (resultString) {
                        return JSON3.parse(resultString);
                        //return [];
                    });
                };
                TicketsApi.queryFromData = function (context, data) {
                    var formattedWordCounts = data.wordCounts.select(function (x) {
                        return { "w": x.key, "c": x.value };
                    }).toArray();
                    var allWordString = APP.Common.Collection.select(formattedWordCounts, function (x) { return x.w; }).join(" ");
                    var res = { kwc: formattedWordCounts, t: allWordString, clientPrice: data.price, source: 'api-' + data.source };
                    return res;
                };
                TicketsApi.dealsFromOffers = function (offers) {
                    var deals = APP.Common.Collection.of(offers).orderByDesc(function (o) { return o.rank; }).select(function (offer, index) {
                        var deal = {
                            title: offer.title,
                            price: offer.price,
                            thumb: offer.largeImage ? offer.largeImage : offer.images,
                            url: (offer.url.indexOf("?") == -1 ? offer.url + '?safepassage=1' : offer.url + '&safepassage=1'),
                            merchantThumb: offer.merchantImage,
                            merchantText: offer.merchant,
                            ribbon: (index == 0) ? "Best Deal" : "",
                            part: offer.part,
                            keywords: offer.keywords,
                            freeShipping: offer.freeShipping,
                            onClick: offer.onClick
                        };
                        return deal;
                    });
                    return deals.toArray();
                };
                TicketsApi.MIN_WORDS = 4;
                return TicketsApi;
            })();
            Data.TicketsApi = TicketsApi;
        })(Data = APP.Data || (APP.Data = {}));
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));

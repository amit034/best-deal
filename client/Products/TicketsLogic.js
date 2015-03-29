/// <reference path="../Data/DataResult.ts" />
/// <reference path="../Common/Collection.ts" />
/// <reference path="../Common/IPageScraper" />
/// <reference path="../Common/Promise.ts" />
/// <reference path="../Common/Retargeting.ts" />
/// <reference path="../Common/WordCounter.ts" />
/// <reference path="../Common/WordUtils.ts" />
/// <reference path="../Data/TicketsApi.ts" />
/// <reference path="../Data/SourceAndResults" />
/// <reference path="../Common/DataSynchronizer.ts" />
/// <reference path="../Products/IProductLogic" />
var BD;
(function (BD) {
    var APP;
    (function (APP) {
        var Products;
        (function (Products) {
            var TicketsLogic = (function () {
                function TicketsLogic() {
                }
                TicketsLogic.prototype.flag = function () {
                    return "pp";
                };
                TicketsLogic.prototype.dataKey = function () {
                    return "CommerceDeals";
                };
                TicketsLogic.prototype.supportsStickyClassification = function () {
                    return true;
                };
                TicketsLogic.prototype.classify = function (context) {
                    return APP.Common.namedWaterfall([
                    ], function (score) { return score != 0; }).alwaysThen(function (scoreAndSource, rej) {
                        return rej ? { name: rej.message, value: 0 } : scoreAndSource;
                    });
                };
                TicketsLogic.prototype.scrapeAndObtainData = function (context, count, sync) {
                    var data = { wordCounts: APP.Common.Map.emptyMap(), price: 0, source: null };
                    data.wordCounts = this.genericScrap(context);
                    data.source = 'generic-scrap';
                    var queryData = APP.Data.TicketsApi.queryFromData(context, data);
                    var prunedResult = APP.Data.TicketsApi.queryApi(context, count, null, queryData).then(function (result) {
                        var flag = context.logic().flag() + "_" + context.visual.flag();
                        var primaryOffers = sync.claimUniques(result.results, function (r) { return r.url; }, flag, count);
                        return new APP.Data.PlainDataResult(result.source, context, primaryOffers);
                    });
                    this.postProcessResults(context, prunedResult);
                    return prunedResult;
                };
                TicketsLogic.prototype.postProcessResults = function (context, results) {
                    results.then(function (result) {
                        if (result.data.length) {
                            // Store for retatrgeting purposes
                            var firstKeywords = result.data[0].keywords;
                            APP.Common.Retargeting.storeImpressionKeywords(context, firstKeywords);
                            // Attach onClick delegate to register clicked keywords for retargeting. The delegate will be carried to the ViewModel in the Visual
                            APP.Common.Collection.each(result.data, function (deal) {
                                deal.onClick = function () {
                                    APP.Common.Retargeting.storeClickKeywords(context, deal.keywords);
                                    //adding appnexus cookie
                                    APP.Logger.Analytics.notifyGenericUrl("https://secure.adnxs.com/seg?add=2205805&t=2");
                                };
                            });
                        }
                    });
                };
                TicketsLogic.prototype.genericScrap = function (context) {
                    var badInputWords = ["search", "here", "keyword", "keywords", "product", "products", "username", "email", "password", "enter"];
                    var goodQSParams = ["q", "Search", "search", "searchterm", "searchTerm", "search_query", "query", "Keywords", "keywords", "field-keywords", "w", "kw", "origkw", "SearchString", "searchString", "keys", "text", "Ntt", "qu", "Keyword", "keyword", "SearchTerms", "searchTerms", "_nkw"];
                    var scraper = context.scraper();
                    var wc = new APP.Common.WordCounter();
                    var searchFields = document.querySelectorAll("input[type='search']");
                    var searchFieldsText = APP.Common.Collection.select(APP.Common.Collection.numValues(searchFields), function (x) { return x.value; }).join(" ");
                    var searchFieldsWords = APP.Common.WordUtils.getNonTrivialWords(searchFieldsText);
                    var validSearchFieldsWords = APP.Common.Collection.intersect(searchFieldsWords, badInputWords).length ? [] : searchFieldsWords;
                    // queryParams values
                    var strongQueryParamWords = [];
                    var weakQueryParamWords = [];
                    for (var key in scraper.queryParams()) {
                        var arr = scraper.queryParams()[key].split(/[+| ]/);
                        if (APP.Common.Collection.contains(goodQSParams, key)) {
                            for (var w = 0; w < arr.length; w++) {
                                strongQueryParamWords.push(arr[w]);
                            }
                        }
                        else {
                            for (var w = 0; w < arr.length; w++) {
                                weakQueryParamWords.push(arr[w]);
                            }
                        }
                    }
                    if (searchFieldsWords.length > 0 || strongQueryParamWords.length > 0) {
                        var firstH1Text = scraper.getFirstMatchText(["h1"]);
                        var firstH1Words = APP.Common.WordUtils.getNonTrivialWords(firstH1Text);
                        // title
                        var titleWords = APP.Common.WordUtils.getNonTrivialWords(document.title);
                        // text fields
                        var textFields = document.querySelectorAll("input[type='text']");
                        var textFieldsText = APP.Common.Collection.select(APP.Common.Collection.numValues(textFields), function (x) { return x.value; }).join(" ");
                        var textFieldsWords = APP.Common.WordUtils.getNonTrivialWords(textFieldsText);
                        var validTextFieldsWords = APP.Common.Collection.intersect(textFieldsWords, badInputWords).length ? [] : textFieldsWords;
                        //push and  amplify
                        var amplifyList = [];
                        amplifyList.push({ keywords: titleWords, weight: 0, source: "Title" });
                        amplifyList.push({ keywords: firstH1Words, weight: 0, source: "H1" });
                        amplifyList.push({ keywords: weakQueryParamWords, weight: 0, source: "unknown query string" });
                        amplifyList.push({ keywords: validTextFieldsWords, weight: 0, source: "Text inputs" });
                        amplifyList.push({ keywords: validSearchFieldsWords, weight: 0, source: "Search inputs" });
                        var amplifyCollection = new APP.Common.Collection(amplifyList);
                        var sortedAmplifyCollection = amplifyCollection.orderByDesc(function (e) { return e.weight; }).toArray();
                        APP.Common.Collection.each(sortedAmplifyCollection, function (a) {
                            wc.pushAndAmplify(a.keywords, a.source, a.weight);
                        });
                    }
                    var filteredWords = APP.Common.Collection.where(wc.getWords(), function (word) {
                        return !word.match(/^[\s]*$/);
                    });
                    var wordCounts = APP.Common.WordUtils.countWords(filteredWords);
                    return wordCounts;
                };
                return TicketsLogic;
            })();
            Products.TicketsLogic = TicketsLogic;
        })(Products = APP.Products || (APP.Products = {}));
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));

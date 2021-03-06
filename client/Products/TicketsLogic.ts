/// <reference path="../Data/DataResult.ts" />
/// <reference path="../Data/Deal.ts" />
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
/// <reference path="../Vertical/TicketsHelper" />


module BD.APP.Products {
    import Promise = Common.Promise;
    import SourceAndResults = Data.SourceAndResults;
    import TicketsApiResult = Data.TicketsApiResult;
    import DealApiResult = Data.DealApiResult;
    import QueryData = Data.QueryData;
    import TicketsApi = Data.TicketsApi;
    import EventApiResult = Data.EventApiResult;
    import PerformersApiResult = Data.PerformersApiResult;
    import Deal = Data.Deal;


    export interface amplify{
        source:string;
        keywords:string[];
        weight:number;
    }

    export class TicketsLogic implements Products.IProductLogic {

        flag():string {
            return "tickets";
        }

        dataKey():string {
            return "CommerceDeals";
        }

        supportsStickyClassification():boolean {
            return true;
        }


        classify(context:Context.IAppContext):Common.Promise<Common.INamedValue<number>> {
            return Common.namedWaterfall([

                {name: "bwl", value: () => Vertical.TicketsHelper.classifyByBlackWhiteList(context)}

            ], (score:number) => score != 0).alwaysThen((scoreAndSource, rej) => {
                return rej ? {name: rej.message, value: 0} : scoreAndSource;
            });
        }


        scrapeAndObtainData(context:Context.LVContext, count:number, sync:Common.DataSynchronizer):Promise<Data.DataResult> {
            var data:Data.TicketsApiRequestData = {wordCounts: Common.Map.emptyMap<number>(), price: 0, source: null};
            data.wordCounts = this.genericScrap(context);

            data.source = 'generic-scrap';
            var queryData= Data.TicketsApi.queryFromData(context, data);
            var prunedResult:Promise<Data.PlainDataResult<Data.Deal>> =Data.TicketsApi.queryApi(context, count, null, queryData).then(result => {
                var flag = context.logic().flag() + "_" + context.visual.flag();

                var primaryEvents = sync.claimUniques<EventApiResult>(result.events, (r) => r.url, flag, count );
                var primaryPerformers = sync.claimUniques<PerformersApiResult>(result.performers, (r) => r.url, flag, count );
                var deals:Deal[] = TicketsApi.dealsFromPerformers(primaryPerformers) ;
                var events: Deal[] = TicketsApi.eventsFromResult(primaryEvents);
                var merchant = Common.MerchantHelper.getOffersMerchant();
                var defaultDeal:Deal = {

                        title: deals.length == 0 ? "Today's Best Deals and Coupons" : deals[0].title,
                        date : deals.length == 0 ? null : "Click here for more dates",
                        merchant:  deals.length == 0 ? merchant.text : (<Data.Performers>deals[0]).merchant ,
                        merchantImage: deals.length == 0 ? merchant.image : (<Data.Performers>deals[0]).merchantImage ,
                        url: deals.length == 0 ? "https://seatgeek.com/?aid=11188" : (<Data.Performers>deals[0]).url,
                        keywords:"",
                        image: deals.length == 0 ? null : (<Data.Performers>deals[0]).image,
                        images: null,
                        onClick: null

                }

                deals = deals.concat(events);
                deals.push(defaultDeal);

                Common.Collection.each(deals, (deal:Data.Event) => {
                    if (! deal.image){
                        deal.image =  "http://" + context.paths().staticContentRoot() +  "/Partials/images/default-event.jpg";
                    }
                });
                return new Data.PlainDataResult(result.source, context, deals);
            });

            this.postProcessResults(context, prunedResult);

            return prunedResult;
        }






        private postProcessResults(context:Context.LVContext, results:Promise<Data.PlainDataResult<Data.Deal>>):void {

            results.then(result => {
                if (result.data.length) {
                    // Store for retatrgeting purposes
                    var firstKeywords = result.data[0].keywords;
                    Common.Retargeting.storeImpressionKeywords(context, firstKeywords);

                    // Attach onClick delegate to register clicked keywords for retargeting. The delegate will be carried to the ViewModel in the Visual
                    Common.Collection.each(result.data, (deal:Data.Deal) => {
                        deal.onClick = () => {
                            Common.Retargeting.storeClickKeywords(context, deal.keywords);


                            Logger.Analytics.notifyClient(context,Logger.Analytics.CLICK , {'merchant' : deal.merchant , 'landing': deal.url});


                        };
                    });
                }
            });

        }



        private genericScrap(context:Context.IAppContext):Common.Map<number> {
            var badInputWords = ["search", "here", "keyword", "keywords", "product", "products", "username", "email", "password", "enter"];
            var goodQSParams = ["q", "Search", "search", "searchterm", "searchTerm", "search_query", "query", "Keywords", "keywords", "field-keywords", "w", "kw", "origkw", "SearchString", "searchString", "keys", "text", "Ntt", "qu", "Keyword", "keyword", "SearchTerms", "searchTerms", "_nkw"];


            var scraper = context.scraper();
            var wc = new Common.WordCounter();


            var searchFields:{[index:number]:Node} = document.querySelectorAll("input[type='search']");
            var searchFieldsText = Common.Collection.select(Common.Collection.numValues(searchFields), (x:HTMLInputElement) => x.value).join(" ");
            var searchFieldsWords = Common.WordUtils.getNonTrivialWords(searchFieldsText);
            var validSearchFieldsWords = Common.Collection.intersect(searchFieldsWords, badInputWords).length ? [] : searchFieldsWords;

            // queryParams values
            var strongQueryParamWords:string[] = [];
            var weakQueryParamWords:string[] = [];
            for (var key in scraper.queryParams()) {
                var arr:string[] = scraper.queryParams()[key].split(/[+| ]/);
                if (Common.Collection.contains(goodQSParams, key)) {
                    for (var w = 0 ; w < arr.length ; w++) {
                        strongQueryParamWords.push(arr[w]);
                    }
                }
                else {
                    for (var w = 0 ; w < arr.length ; w++) {
                        weakQueryParamWords.push(arr[w]);
                    }
                }
            }


                var firstH1Text = scraper.getFirstMatchText(["h1"]);
                var firstH1Words = Common.WordUtils.getNonTrivialWords(firstH1Text);

                // title
                var titleWords = Common.WordUtils.getNonTrivialWords(document.title);

                // text fields
                var textFields:{[index:number]:Node} = document.querySelectorAll("input[type='text']");
                var textFieldsText = Common.Collection.select(Common.Collection.numValues(textFields), (x:HTMLInputElement) => x.value).join(" ");
                var textFieldsWords = Common.WordUtils.getNonTrivialWords(textFieldsText);
                var validTextFieldsWords = Common.Collection.intersect(textFieldsWords, badInputWords).length ? [] : textFieldsWords;


                //push and  amplify
                var amplifyList:amplify[] = [];
                amplifyList.push({keywords:titleWords, weight:2, source:"Title"});
                amplifyList.push({keywords:firstH1Words, weight:2, source:"H1"});

                amplifyList.push({keywords:validTextFieldsWords, weight:1, source:"Text inputs"});
                amplifyList.push({keywords:validSearchFieldsWords, weight:1, source:"Search inputs"});


                var amplifyCollection:Common.Collection<amplify> = new Common.Collection<amplify>(amplifyList);
                var sortedAmplifyCollection = amplifyCollection.orderByDesc(e => e.weight).toArray();

                Common.Collection.each(sortedAmplifyCollection, (a:amplify) => {
                    wc.pushAndAmplify(a.keywords, a.source, a.weight)
                })


            var filteredWords = Common.Collection.where(wc.getWords(), (word:string) => {
                return !word.match(/^[\s]*$/);
            });

            var wordCounts = Common.WordUtils.countWords(filteredWords);
			
            return wordCounts;
        }


    }


}
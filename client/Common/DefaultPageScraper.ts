/// <reference path="../Context/IAppContext" />

/// <reference path="IPageScraper" />
/// <reference path="WordUtils.ts" />
/// <reference path="DependentSingletone" />

module BD.APP.Common {

    interface IElementAccessor {
        (ref:IElementReference): HTMLElement
    }

    export class DefaultPageScraper implements IPageScraper {

        static VALUELESS_PARAM:string = "";


        private _queryParams = new DependentSingletone<{[index:string]: string }>(
            () => window.location.href,
            () => this.parseQueryString(window.location)
        );

        private _documentHTML = new DependentSingletone<string>(
            () => window.location.href,
            () => $(document.documentElement).html()
        );


        documentHTML():string {
            return this._documentHTML.value();
        }

        queryParams():{[index:string]: string } {
            return this._queryParams.value();

        }


        private parseQueryString(location:Location):{[index: string]: string} {
            var searchArgs = location.search.substring(1).split('&');
            var hashArgs = location.hash.substring(1).split('&');
            var args = hashArgs.concat(searchArgs);

            //if same param on both - search will win
            var argsParsed:{[index: string]: any} = {};

            for (var i = 0; i < args.length; i++) {
                var arg = decodeURIComponent(args[i]);

                if (arg.indexOf('=') == -1) {
                    argsParsed[arg] = DefaultPageScraper.VALUELESS_PARAM;
                }
                else {
                    var kvp = arg.split('=');
                    argsParsed[kvp[0]] = kvp[1];
                }
            }
            return argsParsed;
        }


        testPatternsAgainstHTML(patterns:string[]):number {

            for (var i = 0; i < patterns.length; i++) {
                var re = new RegExp("(^|[^a-z|A-Z])(" + patterns[i] + ")($|[^a-z|A-Z])", "ig");
                var matches = this.documentHTML().match(re);
                var count = matches ? matches.length : 0;

                if (count) return 1;
            }
            return 0;
        }


        // todo: ORIGINAL ERROR: usage of innetText will fail with older FF. Move to jQuery
        // todo: ORIGINAL ERROR: usage of evaluate (xpath) will fail with all IE
        getElementTextByReference(entries:IElementReference[], accumulateAllMatches:boolean):string {

            var accessors:IElementAccessor[] = [
                entry => entry.xpath && DefaultPageScraper.getElementByXpath(entry.xpath.trim()),
                entry => entry.id && <HTMLElement>document.querySelector("#" + entry.id.trim()),
                entry => entry.name && <HTMLElement>document.getElementsByName(entry.name.trim())[0],
                entry => entry['class'] && <HTMLElement>document.querySelector("." + entry['class'].trim())
            ];

            var elementTxt = "";

            try {
                for (var e = 0; e < entries.length; e++) {
                    var entry = entries[e];

                    for (var i = 0; i < accessors.length; i++) {
                        var accessor = accessors[i];

                        var element = accessor(entry);
                        if (element) {
                            if (accumulateAllMatches)
                                elementTxt = elementTxt + DefaultPageScraper.getInnerText(element) + " ";
                            else {
                                return DefaultPageScraper.getInnerText(element);
                            }
                        }
                    }
                }
            }
            catch (e) {
                Logger.warn("Failure in dedicated field parsing. Skipping field");
            }
            return elementTxt;
        }


        static getInnerText(element:HTMLElement):string {
            return element.innerText;
        }

        static getElementByXpath(xpath:string):HTMLElement {
            return document['evaluate'] && document['evaluate'](xpath, document, null, 9, null).singleNodeValue;
        }

        // todo: original used a home-grown inner text implementation - changed to inner text
        getFirstMatchText(selectors:string[], fallbackText:string = ""):string {

            for (var index = 0; index < selectors.length; index++) {
                var selector = selectors[index];

                var element:HTMLElement = <HTMLElement>document.querySelector(selector);

                if (element) {
                    var text = DefaultPageScraper.getInnerText(element);
                    if (text)
                        return text;
                }
            }
            return fallbackText;
        }


        scrapeGenericPageWordCounts():Map<number> {

            // Search fields
            var searchFields:{[index:number]:Node} = document.querySelectorAll("input[type='search']");
            var searchFieldsText = Common.Collection.select(Common.Collection.numValues(searchFields), (x:HTMLInputElement) => x.value).join(" ");
            var searchFieldsWords = Common.WordUtils.getNonTrivialWords(searchFieldsText);
            // We want to count the search field words twice (give them double the weight)
            var doubleSearchFieldsWords = [].concat(searchFieldsWords).concat(searchFieldsWords);


            // H1 first texts
            var firstH1Text = this.getFirstMatchText(["h1"]);
            var firstH1Words = Common.WordUtils.getNonTrivialWords(firstH1Text);

            // title
            var titleWords = Common.WordUtils.getNonTrivialWords(document.title);


            // text fields
            var textFields:{[index:number]:Node} = document.querySelectorAll("input[type='text']");
            var textFieldsText = Common.Collection.select(Common.Collection.numValues(textFields), (x:HTMLInputElement) => x.value).join(" ");
            var textFieldsWords = Common.WordUtils.getNonTrivialWords(textFieldsText);

            // queryParams values
            var queryParamsText = Common.Collection.where(Common.Collection.values(this.queryParams()), (x) => x.length > 0).join(" ");
            var queryParamsWords = Common.WordUtils.getNonTrivialWords(queryParamsText);

            var words = [].concat(doubleSearchFieldsWords).concat(firstH1Words).concat(titleWords).concat(textFieldsWords).concat(queryParamsWords);
            var wordCounts = Common.WordUtils.countWords(words);
            return wordCounts;
        }

        getElementPosWithOffsets(element:HTMLElement):ClientRect {
            return HtmlHelper.getElementPosWithOffsets(element);
        }

    }

}

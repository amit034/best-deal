/// <reference path="../Context/IAppContext" />
/// <reference path="IPageScraper" />
/// <reference path="WordUtils.ts" />
/// <reference path="DependentSingletone" />
var BD;
(function (BD) {
    var APP;
    (function (APP) {
        var Common;
        (function (Common) {
            var DefaultPageScraper = (function () {
                function DefaultPageScraper() {
                    var _this = this;
                    this._queryParams = new Common.DependentSingletone(function () { return window.location.href; }, function () { return _this.parseQueryString(window.location); });
                    this._documentHTML = new Common.DependentSingletone(function () { return window.location.href; }, function () { return BD.$(document.documentElement).html(); });
                }
                DefaultPageScraper.prototype.documentHTML = function () {
                    return this._documentHTML.value();
                };
                DefaultPageScraper.prototype.queryParams = function () {
                    return this._queryParams.value();
                };
                DefaultPageScraper.prototype.parseQueryString = function (location) {
                    var searchArgs = location.search.substring(1).split('&');
                    var hashArgs = location.hash.substring(1).split('&');
                    var args = hashArgs.concat(searchArgs);
                    //if same param on both - search will win
                    var argsParsed = {};
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
                };
                DefaultPageScraper.prototype.testPatternsAgainstHTML = function (patterns) {
                    for (var i = 0; i < patterns.length; i++) {
                        var re = new RegExp("(^|[^a-z|A-Z])(" + patterns[i] + ")($|[^a-z|A-Z])", "ig");
                        var matches = this.documentHTML().match(re);
                        var count = matches ? matches.length : 0;
                        if (count)
                            return 1;
                    }
                    return 0;
                };
                // todo: ORIGINAL ERROR: usage of innetText will fail with older FF. Move to jQuery
                // todo: ORIGINAL ERROR: usage of evaluate (xpath) will fail with all IE
                DefaultPageScraper.prototype.getElementTextByReference = function (entries, accumulateAllMatches) {
                    var accessors = [
                        function (entry) { return entry.xpath && DefaultPageScraper.getElementByXpath(entry.xpath.trim()); },
                        function (entry) { return entry.id && document.querySelector("#" + entry.id.trim()); },
                        function (entry) { return entry.name && document.getElementsByName(entry.name.trim())[0]; },
                        function (entry) { return entry['class'] && document.querySelector("." + entry['class'].trim()); }
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
                        APP.Logger.warn("Failure in dedicated field parsing. Skipping field");
                    }
                    return elementTxt;
                };
                DefaultPageScraper.getInnerText = function (element) {
                    return element.innerText;
                };
                DefaultPageScraper.getElementByXpath = function (xpath) {
                    return document['evaluate'] && document['evaluate'](xpath, document, null, 9, null).singleNodeValue;
                };
                // todo: original used a home-grown inner text implementation - changed to inner text
                DefaultPageScraper.prototype.getFirstMatchText = function (selectors, fallbackText) {
                    if (fallbackText === void 0) { fallbackText = ""; }
                    for (var index = 0; index < selectors.length; index++) {
                        var selector = selectors[index];
                        var element = document.querySelector(selector);
                        if (element) {
                            var text = DefaultPageScraper.getInnerText(element);
                            if (text)
                                return text;
                        }
                    }
                    return fallbackText;
                };
                DefaultPageScraper.prototype.scrapeGenericPageWordCounts = function () {
                    // Search fields
                    var searchFields = document.querySelectorAll("input[type='search']");
                    var searchFieldsText = Common.Collection.select(Common.Collection.numValues(searchFields), function (x) { return x.value; }).join(" ");
                    var searchFieldsWords = Common.WordUtils.getNonTrivialWords(searchFieldsText);
                    // We want to count the search field words twice (give them double the weight)
                    var doubleSearchFieldsWords = [].concat(searchFieldsWords).concat(searchFieldsWords);
                    // H1 first texts
                    var firstH1Text = this.getFirstMatchText(["h1"]);
                    var firstH1Words = Common.WordUtils.getNonTrivialWords(firstH1Text);
                    // title
                    var titleWords = Common.WordUtils.getNonTrivialWords(document.title);
                    // text fields
                    var textFields = document.querySelectorAll("input[type='text']");
                    var textFieldsText = Common.Collection.select(Common.Collection.numValues(textFields), function (x) { return x.value; }).join(" ");
                    var textFieldsWords = Common.WordUtils.getNonTrivialWords(textFieldsText);
                    // queryParams values
                    var queryParamsText = Common.Collection.where(Common.Collection.values(this.queryParams()), function (x) { return x.length > 0; }).join(" ");
                    var queryParamsWords = Common.WordUtils.getNonTrivialWords(queryParamsText);
                    var words = [].concat(doubleSearchFieldsWords).concat(firstH1Words).concat(titleWords).concat(textFieldsWords).concat(queryParamsWords);
                    var wordCounts = Common.WordUtils.countWords(words);
                    return wordCounts;
                };
                DefaultPageScraper.prototype.getElementPosWithOffsets = function (element) {
                    return Common.HtmlHelper.getElementPosWithOffsets(element);
                };
                DefaultPageScraper.VALUELESS_PARAM = "";
                return DefaultPageScraper;
            })();
            Common.DefaultPageScraper = DefaultPageScraper;
        })(Common = APP.Common || (APP.Common = {}));
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));

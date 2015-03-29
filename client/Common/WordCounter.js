/// <reference path="Collection.ts"/>
/// <reference path="../Logger/Logger.ts"/>
var BD;
(function (BD) {
    var APP;
    (function (APP) {
        var Common;
        (function (Common) {
            var WordCounter = (function () {
                function WordCounter() {
                    this.words = [];
                }
                WordCounter.prototype.push = function (words, origin, multiply) {
                    if (multiply === void 0) { multiply = 1; }
                    for (var w = 0; w < words.length; w++) {
                        this.words.push({ word: words[w], origin: origin, count: multiply });
                    }
                };
                WordCounter.prototype.contains = function (word) {
                    for (var i = 0; i < this.words.length; i++) {
                        if (this.words[i].word == word) {
                            return true;
                        }
                    }
                    return false;
                };
                WordCounter.prototype.pushAndAmplify = function (words, origin, multiply) {
                    var _this = this;
                    if (multiply === void 0) { multiply = 1; }
                    Common.Collection.of(words).each(function (w) {
                        var shouldPush = multiply > 0 || _this.contains(w);
                        if (shouldPush) {
                            _this.words.push({ word: w, origin: origin, count: Math.abs(multiply) });
                        }
                    });
                };
                WordCounter.prototype.getWords = function () {
                    APP.Logger.log(this.describe());
                    var flatWords = [];
                    for (var i = 0; i < this.words.length; i++) {
                        var w = this.words[i];
                        for (var j = 0; j < w.count; j++) {
                            flatWords.push(w.word);
                        }
                    }
                    return flatWords;
                };
                WordCounter.prototype.describe = function () {
                    var desc = "Words: ";
                    for (var i = 0; i < this.words.length; i++) {
                        desc += "\n" + this.words[i].word + " (" + this.words[i].origin + " x " + this.words[i].count + ")";
                    }
                    return desc;
                };
                return WordCounter;
            })();
            Common.WordCounter = WordCounter;
        })(Common = APP.Common || (APP.Common = {}));
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));

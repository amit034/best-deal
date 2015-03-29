/// <reference path="Collection.ts"/>
/// <reference path="../Logger/Logger.ts"/>
module BD.APP.Common {


    export class WordCounter {
        private words:{word:string; origin:string; count:number}[] = [];

        push(words:string[], origin:string, multiply:number = 1) {
            for (var w = 0; w < words.length; w++) {
                this.words.push({word: words[w], origin: origin, count:multiply});
            }
        }

        contains(word:string):boolean{
            for (var i = 0; i < this.words.length; i++) {
                if (this.words[i].word == word){
                    return true;
                }
            }
            return false;
        }

        pushAndAmplify(words:string[], origin:string, multiply:number = 1){

            Collection.of(words).each(w => {
                var shouldPush = multiply > 0 || this.contains(w);
                if (shouldPush) {
                    this.words.push({word: w, origin: origin, count: Math.abs(multiply)});
                }
            });
        }



        getWords():string[] {
            Logger.log(this.describe());

            var flatWords:string[] = [];
            for (var i = 0; i < this.words.length; i++) {
                var w = this.words[i];

                for (var j = 0; j < w.count; j++) {
                    flatWords.push(w.word);
                }
            }

            return flatWords;
        }

        describe():string {

            var desc = "Words: ";
            for (var i = 0; i < this.words.length; i++) {
                desc += "\n" + this.words[i].word + " (" + this.words[i].origin + " x " + this.words[i].count + ")";
            }

            return desc;
        }

    }

}

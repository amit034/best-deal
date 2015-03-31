
/// <reference path="../External/BloomFilter.d.ts"/>
/// <reference path="AsyncHelper.ts"/>
/// <reference path="../External/JSON3" />


module BD.APP.Common {


    export interface MatchAndScore {
        match:string;
        score:number;
    }


    export class BlackWhiteListHelper {

        /***
         * Breaks down the host into testable fragments in order of decreasing specificity: Entire host, Domain with suffix, Just domain.
         * @param host {string}
         * @returns {string[]}
         */
        static breakdownHost():string[] {

            var host = document.location.host;
            var weird_cookie = 'weird_get_top_level_domain=cookie';
            var hostParts = host.split('.');

            for (var i = hostParts.length - 1; i >= 0; i--) {
                var partialDomain = hostParts.slice(i).join('.');
                document.cookie = weird_cookie + ';domain=.' + partialDomain + ';';

                if (document.cookie.indexOf(weird_cookie) > -1) {
                    document.cookie = weird_cookie.split('=')[0] + '=;domain=.' + partialDomain + ';expires=Thu, 01 Jan 1970 00:00:01 GMT;';

                    var subdomain = hostParts.slice(0, i).join(".");
                    var domain = hostParts[i];
                    var suffix = hostParts.slice(i + 1).join(".");
                    var prefix = document.location.protocol + "//";

                    //return [prefix + subdomain + "." + domain + "." + suffix,  subdomain + "." + domain + "." + suffix, domain + "." + suffix, domain];
                    return [subdomain + "." + domain + "." + suffix, domain + "." + suffix, domain];
                }
            }

            return [host];
        }

        static blackWhiteMatch(domains:string[], whiteUrl:string, blackUrl:string, verifyUrl:string) : Common.Promise<MatchAndScore> {
            var promises: {[index:string]: Common.Promise<string>} = {};
            if (whiteUrl != null) promises['white'] = jqGetPromise(whiteUrl);
            if (blackUrl != null) promises['black'] = jqGetPromise(blackUrl);
            return namedWhen2(promises).then((results:{[index: string]: any}) => {
                var whiteBloom = 'white' in results ? BlackWhiteListHelper.parseBloomFromResponse(results['white']) : null;
                var blackBloom = 'black' in results ? BlackWhiteListHelper.parseBloomFromResponse(results['black']) : null;

                // Initialize the chain with an undetermined result
                var chain:Promise<MatchAndScore> = resolve({match: null, score: 0});

                for (var i = 0; i < domains.length; i++) {
                    var value = domains[i].toLowerCase();
                    var closure = BlackWhiteListHelper.createTestMatchClosure(whiteBloom, blackBloom, verifyUrl, value);

                    chain = chain.then(closure);
                }


                return chain.logPassthrough("bw result");
            })
        }

        private static parseBloomFromResponse(response:string):BD.BloomFilter {
            var cleanResult = response.match(/\[.*\]/)[0];

            var bloomArray:number[] = JSON3.parse(cleanResult);
            return new BD.BloomFilter(bloomArray, 10);
        }

        private static createTestMatchClosure(whiteBloom:BD.BloomFilter, blackBloom:BD.BloomFilter, verifyUrl:string, value:string):(number) => Promise<MatchAndScore> {

            return ((prevResult:MatchAndScore) => {
                if (prevResult.score == 0) {
                    return BlackWhiteListHelper.testMatch(whiteBloom, blackBloom, verifyUrl, value);
                }
                else {
                    return resolve(prevResult)
                }
            });
        }

        private static testMatch(whiteBloom:BD.BloomFilter, blackBloom:BD.BloomFilter, verifyUrl:string, value:string):Promise<MatchAndScore> {
            //console.log("Testing against " + value);

            var whiteBloomMatched = whiteBloom && whiteBloom.test(value);
            var blackBloomMatched = blackBloom && blackBloom.test(value);

            if (verifyUrl && (whiteBloomMatched || blackBloomMatched)) {
                var url = verifyUrl + encodeURIComponent(value);

                return jqGetPromise(url).then((response) => {
                    var result = JSON3.parse(response);
                    var found = ("found" in result) ? (result["found"] ? 2 : -1) : 0;

                    if (found) Logger.log("WBL for " + value + ": " + found);
                    return {match: value, score: found};
                });
            }
            else if (whiteBloomMatched) {
                return resolve({match: value, score: 1});
            }
            else if (blackBloomMatched) {
                return resolve({match: value, score: -1});
            }
            else {
                return resolve({match: value, score: 0});
            }

        }




    }

}
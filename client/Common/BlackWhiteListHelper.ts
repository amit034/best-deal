
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

        static blackWhiteMatch(domains:string[],vertical, blackwhiteUrl:string ) : Common.Promise<MatchAndScore> {
            var promises: {[index:string]: Common.Promise<string>} = {};
            
           
            return jqGetPromise(blackwhiteUrl + "?vertical=" + vertical).then((result:any) => {
				var cleanResult = result.match(/\[.*\]/)[0];
				var json = JSON3.parse(result);	
			    var whiteBloom = json['white']? BlackWhiteListHelper.parseBloomFromResponse(json['white']) : null;
                var blackBloom = json['black'] ? BlackWhiteListHelper.parseBloomFromResponse(json['black']) : null;

                // Initialize the chain with an undetermined result
                var chain:Promise<MatchAndScore> = resolve({match: null, score: 0});

                for (var i = 0; i < domains.length; i++) {
                    var value = domains[i].toLowerCase();
                    var closure = BlackWhiteListHelper.createTestMatchClosure(whiteBloom, blackBloom, value);

                    chain = chain.then(closure);
                }


                return chain.logPassthrough("bw result");
            })
        }

        private static parseBloomFromResponse(bloomArray:number[]):BD.BloomFilter {
            
            return new BloomFilter(bloomArray, 10);
        }

        private static createTestMatchClosure(whiteBloom:BD.BloomFilter, blackBloom:BD.BloomFilter, value:string):(number) => Promise<MatchAndScore> {

            return ((prevResult:MatchAndScore) => {
                if (prevResult.score == 0) {
                    return BlackWhiteListHelper.testMatch(whiteBloom, blackBloom, value);
                }
                else {
                    return resolve(prevResult)
                }
            });
        }

        private static testMatch(whiteBloom:BD.BloomFilter, blackBloom:BD.BloomFilter, value:string):Promise<MatchAndScore> {
            //console.log("Testing against " + value);

            var whiteBloomMatched = whiteBloom && whiteBloom.test(value);
            var blackBloomMatched = blackBloom && blackBloom.test(value);

            if (whiteBloomMatched) {
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
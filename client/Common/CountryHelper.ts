/// <reference path="Promise"/>
/// <reference path="../External/jquery"/>
/// <reference path="../Context/IBaseContext"/>



module BD.APP.Common {

    export class CountryHelper {


        static getCountryPromise(context:Context.IBaseContext):Promise<string>{

            var countryOverride = window["BD_COUNTRY"];

            if (countryOverride) {
                Logger.log("Impersonating country " + countryOverride);
                return resolve(countryOverride);
            }
            else {
                var countryUrl = context.paths().apiRoot() + "/country";

                return Common.jqGetPromise(countryUrl).then((result) => {
                    var json = JSON3.parse(result);
                    return json.country;
                }).alwaysThen<string>((country:string, err:Rejection) => {

                    if (err && !country) {
                        Logger.warn("Failed getting Country.js for context.Defaulting to 'US': " + err.message);
                        country = "US";
                    }
                    else {
                        Logger.log("Country resolved as " + country);
                    }

                    return country;
                });
            }
        }

    }

}

/// <reference path="../Common/BlackWhiteListHelper" />
/// <reference path="../Common/Collection.ts" />
module BD.APP.Vertical {

    export class GamblingHelper {

       
        static classifyByBlackWhiteList(context:Context.IAppContext):Common.Promise<number> {

            
            var domainsToCheck = Common.BlackWhiteListHelper.breakdownHost();
            
            return Common.BlackWhiteListHelper.blackWhiteMatch(domainsToCheck,"gambling", context.paths().apiRoot() + "/bwl")
                .then((result:Common.MatchAndScore) => result.score);

            
        }


    }
}

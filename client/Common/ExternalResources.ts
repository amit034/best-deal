/// <reference path="Res" />
/// <reference path="NativeJSHelper" />
/// <reference path="Promise" />
/// <reference path="CommonHelper" />

 module BD.APP.Common {

    export class ExternalResources {


        static getJQuery(altExternalRoot:string):Promise<any> {

            return ExternalResources.patchExternalOrFallback(
                "//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js",
                -2041667497,
                ExternalResources.patchJQuery,
                altExternalRoot + 'jquery-1.11.1.js',
                ExternalResources.verifyJQuery
            ).then(() => window['BD'].$ = window['$'].noConflict(true))
        }

        private static patchJQuery(original:string):string {
            var toRemove = ',"function"==typeof define&&define.amd&&define("jquery",[],function(){return m})';
            var patched = original.replace(toRemove, '');

            if (patched.length != original.length - toRemove.length)
                throw new Error("Replace didnt take effect");

            return patched;
        }

        private static verifyJQuery():boolean {
            return window['$'].fn.jquery === "1.11.1";
        }


        static getKnockout(altExternalRoot:string):Promise<any> {

            return ExternalResources.patchExternalOrFallback(
                "//cdnjs.cloudflare.com/ajax/libs/knockout/3.2.0/knockout-min.js",
                1918310268,
                ExternalResources.patchKnockout,
                altExternalRoot + 'knockout-3.2.0.js',
                ExternalResources.verifyKnockout
            );
        }

        private static patchKnockout(original:string):string {

            var toRemove = '"function"===typeof require&&"object"===typeof exports&&"object"===typeof module?p(module.exports||exports,require):"function"===typeof define&&define.amd?define(["exports","require"],p):p(s';
            var replacement = 'p(s["BD"]';
            var patched = original.replace(toRemove, replacement);

            if (patched.length != original.length - toRemove.length + replacement.length)
                throw new Error("Replace didnt take effect");

            return patched;
        }

        private static verifyKnockout():boolean {
            return BD['ko']['version'] == "3.2.0";
        }




        private static patchExternalOrFallback(externalUrl:string, verificationHash:number, patch:(original:string) => string, altUrl:string, verification:() => boolean = () => true):Promise<any> {

            return ExternalResources.loadAndPatchExternal(externalUrl, verificationHash, patch).then(() => {
                if (!verification()) throw  new Error("External patch failed verification");
            }).alwaysThen((value, err) => {
                if (err) {
                    Logger.warn("Failed external patching on " + externalUrl + ": " + err.message);

                }
                return resolve(null);
            })


        }

        private static loadAndPatchExternal(externalUrl:string, verificationHash:number, patch:(original:string) => string):Promise<any> {
            return NativeJSHelper.nativeAjax(externalUrl).then((original:string) => {
                var originalHash = stringHash(original);
                if (originalHash != verificationHash)
                    throw new Error("Original didnt match verification hash");

                var patched = patch(original);
                eval(patched);
            });
        }


    }
}

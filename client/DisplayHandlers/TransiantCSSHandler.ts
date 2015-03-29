/// <reference path="IDisplayHandler"/>
/// <reference path="../Common/Res"/>


module BD.APP.DisplayHandlers {

    export class TransiantCSSHandler implements IDisplayHandler {

        private cssUrl:string;

        constructor(cssUrl:string) {
            this.cssUrl = cssUrl;
        }

        afterRender(jqElement:JQuery) {
            Common.Res.injectCss2(this.cssUrl);
        }

        remove() {
            $("link[rel='stylesheet'][href='" + this.cssUrl + "']").prop("disabled", true);
        }
    }

}

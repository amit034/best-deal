/// <reference path="IDisplayHandler"/>
/// <reference path="../External/dotdotdot.d.ts"/>
/// <reference path="../External/jquery.d.ts"/>

module BD.APP.DisplayHandlers {

    export class EllipsisHandler implements IDisplayHandler {

        afterRender(jqElement:JQuery) {
            jqElement.find(".elps").dotdotdot();
        }

    }

}

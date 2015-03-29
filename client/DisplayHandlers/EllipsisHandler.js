/// <reference path="IDisplayHandler"/>
/// <reference path="../External/dotdotdot.d.ts"/>
/// <reference path="../External/jquery.d.ts"/>
var BD;
(function (BD) {
    var APP;
    (function (APP) {
        var DisplayHandlers;
        (function (DisplayHandlers) {
            var EllipsisHandler = (function () {
                function EllipsisHandler() {
                }
                EllipsisHandler.prototype.afterRender = function (jqElement) {
                    jqElement.find(".elps").dotdotdot();
                };
                return EllipsisHandler;
            })();
            DisplayHandlers.EllipsisHandler = EllipsisHandler;
        })(DisplayHandlers = APP.DisplayHandlers || (APP.DisplayHandlers = {}));
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));

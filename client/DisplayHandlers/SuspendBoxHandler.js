/// <reference path="IDisplayHandler"/>
/// <reference path="../External/dotdotdot.d.ts"/>
/// <reference path="../External/jquery.d.ts"/>
var BD;
(function (BD) {
    var APP;
    (function (APP) {
        var DisplayHandlers;
        (function (DisplayHandlers) {
            var SuspendBoxHandler = (function () {
                function SuspendBoxHandler() {
                }
                SuspendBoxHandler.prototype.afterRender = function (jqElement) {
                    BD.$("body").click(function (e) { return SuspendBoxHandler.closeSuspendBox(e, jqElement); });
                    jqElement.click(function (e) { return SuspendBoxHandler.closeSuspendBox(e, jqElement); });
                    jqElement.find(".fo-suspend").click(function (e) { return SuspendBoxHandler.openSuspendBox(e, jqElement); });
                };
                SuspendBoxHandler.openSuspendBox = function (e, jqElement) {
                    jqElement.find(".fo-suspend-tooltip").addClass("shown");
                    e.stopPropagation();
                };
                SuspendBoxHandler.closeSuspendBox = function (e, jqElement) {
                    var inOptions = BD.$(e.target).closest(".fo-suspend-tooltip").length > 0;
                    if (!inOptions)
                        jqElement.find(".fo-suspend-tooltip").removeClass("shown");
                };
                return SuspendBoxHandler;
            })();
            DisplayHandlers.SuspendBoxHandler = SuspendBoxHandler;
        })(DisplayHandlers = APP.DisplayHandlers || (APP.DisplayHandlers = {}));
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));

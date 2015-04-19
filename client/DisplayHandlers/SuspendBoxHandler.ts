/// <reference path="IDisplayHandler"/>
/// <reference path="../External/dotdotdot.d.ts"/>
/// <reference path="../External/jquery.d.ts"/>

module BD.APP.DisplayHandlers {

    export class SuspendBoxHandler implements IDisplayHandler {

        afterRender(jqElement:JQuery) {
            $("body").click((e:Event) => SuspendBoxHandler.closeSuspendBox(e, jqElement));
            jqElement.click((e:Event) => SuspendBoxHandler.closeSuspendBox(e, jqElement));

            jqElement.find(".bd-suspend").click((e:Event) => SuspendBoxHandler.openSuspendBox(e, jqElement));
        }

        private static openSuspendBox(e: Event, jqElement:JQuery) {
            jqElement.find(".bd-suspend-tooltip").addClass("shown");
            e.stopPropagation();
        }

        private static closeSuspendBox(e: Event, jqElement:JQuery) {
            var inOptions = BD.$(e.target).closest(".bd-suspend-tooltip").length > 0;
            if (!inOptions) jqElement.find(".bd-suspend-tooltip").removeClass("shown");
        }

    }
}

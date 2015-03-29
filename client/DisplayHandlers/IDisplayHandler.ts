module BD.APP.DisplayHandlers {


    export interface IDisplayHandler {
        afterRender(jqElement:BD.JQuery, element:HTMLElement):void
        remove?():void
    }

}

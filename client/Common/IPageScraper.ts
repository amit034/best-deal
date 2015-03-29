module BD.APP.Common {


    export interface IPageScraper {
        testPatternsAgainstHTML(patterns:string[]):number;
        queryParams(): {[index:string]: string };

        getElementTextByReference(refs:IElementReference[], accumulateAllMatches:boolean):string
        getFirstMatchText(selectors:string[], fallbackText?:string):string;
        getElementPosWithOffsets(element:HTMLElement):ClientRect;
    }

    export interface IElementReference {
        id:string; class:string; xpath:string; name:string;
    }

}

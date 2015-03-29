
class Injector {

    private static altDocument:HTMLDocument = null;

    private static getAltDocument():HTMLDocument {
        if (Injector.altDocument == null) {
            var iframe:HTMLIFrameElement = document.createElement("iframe");
            iframe.height = iframe.width = "0";
            document.body.appendChild(iframe);
            Injector.altDocument = iframe.contentWindow.document;
        }

        return Injector.altDocument;
    }

    static injectScript(src:string, onLoad:()=>void, onError:(e:ErrorEvent)=>void):boolean {

        var script:HTMLScriptElement = null;
        var injectedNatively = true;
        var done = false;

        // Create script element
        var createElementFn = document.createElement;
        if (createElementFn.toString().indexOf("[native code]") > 0) {
            script = document.createElement("script");
        }
        else {
            script = Injector.getAltDocument().createElement.call(document, "script");
            injectedNatively = false;
        }

        script.onload = script.onreadystatechange = (e) => {
            if (!done && (!script.readyState || script.readyState === "loaded" || script.readyState === "complete") ) {
                done = true;
                script.parentNode && script.parentNode.removeChild(script);

                onLoad && window.setTimeout(() => {onLoad();}, 1);

            }
        };

        script.onerror = (e:ErrorEvent) => {
            if (!done) {
                done = true;
                onError && window.setTimeout(() => {onError(e);}, 1);
            }
        };


        // Append to head
        var head:HTMLHeadElement = document.getElementsByTagName("head")[0];

        var appendChildFn = head.appendChild;
        if (appendChildFn.toString().indexOf("[native code]") > 0) {
            head.appendChild(script);
        }
        else {
            Injector.getAltDocument().appendChild.call(head, script);
            injectedNatively = false;
        }

        // Set src only after append (see bing search results for example why)
        script.src = src;

        return injectedNatively;
    }

}
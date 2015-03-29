var Injector = (function () {
    function Injector() {
    }
    Injector.getAltDocument = function () {
        if (Injector.altDocument == null) {
            var iframe = document.createElement("iframe");
            iframe.height = iframe.width = "0";
            document.body.appendChild(iframe);
            Injector.altDocument = iframe.contentWindow.document;
        }
        return Injector.altDocument;
    };
    Injector.injectScript = function (src, onLoad, onError) {
        var script = null;
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
        script.onload = script.onreadystatechange = function (e) {
            if (!done && (!script.readyState || script.readyState === "loaded" || script.readyState === "complete")) {
                done = true;
                script.parentNode && script.parentNode.removeChild(script);
                onLoad && window.setTimeout(function () {
                    onLoad();
                }, 1);
            }
        };
        script.onerror = function (e) {
            if (!done) {
                done = true;
                onError && window.setTimeout(function () {
                    onError(e);
                }, 1);
            }
        };
        // Append to head
        var head = document.getElementsByTagName("head")[0];
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
    };
    Injector.altDocument = null;
    return Injector;
})();

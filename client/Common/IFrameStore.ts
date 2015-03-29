/// <reference path="Promise"/>
/// <reference path="IStore" />
/// <reference path="CommonHelper" />
/// <reference path="GlobalSpace" />
/// <reference path="IStore" />

/// <reference path="../Context/IPaths" />
/// <reference path="../External/JSON3" />
/// <reference path="HtmlHelper.ts" />
/// <reference path="../Logger/Logger.ts" />
module BD.APP.Common {

    export class IFrameStore {
        private iframePromise: Common.Promise<HTMLIFrameElement>;
        private paths:Context.IPaths = null;

        static REQUEST_TIMEOUT_MS:number = 300;

        constructor(paths:Context.IPaths, debug:boolean) {
            this.paths = paths;
            var iframeId = generateGuid(16);
            this.iframePromise = this.createIFrame(iframeId, paths.iframeStoreSrc(), debug);
        }

        //TODO: Implement timeout for HTML download - with 'WaitForPromise'
        private createIFrame(id:string, src:string, debug:boolean): Common.Promise<HTMLIFrameElement> {

            var d = defer<HTMLIFrameElement>();

            // Create IFrame
            var iframe:HTMLIFrameElement = document.createElement('iframe');
            iframe.id = id;
            iframe.src = debug ? src + "#debug" : src;
            iframe.style.position = "absolute";
            iframe.style.width = "1px";
            iframe.style.height = "1px";
            iframe.style.left = "-100px";
            iframe.style.top = "-100px";
            iframe.style.visibility = "hidden";

            HtmlHelper.appendToBody($(iframe));
            //document.body.appendChild(iframe);

            // Attach listener to handler query responses
            attachPostMessageHandler(window, this.createHandleCallback(this.paths.staticContentRoot()));
            Logger.log("IFrameStore setup");

            iframe.onload = () => {
            //    Logger.warn("IFrame loaded with onload")
            //    d.resolve(iframe);
                Logger.info("IFrame trying echo on onload");
                this.verifyIFramePromise(iframe)
                    .fail((err) => {
                        Logger.warn("IFrame echo failed");
                        var msg = err.message ? err.message : err + '';
                        d.reject({message: "Store IFrame echo after load failure: " + msg});
                    })
                    .done(() => {
                        Logger.info("Store IFrame alive and well.Loaded and echoes");
                        d.resolve(iframe);
                    })
            };

            iframe.onerror = (e:ErrorEvent) => {
                Logger.info("IFrame trying echo on onerror");
                this.verifyIFramePromise(iframe)
                    .fail((err) => {
                        Logger.warn("IFrame echo failed");
                        var msg = err.message ? e.message : err + '';
                        d.reject({message: "Store IFrame echo after error failure: " + msg});
                    })
                    .done(() => {
                        Logger.warn("Store IFrame alive and well even though error reported. WTF.")
                        d.resolve(iframe);
                    })
            };

            return d.promise();
        }

        private verifyIFramePromise(iframe:HTMLIFrameElement):Promise<any> {
            return this.postRequestPromise(iframe, "retrieveOrSet", true, "echo", "echo");
        }


        public postRequest(type:string, roundtrip:boolean, key?:string, value?:any): Promise<any> {
            return this.iframePromise.then((iframe) => this.postRequestPromise(iframe, type, roundtrip, key, value));
        }

        private postRequestPromise(iframe:HTMLIFrameElement, type:string, roundtrip:boolean, key?:string, value?:any): Promise<any> {

            // TODO: Interface for request.
            var d = defer<any>();
            var done = false;
            var requestId = generateGuid(9);
            window.setTimeout(() => {
                if (!done) {
                    done = true;
                    var rej:Rejection = { message: "IFrameStore request of type: " + type + ". key: " + key + ". Has timed out after " + IFrameStore.REQUEST_TIMEOUT_MS };
                    d.reject(rej);
                }
            }, IFrameStore.REQUEST_TIMEOUT_MS);

            // Store a callback (the resolution of the promise) associated with the request id in a GLOBAL map.
            if (roundtrip) {
                IFrameStore.getGlobalCallMap().store(requestId, (data) => {
                    if (!done) {
                        done = true;
                        d.resolve(data);
                    }
                });
            }


            var request = { id: requestId, type: type, key: key, value: value };
            var requestString = JSON3.stringify(request);
            iframe.contentWindow.postMessage(requestString, iframe.src);

            return d.promise();
        }

        private static getGlobalCallMap(): IStore {
            return new GlobalSpace("postMessageCallbacks");
        }


        // Dont have 'this' here - called by the window object.
        private createHandleCallback(rootUrl:string) {

            return (ev: IPostMessageEvent) => {
                var skipOriginCheck = false;
                var validOriginMaindomain = IFrameStore.getMainDomain(rootUrl);
                var originMainDomain = IFrameStore.getMainDomain(ev.origin);

                if (skipOriginCheck || originMainDomain == validOriginMaindomain) {
                    try {
                        var response:{id:string; value:any} = JSON3.parse(ev.data);
                        var callback:Function = IFrameStore.getGlobalCallMap().retriveAndRemove<(data:any) => any>(response.id);

                        if (callback) {
                            callback(response.value);
                        }
                        else {
                            //todo: handle this weird stuff
                            //Logger.warn("Unmatched response id: " + response.id);
                        }

                    }
                    catch (e) {
                    }
                }
            };
        }

        private static getMainDomain(host:string):string {

            if (host.indexOf("//localhost") != -1) return "localhost";

            var re = /\/\/[^\.]+\.((?:[^\.\/]*\.+)?[^\.\/]*)/gi
            var mainDomain = re.exec(host)[1]

            return mainDomain;
        }

        retrieveAll():Promise<{[index:string]: any}> {
            return this.postRequest("retrieveAll", true);
        }

        retrieveOrSet(key:string, value:any): Promise<any> {
            return this.postRequest("retrieveOrSet", true, key, value);
        }

        retrieve(key:string): Promise<any> {
            return this.postRequest("retrieve", true, key);
        }

        store(key:string, value:any) {
            this.postRequest("store", false, key, value);
        }

        storeAll(data: any) {
            this.postRequest("storeAll", false, null, data);
        }

    }

}


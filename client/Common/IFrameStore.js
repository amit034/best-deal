/// <reference path="Promise"/>
/// <reference path="IStore" />
/// <reference path="CommonHelper" />
/// <reference path="GlobalSpace" />
/// <reference path="IStore" />
/// <reference path="../Context/IPaths" />
/// <reference path="../External/JSON3" />
/// <reference path="HtmlHelper.ts" />
/// <reference path="../Logger/Logger.ts" />
var BD;
(function (BD) {
    var APP;
    (function (APP) {
        var Common;
        (function (Common) {
            var IFrameStore = (function () {
                function IFrameStore(paths, debug) {
                    this.paths = null;
                    this.paths = paths;
                    var iframeId = Common.generateGuid(16);
                    this.iframePromise = this.createIFrame(iframeId, paths.iframeStoreSrc(), debug);
                }
                //TODO: Implement timeout for HTML download - with 'WaitForPromise'
                IFrameStore.prototype.createIFrame = function (id, src, debug) {
                    var _this = this;
                    var d = Common.defer();
                    // Create IFrame
                    var iframe = document.createElement('iframe');
                    iframe.id = id;
                    iframe.src = debug ? src + "#debug" : src;
                    iframe.style.position = "absolute";
                    iframe.style.width = "1px";
                    iframe.style.height = "1px";
                    iframe.style.left = "-100px";
                    iframe.style.top = "-100px";
                    iframe.style.visibility = "hidden";
                    Common.HtmlHelper.appendToBody(BD.$(iframe));
                    //document.body.appendChild(iframe);
                    // Attach listener to handler query responses
                    attachPostMessageHandler(window, this.createHandleCallback(this.paths.staticContentRoot()));
                    APP.Logger.log("IFrameStore setup");
                    iframe.onload = function () {
                        //    Logger.warn("IFrame loaded with onload")
                        //    d.resolve(iframe);
                        APP.Logger.info("IFrame trying echo on onload");
                        _this.verifyIFramePromise(iframe).fail(function (err) {
                            APP.Logger.warn("IFrame echo failed");
                            var msg = err.message ? err.message : err + '';
                            d.reject({ message: "Store IFrame echo after load failure: " + msg });
                        }).done(function () {
                            APP.Logger.info("Store IFrame alive and well.Loaded and echoes");
                            d.resolve(iframe);
                        });
                    };
                    iframe.onerror = function (e) {
                        APP.Logger.info("IFrame trying echo on onerror");
                        _this.verifyIFramePromise(iframe).fail(function (err) {
                            APP.Logger.warn("IFrame echo failed");
                            var msg = err.message ? e.message : err + '';
                            d.reject({ message: "Store IFrame echo after error failure: " + msg });
                        }).done(function () {
                            APP.Logger.warn("Store IFrame alive and well even though error reported. WTF.");
                            d.resolve(iframe);
                        });
                    };
                    return d.promise();
                };
                IFrameStore.prototype.verifyIFramePromise = function (iframe) {
                    return this.postRequestPromise(iframe, "retrieveOrSet", true, "echo", "echo");
                };
                IFrameStore.prototype.postRequest = function (type, roundtrip, key, value) {
                    var _this = this;
                    return this.iframePromise.then(function (iframe) { return _this.postRequestPromise(iframe, type, roundtrip, key, value); });
                };
                IFrameStore.prototype.postRequestPromise = function (iframe, type, roundtrip, key, value) {
                    // TODO: Interface for request.
                    var d = Common.defer();
                    var done = false;
                    var requestId = Common.generateGuid(9);
                    window.setTimeout(function () {
                        if (!done) {
                            done = true;
                            var rej = { message: "IFrameStore request of type: " + type + ". key: " + key + ". Has timed out after " + IFrameStore.REQUEST_TIMEOUT_MS };
                            d.reject(rej);
                        }
                    }, IFrameStore.REQUEST_TIMEOUT_MS);
                    // Store a callback (the resolution of the promise) associated with the request id in a GLOBAL map.
                    if (roundtrip) {
                        IFrameStore.getGlobalCallMap().store(requestId, function (data) {
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
                };
                IFrameStore.getGlobalCallMap = function () {
                    return new Common.GlobalSpace("postMessageCallbacks");
                };
                // Dont have 'this' here - called by the window object.
                IFrameStore.prototype.createHandleCallback = function (rootUrl) {
                    return function (ev) {
                        var skipOriginCheck = false;
                        var validOriginMaindomain = IFrameStore.getMainDomain(rootUrl);
                        var originMainDomain = IFrameStore.getMainDomain(ev.origin);
                        if (skipOriginCheck || originMainDomain == validOriginMaindomain) {
                            try {
                                var response = JSON3.parse(ev.data);
                                var callback = IFrameStore.getGlobalCallMap().retriveAndRemove(response.id);
                                if (callback) {
                                    callback(response.value);
                                }
                                else {
                                }
                            }
                            catch (e) {
                            }
                        }
                    };
                };
                IFrameStore.getMainDomain = function (host) {
                    if (host.indexOf("//localhost") != -1)
                        return "localhost";
                    var re = /\/\/[^\.]+\.((?:[^\.\/]*\.+)?[^\.\/]*)/gi;
                    var mainDomain = re.exec(host)[1];
                    return mainDomain;
                };
                IFrameStore.prototype.retrieveAll = function () {
                    return this.postRequest("retrieveAll", true);
                };
                IFrameStore.prototype.retrieveOrSet = function (key, value) {
                    return this.postRequest("retrieveOrSet", true, key, value);
                };
                IFrameStore.prototype.retrieve = function (key) {
                    return this.postRequest("retrieve", true, key);
                };
                IFrameStore.prototype.store = function (key, value) {
                    this.postRequest("store", false, key, value);
                };
                IFrameStore.prototype.storeAll = function (data) {
                    this.postRequest("storeAll", false, null, data);
                };
                IFrameStore.REQUEST_TIMEOUT_MS = 300;
                return IFrameStore;
            })();
            Common.IFrameStore = IFrameStore;
        })(Common = APP.Common || (APP.Common = {}));
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));

var BD;
(function (BD) {
    var APP;
    (function (APP) {
        var Common;
        (function (Common) {
            function stringHash(source) {
                var hashValue = 0, i, chr, len;
                if (source.length == 0)
                    return hashValue;
                for (i = 0, len = source.length; i < len; i++) {
                    chr = source.charCodeAt(i);
                    hashValue = ((hashValue << 5) - hashValue) + chr;
                    hashValue |= 0; // Convert to 32bit integer
                }
                return hashValue;
            }
            Common.stringHash = stringHash;
            function randomInt(from, to) {
                var rnd = Math.random();
                return Math.floor(from + (to - from) * rnd);
            }
            Common.randomInt = randomInt;
            // fix length
            function generateGuid(length) {
                var guid = "";
                for (var i = 0; i < length; i++) {
                    var letter = (Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1));
                    guid = guid + letter;
                }
                return guid.substr(0, length);
            }
            Common.generateGuid = generateGuid;
            function generateUUID() {
                var s = [], itoh = '0123456789ABCDEF';
                for (var i = 0; i < 36; i++)
                    s[i] = Math.floor(Math.random() * 0x10);
                // Conform to RFC-4122, section 4.4
                s[14] = 4; // Set 4 high bits of time_high field to version
                s[19] = (s[19] & 0x3) | 0x8; // Specify 2 high bits of clock sequence
                for (var i = 0; i < 36; i++)
                    s[i] = itoh[s[i]];
                // Insert '-'s
                s[8] = s[13] = s[18] = s[23] = '-';
                return s.join('');
            }
            Common.generateUUID = generateUUID;
            function isEquivalent(a, b) {
                if (a == b) {
                    return true;
                }
                // Create arrays of property names
                var aProps = Object.getOwnPropertyNames(a);
                var bProps = Object.getOwnPropertyNames(b);
                // If number of properties is different,
                // objects are not equivalent
                if (aProps.length != bProps.length) {
                    return false;
                }
                for (var i = 0; i < aProps.length; i++) {
                    var propName = aProps[i];
                    // If values of same property are not equal,
                    // objects are not equivalent
                    if (!isEquivalent(a[propName], b[propName])) {
                        return false;
                    }
                }
                // If we made it this far, objects
                // are considered equivalent
                return true;
            }
            Common.isEquivalent = isEquivalent;
            function stringFormat(format) {
                var replacements = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    replacements[_i - 1] = arguments[_i];
                }
                var args = arguments;
                return format.replace(/{(\d+)}/g, function (match, numberString) {
                    var i = parseInt(numberString) + 1;
                    if (typeof args[i] == 'undefined')
                        throw Error("Failed matching format group " + match);
                    return args[i];
                });
            }
            Common.stringFormat = stringFormat;
            function namedStringFormat(format) {
                var replacements = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    replacements[_i - 1] = arguments[_i];
                }
                return format.replace(/{(\w+)}/g, function (match, group) {
                    for (var i = 0; i < replacements.length; i++) {
                        var replacement = replacements[i];
                        if (group in replacement) {
                            return replacement[group];
                        }
                    }
                    throw Error("Failed matching format group " + match);
                });
            }
            Common.namedStringFormat = namedStringFormat;
            function nameOf(instance) {
                var funcNameRegex = /function (.{1,})\(/;
                var results = (funcNameRegex).exec((instance).constructor.toString());
                return (results && results.length > 1) ? results[1] : "";
            }
            Common.nameOf = nameOf;
            function attachPostMessageHandler(target, handler) {
                if (target.addEventListener) {
                    target.addEventListener("message", handler, false);
                }
                else if (target.attachEvent) {
                    target.attachEvent("onmessage", handler);
                }
            }
            Common.attachPostMessageHandler = attachPostMessageHandler;
            function domainFromUrl(url) {
                var a = document.createElement('a');
                a.href = url;
                return a.hostname;
            }
            Common.domainFromUrl = domainFromUrl;
        })(Common = APP.Common || (APP.Common = {}));
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));
/// <reference path="IPaths.ts"/>
var BD;
(function (BD) {
    var APP;
    (function (APP) {
        var Context;
        (function (Context) {
            var Paths = (function () {
                function Paths(domain) {
                    this._domain = null;
                    this._domain = domain;
                }
                Paths.prototype.domain = function () {
                    return this._domain;
                };
                Paths.prototype.iframeStoreSrc = function () {
                    return (this.staticContentRoot() + "/Store.html");
                };
                Paths.prototype.outerResourcesRoot = function () {
                    return "//" + this._domain + "/External";
                };
                Paths.prototype.apiRoot = function () {
                    return "//" + this._domain + "";
                };
                Paths.prototype.staticContentRoot = function () {
                    return "//" + this._domain + "";
                };
                return Paths;
            })();
            Context.Paths = Paths;
        })(Context = APP.Context || (APP.Context = {}));
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));
var BD;
(function (BD) {
    var APP;
    (function (APP) {
        var AppParams = (function () {
            function AppParams() {
            }
            return AppParams;
        })();
        APP.AppParams = AppParams;
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));
/// <reference path="IPaths"/>
/// <reference path="../AppParams"/>
/// <reference path="../Context/IBaseContext"/>
var BD;
(function (BD) {
    var APP;
    (function (APP) {
        var Logger;
        (function (Logger) {
            var Analytics = (function () {
                function Analytics() {
                }
                //        static notify(context:Context.IBaseContext, notifyType:NotificationType, params:{[index:string]: string} = {}, defaultSamplingPercent:number = 1.0, useContextParams:boolean = true):boolean {
                //            var notificationTypeKey = notifyType.key;
                //            return Analytics.notifyX(context, notificationTypeKey, params, defaultSamplingPercent, useContextParams);
                //        }
                //
                //        private static notifyX(context:Context.IBaseContext, notifyType:string, params:{[index:string]: string} = {}, defaultSamplingPercent:number = 1.0, useContextParams:boolean = true):boolean {
                //
                //            try {
                //                // Determine if we should send this notification
                //                var overrideKey:string = "notifyrate." + notifyType;
                //                var samplingPercent:number =  defaultSamplingPercent;
                //
                //                var shouldNotify = (Math.random() < samplingPercent);
                //                if (!shouldNotify) return false;
                //
                //
                //                var url = Analytics.resolveUrl(context, notifyType, params, useContextParams);
                //
                //                // Inject an image with the url as source into the page - the most hassle free way to call a url
                //                var img:HTMLImageElement = <HTMLImageElement>document.body.appendChild(document.createElement("img"));
                //                img.style.zIndex = "-100";
                //                img.style.position = "absolute";
                //                img.style.left = "0";
                //                img.style.top = "0";
                //                img.src = url;
                //
                //                return true;
                //            }
                //            catch (e) {
                //                return false;
                //            }
                //        }
                //        static resolveUrl(context:Context.IBaseContext, notifyType:string, params:{[index:string]: string} = {}, useContextParams:boolean = true):string {
                //
                //            var mergedParams = Analytics.resolveParamaters(context, params, useContextParams);
                //            var qs = "";
                //
                //            for (var key in mergedParams) {
                //                if (qs.length > 0) qs += "&";
                //                qs += key + "=" + encodeURIComponent(mergedParams[key]);
                //            }
                //
                //            var url = context.paths().notifyRoot() + "/a/" + notifyType + "/logo.png?" + qs;
                //            return url;
                //        }
                //
                //        static resolveParamaters(context:Context.IBaseContext, params:{[index:string]: string} = {}, useContextParams:boolean = true):{[index:string]: string} {
                //
                //            var contextParams:{[index:string]: string} = context.notificationParams();
                //            var mergedParams:{[index:string]: string} = {};
                //
                //            if (useContextParams) {
                //                for (var key in contextParams) mergedParams[key] = contextParams[key];
                //            }
                //
                //            for (var key in params) mergedParams[key] = params[key];
                //
                //            if (!('t' in mergedParams)) mergedParams['t'] = new Date().getTime() + '';
                //
                //            if (mergedParams['pr'] && mergedParams['w']) {
                //                var rp = Analytics.resolveReportingProduct(mergedParams['pr'], mergedParams['w']);
                //                if (rp) mergedParams['rp'] = rp;
                //            }
                //
                //            return mergedParams;
                //        }
                Analytics.resolveReportingProduct = function (pr, w) {
                    if (pr == "pp" && w == "rs-dual")
                        return "rs";
                    if (pr == "pp" && w == "rsif")
                        return "rs";
                    if (pr == "pp" && w == "bs-dual")
                        return "bs";
                    if (pr == "pp" && w == "bsif")
                        return "rs";
                    if (pr == "pp" && w == "tb-dual")
                        return "tb";
                    if (pr == "universal-banner")
                        return "ub";
                    if (pr == "rb")
                        return "rb";
                    if (pr == "gb")
                        return "gb";
                    if (pr == "cpn")
                        return "cpn";
                    if (pr == "ppm")
                        return "rs";
                    return pr + "_" + w;
                };
                Analytics.notifyGenericUrl = function (url, params) {
                    if (params === void 0) { params = {}; }
                    try {
                        if (params) {
                            url = url + "?";
                            for (var key in params) {
                                var value = params[key] + '';
                                url = url + "&" + key + "=" + encodeURIComponent(value);
                            }
                        }
                        // Inject an image with the url as source into the page - the most hassle free way to call a url
                        var img = document.body.appendChild(document.createElement("img"));
                        img.style.zIndex = "-100";
                        img.style.position = "absolute";
                        img.style.left = "0";
                        img.style.top = "0";
                        img.src = url;
                        return true;
                    }
                    catch (e) {
                        return false;
                    }
                };
                Analytics.INJECTION = { key: 'inj' };
                Analytics.INIT = { key: 'init' };
                Analytics.USER = { key: 'usr' };
                Analytics.NO_SHOW = { key: 'noshow' };
                Analytics.IMPRESSION = { key: 'wo' };
                Analytics.HOVER = { key: 'ho' };
                Analytics.CLICK = { key: 'c' };
                Analytics.EXCEPTION = { key: 'exception' };
                return Analytics;
            })();
            Logger.Analytics = Analytics;
        })(Logger = APP.Logger || (APP.Logger = {}));
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));
var BD;
(function (BD) {
    var APP;
    (function (APP) {
        var Common;
        (function (Common) {
            /**
             * Main function giving a function stack trace with a forced or passed in Error
             *
             * @cfg {Error} e The error to create a stacktrace from (optional)
             * @cfg {Boolean} guess If we should try to resolve the names of anonymous functions
             * @return {Array} of Strings with functions, lines, files, and arguments where possible
             */
            function printStackTrace(options) {
                options = options || { guess: true };
                var ex = options.e || null, guess = !!options.guess, mode = options.mode || null;
                var p = new Stacktrace();
                var result = p.run(ex, mode);
                return (guess) ? p.guessAnonymousFunctions(result) : result;
            }
            Common.printStackTrace = printStackTrace;
            var Stacktrace = (function () {
                function Stacktrace() {
                    this.sourceCache = {};
                }
                Stacktrace.prototype.run = function (ex, mode) {
                    ex = ex || this.createException();
                    mode = mode || this.mode(ex);
                    if (mode === 'other') {
                        return this.other(arguments.callee);
                    }
                    else {
                        return this[mode](ex);
                    }
                };
                Stacktrace.prototype.createException = function () {
                    try {
                        this['undef']();
                    }
                    catch (e) {
                        return e;
                    }
                };
                /**
                 * Mode could differ for different exception, e.g.
                 * exceptions in Chrome may or may not have arguments or stack.
                 *
                 * @return {String} mode of operation for the exception
                 */
                Stacktrace.prototype.mode = function (e) {
                    if (e['arguments'] && e.stack) {
                        return 'chrome';
                    }
                    if (e.stack && e.sourceURL) {
                        return 'safari';
                    }
                    if (e.stack && e.number) {
                        return 'ie';
                    }
                    if (e.stack && e.fileName) {
                        return 'firefox';
                    }
                    if (e.message && e['opera#sourceloc']) {
                        // e.message.indexOf("Backtrace:") > -1 -> opera9
                        // 'opera#sourceloc' in e -> opera9, opera10a
                        // !e.stacktrace -> opera9
                        if (!e.stacktrace) {
                            return 'opera9'; // use e.message
                        }
                        if (e.message.indexOf('\n') > -1 && e.message.split('\n').length > e.stacktrace.split('\n').length) {
                            // e.message may have more stack entries than e.stacktrace
                            return 'opera9'; // use e.message
                        }
                        return 'opera10a'; // use e.stacktrace
                    }
                    if (e.message && e.stack && e.stacktrace) {
                        // e.stacktrace && e.stack -> opera10b
                        if (e.stacktrace.indexOf("called from line") < 0) {
                            return 'opera10b'; // use e.stacktrace, format differs from 'opera10a'
                        }
                        // e.stacktrace && e.stack -> opera11
                        return 'opera11'; // use e.stacktrace, format differs from 'opera10a', 'opera10b'
                    }
                    if (e.stack && !e.fileName) {
                        // Chrome 27 does not have e.arguments as earlier versions,
                        // but still does not have e.fileName as Firefox
                        return 'chrome';
                    }
                    return 'other';
                };
                /**
                 * Given a context, function name, and callback function, overwrite it so that it calls
                 * printStackTrace() first with a callback and then runs the rest of the body.
                 *
                 * @param {Object} context of execution (e.g. window)
                 * @param {String} functionName to instrument
                 * @param {Function} callback function to call with a stack trace on invocation
                 */
                Stacktrace.prototype.instrumentFunction = function (context, functionName, callback) {
                    context = context || window;
                    var original = context[functionName];
                    context[functionName] = function instrumented() {
                        callback.call(this, printStackTrace().slice(4));
                        return context[functionName]._instrumented.apply(this, arguments);
                    };
                    context[functionName]._instrumented = original;
                };
                /**
                 * Given a context and function name of a function that has been
                 * instrumented, revert the function to it's original (non-instrumented)
                 * state.
                 *
                 * @param {Object} context of execution (e.g. window)
                 * @param {String} functionName to de-instrument
                 */
                Stacktrace.prototype.deinstrumentFunction = function (context, functionName) {
                    if (context[functionName].constructor === Function && context[functionName]._instrumented && context[functionName]._instrumented.constructor === Function) {
                        context[functionName] = context[functionName]._instrumented;
                    }
                };
                /**
                 * Given an Error object, return a formatted Array based on Chrome's stack string.
                 *
                 * @param e - Error object to inspect
                 * @return Array<String> of function calls, files and line numbers
                 */
                Stacktrace.prototype.chrome = function (e) {
                    return (e.stack + '\n').replace(/^[\s\S]+?\s+at\s+/, ' at ').replace(/^\s+(at eval )?at\s+/gm, '').replace(/^([^\(]+?)([\n$])/gm, '{anonymous}() ($1)$2').replace(/^Object.<anonymous>\s*\(([^\)]+)\)/gm, '{anonymous}() ($1)').replace(/^(.+) \((.+)\)$/gm, '$1@$2').split('\n').slice(0, -1);
                };
                /**
                 * Given an Error object, return a formatted Array based on Safari's stack string.
                 *
                 * @param e - Error object to inspect
                 * @return Array<String> of function calls, files and line numbers
                 */
                Stacktrace.prototype.safari = function (e) {
                    return e.stack.replace(/\[native code\]\n/m, '').replace(/^(?=\w+Error\:).*$\n/m, '').replace(/^@/gm, '{anonymous}()@').split('\n');
                };
                /**
                 * Given an Error object, return a formatted Array based on IE's stack string.
                 *
                 * @param e - Error object to inspect
                 * @return Array<String> of function calls, files and line numbers
                 */
                Stacktrace.prototype.ie = function (e) {
                    return e.stack.replace(/^\s*at\s+(.*)$/gm, '$1').replace(/^Anonymous function\s+/gm, '{anonymous}() ').replace(/^(.+)\s+\((.+)\)$/gm, '$1@$2').split('\n').slice(1);
                };
                /**
                 * Given an Error object, return a formatted Array based on Firefox's stack string.
                 *
                 * @param e - Error object to inspect
                 * @return Array<String> of function calls, files and line numbers
                 */
                Stacktrace.prototype.firefox = function (e) {
                    return e.stack.replace(/(?:\n@:0)?\s+$/m, '').replace(/^(?:\((\S*)\))?@/gm, '{anonymous}($1)@').split('\n');
                };
                Stacktrace.prototype.opera11 = function (e) {
                    var ANON = '{anonymous}', lineRE = /^.*line (\d+), column (\d+)(?: in (.+))? in (\S+):$/;
                    var lines = e.stacktrace.split('\n'), result = [];
                    for (var i = 0, len = lines.length; i < len; i += 2) {
                        var match = lineRE.exec(lines[i]);
                        if (match) {
                            var location = match[4] + ':' + match[1] + ':' + match[2];
                            var fnName = match[3] || "global code";
                            fnName = fnName.replace(/<anonymous function: (\S+)>/, "$1").replace(/<anonymous function>/, ANON);
                            result.push(fnName + '@' + location + ' -- ' + lines[i + 1].replace(/^\s+/, ''));
                        }
                    }
                    return result;
                };
                Stacktrace.prototype.opera10b = function (e) {
                    // "<anonymous function: run>([arguments not available])@file://localhost/G:/js/stacktrace.js:27\n" +
                    // "printStackTrace([arguments not available])@file://localhost/G:/js/stacktrace.js:18\n" +
                    // "@file://localhost/G:/js/test/functional/testcase1.html:15"
                    var lineRE = /^(.*)@(.+):(\d+)$/;
                    var lines = e.stacktrace.split('\n'), result = [];
                    for (var i = 0, len = lines.length; i < len; i++) {
                        var match = lineRE.exec(lines[i]);
                        if (match) {
                            var fnName = match[1] ? (match[1] + '()') : "global code";
                            result.push(fnName + '@' + match[2] + ':' + match[3]);
                        }
                    }
                    return result;
                };
                /**
                 * Given an Error object, return a formatted Array based on Opera 10's stacktrace string.
                 *
                 * @param e - Error object to inspect
                 * @return Array<String> of function calls, files and line numbers
                 */
                Stacktrace.prototype.opera10a = function (e) {
                    // "  Line 27 of linked script file://localhost/G:/js/stacktrace.js\n"
                    // "  Line 11 of inline#1 script in file://localhost/G:/js/test/functional/testcase1.html: In function foo\n"
                    var ANON = '{anonymous}', lineRE = /Line (\d+).*script (?:in )?(\S+)(?:: In function (\S+))?$/i;
                    var lines = e.stacktrace.split('\n'), result = [];
                    for (var i = 0, len = lines.length; i < len; i += 2) {
                        var match = lineRE.exec(lines[i]);
                        if (match) {
                            var fnName = match[3] || ANON;
                            result.push(fnName + '()@' + match[2] + ':' + match[1] + ' -- ' + lines[i + 1].replace(/^\s+/, ''));
                        }
                    }
                    return result;
                };
                // Opera 7.x-9.2x only!
                Stacktrace.prototype.opera9 = function (e) {
                    // "  Line 43 of linked script file://localhost/G:/js/stacktrace.js\n"
                    // "  Line 7 of inline#1 script in file://localhost/G:/js/test/functional/testcase1.html\n"
                    var ANON = '{anonymous}', lineRE = /Line (\d+).*script (?:in )?(\S+)/i;
                    var lines = e.message.split('\n'), result = [];
                    for (var i = 2, len = lines.length; i < len; i += 2) {
                        var match = lineRE.exec(lines[i]);
                        if (match) {
                            result.push(ANON + '()@' + match[2] + ':' + match[1] + ' -- ' + lines[i + 1].replace(/^\s+/, ''));
                        }
                    }
                    return result;
                };
                // Safari 5-, IE 9-, and others
                Stacktrace.prototype.other = function (curr) {
                    var ANON = '{anonymous}', fnRE = /function(?:\s+([\w$]+))?\s*\(/, stack = [], fn, args, maxStackSize = 10;
                    var slice = Array.prototype.slice;
                    while (curr && stack.length < maxStackSize) {
                        fn = fnRE.test(curr.toString()) ? RegExp.$1 || ANON : ANON;
                        try {
                            args = slice.call(curr['arguments'] || []);
                        }
                        catch (e) {
                            args = ['Cannot access arguments: ' + e];
                        }
                        stack[stack.length] = fn + '(' + this.stringifyArguments(args) + ')';
                        try {
                            curr = curr.caller;
                        }
                        catch (e) {
                            stack[stack.length] = 'Cannot access caller: ' + e;
                            break;
                        }
                    }
                    return stack;
                };
                /**
                 * Given arguments array as a String, substituting type names for non-string types.
                 *
                 * @param {Arguments,Array} args
                 * @return {String} stringified arguments
                 */
                Stacktrace.prototype.stringifyArguments = function (args) {
                    var result = [];
                    var slice = Array.prototype.slice;
                    for (var i = 0; i < args.length; ++i) {
                        var arg = args[i];
                        if (arg === undefined) {
                            result[i] = 'undefined';
                        }
                        else if (arg === null) {
                            result[i] = 'null';
                        }
                        else if (arg.constructor) {
                            // TODO constructor comparison does not work for iframes
                            if (arg.constructor === Array) {
                                if (arg.length < 3) {
                                    result[i] = '[' + this.stringifyArguments(arg) + ']';
                                }
                                else {
                                    result[i] = '[' + this.stringifyArguments(slice.call(arg, 0, 1)) + '...' + this.stringifyArguments(slice.call(arg, -1)) + ']';
                                }
                            }
                            else if (arg.constructor === Object) {
                                result[i] = '#object';
                            }
                            else if (arg.constructor === Function) {
                                result[i] = '#function';
                            }
                            else if (arg.constructor === String) {
                                result[i] = '"' + arg + '"';
                            }
                            else if (arg.constructor === Number) {
                                result[i] = arg;
                            }
                            else {
                                result[i] = '?';
                            }
                        }
                    }
                    return result.join(',');
                };
                /**
                 * @return {String} the text from a given URL
                 */
                Stacktrace.prototype.ajax = function (url) {
                    var req = this.createXMLHTTPObject();
                    if (req) {
                        try {
                            req.open('GET', url, false);
                            //req.overrideMimeType('text/plain');
                            //req.overrideMimeType('text/javascript');
                            req.send(null);
                            //return req.status == 200 ? req.responseText : '';
                            return req.responseText;
                        }
                        catch (e) {
                        }
                    }
                    return '';
                };
                /**
                 * Try XHR methods in order and store XHR factory.
                 *
                 * @return {XMLHttpRequest} XHR function or equivalent
                 */
                Stacktrace.prototype.createXMLHTTPObject = function () {
                    var xmlhttp, XMLHttpFactories = [
                        function () {
                            return new XMLHttpRequest();
                        },
                        function () {
                            return new ActiveXObject('Msxml2.XMLHTTP');
                        },
                        function () {
                            return new ActiveXObject('Msxml3.XMLHTTP');
                        },
                        function () {
                            return new ActiveXObject('Microsoft.XMLHTTP');
                        }
                    ];
                    for (var i = 0; i < XMLHttpFactories.length; i++) {
                        try {
                            xmlhttp = XMLHttpFactories[i]();
                            // Use memoization to cache the factory
                            this.createXMLHTTPObject = XMLHttpFactories[i];
                            return xmlhttp;
                        }
                        catch (e) {
                        }
                    }
                };
                /**
                 * Given a URL, check if it is in the same domain (so we can get the source
                 * via Ajax).
                 *
                 * @param url {String} source url
                 * @return {Boolean} False if we need a cross-domain request
                 */
                Stacktrace.prototype.isSameDomain = function (url) {
                    return typeof location !== "undefined" && url.indexOf(location.hostname) !== -1; // location may not be defined, e.g. when running from nodejs.
                };
                /**
                 * Get source code from given URL if in the same domain.
                 *
                 * @param url {String} JS source URL
                 * @return {Array} Array of source code lines
                 */
                Stacktrace.prototype.getSource = function (url) {
                    // TODO reuse source from script tags?
                    if (!(url in this.sourceCache)) {
                        this.sourceCache[url] = this.ajax(url).split('\n');
                    }
                    return this.sourceCache[url];
                };
                Stacktrace.prototype.guessAnonymousFunctions = function (stack) {
                    for (var i = 0; i < stack.length; ++i) {
                        var reStack = /\{anonymous\}\(.*\)@(.*)/, reRef = /^(.*?)(?::(\d+))(?::(\d+))?(?: -- .+)?$/, frame = stack[i], ref = reStack.exec(frame);
                        if (ref) {
                            var m = reRef.exec(ref[1]);
                            if (m) {
                                var file = m[1], lineno = m[2], charno = m[3] || 0;
                                if (file && this.isSameDomain(file) && lineno) {
                                    var functionName = this.guessAnonymousFunction(file, lineno, charno);
                                    stack[i] = frame.replace('{anonymous}', functionName);
                                }
                            }
                        }
                    }
                    return stack;
                };
                Stacktrace.prototype.guessAnonymousFunction = function (url, lineNo, charNo) {
                    var ret;
                    try {
                        ret = this.findFunctionName(this.getSource(url), lineNo);
                    }
                    catch (e) {
                        ret = 'getSource failed with url: ' + url + ', exception: ' + e.toString();
                    }
                    return ret;
                };
                Stacktrace.prototype.findFunctionName = function (source, lineNo) {
                    // FIXME findFunctionName fails for compressed source
                    // (more than one function on the same line)
                    // function {name}({args}) m[1]=name m[2]=args
                    var reFunctionDeclaration = /function\s+([^(]*?)\s*\(([^)]*)\)/;
                    // {name} = function ({args}) TODO args capture
                    // /['"]?([0-9A-Za-z_]+)['"]?\s*[:=]\s*function(?:[^(]*)/
                    var reFunctionExpression = /['"]?([$_A-Za-z][$_A-Za-z0-9]*)['"]?\s*[:=]\s*function\b/;
                    // {name} = eval()
                    var reFunctionEvaluation = /['"]?([$_A-Za-z][$_A-Za-z0-9]*)['"]?\s*[:=]\s*(?:eval|new Function)\b/;
                    // Walk backwards in the source lines until we find
                    // the line which matches one of the patterns above
                    var code = "", line, maxLines = Math.min(lineNo, 20), m, commentPos;
                    for (var i = 0; i < maxLines; ++i) {
                        // lineNo is 1-based, source[] is 0-based
                        line = source[lineNo - i - 1];
                        commentPos = line.indexOf('//');
                        if (commentPos >= 0) {
                            line = line.substr(0, commentPos);
                        }
                        // TODO check other types of comments? Commented code may lead to false positive
                        if (line) {
                            code = line + code;
                            m = reFunctionExpression.exec(code);
                            if (m && m[1]) {
                                return m[1];
                            }
                            m = reFunctionDeclaration.exec(code);
                            if (m && m[1]) {
                                //return m[1] + "(" + (m[2] || "") + ")";
                                return m[1];
                            }
                            m = reFunctionEvaluation.exec(code);
                            if (m && m[1]) {
                                return m[1];
                            }
                        }
                    }
                    return '(?)';
                };
                return Stacktrace;
            })();
        })(Common = APP.Common || (APP.Common = {}));
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));
/// <reference path="../Context/Paths"/>
/// <reference path="../Context/IBaseContext"/>
/// <reference path="Analytics"/>
/// <reference path="../Common/Stacktrace" />
// todo: refactor logging
var BD;
(function (BD) {
    var APP;
    (function (APP) {
        var Logger;
        (function (Logger) {
            (function (LogLevel) {
                //OFF = Number.MAX_VALUE,
                LogLevel[LogLevel["FATAL"] = 50000] = "FATAL";
                LogLevel[LogLevel["ERROR"] = 40000] = "ERROR";
                LogLevel[LogLevel["WARN"] = 30000] = "WARN";
                LogLevel[LogLevel["INFO"] = 20000] = "INFO";
                LogLevel[LogLevel["LOG"] = 15000] = "LOG";
                LogLevel[LogLevel["DEBUG"] = 10000] = "DEBUG";
                LogLevel[LogLevel["TRACE"] = 5000] = "TRACE";
            })(Logger.LogLevel || (Logger.LogLevel = {}));
            var LogLevel = Logger.LogLevel;
            var levelToConsoleFunc = {
                10000: function (msg) { return console.debug(msg); },
                15000: function (msg) { return console.log(msg); },
                20000: function (msg) { return console.info(msg); },
                30000: function (msg) { return console.warn(msg); },
                40000: function (msg) { return console.error(msg); }
            };
            Logger.logToConsole;
            Logger.logstack;
            Logger.callHomeLevel = 40000 /* ERROR */;
            Logger.logContext;
            function intialize(context) {
                Logger.logContext = context;
                Logger.logToConsole = context.isDebugMode();
                if (window['FO_NATIVE_DEBUG']) {
                    if (console.log) {
                        Logger.log = console.log.bind(console);
                        Logger.info = (console.info) ? console.info.bind(console) : console.log.bind(console);
                        Logger.warn = (console.warn) ? console.warn.bind(console) : console.log.bind(console);
                        Logger.error = (console.error) ? console.error.bind(console) : console.log.bind(console);
                        Logger.time = (console.time) ? console.time.bind(console) : console.log.bind(console);
                        Logger.timeEnd = (console.timeEnd) ? console.timeEnd.bind(console) : console.log.bind(console);
                    }
                }
            }
            Logger.intialize = intialize;
            function time(title) {
                if (Logger.logToConsole && console.time)
                    console.time(title);
                log("TIMER_START: " + title);
            }
            Logger.time = time;
            function timeEnd(title) {
                if (Logger.logToConsole && console.timeEnd)
                    console.timeEnd(title);
                if (Logger.logstack) {
                    for (var i = 0; i < Logger.logstack.length; i++) {
                        var event = Logger.logstack[i];
                        if (event.msg == "TIMER_START: " + title) {
                            var elapsed = Date.now() - event.time;
                            log("TIMER END: " + title + "(" + elapsed + "ms elapsed)");
                            return elapsed;
                        }
                    }
                }
            }
            Logger.timeEnd = timeEnd;
            function log(msg) {
                logEvent(15000 /* LOG */, msg);
            }
            Logger.log = log;
            function info(msg) {
                logEvent(20000 /* INFO */, msg);
            }
            Logger.info = info;
            function warn(msg) {
                logEvent(30000 /* WARN */, msg);
            }
            Logger.warn = warn;
            function error(msg) {
                logEvent(40000 /* ERROR */, msg);
            }
            Logger.error = error;
            function logEvent(level, msg) {
                try {
                    var caller = getCaller();
                    if (Logger.logToConsole) {
                        var logFunc = levelToConsoleFunc[level];
                        if (!logFunc)
                            logFunc = function (msg) { return console.log(msg); };
                        var msgEx = "FO - " + (caller ? msg + " @ " + caller : msg);
                        logFunc(msgEx);
                    }
                    //if (level >= LogLevel.ERROR) {
                    //    Logger.Analytics.notifyX(logContext, "noshow", { 'reason': 'exception', 'sreason': msg }, 0);
                    //}
                    if (!Logger.logstack)
                        Logger.logstack = [];
                    var event = {
                        time: Date.now(),
                        level: level,
                        msg: msg,
                        source: caller
                    };
                    Logger.logstack.push(event);
                    if (event.level >= Logger.callHomeLevel) {
                        callHome(Logger.logstack);
                    }
                }
                catch (e) {
                }
            }
            function getCaller() {
                try {
                    var st = APP.Common.printStackTrace();
                    var callerLine = st[6];
                    var callerFunc = callerLine.match(/^[^@]*/)[0];
                    if (callerFunc == "{anonymous}()") {
                        return null;
                    }
                    return callerFunc;
                }
                catch (e) {
                    return null;
                }
            }
            function callHome(events) {
                try {
                    var errorsString = "";
                    for (var i = 0; i < events.length; i++) {
                        var event = events[i];
                        if (event.level >= 30000 /* WARN */ && typeof event.msg == 'string') {
                            if (errorsString.length > 0)
                                errorsString += " --- ";
                            errorsString += LogLevel[event.level] + " " + event.msg;
                        }
                    }
                    // If so many errors the query string will be too long - just send the last part (latest errors)
                    if (errorsString.length > 1024)
                        errorsString = errorsString.substr(errorsString.length - 1024);
                    var params = {
                        'ex': errorsString
                    };
                }
                catch (e) {
                }
            }
            //    export function notify(paths:Context.IPaths, type:string, params:{[index:string]: Object} = {}, samplingPercent:number = 1.0):void {
            //        try {
            //            params['f'] = "nwp";
            //            params['v'] = "{{VERSION}}";
            //
            //            Analytics.notify(paths, type, params, samplingPercent);
            //        }
            //        catch (e) { }
            //    }
            function flushToConsole() {
                printEvents(Logger.logstack);
            }
            Logger.flushToConsole = flushToConsole;
            function printEvents(events) {
                if (events) {
                    for (var i = 0; i < events.length; i++) {
                        var event = events[i];
                        if (event.level == 10000 /* DEBUG */)
                            console.debug(event.msg);
                        if (event.level == 15000 /* LOG */)
                            console.log(event.msg);
                        if (event.level == 20000 /* INFO */)
                            console.info(event.msg);
                        if (event.level == 30000 /* WARN */)
                            console.warn(event.msg);
                        if (event.level == 40000 /* ERROR */)
                            console.error(event.msg);
                    }
                }
            }
            //    function getCaller():string {
            //
            //        try {
            //            throw Error('');
            //        }
            //        catch (e) {
            //            var stack = e.stack.split("\n");
            //
            //            if (stack && stack.length > 5) {
            //                return stack.splice(5).join("\n");
            //            }
            //            else {
            //                return stack;
            //            }
            //        }
            //    }
            function expect(title, condition, withinMS) {
                window.setTimeout(function () {
                    for (var i = 0; i < Logger.logstack.length; i++) {
                        var event = Logger.logstack[i];
                        var passed = condition(event, Logger.logstack);
                        if (passed) {
                            // todo: remove this
                            //console.log("Expect passed " + title)
                            return;
                        }
                    }
                    error("Failure on EXPECT " + title);
                }, withinMS);
            }
            Logger.expect = expect;
        })(Logger = APP.Logger || (APP.Logger = {}));
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));
/// <reference path="CommonHelper.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var BD;
(function (BD) {
    var APP;
    (function (APP) {
        var Common;
        (function (Common) {
            var Collection = (function () {
                function Collection(source) {
                    this.source = null;
                    this.source = source;
                }
                Collection.of = function (source) {
                    return new Collection(source);
                };
                Collection.ofElements = function (source) {
                    var array = [];
                    for (var i = 0; i < source.length; i++) {
                        array.push(source.item(i));
                    }
                    return new Collection(array);
                };
                Collection.empty = function () {
                    return new Collection([]);
                };
                Collection.prototype.length = function () {
                    return this.source.length;
                };
                Collection.prototype.getItem = function (index) {
                    return this.source[index];
                };
                Collection.prototype.each = function (fn) {
                    Collection.each(this.source, fn);
                };
                Collection.prototype.select = function (fn) {
                    return Collection.of(Collection.select(this.source, fn));
                };
                Collection.prototype.slice = function (startIndex, endIndex) {
                    var newArray = [];
                    for (var i = startIndex; i < endIndex; i++) {
                        newArray.push(this.source[i]);
                    }
                    return new Collection(newArray);
                };
                Collection.prototype.stableSort = function (fn) {
                    /**
                     * Merge sort (http://en.wikipedia.org/wiki/Merge_sort)
                     */
                    function mergeSort(arr, compareFn) {
                        if (arr == null) {
                            return [];
                        }
                        else if (arr.length < 2) {
                            return arr;
                        }
                        if (compareFn == null) {
                            compareFn = defaultCompare;
                        }
                        var mid, left, right;
                        mid = ~~(arr.length / 2);
                        left = mergeSort(arr.slice(0, mid), compareFn);
                        right = mergeSort(arr.slice(mid, arr.length), compareFn);
                        return merge(left, right, compareFn);
                    }
                    function defaultCompare(a, b) {
                        return a < b ? -1 : (a > b ? 1 : 0);
                    }
                    function merge(left, right, compareFn) {
                        var result = [];
                        while (left.length && right.length) {
                            if (compareFn(left[0], right[0]) <= 0) {
                                // if 0 it should preserve same order (stable)
                                result.push(left.shift());
                            }
                            else {
                                result.push(right.shift());
                            }
                        }
                        if (left.length) {
                            result.push.apply(result, left);
                        }
                        if (right.length) {
                            result.push.apply(result, right);
                        }
                        return result;
                    }
                    var newSource = mergeSort(this.source, fn);
                    return Collection.of(newSource);
                };
                Collection.prototype.sort = function (fn) {
                    var newSource = this.source.slice(0);
                    newSource.sort(fn);
                    return Collection.of(newSource);
                };
                Collection.prototype.orderBy = function (fn) {
                    return this.sort(function (a, b) { return fn(a) - fn(b); });
                };
                Collection.prototype.orderByDesc = function (fn) {
                    return this.sort(function (a, b) { return fn(b) - fn(a); });
                };
                Collection.prototype.where = function (fn) {
                    return Collection.of(Collection.where(this.source, fn));
                };
                Collection.prototype.skip = function (count) {
                    if (count >= this.source.length) {
                        return new Collection([]);
                    }
                    else {
                        var newSource = this.source.slice(count);
                        return Collection.of(newSource);
                    }
                };
                Collection.prototype.take = function (count) {
                    var newSource = this.source.slice(0, count);
                    return Collection.of(newSource);
                };
                Collection.prototype.firstOrValue = function (value) {
                    return this.source.length ? this.source[0] : value;
                };
                Collection.prototype.first = function (fn) {
                    for (var i = 0; i < this.source.length; i++) {
                        if (fn(this.source[i]))
                            return this.source[i];
                    }
                    return null;
                };
                Collection.prototype.count = function (fn) {
                    return Collection.count(this.source, fn);
                };
                Collection.prototype.any = function (fn) {
                    return Collection.any(this.source, fn);
                };
                Collection.prototype.mergeCol = function (other) {
                    var merged = this.source.concat(other.source);
                    return Collection.of(merged);
                };
                Collection.prototype.merge = function (other) {
                    var merged = this.source.concat(other);
                    return Collection.of(merged);
                };
                Collection.prototype.normalize = function (selector, setter, min, max) {
                    if (min === void 0) { min = 0; }
                    if (max === void 0) { max = 1; }
                    if (this.length() == 0)
                        return;
                    var minValue = selector(this.minBy(selector));
                    var maxValue = selector(this.maxBy(selector));
                    this.each(function (item) {
                        var rawValue = selector(item);
                        var normValue = maxValue > minValue ? (rawValue - minValue) / (maxValue - minValue) : (max - min / 2);
                        setter(item, normValue);
                    });
                };
                Collection.prototype.distinct = function (keySelector) {
                    return Collection.of(Collection.distinct(this.source, keySelector));
                };
                Collection.prototype.sum = function (selector) {
                    return Collection.aggregate(this.source, 0, function (item, prevSum) { return prevSum + selector(item); });
                };
                Collection.prototype.maxBy = function (selector) {
                    return Collection.maxBy(this.source, selector);
                };
                Collection.prototype.minBy = function (selector) {
                    return Collection.maxBy(this.source, function (e) { return -selector(e); });
                };
                Collection.prototype.stringJoin = function (seperator) {
                    return this.source.join(seperator);
                };
                Collection.prototype.groupBy = function (keySelector) {
                    var groupedHash = Collection.orderedGroupByString(this.source, keySelector);
                    return groupedHash;
                };
                Collection.prototype.selectMany = function (selector) {
                    var results = [];
                    this.each(function (item) { return results = results.concat(selector(item)); });
                    return Collection.of(results);
                };
                Collection.prototype.selectFirst = function (selector, validCondition) {
                    if (validCondition === void 0) { validCondition = function (result) { return !!result; }; }
                    for (var i = 0; i < this.source.length; i++) {
                        var itemResult = selector(this.source[i]);
                        if (validCondition(itemResult))
                            return itemResult;
                    }
                    return null;
                };
                Collection.prototype.toMap = function (keySelector, valueSelector) {
                    var keyedCollection = this.select(function (x) {
                        return { key: keySelector(x), value: valueSelector(x) };
                    });
                    return new Map(keyedCollection.toArray());
                };
                Collection.prototype.toHashmap = function (keySelector) {
                    return Collection.toHashmap(this.source, keySelector);
                };
                Collection.prototype.toHashmap2 = function (keySelector, valueSelector) {
                    return Collection.toHashmap2(this.source, keySelector, valueSelector);
                };
                Collection.prototype.toArray = function () {
                    return this.source;
                };
                // Statics
                Collection.count = function (source, fn) {
                    var count = 0;
                    for (var i = 0; i < source.length; i++) {
                        if (fn(source[i]))
                            count++;
                    }
                    return count;
                };
                Collection.any = function (source, fn) {
                    for (var i = 0; i < source.length; i++) {
                        if (fn(source[i]))
                            return true;
                    }
                    return false;
                };
                Collection.each = function (source, fn) {
                    for (var i = 0; i < source.length; i++) {
                        fn(source[i], i);
                    }
                };
                Collection.hashEach = function (source, fn) {
                    for (var key in source) {
                        if (source.hasOwnProperty(key)) {
                            fn(key, source[key]);
                        }
                    }
                };
                Collection.select = function (source, fn) {
                    var results = [];
                    for (var i = 0; i < source.length; i++) {
                        var res = fn(source[i], i);
                        results.push(res);
                    }
                    return results;
                };
                Collection.where = function (source, fn) {
                    var results = [];
                    for (var i = 0; i < source.length; i++) {
                        var res = fn(source[i]);
                        if (res)
                            results.push(source[i]);
                    }
                    return results;
                };
                Collection.filterSelect = function (source, fn) {
                    var results = [];
                    for (var i = 0; i < source.length; i++) {
                        var res = fn(source[i]);
                        if (res != null)
                            results.push(res);
                    }
                    return results;
                };
                Collection.flatMap = function (source) {
                    var results = [];
                    for (var i = 0; i < source.length; i++) {
                        results = results.concat(source[i]);
                    }
                    return results;
                };
                Collection.distinct = function (source, keySelector) {
                    var map = {};
                    var results = [];
                    for (var i = 0; i < source.length; i++) {
                        var item = source[i];
                        var key = keySelector(item);
                        if (!(key in map)) {
                            map[keySelector(item)] = true;
                            results.push(item);
                        }
                    }
                    return results;
                };
                Collection.exclude = function (source, exclude) {
                    var result = [];
                    for (var i = 0; i < source.length; i++) {
                        var matched = false;
                        for (var j = 0; j < exclude.length; i++) {
                            if (source[i].toLowerCase() == exclude[j].toLowerCase()) {
                                matched = true;
                                break;
                            }
                        }
                        if (!matched)
                            result.push(source[i]);
                    }
                    return result;
                };
                Collection.contains = function (source, value) {
                    for (var i = 0; i < source.length; i++) {
                        if (source[i].toLowerCase() == value.toLowerCase())
                            return true;
                    }
                    return false;
                };
                Collection.groupByString = function (source, keySelector) {
                    var group = {};
                    for (var i = 0; i < source.length; i++) {
                        var item = source[i];
                        var key = keySelector(item);
                        if (!(key in group))
                            group[key] = [];
                        group[key].push(item);
                    }
                    return group;
                };
                Collection.orderedGroupByString = function (source, keySelector) {
                    var group = {};
                    var ordered = [];
                    for (var i = 0; i < source.length; i++) {
                        var item = source[i];
                        var key = keySelector(item);
                        if (!(key in group)) {
                            ordered.push({ key: key, value: [] });
                            group[key] = ordered.length - 1;
                        }
                        var index = group[key];
                        ordered[index].value.push(item);
                    }
                    return new Map(ordered);
                };
                Collection.hashSelect = function (source, transform) {
                    var result = {};
                    for (var key in source) {
                        if (source.hasOwnProperty(key)) {
                            result[key] = transform(source[key]);
                        }
                    }
                    return result;
                };
                Collection.aggregate = function (source, initialValue, fn) {
                    var agg = initialValue;
                    for (var i = 0; i < source.length; i++) {
                        agg = fn(source[i], agg);
                    }
                    return agg;
                };
                Collection.hashAggregate = function (source, initialValue, fn) {
                    var agg = initialValue;
                    for (var key in source) {
                        var value = source[key];
                        agg = fn(key, value, agg);
                    }
                    return agg;
                };
                Collection.sum = function (source, selector) {
                    return Collection.aggregate(source, 0, function (item, prevSum) { return prevSum + selector(item); });
                };
                Collection.hashSum = function (source, selector) {
                    return Collection.hashAggregate(source, 0, function (key, value, prevSum) { return prevSum + selector(key, value); });
                };
                Collection.values = function (dict) {
                    var values = [];
                    for (var key in dict) {
                        values.push(dict[key]);
                    }
                    return values;
                };
                Collection.numValues = function (dict) {
                    var values = [];
                    for (var key in dict) {
                        values.push(dict[key]);
                    }
                    return values;
                };
                Collection.maxBy = function (source, selector) {
                    var bestResult = null;
                    var bestItem = null;
                    for (var i = 0; i < source.length; i++) {
                        var result = selector(source[i]);
                        if (bestResult == null || result > bestResult) {
                            bestResult = result;
                            bestItem = source[i];
                        }
                    }
                    return bestItem;
                };
                Collection.intersect = function (first, second) {
                    var result = [];
                    for (var f = 0; f < first.length; f++) {
                        for (var s = 0; s < second.length; s++) {
                            if (first[f] == second[s]) {
                                result.push(first[f]);
                                break;
                            }
                        }
                    }
                    return result;
                };
                Collection.getKeys = function (source) {
                    var keys = [];
                    for (var key in source) {
                        keys.push(key);
                    }
                    return keys;
                };
                Collection.toArray = function (source, selector) {
                    var result = [];
                    for (var key in source) {
                        var value = source[key];
                        var record = selector(key, value);
                        result.push(record);
                    }
                    return result;
                };
                Collection.valuesCollection = function (source) {
                    var values = [];
                    for (var key in source) {
                        if (source.hasOwnProperty(key)) {
                            values.push(source[key]);
                        }
                    }
                    return Collection.of(values);
                };
                Collection.toHashmap = function (source, keySelector) {
                    return Collection.toHashmap2(source, keySelector, function (x) { return x; });
                };
                Collection.toHashmap2 = function (source, keySelector, valueSelector) {
                    var hashmap = {};
                    for (var i = 0; i < source.length; i++) {
                        var item = source[i];
                        var resultItem = valueSelector(item);
                        var key = keySelector(item);
                        hashmap[key] = resultItem;
                    }
                    return hashmap;
                };
                Collection.join = function (firstSource, secondSource, comparerSelector) {
                    var results = [];
                    for (var f = 0; f < firstSource.length; f++) {
                        var first = firstSource[f];
                        for (var s = 0; s < secondSource.length; s++) {
                            var second = secondSource[s];
                            var resultItem = comparerSelector(first, second);
                            if (resultItem != null) {
                                results.push(resultItem);
                            }
                        }
                    }
                    return results;
                };
                Collection.hashMerge = function (first, second, onConflict) {
                    if (onConflict === void 0) { onConflict = Collection.hashMergeDefaultConflictFn; }
                    var result = {};
                    Collection.hashEach(first, function (key, value) { return result[key] = value; });
                    Collection.hashEach(second, function (key, value) {
                        if (key in result) {
                            result[key] = onConflict(key, result[key], value);
                        }
                        else {
                            result[key] = value;
                        }
                    });
                    return result;
                };
                Collection.hashMergeDefaultConflictFn = function (key, first, second) {
                    throw new Error("Conflict on hash merge. Key: " + key + ". First: " + first + ". Second: " + second);
                    return null;
                };
                Collection.recurseElements = function (root, fn, parentElement) {
                    if (parentElement === void 0) { parentElement = null; }
                    var flowBreak = fn(root, parentElement);
                    if (flowBreak == 1 /* BREAK_NODE */ || flowBreak == 2 /* BREAK_ALL */)
                        return flowBreak;
                    for (var i = 0; i < root.children.length; i++) {
                        var child = root.children.item(i);
                        var childFlowBreak = Collection.recurseElements(child, fn);
                        if (childFlowBreak == 2 /* BREAK_ALL */)
                            return 2 /* BREAK_ALL */;
                    }
                    return flowBreak;
                };
                Collection.recurseNodes = function (root, fn, parentElement) {
                    if (parentElement === void 0) { parentElement = null; }
                    var flowBreak = fn(root, parentElement);
                    if (flowBreak == 1 /* BREAK_NODE */ || flowBreak == 2 /* BREAK_ALL */)
                        return flowBreak;
                    for (var i = 0; i < root.childNodes.length; i++) {
                        var child = root.childNodes.item(i);
                        var childFlowBreak = Collection.recurseNodes(child, fn);
                        if (childFlowBreak == 2 /* BREAK_ALL */)
                            return 2 /* BREAK_ALL */;
                    }
                    return flowBreak;
                };
                Collection.repeatString = function (value, count) {
                    var arr = [];
                    for (var i = 0; i < count; i++) {
                        arr.push(value);
                    }
                    return arr;
                };
                return Collection;
            })();
            Common.Collection = Collection;
            var Pair = (function () {
                function Pair() {
                }
                return Pair;
            })();
            Common.Pair = Pair;
            (function (RecursionFlow) {
                RecursionFlow[RecursionFlow["CONTINUE"] = 0] = "CONTINUE";
                RecursionFlow[RecursionFlow["BREAK_NODE"] = 1] = "BREAK_NODE";
                RecursionFlow[RecursionFlow["BREAK_ALL"] = 2] = "BREAK_ALL";
            })(Common.RecursionFlow || (Common.RecursionFlow = {}));
            var RecursionFlow = Common.RecursionFlow;
            var Map = (function (_super) {
                __extends(Map, _super);
                function Map(source) {
                    _super.call(this, source);
                }
                Map.ofHash = function (source) {
                    var pairs = [];
                    for (var key in source) {
                        if (source.hasOwnProperty(key)) {
                            pairs.push({ key: key, value: source[key] });
                        }
                    }
                    return new Map(pairs);
                };
                Map.ofUrlString = function (source) {
                    return Map.ofHashString(source, "&", "=", function (raw) { return decodeURIComponent(raw); });
                };
                Map.ofHashString = function (source, pairSeperator, keyValSeperator, valueTransform) {
                    var pairsStringCollection = Collection.of(source.split(pairSeperator));
                    var hashCollection = pairsStringCollection.select(function (pairString) {
                        var pair = pairString.split(keyValSeperator);
                        var key = pair[0];
                        var rawVal = pair[1];
                        var val = valueTransform(rawVal);
                        return { key: key, value: val };
                    }).toArray();
                    return new Map(hashCollection);
                };
                Map.emptyMap = function () {
                    return Map.ofHash({});
                };
                Map.prototype.get = function (key) {
                    var kv = this.first(function (kv) { return kv.key == key; });
                    return kv ? kv.value : null;
                };
                Map.prototype.keys = function () {
                    return this.select(function (x) { return x.key; });
                };
                Map.prototype.values = function () {
                    return this.select(function (x) { return x.value; });
                };
                Map.prototype.selectValues = function (fn) {
                    var raw = this.select(function (item) {
                        return { key: item.key, value: fn(item) };
                    });
                    return new Map(raw.toArray());
                };
                return Map;
            })(Collection);
            Common.Map = Map;
        })(Common = APP.Common || (APP.Common = {}));
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));
/// <reference path="Collection.ts"/>
/// <reference path="../Logger/Logger.ts"/>
/// <reference path="../External/jquery.d.ts"/>
/// <reference path="Promise.ts"/>
var BD;
(function (BD) {
    var APP;
    (function (APP) {
        var Common;
        (function (Common) {
            function toNamed(name, value) {
                return { name: name, value: value };
            }
            Common.toNamed = toNamed;
            function toNamedPromise(name, promise) {
                return promise.then(function (value) { return toNamed(name, value); });
            }
            Common.toNamedPromise = toNamedPromise;
            function namedWhen3(promises, continueOfFail) {
                if (continueOfFail === void 0) { continueOfFail = false; }
                var promiseArray = [];
                for (var name in promises) {
                    var namedPromise = namePromise(name, promises[name]);
                    promiseArray.push(namedPromise);
                }
                return namedWhen(promiseArray, continueOfFail);
            }
            Common.namedWhen3 = namedWhen3;
            function namedWhen2(promises, continueOfFail) {
                if (continueOfFail === void 0) { continueOfFail = false; }
                var promiseArray = [];
                for (var name in promises) {
                    var namedPromise = namePromise(name, promises[name]);
                    promiseArray.push(namedPromise);
                }
                return namedWhen(promiseArray, continueOfFail);
            }
            Common.namedWhen2 = namedWhen2;
            function namedWhen(promises, continueOfFail) {
                if (continueOfFail === void 0) { continueOfFail = false; }
                var allDone = Common.defer();
                var targetCount = promises.length;
                var results = {};
                if (targetCount == 0) {
                    allDone.resolve({});
                    return allDone.promise();
                }
                for (var i = 0; i < promises.length; i++) {
                    var promise = promises[i];
                    promise.done(function (value) {
                        //console.debug("namedWhen: " + value.name + " promise resolved: " + value.value);
                        results[value.name] = value.value;
                        if (Common.Collection.getKeys(results).length == targetCount)
                            allDone.resolve(results);
                    }).fail(function (err) {
                        if (continueOfFail) {
                            APP.Logger.warn("Continuing ofter inner error: " + err.message);
                            var randomKey = '' + Math.random();
                            results[randomKey] = null;
                        }
                        else if (allDone.getStatus() !== 1 /* Rejected */) {
                            allDone.reject(err);
                        }
                    });
                }
                return allDone.promise();
            }
            Common.namedWhen = namedWhen;
            function toNativePromise(jqPromise) {
                var d = Common.defer();
                jqPromise.done(function (result) {
                    d.resolve(result);
                });
                jqPromise.fail(function (xhr, status, err) {
                    d.reject(err);
                });
                return d.promise();
            }
            function namePromise(name, promise) {
                return promise.then((function (value) {
                    return { name: name, value: value };
                }));
            }
            Common.namePromise = namePromise;
            function jqGetPromise(url) {
                var d = Common.defer();
                BD.$.ajax(url, { dataType: 'text' }).done(function (result) {
                    d.resolve(result);
                }).fail(function (xhr, status, err) {
                    var errorString = (err && err.message) || (status != "error" && status) || xhr.status || xhr.responseText || "generic error";
                    APP.Logger.warn("First level error on jqGet '" + url + "': " + errorString);
                    d.reject({ message: errorString });
                });
                return d.promise();
            }
            Common.jqGetPromise = jqGetPromise;
        })(Common = APP.Common || (APP.Common = {}));
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));
/// <reference path="../Logger/Logger.ts" />
/// <reference path="AsyncHelper.ts" />
/**
    Module P: Generic Promises for TypeScript

    Project, documentation, and license: https://github.com/pragmatrix/Promise
*/
var BD;
(function (BD) {
    var APP;
    (function (APP) {
        var Common;
        (function (Common) {
            /**
             Returns a new "Deferred" value that may be resolved or rejected.
             */
            function defer() {
                return new DeferredI();
            }
            Common.defer = defer;
            /**
             Converts a value to a resolved promise.
             */
            function resolve(v) {
                return defer().resolve(v).promise();
            }
            Common.resolve = resolve;
            /**
             Returns a rejected promise.
             */
            function reject(err) {
                return defer().reject(err).promise();
            }
            Common.reject = reject;
            /**
             http://en.wikipedia.org/wiki/Anamorphism
        
             Given a seed value, unfold calls the unspool function, waits for the returned promise to be resolved, and then
             calls it again if a next seed value was returned.
        
             All the values of all promise results are collected into the resulting promise which is resolved as soon
             the last generated element value is resolved.
             */
            function unfold(unspool, seed) {
                var d = defer();
                var elements = new Array();
                unfoldCore(elements, d, unspool, seed);
                return d.promise();
            }
            Common.unfold = unfold;
            function unfoldCore(elements, deferred, unspool, seed) {
                var result = unspool(seed);
                if (!result) {
                    deferred.resolve(elements);
                    return;
                }
                while (result.next && result.promise.getStatus() == 2 /* Resolved */) {
                    elements.push(result.promise.getResult());
                    result = unspool(result.next);
                    if (!result) {
                        deferred.resolve(elements);
                        return;
                    }
                }
                result.promise.done(function (v) {
                    elements.push(v);
                    if (!result.next)
                        deferred.resolve(elements);
                    else
                        unfoldCore(elements, deferred, unspool, result.next);
                }).fail(function (e) {
                    deferred.reject(e);
                });
            }
            /**
             The status of a Promise. Initially a Promise is Unfulfilled and may
             change to Rejected or Resolved.
        
             Once a promise is either Rejected or Resolved, it can not change its
             status anymore.
             */
            (function (Status) {
                Status[Status["Unfulfilled"] = 0] = "Unfulfilled";
                Status[Status["Rejected"] = 1] = "Rejected";
                Status[Status["Resolved"] = 2] = "Resolved";
            })(Common.Status || (Common.Status = {}));
            var Status = Common.Status;
            /**
             Creates a promise that gets resolved when all the promises in the argument list get resolved.
             As soon one of the arguments gets rejected, the resulting promise gets rejected.
             If no promises were provided, the resulting promise is immediately resolved.
             */
            // GUY ADDITION
            //    export function wait(ms:number):Promise<void> {
            //        var d = defer<T>();
            //        setTimeout(() => d.resolve(), ms);
            //
            //        return d.promise();
            //    }
            // GUY ADDITION
            function wait(interval) {
                return waitFor(function () { return true; }, Number.MAX_VALUE, interval, false);
            }
            Common.wait = wait;
            function waitForEvent(setEventFn, timeout) {
                if (timeout === void 0) { timeout = Number.MAX_VALUE; }
                var d = defer();
                var done = false;
                window.setTimeout(function () {
                    if (!done) {
                        done = true;
                        d.reject({ message: "Timed out after " + timeout });
                    }
                });
                setEventFn(function (ev) {
                    if (!done) {
                        done = true;
                        d.resolve(ev);
                    }
                });
                return d.promise();
            }
            Common.waitForEvent = waitForEvent;
            function waitFor(fn, timeout, interval, tryImmediately) {
                if (timeout === void 0) { timeout = 0; }
                if (interval === void 0) { interval = 500; }
                if (tryImmediately === void 0) { tryImmediately = true; }
                var d = defer();
                var start = Date.now();
                var action = function () {
                    var elapsed = Date.now() - start;
                    if (elapsed >= timeout) {
                        clearInterval(intervalId);
                        d.reject(Error("Timed out after " + elapsed));
                    }
                    else {
                        var result = fn();
                        //                if (promiseOrValue instanceof PromiseI) {
                        //                    var p = <Promise<Result>> promiseOrValue;
                        //                    p.done(v2 => d.resolve(v2))
                        //                        .fail(err => d.reject(err));
                        //                    return p;
                        //                }
                        if (typeof result !== "undefined" && result != null) {
                            clearInterval(intervalId);
                            d.resolve(result);
                        }
                    }
                };
                var intervalId = setInterval(action, interval);
                if (tryImmediately)
                    action();
                return d.promise();
            }
            Common.waitFor = waitFor;
            function when() {
                var promises = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    promises[_i - 0] = arguments[_i];
                }
                var allDone = defer();
                if (!promises.length) {
                    allDone.resolve([]);
                    return allDone.promise();
                }
                var resolved = 0;
                var results = [];
                for (var i = 0; i < promises.length; i++) {
                    var p = promises[i];
                    p.done(function (v) {
                        results.push(v);
                        ++resolved;
                        if (resolved === promises.length && allDone.getStatus() !== 1 /* Rejected */)
                            allDone.resolve(results);
                    }).fail(function (e) {
                        if (allDone.getStatus() !== 1 /* Rejected */)
                            allDone.reject(e);
                    });
                }
                return allDone.promise();
            }
            Common.when = when;
            // GUY ADDITION
            function typedWhen(promises, continueOnFail) {
                if (continueOnFail === void 0) { continueOnFail = false; }
                var allDone = defer();
                if (!promises.length) {
                    allDone.resolve([]);
                    return allDone.promise();
                }
                var resolved = 0;
                var results = [];
                for (var i = 0; i < promises.length; i++) {
                    var p = promises[i];
                    p.done(function (v) {
                        results.push(v);
                        ++resolved;
                        if (resolved === promises.length && allDone.getStatus() !== 1 /* Rejected */)
                            allDone.resolve(results);
                    }).fail(function (e) {
                        if (continueOnFail) {
                            APP.Logger.warn("Continuing after inner error: " + e.message);
                            ++resolved;
                        }
                        else if (allDone.getStatus() !== 1 /* Rejected */) {
                            allDone.reject(e);
                        }
                    });
                }
                return allDone.promise();
            }
            Common.typedWhen = typedWhen;
            //export function waterfall<R>(fns:Array<(attempt:number) => Promise<R>>, isValid:(result:R) => boolean = (result:R) => true):Promise<R> {
            //
            //	// Initialize the chain with an undetermined result
            //	var virgin = true;
            //	var chain:Promise<R> = resolve(null);
            //
            //	for (var i = 0; i < fns.length; i++) {
            //		var fn = fns[i];
            //       var attempt = i + 1;
            //
            //       var fnWrapper = (attempt:number, prevValue?:R, rej?:Common.Rejection) => {
            //           if (!rej && !virgin && isValid(prevValue)) {
            //               return resolve(prevValue);
            //           }
            //           else {
            //               virgin = false;
            //               return fn(attempt);
            //           }
            //       };
            //
            //       var fnWrapperWithAttempt = lambda3(fnWrapper, attempt);
            //		chain = chain.alwaysThen<R>(fnWrapperWithAttempt);
            //	}
            //
            //	return chain;
            //}
            function namedWaterfall(fns, isValid) {
                if (isValid === void 0) { isValid = function (result) { return true; }; }
                // Initialize the chain with an undetermined result
                var chain = resolve(null);
                for (var i = 0; i < fns.length; i++) {
                    var wrappedFn = wrapFnForChain(fns[i], isValid, i + 1);
                    chain = chain.alwaysThen(wrappedFn);
                }
                return chain;
            }
            Common.namedWaterfall = namedWaterfall;
            function wrapFnForChain(fn, isValid, attempt) {
                var wrapped = function (attempt, prevValue, rej) {
                    if (!rej && prevValue != null && isValid(prevValue.value)) {
                        return resolve(prevValue);
                    }
                    else {
                        return fn.value(attempt).then(function (value) {
                            return { name: fn.name, value: value };
                        });
                    }
                };
                return lambda3(wrapped, attempt);
            }
            function lambda1(fn, value) {
                return function () { return fn(value); };
            }
            Common.lambda1 = lambda1;
            function lambda2(fn, value) {
                return function (value2) { return fn(value, value2); };
            }
            Common.lambda2 = lambda2;
            function lambda3(fn, value) {
                return function (value2, value3) { return fn(value, value2, value3); };
            }
            Common.lambda3 = lambda3;
            function lambda4(fn, value) {
                return function (value2, value3, value4) { return fn(value, value2, value3, value4); };
            }
            Common.lambda4 = lambda4;
            //    export function lambda4<T1, T2, T3, T4, R>(fn:(value:T1, value2:T2, value3:T3, value4:T4) => R, value:T1, value2:T2):(value3:T3, value4:T4) => R {
            //        return (value3:T3, value4:T4) => fn(value, value2, value3, value4);
            //    }
            function retryPromise(fn, tryCount) {
                if (tryCount === void 0) { tryCount = 1; }
                var chain = reject({ message: 'initial state' });
                for (var i = 0; i < tryCount; i++) {
                    chain = chain.alwaysThen(function (value, err) { return err ? fn() : resolve(value); });
                }
                return chain;
            }
            Common.retryPromise = retryPromise;
            //export function tryMany<R>(fn:(attempt:number) => Promise<R>, tries:number, isValid:(result:R) => boolean = (result:R) => true):Promise<R> {
            //
            //	var fns:Array<(attempt:number) => Promise<R>> = [];
            //	for (var i = 0; i < tries; i++) {
            //		fns.push(fn);
            //	}
            //
            //	return waterfall(fns, isValid);
            //
            //}
            /**
             Implementation of a promise.
        
             The Promise<Value> instance is a proxy to the Deferred<Value> instance.
             */
            var PromiseI = (function () {
                function PromiseI(deferred) {
                    this.deferred = deferred;
                }
                PromiseI.prototype.getStatus = function () {
                    return this.deferred.getStatus();
                };
                PromiseI.prototype.getResult = function () {
                    return this.deferred.getResult();
                };
                PromiseI.prototype.getError = function () {
                    return this.deferred.getError();
                };
                PromiseI.prototype.done = function (f) {
                    this.deferred.done(f);
                    return this;
                };
                PromiseI.prototype.fail = function (f) {
                    this.deferred.fail(f);
                    return this;
                };
                PromiseI.prototype.always = function (f) {
                    this.deferred.always(f);
                    return this;
                };
                // GUY ADDITION
                PromiseI.prototype.alwaysThen = function (f) {
                    return this.deferred.alwaysThen(f);
                };
                PromiseI.prototype.then = function (f) {
                    return this.deferred.then(f);
                };
                PromiseI.prototype.logPassthrough = function (logPrefix) {
                    return this.then(function (value) {
                        if (typeof value == 'string' || value instanceof String) {
                            APP.Logger.log(logPrefix + ": " + value);
                        }
                        else {
                            APP.Logger.log(logPrefix + ": " + JSON.stringify(value));
                        }
                        return value;
                    });
                };
                return PromiseI;
            })();
            /**
             Implementation of a deferred.
             */
            var DeferredI = (function () {
                function DeferredI() {
                    this._resolved = function (_) {
                    };
                    this._rejected = function (_) {
                    };
                    this._status = 0 /* Unfulfilled */;
                    this._error = { message: "" };
                    this._promise = new PromiseI(this);
                }
                DeferredI.prototype.promise = function () {
                    return this._promise;
                };
                DeferredI.prototype.getStatus = function () {
                    return this._status;
                };
                DeferredI.prototype.getResult = function () {
                    if (this._status != 2 /* Resolved */)
                        throw new Error("Promise: result not available");
                    return this._result;
                };
                DeferredI.prototype.getError = function () {
                    if (this._status != 1 /* Rejected */)
                        throw new Error("Promise: rejection reason not available");
                    return this._error;
                };
                // GUY ADDITION
                //        alwaysThen<Result>(f: (v?: Value, err?: Rejection) => any): Promise<Result> {
                //
                //            var d = defer<Result>();
                //            var result:Result = null;
                //
                //            this.always((value, rejection) => {
                //                debugger;
                //                var promiseOrValue = f(value, rejection);
                //
                //                // todo: need to find another way to check if r is really of interface
                //                // type Promise<any>, otherwise we would not support other
                //                // implementations here.
                //                //if (promiseOrValue instanceof PromiseI)
                //                if (promiseOrValue && typeof promiseOrValue.done === "function" && promiseOrValue.deferred)
                //                {
                //                    var p = <Promise<Result>> promiseOrValue;
                //                    p.done(v2 => d.resolve(v2)).fail(err => d.reject(err));
                //                    return p;
                //                }
                //
                //                d.resolve(promiseOrValue);
                //
                //            });
                //
                //            return d.promise();
                //
                //        }
                DeferredI.prototype.thenOld = function (f) {
                    var d = defer();
                    this.done(function (v) {
                        var promiseOrValue = f(v);
                        // todo: need to find another way to check if r is really of interface
                        // type Promise<any>, otherwise we would not support other
                        // implementations here.
                        //if (promiseOrValue instanceof PromiseI)
                        if (promiseOrValue && typeof promiseOrValue.done === "function" && promiseOrValue.deferred) {
                            var p = promiseOrValue;
                            p.done(function (v2) { return d.resolve(v2); }).fail(function (err) { return d.reject(err); });
                            return p;
                        }
                        d.resolve(promiseOrValue);
                    }).fail(function (err) { return d.reject(err); });
                    return d.promise();
                };
                DeferredI.prototype.then = function (f) {
                    var d = defer();
                    this.done(function (v) {
                        // GUY ADDITION - the try catch reject wrapping
                        var promiseOrValue = null;
                        try {
                            promiseOrValue = f(v);
                        }
                        catch (e) {
                            APP.Logger.warn("First level error: " + e.message + " @ " + f);
                            d.reject(e);
                            return;
                        }
                        // todo: need to find another way to check if r is really of interface
                        // type Promise<any>, otherwise we would not support other
                        // implementations here.
                        //if (promiseOrValue instanceof PromiseI) {
                        if (promiseOrValue && typeof promiseOrValue.done === "function" && promiseOrValue.deferred) {
                            var p = promiseOrValue;
                            p.done(function (v2) { return d.resolve(v2); }).fail(function (err) { return d.reject(err); });
                            return p;
                        }
                        d.resolve(promiseOrValue);
                    }).fail(function (err) { return d.reject(err); });
                    return d.promise();
                };
                DeferredI.prototype.alwaysThen = function (f) {
                    var d = defer();
                    var handler = function (v, err) {
                        var promiseOrValue = null;
                        try {
                            promiseOrValue = f(v, err);
                        }
                        catch (e) {
                            APP.Logger.warn("First level error: " + e.message + " @ " + f);
                            d.reject(e);
                            return;
                        }
                        // todo: need to find another way to check if r is really of interface
                        // type Promise<any>, otherwise we would not support other
                        // implementations here.
                        //if (promiseOrValue instanceof PromiseI) {
                        if (promiseOrValue && typeof promiseOrValue.done === "function" && promiseOrValue.deferred) {
                            var p = promiseOrValue;
                            p.done(function (v2) { return d.resolve(v2); }).fail(function (err) { return d.reject(err); });
                            return p;
                        }
                        d.resolve(promiseOrValue);
                    };
                    this.done(function (v) { return handler(v, null); }).fail(function (err) { return handler(null, err); });
                    return d.promise();
                };
                DeferredI.prototype.done = function (f) {
                    if (this.getStatus() === 2 /* Resolved */) {
                        f(this._result);
                        return this;
                    }
                    if (this.getStatus() !== 0 /* Unfulfilled */)
                        return this;
                    var prev = this._resolved;
                    this._resolved = function (v) {
                        prev(v);
                        f(v);
                    };
                    return this;
                };
                DeferredI.prototype.fail = function (f) {
                    if (this.getStatus() === 1 /* Rejected */) {
                        f(this._error);
                        return this;
                    }
                    if (this.getStatus() !== 0 /* Unfulfilled */)
                        return this;
                    var prev = this._rejected;
                    this._rejected = function (e) {
                        prev(e);
                        f(e);
                    };
                    return this;
                };
                DeferredI.prototype.always = function (f) {
                    this.done(function (v) { return f(v); }).fail(function (err) { return f(null, err); });
                    return this;
                };
                DeferredI.prototype.resolve = function (result) {
                    if (this._status !== 0 /* Unfulfilled */) {
                        throw new Error("tried to resolve a fulfilled promise");
                    }
                    this._result = result;
                    this._status = 2 /* Resolved */;
                    this._resolved(result);
                    this.detach();
                    return this;
                };
                DeferredI.prototype.reject = function (err) {
                    if (this._status !== 0 /* Unfulfilled */) {
                        throw new Error("tried to reject a fulfilled promise");
                    }
                    this._error = err;
                    this._status = 1 /* Rejected */;
                    this._rejected(err);
                    this.detach();
                    return this;
                };
                DeferredI.prototype.detach = function () {
                    this._resolved = function (_) {
                    };
                    this._rejected = function (_) {
                    };
                };
                return DeferredI;
            })();
            function generator(g) {
                return function () { return iterator(g()); };
            }
            Common.generator = generator;
            ;
            function iterator(f) {
                return new IteratorI(f);
            }
            Common.iterator = iterator;
            var IteratorI = (function () {
                function IteratorI(f) {
                    this.f = f;
                    this.current = undefined;
                }
                IteratorI.prototype.advance = function () {
                    var _this = this;
                    var res = this.f();
                    return res.then(function (value) {
                        if (isUndefined(value))
                            return false;
                        _this.current = value;
                        return true;
                    });
                };
                return IteratorI;
            })();
            /**
             Iterator functions.
             */
            function each(gen, f) {
                var d = defer();
                eachCore(d, gen(), f);
                return d.promise();
            }
            Common.each = each;
            function eachCore(fin, it, f) {
                it.advance().done(function (hasValue) {
                    if (!hasValue) {
                        fin.resolve({});
                        return;
                    }
                    f(it.current);
                    eachCore(fin, it, f);
                }).fail(function (err) { return fin.reject(err); });
            }
            /**
             std
             */
            function isUndefined(v) {
                return typeof v === 'undefined';
            }
            Common.isUndefined = isUndefined;
        })(Common = APP.Common || (APP.Common = {}));
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));
/// <reference path="../External/jquery"/>
/// <reference path="CommonHelper.ts"/>
var BD;
(function (BD) {
    var APP;
    (function (APP) {
        var Common;
        (function (Common) {
            var HtmlHelper = (function () {
                function HtmlHelper() {
                }
                HtmlHelper.appendHtmlWithRootClass = function (htmlString, rootClass, doc) {
                    if (doc === void 0) { doc = document; }
                    var element = BD.$(htmlString).addClass(rootClass);
                    HtmlHelper.appendToBody(element, doc);
                    return element;
                };
                HtmlHelper.parseAndAppendHtmlToElement = function (htmlString, htmlElement) {
                    var elements = BD.$.parseHTML(htmlString);
                    return BD.$(htmlElement).append(elements);
                };
                HtmlHelper.appendToDivById = function (id, element, doc) {
                    if (doc === void 0) { doc = document; }
                    var parent = doc.getElementById(id);
                    HtmlHelper.safeAppend(parent, element, false);
                };
                HtmlHelper.appendToBody = function (element, doc) {
                    if (doc === void 0) { doc = document; }
                    var body = doc.documentElement.getElementsByTagName("body")[0];
                    HtmlHelper.safeAppend(body, element, false);
                };
                HtmlHelper.appendToHead = function (element, doc) {
                    if (doc === void 0) { doc = document; }
                    var head = doc.documentElement.getElementsByTagName("head")[0];
                    HtmlHelper.safeAppend(head, element, false);
                };
                // use http://www.beallsflorida.com/online/carters-baby-boys-every-step-stage-2-grey-shoe?cm_mmc=CSE-_-Shopzilla-_-Kids%27Clothing-_-P000319065&zmam=24032966&zmas=1&zmac=5&zmap=P000319065&utm_source=shopzilla&utm_medium=cse&utm_content=P000319065&utm_campaign=Kids%27Clothing
                HtmlHelper.safeAppend = function (parent, element, first) {
                    var verifyClass = "ver" + (Math.random() * 10000000).toFixed();
                    element.addClass(verifyClass);
                    if (first) {
                        BD.$(parent).prepend(element);
                    }
                    else {
                        BD.$(parent).append(element);
                    }
                    //noinspection JSJQueryEfficiency
                    if (BD.$("." + verifyClass).length == 0) {
                        var htmlElement = element[0];
                        var firstChild = parent.childElementCount > 0 ? parent.children.item(0) : null;
                        parent.insertBefore(htmlElement, firstChild);
                        //var wrapperDiv = document.createElement("div");
                        //wrapperDiv.innerHTML = element[0].outerHTML;
                        //parent.appendChild(wrapperDiv);
                        if (BD.$("." + verifyClass).length == 0) {
                            throw new Error("Root element cannot be found after supposadly appended");
                        }
                    }
                };
                HtmlHelper.elementBelowTheFold = function (element, portion) {
                    var fold = BD.$(window).height() + BD.$(window).scrollTop();
                    return (fold <= BD.$(element).offset().top + (BD.$(element).height() * portion));
                };
                HtmlHelper.elementAboveTheTop = function (element, portion) {
                    var top = BD.$(window).scrollTop();
                    var elementHeight = BD.$(element).height();
                    return (top >= BD.$(element).offset().top + elementHeight - (elementHeight * portion));
                };
                HtmlHelper.elementRightOfScreen = function (element, portion) {
                    var fold = BD.$(window).width() + BD.$(window).scrollLeft();
                    return fold <= BD.$(element).offset().left - (BD.$(element).width() * portion);
                };
                HtmlHelper.positionNextTo = function (target, box, horizontalPadding, win) {
                    if (horizontalPadding === void 0) { horizontalPadding = 0; }
                    if (win === void 0) { win = window; }
                    var targetOffset = HtmlHelper.getElementPosWithOffsets(target[0]);
                    var targetWidth = target.width();
                    var boxWidth = box.width();
                    var x;
                    var spaceOnRight = targetOffset.left + targetWidth + horizontalPadding + boxWidth < win.innerWidth;
                    var spaceOnLeft = targetOffset.left - horizontalPadding > boxWidth;
                    if (spaceOnRight) {
                        x = targetOffset.left + targetWidth + horizontalPadding;
                    }
                    else if (spaceOnLeft) {
                        x = targetOffset.left - horizontalPadding - boxWidth;
                    }
                    else {
                        x = (win.innerWidth - boxWidth) / 2;
                    }
                    var y = targetOffset.top; //Math.min(targetOffset.top, win.innerHeight - box.height());
                    return { x: x, y: y };
                };
                HtmlHelper.getElementPosWithOffsets = function (element) {
                    if (!element || !element.getBoundingClientRect) {
                        return;
                    }
                    var box = { top: 0, left: 0, width: 0, height: 0, bottom: 0, right: 0 };
                    var doc = element && element.ownerDocument;
                    box = element.getBoundingClientRect();
                    if (!doc)
                        return box;
                    var win = doc.defaultView || doc.parentWindow, doc_element = doc.documentElement;
                    var top = box.top + (win.pageYOffset || doc_element.scrollTop || 0) - (doc_element.clientTop || 0);
                    var left = box.left + (win.pageXOffset || doc_element.scrollLeft || 0) - (doc_element.clientLeft || 0);
                    var width = element.offsetWidth || 0;
                    var height = element.offsetHeight || 0;
                    var bottom = top + height;
                    var right = left + width;
                    return {
                        top: top,
                        left: left,
                        width: width,
                        height: height,
                        bottom: bottom,
                        right: right
                    };
                };
                HtmlHelper.isContained = function (x, y, rect) {
                    return (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom);
                };
                HtmlHelper.elementLeftOfScreen = function (element, portion) {
                    var left = BD.$(window).scrollLeft();
                    var elementWidth = BD.$(element).width();
                    return left >= BD.$(element).offset().left + elementWidth - (elementWidth * portion);
                };
                HtmlHelper.isElementInViewport = function (element, portion) {
                    portion = (portion || 0);
                    return (!HtmlHelper.elementRightOfScreen(element, portion) && !HtmlHelper.elementLeftOfScreen(element, portion) && !HtmlHelper.elementBelowTheFold(element, portion) && !HtmlHelper.elementAboveTheTop(element, portion));
                };
                return HtmlHelper;
            })();
            Common.HtmlHelper = HtmlHelper;
        })(Common = APP.Common || (APP.Common = {}));
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));
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
/// <reference path="Promise"/>
/// <reference path="../Bootstrap/Injector.ts"/>
var BD;
(function (BD) {
    var APP;
    (function (APP) {
        var Common;
        (function (Common) {
            var NativeJSHelper = (function () {
                function NativeJSHelper() {
                }
                NativeJSHelper.injectScriptPromise = function (url) {
                    var d = Common.defer();
                    Injector.injectScript(url, function () { return d.resolve(null); }, function (e) { return d.reject({ message: "Failed script load " + url + ": " + (e && e.message) }); });
                    return d.promise();
                };
                NativeJSHelper.promiseFromLoader = function (loader, name) {
                    var d = Common.defer();
                    var done = false;
                    loader.onload = loader.onreadystatechange = function (e) {
                        if (!done && (!loader.readyState || loader.readyState == 4 || loader.readyState === "loaded" || loader.readyState === "complete")) {
                            done = true;
                            d.resolve(loader);
                        }
                    };
                    loader.onerror = function (e) {
                        done = true;
                        d.reject({ message: 'unknown load error' });
                    };
                    loader.ontimeout = function (e) {
                        done = true;
                        d.reject({ message: 'timeout error' });
                    };
                    return d.promise();
                };
                NativeJSHelper.nativeAjax = function (url) {
                    var promise = null;
                    if ("XDomainRequest" in window) {
                        var xdr = new XDomainRequest();
                        xdr.open("get", url);
                        promise = NativeJSHelper.promiseFromLoader(xdr, url);
                        xdr.send();
                    }
                    else {
                        var xhr = new XMLHttpRequest();
                        xhr.open("get", url, true);
                        promise = NativeJSHelper.promiseFromLoader(xhr, url);
                        xhr.send();
                    }
                    return promise.then(function (xr) {
                        if (xr.status == 200) {
                            return xr.responseText;
                        }
                        else {
                            throw Error(xr.statusText);
                        }
                    });
                };
                return NativeJSHelper;
            })();
            Common.NativeJSHelper = NativeJSHelper;
        })(Common = APP.Common || (APP.Common = {}));
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));
/// <reference path="../Common/HtmlHelper.ts"/>
/// <reference path="../Common/NativeJSHelper.ts"/>
/// <reference path="../Common/Promise.ts"/>
var BD;
(function (BD) {
    var APP;
    (function (APP) {
        var Common;
        (function (Common) {
            var Res = (function () {
                function Res() {
                }
                // ResourcePromiseHelpers
                Res.bring = function (url) {
                    return Common.jqGetPromise(url);
                };
                Res.injectCss = function (url, doc) {
                    if (doc === void 0) { doc = document; }
                    if (doc.createStyleSheet) {
                        doc.createStyleSheet(url);
                    }
                    else {
                        var cssElement = BD.$('<link rel="stylesheet" type="text/css" href="' + url + '" />');
                        Common.HtmlHelper.appendToHead(cssElement, doc);
                    }
                    return Common.resolve(null);
                };
                Res.injectScript = function (url) {
                    return Common.NativeJSHelper.injectScriptPromise(url, 2);
                };
                return Res;
            })();
            Common.Res = Res;
        })(Common = APP.Common || (APP.Common = {}));
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));
/// <reference path="IStore.ts" />
var BD;
(function (BD) {
    var APP;
    (function (APP) {
        var Common;
        (function (Common) {
            var GlobalSpace = (function () {
                function GlobalSpace(section) {
                    this.datastore = null;
                    if (!window["BD"]["GlobalStore"]) {
                        window["BD"]["GlobalStore"] = {};
                    }
                    this.datastore = window["BD"]["GlobalStore"];
                    if (section) {
                        if (!(section in this.datastore)) {
                            this.datastore[section] = {};
                        }
                        this.datastore = this.datastore[section];
                    }
                }
                GlobalSpace.prototype.retrive = function (key) {
                    return this.datastore[key];
                };
                GlobalSpace.prototype.store = function (key, value) {
                    this.datastore[key] = value;
                };
                GlobalSpace.prototype.remove = function (key) {
                    delete this.datastore[key];
                };
                GlobalSpace.prototype.retriveAndRemove = function (key) {
                    var value = this.retrive(key);
                    this.remove(key);
                    return value;
                };
                return GlobalSpace;
            })();
            Common.GlobalSpace = GlobalSpace;
        })(Common = APP.Common || (APP.Common = {}));
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));
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
                    Common.attachPostMessageHandler(window, this.createHandleCallback(this.paths.staticContentRoot()));
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
var BD;
(function (BD) {
    var APP;
    (function (APP) {
        var Context;
        (function (Context) {
            var AppContext = (function () {
                function AppContext(paths, params) {
                    this._paths = paths;
                    this._params = params;
                    this._host = window.location.host;
                }
                AppContext.prototype.paths = function () {
                    return this._paths;
                };
                AppContext.prototype.params = function () {
                    return this._params;
                };
                AppContext.prototype.host = function () {
                    return this._host;
                };
                AppContext.prototype.isDebugMode = function () {
                    return true;
                };
                return AppContext;
            })();
            Context.AppContext = AppContext;
        })(Context = APP.Context || (APP.Context = {}));
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));
/// <reference path="IStore.ts"/>
/// <reference path="Promise.ts"/>
/// <reference path="../Common/IUserStore" />
/// <reference path="../Common/ISuspender" />
/// <reference path="../Common/IPageScraper" />
/// <reference path="../Common/IFrameStore.ts" />
var BD;
(function (BD) {
    var APP;
    (function (APP) {
        var Common;
        (function (Common) {
            var Base64 = (function () {
                function Base64() {
                }
                // public method for encoding
                Base64.encode = function (input) {
                    var output = "";
                    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
                    var i = 0;
                    input = Base64._utf8_encode(input);
                    while (i < input.length) {
                        chr1 = input.charCodeAt(i++);
                        chr2 = input.charCodeAt(i++);
                        chr3 = input.charCodeAt(i++);
                        enc1 = chr1 >> 2;
                        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                        enc4 = chr3 & 63;
                        if (isNaN(chr2)) {
                            enc3 = enc4 = 64;
                        }
                        else if (isNaN(chr3)) {
                            enc4 = 64;
                        }
                        output = output + Base64._keyStr.charAt(enc1) + Base64._keyStr.charAt(enc2) + Base64._keyStr.charAt(enc3) + Base64._keyStr.charAt(enc4);
                    }
                    return output;
                };
                // public method for decoding
                Base64.decode = function (input) {
                    var output = "";
                    var chr1, chr2, chr3;
                    var enc1, enc2, enc3, enc4;
                    var i = 0;
                    input = input.replace(/[^A-Za-z0-9\-\_\=]/g, "");
                    while (i < input.length) {
                        enc1 = Base64._keyStr.indexOf(input.charAt(i++));
                        enc2 = Base64._keyStr.indexOf(input.charAt(i++));
                        enc3 = Base64._keyStr.indexOf(input.charAt(i++));
                        enc4 = Base64._keyStr.indexOf(input.charAt(i++));
                        chr1 = (enc1 << 2) | (enc2 >> 4);
                        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                        chr3 = ((enc3 & 3) << 6) | enc4;
                        output = output + String.fromCharCode(chr1);
                        if (enc3 != 64) {
                            output = output + String.fromCharCode(chr2);
                        }
                        if (enc4 != 64) {
                            output = output + String.fromCharCode(chr3);
                        }
                    }
                    output = Base64._utf8_decode(output);
                    return output;
                };
                // private method for UTF-8 encoding
                Base64._utf8_encode = function (str) {
                    str = str.replace(/\r\n/g, "\n");
                    var utftext = "";
                    for (var n = 0; n < str.length; n++) {
                        var c = str.charCodeAt(n);
                        if (c < 128) {
                            utftext += String.fromCharCode(c);
                        }
                        else if ((c > 127) && (c < 2048)) {
                            utftext += String.fromCharCode((c >> 6) | 192);
                            utftext += String.fromCharCode((c & 63) | 128);
                        }
                        else {
                            utftext += String.fromCharCode((c >> 12) | 224);
                            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                            utftext += String.fromCharCode((c & 63) | 128);
                        }
                    }
                    return utftext;
                };
                // private method for UTF-8 decoding
                Base64._utf8_decode = function (utftext) {
                    var str = "";
                    var i = 0;
                    var c = 0;
                    var c2 = 0;
                    var c3 = 0;
                    while (i < utftext.length) {
                        c = utftext.charCodeAt(i);
                        if (c < 128) {
                            str += String.fromCharCode(c);
                            i++;
                        }
                        else if ((c > 191) && (c < 224)) {
                            c2 = utftext.charCodeAt(i + 1);
                            str += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                            i += 2;
                        }
                        else {
                            c2 = utftext.charCodeAt(i + 1);
                            c3 = utftext.charCodeAt(i + 2);
                            str += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                            i += 3;
                        }
                    }
                    return str;
                };
                // private property
                // private static _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
                Base64._keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=";
                return Base64;
            })();
            Common.Base64 = Base64;
        })(Common = APP.Common || (APP.Common = {}));
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));
/// <reference path="Collection.ts"/>
/// <reference path="Base64.ts"/>
var BD;
(function (BD) {
    var APP;
    (function (APP) {
        var Common;
        (function (Common) {
            var WordUtils = (function () {
                function WordUtils() {
                }
                WordUtils.countWords = function (words) {
                    var wordMap = Common.Collection.of(words).groupBy(function (x) { return x; });
                    var wordCounts = wordMap.selectValues(function (x) { return x.value.length; });
                    return wordCounts;
                };
                WordUtils.countWords_old = function (words) {
                    var groupedWords = Common.Collection.groupByString(words, function (x) { return x; });
                    var wordCounts = Common.Collection.hashSelect(groupedWords, function (x) { return x.length; });
                    return wordCounts;
                };
                WordUtils.getNonTrivialWords = function (str) {
                    var hostPartsRegex = new RegExp("^" + window.location.hostname.replace(/\./g, '|') + "$", "i");
                    var trivialWordsRegex = new RegExp(WordUtils.trivialWordPattern, "i");
                    var unique = [];
                    if (str) {
                        str = WordUtils.cleanString(str).toLowerCase();
                        unique = WordUtils.splitToDistinctWords(str, function (word) {
                            return !trivialWordsRegex.test(word) && !hostPartsRegex.test(word) && word != "|";
                        });
                    }
                    return unique;
                };
                WordUtils.splitToDistinctWords = function (str, filter) {
                    var words = str.match(/\S+/g);
                    return words ? Common.Collection.of(words).distinct(function (x) { return x; }).where(filter).toArray() : [];
                };
                WordUtils.cleanString = function (str) {
                    str = str.replace(/(<([^>]+)>)/ig, ''); // removing HTML tags
                    str = str.replace(/\$\d(?:\d|,|&|\.)*/g, " ");
                    str = str.replace(/\(.*\)/g, " ");
                    // str = str.replace(/[-_//\+\.,'":&=\?\|]/g, ' ');
                    str = str.replace(/[\|,\-\/#!$%\^&\*;:{}=\-_`~()@\+\?><\[\]\+\"]/g, ' '); // removing punctuations
                    // GUY ONLY REMOVE . if not between two numbers
                    str = str.replace(/\./g, function (match, pos, original) {
                        var digitPrefix = pos != 0 && original[pos - 1].match(/\d/);
                        var digitSuffix = pos != original.length - 1 && original[pos + 1].match(/\d/);
                        return (digitPrefix && digitSuffix) ? "." : " ";
                    });
                    //        // non-printable characters
                    //        str = str.replace(/[\0-\x1F\x7F-\x9F\xAD\u0378\u0379\u037F-\u0383\u038B\u038D\u03A2\u0528-\u0530\u0557\u0558\u0560\u0588\u058B-\u058E\u0590\u05C8-\u05CF\u05EB-\u05EF\u05F5-\u0605\u061C\u061D\u06DD\u070E\u070F\u074B\u074C\u07B2-\u07BF\u07FB-\u07FF\u082E\u082F\u083F\u085C\u085D\u085F-\u089F\u08A1\u08AD-\u08E3\u08FF\u0978\u0980\u0984\u098D\u098E\u0991\u0992\u09A9\u09B1\u09B3-\u09B5\u09BA\u09BB\u09C5\u09C6\u09C9\u09CA\u09CF-\u09D6\u09D8-\u09DB\u09DE\u09E4\u09E5\u09FC-\u0A00\u0A04\u0A0B-\u0A0E\u0A11\u0A12\u0A29\u0A31\u0A34\u0A37\u0A3A\u0A3B\u0A3D\u0A43-\u0A46\u0A49\u0A4A\u0A4E-\u0A50\u0A52-\u0A58\u0A5D\u0A5F-\u0A65\u0A76-\u0A80\u0A84\u0A8E\u0A92\u0AA9\u0AB1\u0AB4\u0ABA\u0ABB\u0AC6\u0ACA\u0ACE\u0ACF\u0AD1-\u0ADF\u0AE4\u0AE5\u0AF2-\u0B00\u0B04\u0B0D\u0B0E\u0B11\u0B12\u0B29\u0B31\u0B34\u0B3A\u0B3B\u0B45\u0B46\u0B49\u0B4A\u0B4E-\u0B55\u0B58-\u0B5B\u0B5E\u0B64\u0B65\u0B78-\u0B81\u0B84\u0B8B-\u0B8D\u0B91\u0B96-\u0B98\u0B9B\u0B9D\u0BA0-\u0BA2\u0BA5-\u0BA7\u0BAB-\u0BAD\u0BBA-\u0BBD\u0BC3-\u0BC5\u0BC9\u0BCE\u0BCF\u0BD1-\u0BD6\u0BD8-\u0BE5\u0BFB-\u0C00\u0C04\u0C0D\u0C11\u0C29\u0C34\u0C3A-\u0C3C\u0C45\u0C49\u0C4E-\u0C54\u0C57\u0C5A-\u0C5F\u0C64\u0C65\u0C70-\u0C77\u0C80\u0C81\u0C84\u0C8D\u0C91\u0CA9\u0CB4\u0CBA\u0CBB\u0CC5\u0CC9\u0CCE-\u0CD4\u0CD7-\u0CDD\u0CDF\u0CE4\u0CE5\u0CF0\u0CF3-\u0D01\u0D04\u0D0D\u0D11\u0D3B\u0D3C\u0D45\u0D49\u0D4F-\u0D56\u0D58-\u0D5F\u0D64\u0D65\u0D76-\u0D78\u0D80\u0D81\u0D84\u0D97-\u0D99\u0DB2\u0DBC\u0DBE\u0DBF\u0DC7-\u0DC9\u0DCB-\u0DCE\u0DD5\u0DD7\u0DE0-\u0DF1\u0DF5-\u0E00\u0E3B-\u0E3E\u0E5C-\u0E80\u0E83\u0E85\u0E86\u0E89\u0E8B\u0E8C\u0E8E-\u0E93\u0E98\u0EA0\u0EA4\u0EA6\u0EA8\u0EA9\u0EAC\u0EBA\u0EBE\u0EBF\u0EC5\u0EC7\u0ECE\u0ECF\u0EDA\u0EDB\u0EE0-\u0EFF\u0F48\u0F6D-\u0F70\u0F98\u0FBD\u0FCD\u0FDB-\u0FFF\u10C6\u10C8-\u10CC\u10CE\u10CF\u1249\u124E\u124F\u1257\u1259\u125E\u125F\u1289\u128E\u128F\u12B1\u12B6\u12B7\u12BF\u12C1\u12C6\u12C7\u12D7\u1311\u1316\u1317\u135B\u135C\u137D-\u137F\u139A-\u139F\u13F5-\u13FF\u169D-\u169F\u16F1-\u16FF\u170D\u1715-\u171F\u1737-\u173F\u1754-\u175F\u176D\u1771\u1774-\u177F\u17DE\u17DF\u17EA-\u17EF\u17FA-\u17FF\u180F\u181A-\u181F\u1878-\u187F\u18AB-\u18AF\u18F6-\u18FF\u191D-\u191F\u192C-\u192F\u193C-\u193F\u1941-\u1943\u196E\u196F\u1975-\u197F\u19AC-\u19AF\u19CA-\u19CF\u19DB-\u19DD\u1A1C\u1A1D\u1A5F\u1A7D\u1A7E\u1A8A-\u1A8F\u1A9A-\u1A9F\u1AAE-\u1AFF\u1B4C-\u1B4F\u1B7D-\u1B7F\u1BF4-\u1BFB\u1C38-\u1C3A\u1C4A-\u1C4C\u1C80-\u1CBF\u1CC8-\u1CCF\u1CF7-\u1CFF\u1DE7-\u1DFB\u1F16\u1F17\u1F1E\u1F1F\u1F46\u1F47\u1F4E\u1F4F\u1F58\u1F5A\u1F5C\u1F5E\u1F7E\u1F7F\u1FB5\u1FC5\u1FD4\u1FD5\u1FDC\u1FF0\u1FF1\u1FF5\u1FFF\u200B-\u200F\u202A-\u202E\u2060-\u206F\u2072\u2073\u208F\u209D-\u209F\u20BB-\u20CF\u20F1-\u20FF\u218A-\u218F\u23F4-\u23FF\u2427-\u243F\u244B-\u245F\u2700\u2B4D-\u2B4F\u2B5A-\u2BFF\u2C2F\u2C5F\u2CF4-\u2CF8\u2D26\u2D28-\u2D2C\u2D2E\u2D2F\u2D68-\u2D6E\u2D71-\u2D7E\u2D97-\u2D9F\u2DA7\u2DAF\u2DB7\u2DBF\u2DC7\u2DCF\u2DD7\u2DDF\u2E3C-\u2E7F\u2E9A\u2EF4-\u2EFF\u2FD6-\u2FEF\u2FFC-\u2FFF\u3040\u3097\u3098\u3100-\u3104\u312E-\u3130\u318F\u31BB-\u31BF\u31E4-\u31EF\u321F\u32FF\u4DB6-\u4DBF\u9FCD-\u9FFF\uA48D-\uA48F\uA4C7-\uA4CF\uA62C-\uA63F\uA698-\uA69E\uA6F8-\uA6FF\uA78F\uA794-\uA79F\uA7AB-\uA7F7\uA82C-\uA82F\uA83A-\uA83F\uA878-\uA87F\uA8C5-\uA8CD\uA8DA-\uA8DF\uA8FC-\uA8FF\uA954-\uA95E\uA97D-\uA97F\uA9CE\uA9DA-\uA9DD\uA9E0-\uA9FF\uAA37-\uAA3F\uAA4E\uAA4F\uAA5A\uAA5B\uAA7C-\uAA7F\uAAC3-\uAADA\uAAF7-\uAB00\uAB07\uAB08\uAB0F\uAB10\uAB17-\uAB1F\uAB27\uAB2F-\uABBF\uABEE\uABEF\uABFA-\uABFF\uD7A4-\uD7AF\uD7C7-\uD7CA\uD7FC-\uF8FF\uFA6E\uFA6F\uFADA-\uFAFF\uFB07-\uFB12\uFB18-\uFB1C\uFB37\uFB3D\uFB3F\uFB42\uFB45\uFBC2-\uFBD2\uFD40-\uFD4F\uFD90\uFD91\uFDC8-\uFDEF\uFDFE\uFDFF\uFE1A-\uFE1F\uFE27-\uFE2F\uFE53\uFE67\uFE6C-\uFE6F\uFE75\uFEFD-\uFF00\uFFBF-\uFFC1\uFFC8\uFFC9\uFFD0\uFFD1\uFFD8\uFFD9\uFFDD-\uFFDF\uFFE7\uFFEF-\uFFFB\uFFFE\uFFFF]/g, '');
                    str = str.replace(/\s{2,}/g, ' '); // collapsing many spaces to one
                    str = str.replace(/('|\s$)/g, '');
                    // removing all characters which are not letters, accented letters, numbers, spaces
                    // str = str.replace(/[^A-Z|0-a-z|9|\u00C0-\u017F|\u0410-\u044F|\s]/g, '');
                    // if there's accented characters (e.g. PANTALֳ“N), replace them with the ASCII equivalent
                    if (/[\u00C0-\u017F]/.test(str)) {
                        str = WordUtils.removeDiacritics(str);
                    }
                    return str;
                };
                WordUtils.removeDiacritics = function (str) {
                    var defaultDiacriticsRemovalMap = [
                        { 'base': 'A', 'letters': /[\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F]/g },
                        { 'base': 'AA', 'letters': /[\uA732]/g },
                        { 'base': 'AE', 'letters': /[\u00C6\u01FC\u01E2]/g },
                        { 'base': 'AO', 'letters': /[\uA734]/g },
                        { 'base': 'AU', 'letters': /[\uA736]/g },
                        { 'base': 'AV', 'letters': /[\uA738\uA73A]/g },
                        { 'base': 'AY', 'letters': /[\uA73C]/g },
                        { 'base': 'B', 'letters': /[\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181]/g },
                        { 'base': 'C', 'letters': /[\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E]/g },
                        { 'base': 'D', 'letters': /[\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779]/g },
                        { 'base': 'DZ', 'letters': /[\u01F1\u01C4]/g },
                        { 'base': 'Dz', 'letters': /[\u01F2\u01C5]/g },
                        { 'base': 'E', 'letters': /[\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E]/g },
                        { 'base': 'F', 'letters': /[\u0046\u24BB\uFF26\u1E1E\u0191\uA77B]/g },
                        { 'base': 'G', 'letters': /[\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E]/g },
                        { 'base': 'H', 'letters': /[\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D]/g },
                        { 'base': 'I', 'letters': /[\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197]/g },
                        { 'base': 'J', 'letters': /[\u004A\u24BF\uFF2A\u0134\u0248]/g },
                        { 'base': 'K', 'letters': /[\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2]/g },
                        { 'base': 'L', 'letters': /[\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780]/g },
                        { 'base': 'LJ', 'letters': /[\u01C7]/g },
                        { 'base': 'Lj', 'letters': /[\u01C8]/g },
                        { 'base': 'M', 'letters': /[\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C]/g },
                        { 'base': 'N', 'letters': /[\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4]/g },
                        { 'base': 'NJ', 'letters': /[\u01CA]/g },
                        { 'base': 'Nj', 'letters': /[\u01CB]/g },
                        { 'base': 'O', 'letters': /[\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C]/g },
                        { 'base': 'OI', 'letters': /[\u01A2]/g },
                        { 'base': 'OO', 'letters': /[\uA74E]/g },
                        { 'base': 'OU', 'letters': /[\u0222]/g },
                        { 'base': 'P', 'letters': /[\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754]/g },
                        { 'base': 'Q', 'letters': /[\u0051\u24C6\uFF31\uA756\uA758\u024A]/g },
                        { 'base': 'R', 'letters': /[\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782]/g },
                        { 'base': 'S', 'letters': /[\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784]/g },
                        { 'base': 'T', 'letters': /[\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786]/g },
                        { 'base': 'TZ', 'letters': /[\uA728]/g },
                        { 'base': 'U', 'letters': /[\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244]/g },
                        { 'base': 'V', 'letters': /[\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245]/g },
                        { 'base': 'VY', 'letters': /[\uA760]/g },
                        { 'base': 'W', 'letters': /[\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72]/g },
                        { 'base': 'X', 'letters': /[\u0058\u24CD\uFF38\u1E8A\u1E8C]/g },
                        { 'base': 'Y', 'letters': /[\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE]/g },
                        { 'base': 'Z', 'letters': /[\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762]/g },
                        { 'base': 'a', 'letters': /[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250]/g },
                        { 'base': 'aa', 'letters': /[\uA733]/g },
                        { 'base': 'ae', 'letters': /[\u00E6\u01FD\u01E3]/g },
                        { 'base': 'ao', 'letters': /[\uA735]/g },
                        { 'base': 'au', 'letters': /[\uA737]/g },
                        { 'base': 'av', 'letters': /[\uA739\uA73B]/g },
                        { 'base': 'ay', 'letters': /[\uA73D]/g },
                        { 'base': 'b', 'letters': /[\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253]/g },
                        { 'base': 'c', 'letters': /[\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184]/g },
                        { 'base': 'd', 'letters': /[\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A]/g },
                        { 'base': 'dz', 'letters': /[\u01F3\u01C6]/g },
                        { 'base': 'e', 'letters': /[\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD]/g },
                        { 'base': 'f', 'letters': /[\u0066\u24D5\uFF46\u1E1F\u0192\uA77C]/g },
                        { 'base': 'g', 'letters': /[\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F]/g },
                        { 'base': 'h', 'letters': /[\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265]/g },
                        { 'base': 'hv', 'letters': /[\u0195]/g },
                        { 'base': 'i', 'letters': /[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131]/g },
                        { 'base': 'j', 'letters': /[\u006A\u24D9\uFF4A\u0135\u01F0\u0249]/g },
                        { 'base': 'k', 'letters': /[\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3]/g },
                        { 'base': 'l', 'letters': /[\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747]/g },
                        { 'base': 'lj', 'letters': /[\u01C9]/g },
                        { 'base': 'm', 'letters': /[\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F]/g },
                        { 'base': 'n', 'letters': /[\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5]/g },
                        { 'base': 'nj', 'letters': /[\u01CC]/g },
                        { 'base': 'o', 'letters': /[\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275]/g },
                        { 'base': 'oi', 'letters': /[\u01A3]/g },
                        { 'base': 'ou', 'letters': /[\u0223]/g },
                        { 'base': 'oo', 'letters': /[\uA74F]/g },
                        { 'base': 'p', 'letters': /[\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755]/g },
                        { 'base': 'q', 'letters': /[\u0071\u24E0\uFF51\u024B\uA757\uA759]/g },
                        { 'base': 'r', 'letters': /[\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783]/g },
                        { 'base': 's', 'letters': /[\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B]/g },
                        { 'base': 't', 'letters': /[\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787]/g },
                        { 'base': 'tz', 'letters': /[\uA729]/g },
                        { 'base': 'u', 'letters': /[\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289]/g },
                        { 'base': 'v', 'letters': /[\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C]/g },
                        { 'base': 'vy', 'letters': /[\uA761]/g },
                        { 'base': 'w', 'letters': /[\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73]/g },
                        { 'base': 'x', 'letters': /[\u0078\u24E7\uFF58\u1E8B\u1E8D]/g },
                        { 'base': 'y', 'letters': /[\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF]/g },
                        { 'base': 'z', 'letters': /[\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763]/g }
                    ];
                    for (var i = 0; i < defaultDiacriticsRemovalMap.length; i++) {
                        str = str.replace(defaultDiacriticsRemovalMap[i].letters, defaultDiacriticsRemovalMap[i].base);
                    }
                    return str;
                };
                //self.exW = "^(search|result|results|com|info|net|item|keyword|keywords|cart|for|accounts|account|customer|service|support|contact|we|description|xml|proxy|stylesheet|shops|shop|shopping|price|min|max|online|id|email|ship|shipping|to|personalized|suchen|lieblingsprodukt|produkt|de|suche|ergebnis|ergebnisse|artikel|stichwort|jobtitel|warenkorb|kundendienst|kundensupport|kontaktieren|unterstützung|wir|beschreibung|einkaufen|geschäfte|preis|schiffs|versand|unterstützung|schuhe|zalando|account|produkte|onlineshop|suchergebnisse|query|langid|markt|media|multichannelsearch|achats|achats|commerce|discount|recherché|recherche|rechercher|recherches|chercher|produit|produits|article|résultat|résultats|suite|consequence|raison|prix|page|asp|aspx|php|choix|prix|électroménager|accueil|homepage|marchand|merchant|händler|url|html|prodotti|programmi|guardare|prezzi|trova|acquisti|ricerca|confronta|offerte|cerca|Iscriviti|Accedi|login|email|e-mail|sconti|lavoretti|menu|corso|benessere|parcheggi|ricaricabile|compara|listsales|returnurl|sales|tag|tagname|offerta)$";
                WordUtils.encodedTrivialWordPattern = "XihzZWFyY2h8cmVzdWx0fHJlc3VsdHN8Y29tfGluZm98bmV0fGl0ZW18a2V5d29yZHxrZXl3b3Jkc3xjYXJ0fGZvcnxhY2NvdW50c3xhY2NvdW50fGN1c3RvbWVyfHNlcnZpY2V8c3VwcG9ydHxjb250YWN0fHdlfGRlc2NyaXB0aW9ufHhtbHxwcm94eXxzdHlsZXNoZWV0fHNob3BzfHNob3B8c2hvcHBpbmd8cHJpY2V8bWlufG1heHxvbmxpbmV8aWR8ZW1haWx8c2hpcHxzaGlwcGluZ3x0b3xwZXJzb25hbGl6ZWR8c3VjaGVufGxpZWJsaW5nc3Byb2R1a3R8cHJvZHVrdHxkZXxzdWNoZXxlcmdlYm5pc3xlcmdlYm5pc3NlfGFydGlrZWx8c3RpY2h3b3J0fGpvYnRpdGVsfHdhcmVua29yYnxrdW5kZW5kaWVuc3R8a3VuZGVuc3VwcG9ydHxrb250YWt0aWVyZW58dW50ZXJzdMO8dHp1bmd8d2lyfGJlc2NocmVpYnVuZ3xlaW5rYXVmZW58Z2VzY2jDpGZ0ZXxwcmVpc3xzY2hpZmZzfHZlcnNhbmR8dW50ZXJzdMO8dHp1bmd8c2NodWhlfHphbGFuZG98YWNjb3VudHxwcm9kdWt0ZXxvbmxpbmVzaG9wfHN1Y2hlcmdlYm5pc3NlfHF1ZXJ5fGxhbmdpZHxtYXJrdHxtZWRpYXxtdWx0aWNoYW5uZWxzZWFyY2h8YWNoYXRzfGFjaGF0c3xjb21tZXJjZXxkaXNjb3VudHxyZWNoZXJjaMOpfHJlY2hlcmNoZXxyZWNoZXJjaGVyfHJlY2hlcmNoZXN8Y2hlcmNoZXJ8cHJvZHVpdHxwcm9kdWl0c3xhcnRpY2xlfHLDqXN1bHRhdHxyw6lzdWx0YXRzfHN1aXRlfGNvbnNlcXVlbmNlfHJhaXNvbnxwcml4fHBhZ2V8YXNwfGFzcHh8cGhwfGNob2l4fHByaXh8w6lsZWN0cm9tw6luYWdlcnxhY2N1ZWlsfGhvbWVwYWdlfG1hcmNoYW5kfG1lcmNoYW50fGjDpG5kbGVyfHVybHxodG1sfHByb2RvdHRpfHByb2dyYW1taXxndWFyZGFyZXxwcmV6eml8dHJvdmF8YWNxdWlzdGl8cmljZXJjYXxjb25mcm9udGF8b2ZmZXJ0ZXxjZXJjYXxJc2NyaXZpdGl8QWNjZWRpfGxvZ2lufGVtYWlsfGUtbWFpbHxzY29udGl8bGF2b3JldHRpfG1lbnV8Y29yc298YmVuZXNzZXJlfHBhcmNoZWdnaXxyaWNhcmljYWJpbGV8Y29tcGFyYXxsaXN0c2FsZXN8cmV0dXJudXJsfHNhbGVzfHRhZ3x0YWduYW1lfG9mZmVydGEpJA==";
                WordUtils.trivialWordPattern = Common.Base64.decode(WordUtils.encodedTrivialWordPattern);
                return WordUtils;
            })();
            Common.WordUtils = WordUtils;
        })(Common = APP.Common || (APP.Common = {}));
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));
var BD;
(function (BD) {
    var APP;
    (function (APP) {
        var Common;
        (function (Common) {
            var DependentSingletone = (function () {
                function DependentSingletone(keyFunc, valueFunc) {
                    this.virgin = true;
                    this.keyFunc = keyFunc;
                    this.valueFunc = valueFunc;
                }
                DependentSingletone.prototype.value = function () {
                    var currentKey = this.keyFunc();
                    if (this.virgin || currentKey != this.key) {
                        this._value = this.valueFunc();
                        this.key = currentKey;
                        this.virgin = false;
                    }
                    return this._value;
                };
                return DependentSingletone;
            })();
            Common.DependentSingletone = DependentSingletone;
        })(Common = APP.Common || (APP.Common = {}));
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));
/// <reference path="../Context/IAppContext" />
/// <reference path="IPageScraper" />
/// <reference path="WordUtils.ts" />
/// <reference path="DependentSingletone" />
var BD;
(function (BD) {
    var APP;
    (function (APP) {
        var Common;
        (function (Common) {
            var DefaultPageScraper = (function () {
                function DefaultPageScraper() {
                    var _this = this;
                    this._queryParams = new Common.DependentSingletone(function () { return window.location.href; }, function () { return _this.parseQueryString(window.location); });
                    this._documentHTML = new Common.DependentSingletone(function () { return window.location.href; }, function () { return BD.$(document.documentElement).html(); });
                }
                DefaultPageScraper.prototype.documentHTML = function () {
                    return this._documentHTML.value();
                };
                DefaultPageScraper.prototype.queryParams = function () {
                    return this._queryParams.value();
                };
                DefaultPageScraper.prototype.parseQueryString = function (location) {
                    var searchArgs = location.search.substring(1).split('&');
                    var hashArgs = location.hash.substring(1).split('&');
                    var args = hashArgs.concat(searchArgs);
                    //if same param on both - search will win
                    var argsParsed = {};
                    for (var i = 0; i < args.length; i++) {
                        var arg = decodeURIComponent(args[i]);
                        if (arg.indexOf('=') == -1) {
                            argsParsed[arg] = DefaultPageScraper.VALUELESS_PARAM;
                        }
                        else {
                            var kvp = arg.split('=');
                            argsParsed[kvp[0]] = kvp[1];
                        }
                    }
                    return argsParsed;
                };
                DefaultPageScraper.prototype.testPatternsAgainstHTML = function (patterns) {
                    for (var i = 0; i < patterns.length; i++) {
                        var re = new RegExp("(^|[^a-z|A-Z])(" + patterns[i] + ")($|[^a-z|A-Z])", "ig");
                        var matches = this.documentHTML().match(re);
                        var count = matches ? matches.length : 0;
                        if (count)
                            return 1;
                    }
                    return 0;
                };
                // todo: ORIGINAL ERROR: usage of innetText will fail with older FF. Move to jQuery
                // todo: ORIGINAL ERROR: usage of evaluate (xpath) will fail with all IE
                DefaultPageScraper.prototype.getElementTextByReference = function (entries, accumulateAllMatches) {
                    var accessors = [
                        function (entry) { return entry.xpath && DefaultPageScraper.getElementByXpath(entry.xpath.trim()); },
                        function (entry) { return entry.id && document.querySelector("#" + entry.id.trim()); },
                        function (entry) { return entry.name && document.getElementsByName(entry.name.trim())[0]; },
                        function (entry) { return entry['class'] && document.querySelector("." + entry['class'].trim()); }
                    ];
                    var elementTxt = "";
                    try {
                        for (var e = 0; e < entries.length; e++) {
                            var entry = entries[e];
                            for (var i = 0; i < accessors.length; i++) {
                                var accessor = accessors[i];
                                var element = accessor(entry);
                                if (element) {
                                    if (accumulateAllMatches)
                                        elementTxt = elementTxt + DefaultPageScraper.getInnerText(element) + " ";
                                    else {
                                        return DefaultPageScraper.getInnerText(element);
                                    }
                                }
                            }
                        }
                    }
                    catch (e) {
                        APP.Logger.warn("Failure in dedicated field parsing. Skipping field");
                    }
                    return elementTxt;
                };
                DefaultPageScraper.getInnerText = function (element) {
                    return element.innerText;
                };
                DefaultPageScraper.getElementByXpath = function (xpath) {
                    return document['evaluate'] && document['evaluate'](xpath, document, null, 9, null).singleNodeValue;
                };
                // todo: original used a home-grown inner text implementation - changed to inner text
                DefaultPageScraper.prototype.getFirstMatchText = function (selectors, fallbackText) {
                    if (fallbackText === void 0) { fallbackText = ""; }
                    for (var index = 0; index < selectors.length; index++) {
                        var selector = selectors[index];
                        var element = document.querySelector(selector);
                        if (element) {
                            var text = DefaultPageScraper.getInnerText(element);
                            if (text)
                                return text;
                        }
                    }
                    return fallbackText;
                };
                DefaultPageScraper.prototype.scrapeGenericPageWordCounts = function () {
                    // Search fields
                    var searchFields = document.querySelectorAll("input[type='search']");
                    var searchFieldsText = Common.Collection.select(Common.Collection.numValues(searchFields), function (x) { return x.value; }).join(" ");
                    var searchFieldsWords = Common.WordUtils.getNonTrivialWords(searchFieldsText);
                    // We want to count the search field words twice (give them double the weight)
                    var doubleSearchFieldsWords = [].concat(searchFieldsWords).concat(searchFieldsWords);
                    // H1 first texts
                    var firstH1Text = this.getFirstMatchText(["h1"]);
                    var firstH1Words = Common.WordUtils.getNonTrivialWords(firstH1Text);
                    // title
                    var titleWords = Common.WordUtils.getNonTrivialWords(document.title);
                    // text fields
                    var textFields = document.querySelectorAll("input[type='text']");
                    var textFieldsText = Common.Collection.select(Common.Collection.numValues(textFields), function (x) { return x.value; }).join(" ");
                    var textFieldsWords = Common.WordUtils.getNonTrivialWords(textFieldsText);
                    // queryParams values
                    var queryParamsText = Common.Collection.where(Common.Collection.values(this.queryParams()), function (x) { return x.length > 0; }).join(" ");
                    var queryParamsWords = Common.WordUtils.getNonTrivialWords(queryParamsText);
                    var words = [].concat(doubleSearchFieldsWords).concat(firstH1Words).concat(titleWords).concat(textFieldsWords).concat(queryParamsWords);
                    var wordCounts = Common.WordUtils.countWords(words);
                    return wordCounts;
                };
                DefaultPageScraper.prototype.getElementPosWithOffsets = function (element) {
                    return Common.HtmlHelper.getElementPosWithOffsets(element);
                };
                DefaultPageScraper.VALUELESS_PARAM = "";
                return DefaultPageScraper;
            })();
            Common.DefaultPageScraper = DefaultPageScraper;
        })(Common = APP.Common || (APP.Common = {}));
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));
/// <reference path="AppContext"/>
/// <reference path="IAppContext"/>
/// <reference path="IBaseContext.ts"/>
/// <reference path="../External/JSON3" />
/// <reference path="../Common/IUserStore" />
/// <reference path="../Common/ISuspender" />
/// <reference path="../Common/IPageScraper" />
/// <reference path="../Common/IFrameStore.ts" />
/// <reference path="../Common/DefaultPageScraper.ts" />
/// <reference path="../Common/Promise.ts" />
var BD;
(function (BD) {
    var APP;
    (function (APP) {
        var Context;
        (function (Context) {
            var DomainContext = (function (_super) {
                __extends(DomainContext, _super);
                function DomainContext(baseContext, userSettings, suspender, iframe, fnWindow) {
                    _super.call(this, baseContext.paths(), baseContext.params());
                    this._userSettings = userSettings;
                    this._suspender = suspender;
                    this._iframe = iframe;
                    this._scraper = new APP.Common.DefaultPageScraper();
                    this._fnWindow = window;
                }
                DomainContext.prototype.userSettings = function () {
                    return this._userSettings;
                };
                DomainContext.prototype.suspender = function () {
                    return this._suspender;
                };
                DomainContext.prototype.scraper = function () {
                    return this._scraper;
                };
                DomainContext.prototype.iframe = function () {
                    return this._iframe;
                };
                DomainContext.prototype.fnWindow = function () {
                    return this._fnWindow;
                };
                DomainContext.initializePromise = function (baseContext, userSettingsPromise, suspenderPromise, iframe, fnWindow) {
                    return APP.Common.namedWhen2({ 'US': userSettingsPromise, 'SU': suspenderPromise }).then(function (res) {
                        var userSettings = res['US'];
                        var suspender = res['SU'];
                        return new DomainContext(baseContext, userSettings, suspender, iframe, fnWindow);
                    });
                };
                return DomainContext;
            })(Context.AppContext);
            Context.DomainContext = DomainContext;
        })(Context = APP.Context || (APP.Context = {}));
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));
/// <reference path="DomainContext"/>
var BD;
(function (BD) {
    var APP;
    (function (APP) {
        var Context;
        (function (Context) {
            var VisualContext = (function (_super) {
                __extends(VisualContext, _super);
                function VisualContext(appContext, productName, visual) {
                    _super.call(this, appContext, appContext.userSettings(), appContext.suspender(), appContext.iframe(), appContext.fnWindow());
                    this.productName = productName;
                    this.visual = visual;
                }
                return VisualContext;
            })(Context.DomainContext);
            Context.VisualContext = VisualContext;
        })(Context = APP.Context || (APP.Context = {}));
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));
/// <reference path="VisualContext"/>
var BD;
(function (BD) {
    var APP;
    (function (APP) {
        var Context;
        (function (Context) {
            var LVContext = (function (_super) {
                __extends(LVContext, _super);
                function LVContext(appContext, productName, logic, visual) {
                    _super.call(this, appContext, productName, visual);
                    this._logic = logic;
                }
                LVContext.prototype.logic = function () {
                    return this._logic;
                };
                return LVContext;
            })(Context.VisualContext);
            Context.LVContext = LVContext;
        })(Context = APP.Context || (APP.Context = {}));
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));
/// <reference path="../Context/LVContext" />
/// <reference path="../Common/Promise" />
var BD;
(function (BD) {
    var APP;
    (function (APP) {
        var Data;
        (function (Data) {
            var PlainDataResult = (function () {
                function PlainDataResult(source, context, data, extras) {
                    if (extras === void 0) { extras = {}; }
                    this.source = source;
                    this.context = context;
                    this.data = data;
                    this.extras = extras;
                }
                PlainDataResult.prototype.hasData = function () {
                    return this.data && this.data.length > 0;
                };
                return PlainDataResult;
            })();
            Data.PlainDataResult = PlainDataResult;
            var StubDataResult = (function () {
                function StubDataResult(source, context) {
                    this.source = source;
                    this.context = context;
                }
                StubDataResult.prototype.hasData = function () {
                    return true;
                };
                return StubDataResult;
            })();
            Data.StubDataResult = StubDataResult;
            var DataGeneratorResult = (function (_super) {
                __extends(DataGeneratorResult, _super);
                function DataGeneratorResult(source, context, generator) {
                    _super.call(this, source, context);
                    this.generator = generator;
                }
                DataGeneratorResult.prototype.generateData = function (param, context, counts) {
                    return this.generator(param, context, counts);
                };
                return DataGeneratorResult;
            })(StubDataResult);
            Data.DataGeneratorResult = DataGeneratorResult;
        })(Data = APP.Data || (APP.Data = {}));
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));
/// <reference path="GlobalSpace" />
var BD;
(function (BD) {
    var APP;
    (function (APP) {
        var Common;
        (function (Common) {
            var DataSynchronizer = (function () {
                function DataSynchronizer() {
                    this.dataSyncStore = new Common.GlobalSpace("DataSync");
                }
                DataSynchronizer.prototype.getAll = function () {
                    var dataItems = this.dataSyncStore.retrive("DataItems");
                    if (!dataItems)
                        dataItems = {};
                    return dataItems;
                };
                DataSynchronizer.prototype.setAll = function (dataItems) {
                    this.dataSyncStore.store("DataItems", dataItems);
                };
                DataSynchronizer.prototype.claim = function (key, mark, force) {
                    if (force === void 0) { force = false; }
                    var dataItems = this.getAll();
                    var alreadyClaimed = (key in dataItems);
                    if (!alreadyClaimed || force) {
                        dataItems[key] = mark;
                    }
                    this.setAll(dataItems);
                    return alreadyClaimed;
                };
                DataSynchronizer.prototype.cliamWithoutMarking = function (source, keyFn, claimCount, except) {
                    if (except === void 0) { except = []; }
                    var selected = [];
                    var exceptKeys = Common.Collection.select(except, keyFn);
                    for (var i = 0; i < source.length; i++) {
                        if (selected.length >= claimCount)
                            break;
                        var item = source[i];
                        var key = keyFn(item);
                        var exclude = Common.Collection.contains(exceptKeys, key);
                        if (exclude)
                            continue;
                        selected.push(item);
                    }
                    return selected;
                };
                DataSynchronizer.prototype.claimUniques = function (source, keyFn, mark, claimCount, fallbackToUsed, except) {
                    if (fallbackToUsed === void 0) { fallbackToUsed = true; }
                    if (except === void 0) { except = []; }
                    var uniqueItems = [];
                    var nonuniqueItems = [];
                    var selected = [];
                    var claimedItems = this.getAll();
                    var exceptKeys = Common.Collection.select(except, keyFn);
                    for (var i = 0; i < source.length; i++) {
                        var item = source[i];
                        var key = keyFn(item);
                        var exclude = Common.Collection.contains(exceptKeys, key);
                        if (exclude)
                            continue;
                        if (key in claimedItems) {
                            nonuniqueItems.push(item);
                        }
                        else {
                            uniqueItems.push(item);
                            claimedItems[key] = mark;
                            if (uniqueItems.length >= claimCount)
                                break;
                        }
                    }
                    this.setAll(claimedItems);
                    if (fallbackToUsed) {
                        var fallbackItems = this.cliamWithoutMarking(nonuniqueItems, keyFn, claimCount - uniqueItems.length, uniqueItems);
                        selected = uniqueItems.concat(fallbackItems);
                    }
                    else {
                        selected = uniqueItems;
                    }
                    return selected;
                };
                return DataSynchronizer;
            })();
            Common.DataSynchronizer = DataSynchronizer;
        })(Common = APP.Common || (APP.Common = {}));
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));
/// <reference path="../Context/LVContext"/>
/// <reference path="../Common/Promise"/>
/// <reference path="../Data/DataResult"/>
/// <reference path="../Common/DataSynchronizer.ts"/>
/// <reference path="IProductVisual.ts"/>
/// <reference path="IProductLogic.ts"/>
var BD;
(function (BD) {
    var APP;
    (function (APP) {
        var Products;
        (function (Products) {
            var Product = (function () {
                function Product(productName, logic, visual) {
                    this.logic = null;
                    this.name = productName;
                    this.logic = logic;
                    this.visual = visual;
                }
                /**
                 * Classifies the relevancy of the Product to the current page. Values between -1 and 1.
                 * @param context - current context.
                 * @param scraper - scraper component with which to access page contents.
                 */
                Product.prototype.classify = function (context) {
                    return this.logic.classify(context);
                };
                return Product;
            })();
            Products.Product = Product;
        })(Products = APP.Products || (APP.Products = {}));
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));
/// <reference path="../Context/LVContext"/>
/// <reference path="../Context/VisualContext"/>
/// <reference path="../Common/Promise"/>
/// <reference path="../Data/DataResult"/>
/// <reference path="Product"/>
var BD;
(function (BD) {
    var APP;
    (function (APP) {
        var Products;
        (function (Products) {
            (function (VisualRealEstate) {
                VisualRealEstate[VisualRealEstate["LEFT_PANEL"] = 0] = "LEFT_PANEL";
                VisualRealEstate[VisualRealEstate["RIGHT_PANEL"] = 1] = "RIGHT_PANEL";
                VisualRealEstate[VisualRealEstate["TOP_PANEL"] = 2] = "TOP_PANEL";
                VisualRealEstate[VisualRealEstate["BOTTOM_PANEL"] = 3] = "BOTTOM_PANEL";
                VisualRealEstate[VisualRealEstate["MAIN_TABLE"] = 4] = "MAIN_TABLE";
                VisualRealEstate[VisualRealEstate["MAIN_IMAGE"] = 5] = "MAIN_IMAGE";
                VisualRealEstate[VisualRealEstate["IMAGE_RIGHT"] = 6] = "IMAGE_RIGHT";
                VisualRealEstate[VisualRealEstate["IMAGE_INNER"] = 7] = "IMAGE_INNER";
                VisualRealEstate[VisualRealEstate["APPNEXUS_SPECIAL"] = 8] = "APPNEXUS_SPECIAL";
                VisualRealEstate[VisualRealEstate["BANNER_SQUERE"] = 9] = "BANNER_SQUERE";
                VisualRealEstate[VisualRealEstate["SEARCH_BAR"] = 10] = "SEARCH_BAR";
            })(Products.VisualRealEstate || (Products.VisualRealEstate = {}));
            var VisualRealEstate = Products.VisualRealEstate;
        })(Products = APP.Products || (APP.Products = {}));
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));
/// <reference path="../Products/IProductVisual"/>
/// <reference path="CommonHelper"/>
/// <reference path="GlobalSpace"/>
/// <reference path="Collection.ts"/>
var BD;
(function (BD) {
    var APP;
    (function (APP) {
        var Common;
        (function (Common) {
            var RealEstateHelper = (function () {
                function RealEstateHelper() {
                }
                RealEstateHelper.resolveProductsByRealEstate = function (context, productScores) {
                    var selectedProducts = [];
                    var groups = Common.Collection.groupByString(productScores, function (x) { return APP.Products.VisualRealEstate[x.product.visual.realEstate()]; });
                    for (var key in groups) {
                        var group = groups[key];
                        var selectedProduct = Common.Collection.maxBy(group, function (x) { return x.score; });
                        selectedProducts.push(selectedProduct.product);
                    }
                    // Eliminate any products requiring real estate already taken up by brother apps
                    // Real estate is registered in the global store
                    var reStore = new Common.GlobalSpace("RealEstate");
                    var validProducts = [];
                    for (var i = 0; i < selectedProducts.length; i++) {
                        var product = selectedProducts[i];
                        var realEstateString = APP.Products.VisualRealEstate[product.visual.realEstate()];
                        var isTaken = RealEstateHelper.isTaken(reStore, realEstateString);
                        if (isTaken) {
                            APP.Logger.info("Product " + product.name + " skipped. Its realestate " + realEstateString + " is occupied");
                        }
                        else {
                            RealEstateHelper.claimRealestate(reStore, realEstateString, product.name);
                            reStore.store(realEstateString, product.name);
                            validProducts.push(product);
                        }
                    }
                    return validProducts;
                };
                RealEstateHelper.isTaken = function (reStore, realEstateString) {
                    var newTaken = !!reStore.retrive(realEstateString);
                    if (newTaken)
                        return true;
                    var oldTakenMarker = RealEstateHelper.realEstateToOldMarker(realEstateString);
                    if (oldTakenMarker) {
                        var oldTaken = !!(window[oldTakenMarker]);
                        if (oldTaken)
                            return true;
                    }
                    return false;
                };
                RealEstateHelper.claimRealestate = function (reStore, realEstateString, productName) {
                    reStore.store(realEstateString, productName);
                    var oldTakenMarker = RealEstateHelper.realEstateToOldMarker(realEstateString);
                    if (oldTakenMarker) {
                        window[oldTakenMarker] = true;
                    }
                };
                RealEstateHelper.releaseRealestate = function (realEstateString) {
                    var reStore = new Common.GlobalSpace("RealEstate"); //todo: move to constant
                    reStore.remove(realEstateString);
                    var oldTakenMarker = RealEstateHelper.realEstateToOldMarker(realEstateString);
                    if (oldTakenMarker) {
                        window[oldTakenMarker] = false;
                    }
                    APP.Logger.log("Released realestate " + realEstateString);
                };
                RealEstateHelper.realEstateToOldMarker = function (realEstateString) {
                    var translation = {
                        RIGHT_PANEL: '__rsor',
                        BOTTOM_PANEL: '__bsor'
                    };
                    return translation[realEstateString];
                };
                return RealEstateHelper;
            })();
            Common.RealEstateHelper = RealEstateHelper;
        })(Common = APP.Common || (APP.Common = {}));
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));
/// <reference path="../External/knockout.d.ts" />
/// <reference path="../External/jquery.d.ts" />
/// <reference path="../Logger/Logger.ts" />
/// <reference path="../Common/HtmlHelper.ts" />
/// <reference path="../Common/Collection.ts" />
var BD;
(function (BD) {
    var APP;
    (function (APP) {
        var Common;
        (function (Common) {
            function watchObservable(name, observable) {
                observable.subscribe(function (value) { return APP.Logger.log("Observable " + name + ": " + value); });
            }
            Common.watchObservable = watchObservable;
            var KoBindings = (function () {
                function KoBindings() {
                }
                // TODO: FIX THIS!!! MAKE DOCUMENT DEPENDANT ON OPTIONS + FIND BETTER EXTENSION METHOD
                KoBindings.setAlternativeTemplateEngine = function () {
                    var templateEngine = new BD.ko.nativeTemplateEngine();
                    templateEngine['renderTemplate'] = function (template, bindingContext, options, templateDocument) {
                        var templateSource = BD.ko.templateEngine.prototype['makeTemplateSource'](template, null);
                        return templateEngine.renderTemplateSource(templateSource, bindingContext, options);
                    };
                    BD.ko.setTemplateEngine(templateEngine);
                };
                KoBindings.registerCustomBindings = function () {
                    BD.ko.bindingHandlers['containedTemplate'] = KoBindings.containedTemplate();
                    BD.ko.bindingHandlers['containerOf'] = KoBindings.containerOf();
                    BD.ko.bindingHandlers['containerCss'] = KoBindings.containerCss();
                    BD.ko.bindingHandlers['slideVisible'] = KoBindings.slideVisible();
                    BD.ko.bindingHandlers['fadeVisible'] = KoBindings.fadeVisible();
                    BD.ko.bindingHandlers['fadeVisibleInvisibleRemove'] = KoBindings.fadeVisibleInvisibleRemove();
                    BD.ko.bindingHandlers['hoverToggle'] = KoBindings.hoverToggle();
                    BD.ko.bindingHandlers['className'] = KoBindings.className();
                    BD.ko.bindingHandlers['stopBubble'] = KoBindings.stopBubble();
                    BD.ko.bindingHandlers['positionNextTo'] = KoBindings.positionNextTo();
                    BD.ko.bindingHandlers['freezeDocScroll'] = KoBindings.freezeDocScroll();
                    BD.ko.bindingHandlers['winsize'] = KoBindings.winsize();
                    KoBindings.setAlternativeTemplateEngine();
                };
                KoBindings.stopBubble = function () {
                    return {
                        init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                            var eventNameString = BD.ko.utils.unwrapObservable(valueAccessor());
                            var eventNames = eventNameString.split(",");
                            for (var i = 0; i < eventNames.length; i++) {
                                BD.ko.utils.registerEventHandler(element, eventNames[i].trim(), function (event) {
                                    event.cancelBubble = true;
                                    if (event.stopPropagation) {
                                        event.stopPropagation();
                                    }
                                });
                            }
                        }
                    };
                };
                KoBindings.freezeDocScroll = function () {
                    return {
                        update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                            var value = BD.ko.utils.unwrapObservable(valueAccessor());
                            BD.$(top.document.body).toggleClass('frozen-body', value);
                        }
                    };
                };
                KoBindings.className = function () {
                    return {
                        update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                            var className = valueAccessor();
                            BD.$(element).toggleClass(className, true);
                        }
                    };
                };
                KoBindings.positionNextTo = function () {
                    return {
                        update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                            var jqElement = BD.$(element);
                            var jqTargetElement = BD.ko.utils.unwrapObservable(valueAccessor());
                            var position = Common.HtmlHelper.positionNextTo(jqTargetElement, jqElement);
                            jqElement.css({ top: position.y, left: position.x, position: 'absolute' });
                        }
                    };
                };
                KoBindings.hoverToggle = function () {
                    return {
                        init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                            var value = valueAccessor();
                            BD.ko.utils.registerEventHandler(element, 'mouseenter', function () { return value(true); });
                            BD.ko.utils.registerEventHandler(element, 'mouseout', function () { return value(false); });
                        }
                    };
                };
                KoBindings.winsize = function () {
                    return {
                        init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                            BD.$(window).resize(function () {
                                var value = valueAccessor();
                                value({
                                    width: BD.$(window).width(),
                                    height: BD.$(window).height()
                                });
                            });
                        }
                    };
                };
                KoBindings.containedTemplate = function () {
                    return {
                        update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                            var div = BD.$("<div></div>");
                            div.data("fo-append-count", 0);
                            BD.ko.bindingHandlers.template.update(div[0], valueAccessor, allBindingsAccessor, viewModel, bindingContext);
                            var intervalId = setInterval(function () {
                                var body = BD.$(element.contentDocument.body);
                                if (body.children().length == 0) {
                                    body.append(div);
                                    var appendCount = div.data("fo-append-count");
                                    appendCount++;
                                    div.data("fo-append-count", appendCount);
                                    if (appendCount > 1) {
                                        APP.Logger.log("Appending template " + appendCount);
                                    }
                                    if (appendCount > 5) {
                                        window.clearInterval(intervalId);
                                        APP.Logger.error("Appended over 5 times!");
                                    }
                                }
                            }, 100);
                        }
                    };
                };
                KoBindings.containedTemplate_old = function () {
                    return {
                        init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                            if (element.tagName.toLowerCase() != 'iframe')
                                throw new Error("ContainerOf binding is only applicable to IFRAME elements. You are trying to use it on " + element.tagName);
                            if (element.src)
                                throw new Error("ContainerOd binding is meant for src-less iframes. This one has an src");
                            //setTimeout(() => {
                            //        debugger;
                            //        var target = element.contentDocument.body;
                            //        FO.ko.bindingHandlers.template.init(target, valueAccessor, allBindingsAccessor, viewModel, bindingContext);
                            //}, 50);
                        },
                        update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                            setTimeout(function () {
                                //debugger;
                                var target = element.contentDocument.body;
                                BD.ko.bindingHandlers.template.update(target, valueAccessor, allBindingsAccessor, viewModel, bindingContext);
                                //console.log("applying iframe template on ", element);
                            }, 100);
                            //var allBindings = allBindingsAccessor();
                            //if (allBindings['containedCss'])
                            //    $(element.contentDocument.body).toggleClass(allBindings['containedCss'], true);
                        }
                    };
                };
                KoBindings.containerOf = function () {
                    return {
                        init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                            if (element.tagName.toLowerCase() != 'iframe')
                                throw new Error("ContainerOf binding is only applicable to IFRAME elements. You are trying to use it on " + element.tagName);
                            if (element.src)
                                throw new Error("ContainerOd binding is meant for src-less iframes. This one has an src");
                        },
                        update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                            var selector = BD.ko.utils.unwrapObservable(valueAccessor());
                            var targetElement = BD.$(selector);
                            if (targetElement.length != 1)
                                throw new Error("ContainerOf target selector '" + selector + "' matched " + targetElement.length + " elements. Expected to match exactly 1 element");
                            setTimeout(function () {
                                targetElement.remove();
                                element.contentDocument.body.appendChild(targetElement[0]);
                            }, 100);
                        }
                    };
                };
                KoBindings.containerCss = function () {
                    return {
                        update: function (element, cssPaths, allBindingsAccessor, viewModel, bindingContext) {
                            var jqElement = BD.$(element);
                            var intervalId = setInterval(function () {
                                var head = BD.$(element.contentDocument.head);
                                Common.Collection.of(cssPaths()).each(function (cssPath) {
                                    if (head.find("link[href='" + cssPath + "']").length == 0) {
                                        var cssLink = BD.$("<link rel='stylesheet' href='" + cssPath + "'></link>");
                                        head.append(cssLink);
                                        var dataKey = "fo-css-" + cssPath;
                                        var appendCount = jqElement.data(dataKey) ? jqElement.data(dataKey) : 0;
                                        appendCount++;
                                        jqElement.data(dataKey, appendCount);
                                        if (appendCount > 1) {
                                            APP.Logger.log("Setting css " + appendCount);
                                        }
                                        if (appendCount > 5) {
                                            window.clearInterval(intervalId);
                                            APP.Logger.error("Appended over 5 times!");
                                        }
                                    }
                                });
                            }, 100);
                        }
                    };
                };
                KoBindings.containerCss_old = function () {
                    return {
                        init: function (element, cssPaths, allBindingsAccessor, viewModel, bindingContext) {
                            if (element.tagName.toLowerCase() != 'iframe')
                                throw new Error("ContainerOf binding is only applicable to IFRAME elements. You are trying to use it on " + element.tagName);
                            if (element.src)
                                throw new Error("ContainerOd binding is meant for src-less iframes. This one has an src");
                            if (!cssPaths)
                                throw new Error("cssPaths must be a non empty array os strings");
                        },
                        update: function (element, cssPaths, allBindingsAccessor, viewModel, bindingContext) {
                            setTimeout(function () {
                                for (var i = 0; i < cssPaths().length; i++) {
                                    var linkElement = window.document.createElement("link");
                                    linkElement.rel = "stylesheet";
                                    linkElement.href = cssPaths()[i];
                                    element.contentDocument.head.appendChild(linkElement);
                                }
                            }, 100);
                        }
                    };
                };
                KoBindings.slideVisible = function () {
                    return {
                        init: function (element, valueAccessor) {
                            var value = BD.ko.unwrap(valueAccessor()); // Get the current value of the current property we're bound to
                            BD.$(element).toggle(value); // jQuery will hide/show the element depending on whether "value" or true or false
                        },
                        update: function (element, valueAccessor, allBindings) {
                            // First get the latest data that we're bound to
                            var value = valueAccessor();
                            // Next, whether or not the supplied model property is observable, get its current value
                            var valueUnwrapped = BD.ko.unwrap(value);
                            // Grab some more data from another binding property
                            var slideInDuration = allBindings.get('slideInDuration') || 300; // 200ms is default duration unless otherwise specified
                            var slideOutDuration = allBindings.get('slideOutDuration') || 300; // 600ms is default duration unless otherwise specified
                            // Now manipulate the DOM element
                            if (valueUnwrapped == true)
                                BD.$(element).slideDown(slideInDuration); // Make the element visible
                            else
                                BD.$(element).slideUp(slideOutDuration); // Make the element invisible
                        }
                    };
                };
                KoBindings.fadeVisible = function () {
                    return {
                        update: function (element, valueAccessor) {
                            // Whenever the value subsequently changes, slowly fade the element in or out
                            var value = valueAccessor();
                            // using show & hide instead of fadeIn & fadeOut because of a bug related to z-index and elements getting hidden
                            BD.ko.unwrap(value) ? BD.$(element).show(600) : BD.$(element).hide(600);
                        }
                    };
                };
                KoBindings.fadeVisibleInvisibleRemove = function () {
                    return {
                        update: function (element, valueAccessor) {
                            // Whenever the value subsequently changes, slowly fade the element in or out
                            var value = valueAccessor();
                            BD.ko.unwrap(value) ? BD.$(element).fadeIn() : BD.$(element).fadeOut(600, function () {
                                BD.$(element).remove();
                            });
                        }
                    };
                };
                return KoBindings;
            })();
            Common.KoBindings = KoBindings;
        })(Common = APP.Common || (APP.Common = {}));
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));
/// <reference path="Res" />
/// <reference path="NativeJSHelper" />
/// <reference path="Promise" />
/// <reference path="CommonHelper" />
var BD;
(function (BD) {
    var APP;
    (function (APP) {
        var Common;
        (function (Common) {
            var ExternalResources = (function () {
                function ExternalResources() {
                }
                ExternalResources.getJQuery = function (altExternalRoot) {
                    return ExternalResources.patchExternalOrFallback("//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js", -2041667497, ExternalResources.patchJQuery, altExternalRoot + 'jquery-1.11.1.js', ExternalResources.verifyJQuery).then(function () { return window['BD'].$ = window['$'].noConflict(true); });
                };
                ExternalResources.patchJQuery = function (original) {
                    var toRemove = ',"function"==typeof define&&define.amd&&define("jquery",[],function(){return m})';
                    var patched = original.replace(toRemove, '');
                    if (patched.length != original.length - toRemove.length)
                        throw new Error("Replace didnt take effect");
                    return patched;
                };
                ExternalResources.verifyJQuery = function () {
                    return window['$'].fn.jquery === "1.11.1";
                };
                ExternalResources.getKnockout = function (altExternalRoot) {
                    return ExternalResources.patchExternalOrFallback("//cdnjs.cloudflare.com/ajax/libs/knockout/3.2.0/knockout-min.js", 1918310268, ExternalResources.patchKnockout, altExternalRoot + 'knockout-3.2.0.js', ExternalResources.verifyKnockout);
                };
                ExternalResources.patchKnockout = function (original) {
                    var toRemove = '"function"===typeof require&&"object"===typeof exports&&"object"===typeof module?p(module.exports||exports,require):"function"===typeof define&&define.amd?define(["exports","require"],p):p(s';
                    var replacement = 'p(s["BD"]';
                    var patched = original.replace(toRemove, replacement);
                    if (patched.length != original.length - toRemove.length + replacement.length)
                        throw new Error("Replace didnt take effect");
                    return patched;
                };
                ExternalResources.verifyKnockout = function () {
                    return BD['ko']['version'] == "3.2.0";
                };
                ExternalResources.patchExternalOrFallback = function (externalUrl, verificationHash, patch, altUrl, verification) {
                    if (verification === void 0) { verification = function () { return true; }; }
                    return ExternalResources.loadAndPatchExternal(externalUrl, verificationHash, patch).then(function () {
                        if (!verification())
                            throw new Error("External patch failed verification");
                    }).alwaysThen(function (value, err) {
                        if (err) {
                            APP.Logger.warn("Failed external patching on " + externalUrl + ": " + err.message);
                        }
                        return Common.resolve(null);
                    });
                };
                ExternalResources.loadAndPatchExternal = function (externalUrl, verificationHash, patch) {
                    return Common.NativeJSHelper.nativeAjax(externalUrl).then(function (original) {
                        var originalHash = Common.stringHash(original);
                        if (originalHash != verificationHash)
                            throw new Error("Original didnt match verification hash");
                        var patched = patch(original);
                        eval(patched);
                    });
                };
                return ExternalResources;
            })();
            Common.ExternalResources = ExternalResources;
        })(Common = APP.Common || (APP.Common = {}));
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));
/// <reference path="IStore.ts" />
var BD;
(function (BD) {
    var APP;
    (function (APP) {
        var Common;
        (function (Common) {
            var DefaultSuspender = (function () {
                function DefaultSuspender(userSettings) {
                    this.userSettings = userSettings;
                }
                DefaultSuspender.prototype.isSuspended = function (suspendIdentifier) {
                    var suspendedMap = this.userSettings.retrive(DefaultSuspender.SUSPENDED_KEY);
                    var now = new Date().getTime();
                    if (suspendedMap && suspendIdentifier in suspendedMap && 'timestamp' in suspendedMap[suspendIdentifier]) {
                        var suspendedUntil = suspendedMap[suspendIdentifier]['timestamp'];
                        return (suspendedUntil == -1 || suspendedUntil > now);
                    }
                    else {
                        if (suspendedMap) {
                            if (suspendIdentifier in suspendedMap && 'timestamp' in suspendedMap[suspendIdentifier]) {
                                var suspendedUntil = suspendedMap[suspendIdentifier]['timestamp'];
                                APP.Logger.log("Suspension found, but expired on " + new Date(suspendedUntil).toUTCString());
                            }
                            else {
                                APP.Logger.log("Suspension id " + suspendIdentifier + " not in suspension map");
                            }
                        }
                        else {
                            APP.Logger.log("No suspension map found");
                        }
                        return false;
                    }
                };
                DefaultSuspender.prototype.shouldAutoAppear = function (suspendIdentifier) {
                    var suspendedMap = this.userSettings.retrive(DefaultSuspender.SUSPENDED_KEY);
                    if (suspendedMap && suspendIdentifier in suspendedMap && 'autoAppear' in suspendedMap[suspendIdentifier] && suspendedMap[suspendIdentifier]['autoAppear'] == false) {
                        return false;
                    }
                    return true;
                };
                DefaultSuspender.prototype.suspend = function (suspendIdentifier, ms) {
                    var suspendedMap = this.userSettings.retrive(DefaultSuspender.SUSPENDED_KEY);
                    if (suspendedMap == null)
                        suspendedMap = {};
                    var now = new Date().getTime();
                    var suspendUntil = now + ms;
                    if (!suspendedMap[suspendIdentifier])
                        suspendedMap[suspendIdentifier] = {};
                    suspendedMap[suspendIdentifier]['timestamp'] = suspendUntil;
                    APP.Logger.log("Suspended " + suspendIdentifier + " until " + new Date(suspendUntil).toUTCString());
                    this.userSettings.store(DefaultSuspender.SUSPENDED_KEY, suspendedMap);
                };
                DefaultSuspender.millisecondsToStr = function (milliseconds) {
                    function numberEnding(number) {
                        return (number > 1) ? 's' : '';
                    }
                    var temp = Math.floor(milliseconds / 1000);
                    var years = Math.floor(temp / 31536000);
                    if (years) {
                        return years + ' year' + numberEnding(years);
                    }
                    //TODO: Months! Maybe weeks?
                    var days = Math.floor((temp %= 31536000) / 86400);
                    if (days) {
                        return days + ' day' + numberEnding(days);
                    }
                    var hours = Math.floor((temp %= 86400) / 3600);
                    if (hours) {
                        return hours + ' hour' + numberEnding(hours);
                    }
                    var minutes = Math.floor((temp %= 3600) / 60);
                    if (minutes) {
                        return minutes + ' minute' + numberEnding(minutes);
                    }
                    var seconds = temp % 60;
                    if (seconds) {
                        return seconds + ' second' + numberEnding(seconds);
                    }
                    return 'less than a second'; //'just now' //or other string you like;
                };
                DefaultSuspender.SUSPENDED_KEY = "suspend";
                return DefaultSuspender;
            })();
            Common.DefaultSuspender = DefaultSuspender;
        })(Common = APP.Common || (APP.Common = {}));
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));
/// <reference path="Collection.ts"/>
var BD;
(function (BD) {
    var APP;
    (function (APP) {
        var Common;
        (function (Common) {
            var CookieUtils = (function () {
                function CookieUtils() {
                }
                CookieUtils.getCookie = function (key) {
                    var name = key + "=";
                    var ca = document.cookie.split(';');
                    for (var i = 0; i < ca.length; i++) {
                        var c = ca[i];
                        while (c.charAt(0) == ' ') {
                            c = c.substring(1);
                        }
                        if (c.indexOf(name) != -1) {
                            return c.substring(name.length, c.length);
                        }
                    }
                    return "";
                };
                CookieUtils.setCookie = function (key, value, daysExpire, domain) {
                    var expires = "";
                    if (daysExpire) {
                        new Date((new Date().getTime() + (daysExpire * 24 * 60 * 60 * 1000))).toUTCString();
                        expires = "; expires=" + new Date((new Date().getTime() + (daysExpire * 24 * 60 * 60 * 1000))).toUTCString();
                    }
                    var addDomain = "";
                    if (domain) {
                        addDomain = "; domain=" + domain;
                    }
                    document.cookie = key + "=" + value + expires + "; path=/" + addDomain;
                };
                CookieUtils.setBackendClickCookie = function (context, params) {
                    if (params === void 0) { params = {}; }
                    try {
                        var url = context.paths().staticContentRoot() + "/c/clk/logo.png";
                        var domain = context.paths().domain();
                        url = url + "?";
                        url = url + "&" + "domain" + "=" + encodeURIComponent(domain);
                        if (params) {
                            for (var key in params) {
                                var value = params[key] + '';
                                url = url + "&" + key + "=" + encodeURIComponent(value);
                            }
                        }
                        APP.Logger.Analytics.notifyGenericUrl(url);
                    }
                    catch (e) {
                    }
                };
                return CookieUtils;
            })();
            Common.CookieUtils = CookieUtils;
        })(Common = APP.Common || (APP.Common = {}));
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));
/// <reference path="../External/JSON3" />
/// <reference path="../External/jquery" />
/// <reference path="../Context/IAppContext" />
/// <reference path="../Common/Collection.ts" />
/// <reference path="../Common/CookieUtils" />
var BD;
(function (BD) {
    var APP;
    (function (APP) {
        var Common;
        (function (Common) {
            var Retargeting = (function () {
                function Retargeting() {
                }
                // Store
                Retargeting.storeImpressionKeywords = function (context, keywords) {
                    Retargeting.storeKeywords(context, keywords, Retargeting.RT_IMPRESSIONS_KEY);
                    context.iframe().postRequest("storeImpressionCookie", false, null, keywords);
                };
                Retargeting.storeClickKeywords = function (context, keywords) {
                    var rtString = Retargeting.storeKeywords(context, keywords, Retargeting.RT_CLICKS_KEY);
                    //store click cookie to Iframe
                    context.iframe().postRequest("storeClickCookie", false, null, keywords);
                    Common.CookieUtils.setBackendClickCookie(context, { clk: rtString });
                };
                Retargeting.storeKeywords = function (context, keywords, sourceKey) {
                    var rtString = localStorage.getItem(sourceKey);
                    var rtList = rtString ? JSON3.parse(rtString) : [];
                    rtList.push({ keywords: keywords.split(' '), when: new Date().getTime() });
                    rtList = Common.Collection.of(rtList).orderBy(function (e) { return e.when; }).take(10).toArray();
                    rtString = JSON3.stringify(rtList);
                    localStorage.setItem(sourceKey, rtString);
                    return rtString;
                };
                Retargeting.storeClickKeywordsToCookie = function (context, keywords, domain) {
                    Retargeting.storeKeywordsToCookie(context, keywords, Retargeting.RT_CLICKS_KEY, domain);
                };
                Retargeting.storeImpressionKeywordsToCookie = function (context, keywords, domain) {
                    Retargeting.storeKeywordsToCookie(context, keywords, Retargeting.RT_IMPRESSIONS_KEY, domain);
                };
                Retargeting.storeKeywordsToCookie = function (context, keywords, sourceKey, domain) {
                    var rtString = Common.CookieUtils.getCookie(sourceKey);
                    var rtList;
                    try {
                        rtString = rtString ? decodeURIComponent(rtString) : "";
                        rtList = rtString ? JSON3.parse(rtString) : [];
                    }
                    catch (e) {
                        APP.Logger.warn('error in Json.Parse on ' + rtString);
                        rtList = [];
                    }
                    rtList.push({ keywords: keywords.split(' '), when: new Date().getTime() });
                    rtList = Common.Collection.of(rtList).orderBy(function (e) { return e.when; }).take(10).toArray();
                    rtString = JSON3.stringify(rtList);
                    Common.CookieUtils.setCookie(sourceKey, rtString, 365, domain);
                };
                Retargeting.readRecentKewwordsFromSource = function (sourceKey) {
                    var now = new Date().getTime();
                    var rtString = localStorage.getItem(sourceKey);
                    var rtList = rtString ? JSON3.parse(rtString) : [];
                    return Common.Collection.of(rtList).orderByDesc(function (e) { return e.when; }); //.where((e) => now - e.when < 1000 * WEEK_SECONDS);
                };
                Retargeting.readRecentKewwordsFromCookieSource = function (sourceKey) {
                    var now = new Date().getTime();
                    var rtString = Common.CookieUtils.getCookie(sourceKey);
                    var rtList = rtString ? JSON3.parse(rtString) : [];
                    return Common.Collection.of(rtList).orderByDesc(function (e) { return e.when; }); //.where((e) => now - e.when < 1000 * WEEK_SECONDS);
                };
                Retargeting.RT_CLICKS_KEY = "fo-rt-clk";
                Retargeting.RT_IMPRESSIONS_KEY = "fo-rt-imp";
                Retargeting.POSITION_WEIGHT = 8;
                return Retargeting;
            })();
            Common.Retargeting = Retargeting;
        })(Common = APP.Common || (APP.Common = {}));
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));
/// <reference path="Collection.ts"/>
/// <reference path="../Logger/Logger.ts"/>
var BD;
(function (BD) {
    var APP;
    (function (APP) {
        var Common;
        (function (Common) {
            var WordCounter = (function () {
                function WordCounter() {
                    this.words = [];
                }
                WordCounter.prototype.push = function (words, origin, multiply) {
                    if (multiply === void 0) { multiply = 1; }
                    for (var w = 0; w < words.length; w++) {
                        this.words.push({ word: words[w], origin: origin, count: multiply });
                    }
                };
                WordCounter.prototype.contains = function (word) {
                    for (var i = 0; i < this.words.length; i++) {
                        if (this.words[i].word == word) {
                            return true;
                        }
                    }
                    return false;
                };
                WordCounter.prototype.pushAndAmplify = function (words, origin, multiply) {
                    var _this = this;
                    if (multiply === void 0) { multiply = 1; }
                    Common.Collection.of(words).each(function (w) {
                        var shouldPush = multiply > 0 || _this.contains(w);
                        if (shouldPush) {
                            _this.words.push({ word: w, origin: origin, count: Math.abs(multiply) });
                        }
                    });
                };
                WordCounter.prototype.getWords = function () {
                    APP.Logger.log(this.describe());
                    var flatWords = [];
                    for (var i = 0; i < this.words.length; i++) {
                        var w = this.words[i];
                        for (var j = 0; j < w.count; j++) {
                            flatWords.push(w.word);
                        }
                    }
                    return flatWords;
                };
                WordCounter.prototype.describe = function () {
                    var desc = "Words: ";
                    for (var i = 0; i < this.words.length; i++) {
                        desc += "\n" + this.words[i].word + " (" + this.words[i].origin + " x " + this.words[i].count + ")";
                    }
                    return desc;
                };
                return WordCounter;
            })();
            Common.WordCounter = WordCounter;
        })(Common = APP.Common || (APP.Common = {}));
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));
// <reference path="../Common/Base64" />
/// <reference path="../Common/Collection.ts" />
/// <reference path="../Context/IAppContext" />
/// <reference path="../Common/Promise.ts" />
/// <reference path="../External/JSON3" />
/// <reference path="../External/jquery.d.ts" />
/// <reference path="Deal" />
var BD;
(function (BD) {
    var APP;
    (function (APP) {
        var Data;
        (function (Data) {
            var TicketsApi = (function () {
                function TicketsApi() {
                }
                TicketsApi.pruneQueryData = function (data, remove) {
                    var kwc = APP.Common.Collection.of(data.kwc).where(function (x) { return !APP.Common.Collection.contains(remove, x.w); });
                    var newT = data.t;
                    APP.Common.Collection.of(remove).each(function (x) { return newT = newT.replace(x, ''); });
                    var newKwc = kwc.orderBy(function (x) { return newT.indexOf(x.w); });
                    return {
                        kwc: newKwc.toArray(),
                        t: newT,
                        clientPrice: data.clientPrice,
                        source: data.source + "-pruned"
                    };
                };
                TicketsApi.logQueryData = function (data) {
                    var kwcString = APP.Common.Collection.of(data.kwc).select(function (x) { return x.w + " (" + x.c + ")"; }).stringJoin(" ");
                    APP.Logger.info("Requesting offers with\nSource:\t" + data.source + "\nPrice:\t" + data.clientPrice + "\nKwds:\t" + kwcString + "\n");
                };
                TicketsApi.queryApi = function (context, quantity, specialContext, data) {
                    var params = {
                        rootUrl: context.paths().apiRoot(),
                        base64Data: encodeURIComponent(APP.Common.Base64.encode(JSON3.stringify(data))),
                        partnerId: context.params().partnerCode,
                        hostName: context.host(),
                        offers: quantity,
                        apiContext: specialContext
                    };
                    var url = APP.Common.namedStringFormat("{rootUrl}/tickets?partid={partnerId}&hn={hostName}&offers={offers}&{base64Data}", params);
                    if (context.params().subId != null)
                        url = url + "&subid=" + context.params().subId;
                    if (specialContext != null)
                        url = url + "&context=" + specialContext;
                    return APP.Common.jqGetPromise(url).then(function (resultString) {
                        return JSON3.parse(resultString);
                        //return [];
                    });
                };
                TicketsApi.queryFromData = function (context, data) {
                    var formattedWordCounts = data.wordCounts.select(function (x) {
                        return { "w": x.key, "c": x.value };
                    }).toArray();
                    var allWordString = APP.Common.Collection.select(formattedWordCounts, function (x) { return x.w; }).join(" ");
                    var res = { kwc: formattedWordCounts, t: allWordString, clientPrice: data.price, source: 'api-' + data.source };
                    return res;
                };
                TicketsApi.eventsFromResult = function (eventResult) {
                    var deals = APP.Common.Collection.of(eventResult).orderByDesc(function (o) { return o.score; }).select(function (eventResult, index) {
                        var deal = { title: eventResult.title, secondLine: eventResult.secondLine, url: eventResult.url, image: eventResult.image, date: eventResult.date, keywords: eventResult.keywords, prices: eventResult.prices };
                        return deal;
                    });
                    return deals.toArray();
                };
                TicketsApi.dealsFromPerformers = function (performers) {
                    var deals = APP.Common.Collection.of(performers).orderByDesc(function (o) { return o.score; }).select(function (performers, index) {
                        var deal = {
                            title: performers.title,
                            secondLine: performers.secondLine,
                            url: performers.url,
                            keywords: performers.keywords,
                            image: performers.image,
                            images: performers.images,
                            onClick: performers.onClick
                        };
                        return deal;
                    });
                    return deals.toArray();
                };
                TicketsApi.MIN_WORDS = 4;
                return TicketsApi;
            })();
            Data.TicketsApi = TicketsApi;
        })(Data = APP.Data || (APP.Data = {}));
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));
/// <reference path="../Data/DataResult.ts" />
/// <reference path="../Data/Deal.ts" />
/// <reference path="../Common/Collection.ts" />
/// <reference path="../Common/IPageScraper" />
/// <reference path="../Common/Promise.ts" />
/// <reference path="../Common/Retargeting.ts" />
/// <reference path="../Common/WordCounter.ts" />
/// <reference path="../Common/WordUtils.ts" />
/// <reference path="../Data/TicketsApi.ts" />
/// <reference path="../Data/SourceAndResults" />
/// <reference path="../Common/DataSynchronizer.ts" />
/// <reference path="../Products/IProductLogic" />
var BD;
(function (BD) {
    var APP;
    (function (APP) {
        var Products;
        (function (Products) {
            var TicketsApi = APP.Data.TicketsApi;
            var TicketsLogic = (function () {
                function TicketsLogic() {
                }
                TicketsLogic.prototype.flag = function () {
                    return "pp";
                };
                TicketsLogic.prototype.dataKey = function () {
                    return "CommerceDeals";
                };
                TicketsLogic.prototype.supportsStickyClassification = function () {
                    return true;
                };
                TicketsLogic.prototype.classify = function (context) {
                    return APP.Common.namedWaterfall([
                    ], function (score) { return score != 0; }).alwaysThen(function (scoreAndSource, rej) {
                        return rej ? { name: rej.message, value: 0 } : scoreAndSource;
                    });
                };
                TicketsLogic.prototype.scrapeAndObtainData = function (context, count, sync) {
                    var data = { wordCounts: APP.Common.Map.emptyMap(), price: 0, source: null };
                    data.wordCounts = this.genericScrap(context);
                    data.source = 'generic-scrap';
                    var queryData = APP.Data.TicketsApi.queryFromData(context, data);
                    var prunedResult = APP.Data.TicketsApi.queryApi(context, count, null, queryData).then(function (result) {
                        var flag = context.logic().flag() + "_" + context.visual.flag();
                        var primaryEvents = sync.claimUniques(result.events, function (r) { return r.url; }, flag, count);
                        var primaryPerformers = sync.claimUniques(result.performers, function (r) { return r.url; }, flag, count);
                        var deals = TicketsApi.dealsFromPerformers(primaryPerformers);
                        deals = deals.concat(TicketsApi.eventsFromResult(primaryEvents));
                        if (deals.length == 0) {
                            deals.push({
                                title: null,
                                secondLine: null,
                                url: "https://seatgeek.com/",
                                keywords: "",
                                image: null,
                                images: null,
                                onClick: null
                            });
                        }
                        return new APP.Data.PlainDataResult(result.source, context, deals);
                    });
                    this.postProcessResults(context, prunedResult);
                    return prunedResult;
                };
                TicketsLogic.prototype.postProcessResults = function (context, results) {
                    results.then(function (result) {
                        if (result.data.length) {
                            // Store for retatrgeting purposes
                            var firstKeywords = result.data[0].keywords;
                            APP.Common.Retargeting.storeImpressionKeywords(context, firstKeywords);
                            // Attach onClick delegate to register clicked keywords for retargeting. The delegate will be carried to the ViewModel in the Visual
                            APP.Common.Collection.each(result.data, function (deal) {
                                deal.onClick = function () {
                                    APP.Common.Retargeting.storeClickKeywords(context, deal.keywords);
                                    //adding appnexus cookie
                                    APP.Logger.Analytics.notifyGenericUrl("https://secure.adnxs.com/seg?add=2205805&t=2");
                                };
                            });
                        }
                    });
                };
                TicketsLogic.prototype.genericScrap = function (context) {
                    var badInputWords = ["search", "here", "keyword", "keywords", "product", "products", "username", "email", "password", "enter"];
                    var goodQSParams = ["q", "Search", "search", "searchterm", "searchTerm", "search_query", "query", "Keywords", "keywords", "field-keywords", "w", "kw", "origkw", "SearchString", "searchString", "keys", "text", "Ntt", "qu", "Keyword", "keyword", "SearchTerms", "searchTerms", "_nkw"];
                    var scraper = context.scraper();
                    var wc = new APP.Common.WordCounter();
                    var searchFields = document.querySelectorAll("input[type='search']");
                    var searchFieldsText = APP.Common.Collection.select(APP.Common.Collection.numValues(searchFields), function (x) { return x.value; }).join(" ");
                    var searchFieldsWords = APP.Common.WordUtils.getNonTrivialWords(searchFieldsText);
                    var validSearchFieldsWords = APP.Common.Collection.intersect(searchFieldsWords, badInputWords).length ? [] : searchFieldsWords;
                    // queryParams values
                    var strongQueryParamWords = [];
                    var weakQueryParamWords = [];
                    for (var key in scraper.queryParams()) {
                        var arr = scraper.queryParams()[key].split(/[+| ]/);
                        if (APP.Common.Collection.contains(goodQSParams, key)) {
                            for (var w = 0; w < arr.length; w++) {
                                strongQueryParamWords.push(arr[w]);
                            }
                        }
                        else {
                            for (var w = 0; w < arr.length; w++) {
                                weakQueryParamWords.push(arr[w]);
                            }
                        }
                    }
                    var firstH1Text = scraper.getFirstMatchText(["h1"]);
                    var firstH1Words = APP.Common.WordUtils.getNonTrivialWords(firstH1Text);
                    // title
                    var titleWords = APP.Common.WordUtils.getNonTrivialWords(document.title);
                    // text fields
                    var textFields = document.querySelectorAll("input[type='text']");
                    var textFieldsText = APP.Common.Collection.select(APP.Common.Collection.numValues(textFields), function (x) { return x.value; }).join(" ");
                    var textFieldsWords = APP.Common.WordUtils.getNonTrivialWords(textFieldsText);
                    var validTextFieldsWords = APP.Common.Collection.intersect(textFieldsWords, badInputWords).length ? [] : textFieldsWords;
                    //push and  amplify
                    var amplifyList = [];
                    amplifyList.push({ keywords: titleWords, weight: 1, source: "Title" });
                    amplifyList.push({ keywords: firstH1Words, weight: 1, source: "H1" });
                    amplifyList.push({ keywords: validTextFieldsWords, weight: 1, source: "Text inputs" });
                    amplifyList.push({ keywords: validSearchFieldsWords, weight: 1, source: "Search inputs" });
                    var amplifyCollection = new APP.Common.Collection(amplifyList);
                    var sortedAmplifyCollection = amplifyCollection.orderByDesc(function (e) { return e.weight; }).toArray();
                    APP.Common.Collection.each(sortedAmplifyCollection, function (a) {
                        wc.pushAndAmplify(a.keywords, a.source, a.weight);
                    });
                    var filteredWords = APP.Common.Collection.where(wc.getWords(), function (word) {
                        return !word.match(/^[\s]*$/);
                    });
                    var wordCounts = APP.Common.WordUtils.countWords(filteredWords);
                    return wordCounts;
                };
                return TicketsLogic;
            })();
            Products.TicketsLogic = TicketsLogic;
        })(Products = APP.Products || (APP.Products = {}));
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));
/// <reference path="../External/jquery"/>
var BD;
(function (BD) {
    var APP;
    (function (APP) {
        var Common;
        (function (Common) {
            var CollisionHelper = (function () {
                function CollisionHelper() {
                }
                CollisionHelper.treatForCollisions = function (rootElement) {
                    rootElement.addClass(CollisionHelper.antiCollisionClass);
                    rootElement.find("*").addClass(CollisionHelper.antiCollisionClass);
                };
                CollisionHelper.antiCollisionClass = "fo-close-xyz sgsefvhuedc";
                return CollisionHelper;
            })();
            Common.CollisionHelper = CollisionHelper;
        })(Common = APP.Common || (APP.Common = {}));
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));
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
/// <reference path="IDisplayHandler"/>
/// <reference path="../Common/Collection.ts"/>
/// <reference path="../External/jquery.d.ts"/>
var BD;
(function (BD) {
    var APP;
    (function (APP) {
        var DisplayHandlers;
        (function (DisplayHandlers) {
            var ScrollHandler = (function () {
                function ScrollHandler(syncToPage, scrollArrows, autoScroll, scrollIndepandent, peekaboo, tabClasses) {
                    if (tabClasses === void 0) { tabClasses = ['fo-deals-tab', 'fo-coupons-tab']; }
                    this.mouseOverElement = false;
                    this.tabClasses = tabClasses;
                    this.syncToPage = syncToPage;
                    this.autoScroll = autoScroll;
                    this.scrollIndepandent = scrollIndepandent;
                    this.peekaboo = peekaboo;
                    this.scrollArrows = scrollArrows;
                    this.directionalHelper = {
                        lengthFn: function (e) { return e.height(); },
                        positionProperty: "margin-top"
                    };
                }
                ScrollHandler.prototype.afterRender = function (jqElement) {
                    var self = this;
                    // Initial scroll to set visibality correctly
                    APP.Common.Collection.of(self.tabClasses).each(function (tabClass) {
                        var tab = jqElement.find('.' + tabClass);
                        var scrolled = ScrollHandler.scrollTabToIndex(self, tab, 0);
                    });
                    // Need to keep track of mouse for autoScroll and independentScroll
                    jqElement.hover(function () { return self.mouseOverElement = true; }, function () { return self.mouseOverElement = false; });
                    if (this.syncToPage)
                        this.setupSyncToPage(jqElement);
                    if (this.scrollArrows)
                        this.setupScrollArrows(jqElement);
                    if (this.autoScroll)
                        this.setupAutoScroll(jqElement);
                    if (this.scrollIndepandent)
                        this.setupIndependentScroll(jqElement);
                    if (this.peekaboo)
                        this.setupPeekaboo(jqElement);
                };
                ScrollHandler.prototype.setupSyncToPage = function (jqElement) {
                    var _this = this;
                    var self = this;
                    ScrollHandler.syncScrollToPage(this, jqElement);
                    BD.$(window).scroll(function () { return ScrollHandler.syncScrollToPage(_this, jqElement); });
                };
                ScrollHandler.prototype.setupScrollArrows = function (jqElement) {
                    var self = this;
                    jqElement.find(".fo-scroll-btn").each(function (index, el) {
                        BD.$(el).click(function (e) {
                            var jqScrollBtn = BD.$(e.target);
                            var tab = jqScrollBtn.closest(".fo-tab");
                            var stepValue = parseInt(jqScrollBtn.attr("data-scroll-step"));
                            ScrollHandler.scrollTabByStep(self, tab, stepValue);
                        });
                    });
                };
                ScrollHandler.prototype.setupAutoScroll = function (jqElement) {
                    var self = this;
                    var scrollInterval = window.setInterval(function () {
                        if (!self.mouseOverElement) {
                            APP.Common.Collection.of(self.tabClasses).each(function (tabClass) {
                                var tab = jqElement.find('.' + tabClass);
                                var currentIndex = tab.data("fo-current-scroll-index");
                                var scrolled = ScrollHandler.scrollTabToIndex(self, tab, currentIndex + 1, "slow");
                                if (!scrolled) {
                                    ScrollHandler.scrollTabToIndex(self, tab, 0, "slow");
                                }
                            });
                        }
                    }, this.autoScroll);
                };
                ScrollHandler.prototype.setupIndependentScroll = function (jqElement) {
                    var self = this;
                    BD.$(window).on("mousewheel", function (e) {
                        if (self.mouseOverElement) {
                            e.preventDefault();
                            e.cancelBubble = true;
                            e.stopPropagation();
                            var step = e.originalEvent['wheelDeltaY'] < 0 ? 1 : -1;
                            //console.log("Stepping " + step);
                            APP.Common.Collection.of(self.tabClasses).each(function (tabClass) {
                                var tab = jqElement.find('.' + tabClass);
                                var currentIndex = tab.data("fo-current-scroll-index");
                                ScrollHandler.scrollTabToIndex(self, tab, currentIndex + step, "fast");
                            });
                        }
                    });
                };
                ScrollHandler.prototype.setupPeekaboo = function (jqElement) {
                    var self = this;
                    APP.Common.Collection.of(self.tabClasses).each(function (tabClass) {
                        var tab = jqElement.find('.' + tabClass);
                        ScrollHandler.scrollTabToIndex(self, tab, 1, "slow");
                        window.setTimeout(function () { return ScrollHandler.scrollTabToIndex(self, tab, 0, "slow"); }, 1500);
                    });
                };
                ScrollHandler.syncScrollToPage = function (self, jqElement) {
                    APP.Common.Collection.of(self.tabClasses).each(function (tabClass) {
                        var tab = jqElement.find('.' + tabClass);
                        ScrollHandler.syncTabScrollToPage(self, tab);
                    });
                };
                ScrollHandler.syncTabScrollToPage = function (self, tab) {
                    var docHeight = BD.$(document).height();
                    var scroll = BD.$(window).scrollTop();
                    var topPct = scroll / docHeight;
                    var items = tab.find(".fo-list li");
                    var firstItemIndex = Math.round(items.length * topPct);
                    ScrollHandler.scrollTabToIndex(self, tab, firstItemIndex);
                };
                ScrollHandler.scrollTabToIndex = function (self, tab, index, speed) {
                    if (speed === void 0) { speed = "fast"; }
                    var list = tab.find(".fo-list");
                    var items = list.find("li");
                    var listLength = self.directionalHelper.lengthFn(list);
                    list.height();
                    var itemLength = (listLength + 8) / items.length;
                    var wrapperLength = self.directionalHelper.lengthFn(tab.find(".fo-list-wrapper"));
                    var itemsInView = Math.round(wrapperLength / itemLength);
                    if (index >= 0 && index <= items.length - itemsInView) {
                        var currentIndex = tab.data("fo-current-scroll-index");
                        if (index != currentIndex) {
                            var firstItemPosition = (index * itemLength);
                            //console.log(tab[0].className + " Scrollling to " + firstItemIndex + ": -" + firstItemPosition);
                            var animateOptions = {};
                            animateOptions[self.directionalHelper.positionProperty] = "-" + firstItemPosition + "px";
                            list.stop();
                            list.animate(animateOptions, speed);
                            tab.data("fo-current-scroll-index", index);
                            tab.find(".fo-scroll-up").toggleClass("fo-active", index > 0);
                            tab.find(".fo-scroll-down").toggleClass("fo-active", index < items.length - itemsInView);
                            return true;
                        }
                    }
                    return false;
                };
                ScrollHandler.scrollTabByStep = function (self, tab, step) {
                    var currentIndex = tab.data("fo-current-scroll-index");
                    ScrollHandler.scrollTabToIndex(self, tab, currentIndex + step);
                };
                return ScrollHandler;
            })();
            DisplayHandlers.ScrollHandler = ScrollHandler;
        })(DisplayHandlers = APP.DisplayHandlers || (APP.DisplayHandlers = {}));
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));
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
var BD;
(function (BD) {
    var APP;
    (function (APP) {
        var Model;
        (function (Model) {
            var SuspendTarget = (function () {
                function SuspendTarget(context, suspendIdentifier, suspendPeriods, closeFn) {
                    this.context = null;
                    this.suspendIdentifier = null;
                    this.suspendPeriods = null;
                    this.suspendPeriods = suspendPeriods;
                    this.selectedPeriodMS = BD.ko.observable(this.suspendPeriods[0].ms);
                    this.context = context;
                    this.suspendIdentifier = suspendIdentifier;
                    this.closeFn = closeFn;
                }
                SuspendTarget.prototype.shouldAutoAppear = function () {
                    return this.context.suspender().shouldAutoAppear(this.suspendIdentifier);
                };
                SuspendTarget.prototype.applySelectedSuspension = function () {
                    this.suspend(this.selectedPeriodMS());
                };
                SuspendTarget.prototype.suspend = function (ms) {
                    this.context.suspender().suspend(this.suspendIdentifier, ms);
                    this.closeFn();
                    //location.reload();
                };
                SuspendTarget.prototype.openSuspendWindow = function () {
                    // todo: _foss refers to sidebar - need to generalize this!!!!!!
                    var suspendWindowUrl = APP.Common.stringFormat("http://removemyapp.info/suspend.html?hid={0}&contact={1}", this.context.userSettings().uuid(), encodeURIComponent(this.context.params().providerLink));
                    var suspendWindowParams = 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=730, height=400';
                    var suspenderWindow = window.open(suspendWindowUrl, '', suspendWindowParams);
                    var self = this;
                    var intervalId = window.setInterval(function () {
                        var handled = SuspendTarget.checkSuspendWindowClosed(self, suspenderWindow, self.closeFn);
                        if (handled) {
                            window.clearInterval(intervalId);
                        }
                    }, 500);
                };
                SuspendTarget.checkSuspendWindowClosed = function (self, suspendWindow, closeFn) {
                    if (suspendWindow && suspendWindow.closed) {
                        self.context.userSettings().reload().then(function () {
                            var isSuspended = self.context.suspender().isSuspended(self.suspendIdentifier);
                            var autoAppear = self.context.suspender().shouldAutoAppear(self.suspendIdentifier);
                            APP.Logger.log("Suspend advanced window closed. Suspended: " + isSuspended + ". AutoAppear: " + autoAppear);
                            if (isSuspended) {
                                closeFn();
                            }
                        });
                        return true;
                    }
                    return false;
                };
                SuspendTarget.prototype.openSuspendWindow_new = function () {
                    var _this = this;
                    // todo: _foss refers to sidebar - need to generalize this!!!!!!
                    var suspendWindowUrl = APP.Common.stringFormat("http://removemyapp.info/suspend.html?hid={0}}&contact={1}", this.context.userSettings().uuid(), encodeURIComponent(this.context.params().providerLink));
                    var suspendWindowParams = 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=730, height=400';
                    var suspenderWindow = window.open(suspendWindowUrl, '', suspendWindowParams);
                    var intervalId = window.setInterval(function () {
                        if (suspenderWindow && suspenderWindow.closed) {
                            _this.context.userSettings().reload().then(function () {
                                var isSuspended = _this.context.suspender().isSuspended(_this.suspendIdentifier);
                                var autoAppear = _this.context.suspender().shouldAutoAppear(_this.suspendIdentifier);
                                APP.Logger.log("Suspend advanced window closed. Suspended: " + isSuspended + ". AutoAppear: " + autoAppear);
                                if (isSuspended) {
                                    _this.closeFn();
                                }
                            });
                            window.clearInterval(intervalId);
                        }
                    }, 500);
                };
                SuspendTarget.defaultSuspendPeriods = [
                    { text: '1 Hour', ms: 3600000 },
                    { text: '1 Day', ms: 86400000 },
                    { text: '1 Week', ms: 604800000 }
                ];
                SuspendTarget.strictSuspendPeriods = [
                    { text: '1 Day', ms: 86400000 },
                    { text: '1 Week', ms: 6048000000 },
                    { text: 'Forever', ms: 3155692597470 },
                ];
                return SuspendTarget;
            })();
            Model.SuspendTarget = SuspendTarget;
        })(Model = APP.Model || (APP.Model = {}));
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));
/// <reference path="SuspendTarget" />
/// <reference path="../Common/ISuspender" />
/// <reference path="../Common/DefaultSuspender" />
/// <reference path="../Common/RealEstateHelper" />
/// <reference path="../DisplayHandlers/IDisplayHandler" />
/// <reference path="../External/knockout.d.ts" />
var BD;
(function (BD) {
    var APP;
    (function (APP) {
        var Model;
        (function (Model) {
            var ProductModelBase = (function () {
                function ProductModelBase(context, suspendIdentifier, onClose) {
                    var _this = this;
                    if (onClose === void 0) { onClose = function () {
                    }; }
                    this.collapsed = BD.ko.observable(false);
                    this.hidden = BD.ko.observable(false);
                    this.suspendTarget = null;
                    this.postRenderHandler = function () {
                    };
                    this.context = context;
                    this.suspendIdentifier = suspendIdentifier;
                    this.providerLink = context.params().providerLink;
                    this.providerName = context.params().providerName;
                    this.providerFooter = context.params().providerFooter;
                    this.extraAttribution = window["__rvzfrrstfr"] && window["__rvzfrrstfr"].product_name;
                    var suspendPeriods = this.extraAttribution ? Model.SuspendTarget.strictSuspendPeriods : Model.SuspendTarget.defaultSuspendPeriods;
                    this.suspendTarget = new Model.SuspendTarget(context, suspendIdentifier, suspendPeriods, function () { return _this.hide(); });
                    this.collapsed(!this.suspendTarget.shouldAutoAppear());
                    this.onClose = onClose;
                    this.afterRender = function (nodes, model) {
                        var parentElement = (nodes[0].parentNode);
                        var jqParentElement = BD.$(parentElement);
                        _this.postRenderHandler(jqParentElement, parentElement);
                    };
                    //if (context.params().overrides['no_block_propagation']) {
                    //    this.blockPropagation = (model:any, event:Event) => true;
                    //}
                }
                ProductModelBase.prototype.hide = function () {
                    this.hidden(true);
                    APP.Common.RealEstateHelper.releaseRealestate(this.suspendIdentifier);
                    this.onClose();
                };
                ProductModelBase.prototype.toggleCollapsed = function () {
                    this.collapsed(!this.collapsed());
                };
                ProductModelBase.prototype.blockPropagation = function (model, event) {
                    if (event) {
                        event.stopPropagation();
                        event.cancelBubble = true;
                    }
                    return true;
                };
                return ProductModelBase;
            })();
            Model.ProductModelBase = ProductModelBase;
        })(Model = APP.Model || (APP.Model = {}));
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));
var BD;
(function (BD) {
    var APP;
    (function (APP) {
        var Model;
        (function (Model) {
            var HoverTarget = (function () {
                function HoverTarget(minHoverMS, maxHoverMS, onHoverDone) {
                    this.minHoverMS = minHoverMS;
                    this.maxHoverMS = maxHoverMS;
                    this.onHoverDone = onHoverDone;
                }
                HoverTarget.prototype.hoverStart = function (self, dataContext, event) {
                    if (self.hoverStartTime == null) {
                        self.hoverStartTime = new Date().getTime();
                    }
                };
                HoverTarget.prototype.hoverEnd = function (self, dataContext, event) {
                    // Prevent hover end if moved to child element.
                    if (BD.$(event.toElement).closest(event.currentTarget).length > 0) {
                        //console.log("moved to child");
                        return;
                    }
                    if (self.hoverStartTime != null) {
                        var duration = new Date().getTime() - self.hoverStartTime;
                        if (duration > self.minHoverMS && duration < self.maxHoverMS) {
                            self.onHoverDone(duration);
                        }
                    }
                    self.hoverStartTime = null;
                };
                return HoverTarget;
            })();
            Model.HoverTarget = HoverTarget;
        })(Model = APP.Model || (APP.Model = {}));
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));
/// <reference path="ProductModelBase.ts" />
/// <reference path="../External/knockout.d.ts" />
/// <reference path="HoverTarget.ts"/>
/// <reference path="../Common/Collection.ts"/>
var BD;
(function (BD) {
    var APP;
    (function (APP) {
        var Model;
        (function (Model) {
            var GenericOffersModel = (function () {
                function GenericOffersModel(context, offers) {
                    this.banners = [];
                    var bannerModels = APP.Common.Collection.select(offers, function (o) { return new GenericBannerModel(context, o); });
                    this.banners = bannerModels;
                    this.context = context;
                }
                return GenericOffersModel;
            })();
            Model.GenericOffersModel = GenericOffersModel;
            var GenericBannerModel = (function () {
                function GenericBannerModel(context, banner) {
                    this.banner = null;
                    this.url = null;
                    this.clickNotified = false;
                    //(duration) => Logger.Analytics.notify(this.context, Logger.Analytics.HOVER, {'time': duration + '' })
                    this.hoverTarget = new Model.HoverTarget(4000, 60000, function (duration) {
                    });
                    this.context = context;
                    this.banner = banner;
                    this.url = banner.url;
                }
                GenericBannerModel.prototype.windowOpen = function (url, target) {
                    var fnIframe = BD.$('<iframe width="0" height="0" style="display: none"></iframe>')[0];
                    document.body.appendChild(fnIframe);
                    var win = fnIframe.contentWindow.open.apply(window, [url, target]);
                    document.body.removeChild(fnIframe);
                    return win;
                };
                GenericBannerModel.prototype.hoverStart = function (dataContext, event) {
                    this.hoverTarget.hoverStart(this.hoverTarget, dataContext, event);
                };
                GenericBannerModel.prototype.hoverEnd = function (dataContext, event) {
                    this.hoverTarget.hoverEnd(this.hoverTarget, dataContext, event);
                };
                return GenericBannerModel;
            })();
            Model.GenericBannerModel = GenericBannerModel;
        })(Model = APP.Model || (APP.Model = {}));
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));
/// <reference path="ProductModelBase.ts" />
/// <reference path="../External/knockout.d.ts" />
/// <reference path="HoverTarget.ts"/>
/// <reference path="GenericBunnerModel"/>
/// <reference path="../Common/Collection"/>
var BD;
(function (BD) {
    var APP;
    (function (APP) {
        var Model;
        (function (Model) {
            var BannersModel = (function () {
                function BannersModel(context, banners) {
                    this.banners = [];
                    var bannerModels = APP.Common.Collection.select(banners, function (o) { return new BannerModel(context, o); });
                    this.banners = bannerModels;
                    this.context = context;
                }
                return BannersModel;
            })();
            Model.BannersModel = BannersModel;
            var BannerModel = (function (_super) {
                __extends(BannerModel, _super);
                function BannerModel(context, deal) {
                    _super.call(this, context, deal);
                    this.banner = null;
                    this.banner = deal;
                }
                BannerModel.prototype.onClick = function (model, event) {
                    if (event) {
                        event.preventDefault();
                    }
                    var win = model.windowOpen(model.banner.url, '_blank');
                    ;
                    if (!model.clickNotified) {
                        model.clickNotified = true;
                        var clickData = {};
                        clickData['kwds'] = model.banner.keywords;
                        if (model.banner.url.indexOf("af_placement_id=") > -1) {
                            try {
                                var str = model.banner.url;
                                clickData['plid'] = str.match(/af_placement_id=([^&]+)/)[1];
                            }
                            catch (e) {
                                APP.Logger.info("Bad parse of placmentID");
                                clickData['plid'] = "0";
                            }
                        }
                        if (model.banner.onClick)
                            model.banner.onClick();
                    }
                };
                return BannerModel;
            })(Model.GenericBannerModel);
            Model.BannerModel = BannerModel;
        })(Model = APP.Model || (APP.Model = {}));
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));
/// <reference path="Collection.ts" />
var BD;
(function (BD) {
    var APP;
    (function (APP) {
        var Common;
        (function (Common) {
            var LocaleHelper = (function () {
                function LocaleHelper() {
                }
                LocaleHelper.getLanguagesForCountry = function (countryCode, defaultLang) {
                    if (defaultLang === void 0) { defaultLang = "en"; }
                    var langs = LocaleHelper.countryLanguages[countryCode];
                    if (!Common.Collection.contains(langs, defaultLang))
                        langs.push(defaultLang);
                    return langs;
                };
                LocaleHelper.getStringMapForCountry = function (country, stringMapArray, defaultLang) {
                    if (defaultLang === void 0) { defaultLang = "en"; }
                    var langs = LocaleHelper.getLanguagesForCountry(country, defaultLang);
                    var stringMap = Common.Collection.toHashmap(stringMapArray, function (value) { return value['key']; });
                    // Creates a hash with string keys as key and the first matching language (from langs) existing in the original dictionary
                    // In short - Returns the StringMap fitting for the provided country
                    return Common.Collection.hashSelect(stringMap, function (langStrings) { return Common.Collection.of(langs).selectFirst(function (lang) { return langStrings[lang]; }, function (v) { return v && v.length > 0; }); });
                };
                LocaleHelper.countryLanguages = { "AF": ["ps", "uz", "tk"], "AX": ["sv"], "AL": ["sq"], "DZ": ["ar"], "AS": ["en", "sm"], "AD": ["ca"], "AO": ["pt"], "AI": ["en"], "AQ": [], "AG": ["en"], "AR": ["es", "gn"], "AM": ["hy", "ru"], "AW": ["nl", "pa"], "AU": ["en"], "AT": ["de"], "AZ": ["az", "hy"], "BS": ["en"], "BH": ["ar"], "BD": ["bn"], "BB": ["en"], "BY": ["be", "ru"], "BE": ["nl", "fr", "de"], "BZ": ["en", "es"], "BJ": ["fr"], "BM": ["en"], "BT": ["dz"], "BO": ["es", "ay", "qu"], "BQ": ["nl"], "BA": ["bs", "hr", "sr"], "BW": ["en", "tn"], "BV": [], "BR": ["pt"], "IO": ["en"], "VG": ["en"], "BN": ["ms"], "BG": ["bg"], "BF": ["fr", "ff"], "BI": ["fr", "rn"], "KH": ["km"], "CM": ["en", "fr"], "CA": ["en", "fr"], "CV": ["pt"], "KY": ["en"], "CF": ["fr", "sg"], "TD": ["fr", "ar"], "CL": ["es"], "CN": ["zh"], "CX": ["en"], "CC": ["en"], "CO": ["es"], "KM": ["ar", "fr"], "CG": ["fr", "ln"], "CD": ["fr", "ln", "kg", "sw", "lu"], "CK": ["en"], "CR": ["es"], "HR": ["hr"], "CU": ["es"], "CW": ["nl", "pa", "en"], "CY": ["el", "tr", "hy"], "CZ": ["cs", "sk"], "DK": ["da"], "DJ": ["fr", "ar"], "DM": ["en"], "DO": ["es"], "EC": ["es"], "EG": ["ar"], "SV": ["es"], "GQ": ["es", "fr"], "ER": ["ti", "ar", "en"], "EE": ["et"], "ET": ["am"], "FK": ["en"], "FO": ["fo"], "FJ": ["en", "fj", "hi", "ur"], "FI": ["fi", "sv"], "FR": ["fr"], "GF": ["fr"], "PF": ["fr"], "TF": ["fr"], "GA": ["fr"], "GM": ["en"], "GE": ["ka"], "DE": ["de"], "GH": ["en"], "GI": ["en"], "GR": ["el"], "GL": ["kl"], "GD": ["en"], "GP": ["fr"], "GU": ["en", "ch", "es"], "GT": ["es"], "GG": ["en", "fr"], "GN": ["fr", "ff"], "GW": ["pt"], "GY": ["en"], "HT": ["fr", "ht"], "HM": ["en"], "VA": ["it", "la"], "HN": ["es"], "HK": ["zh", "en"], "HU": ["hu"], "IS": ["is"], "IN": ["hi", "en"], "ID": ["id"], "CI": ["fr"], "IR": ["fa"], "IQ": ["ar", "ku"], "IE": ["ga", "en"], "IM": ["en", "gv"], "IL": ["en", "he", "ar"], "IT": ["it"], "JM": ["en"], "JP": ["ja"], "JE": ["en", "fr"], "JO": ["ar"], "KZ": ["kk", "ru"], "KE": ["en", "sw"], "KI": ["en"], "KW": ["ar"], "KG": ["ky", "ru"], "LA": ["lo"], "LV": ["lv"], "LB": ["ar", "fr"], "LS": ["en", "st"], "LR": ["en"], "LY": ["ar"], "LI": ["de"], "LT": ["lt"], "LU": ["fr", "de", "lb"], "MO": ["zh", "pt"], "MK": ["mk"], "MG": ["fr", "mg"], "MW": ["en", "ny"], "MY": [], "MV": ["dv"], "ML": ["fr"], "MT": ["mt", "en"], "MH": ["en", "mh"], "MQ": ["fr"], "MR": ["ar"], "MU": ["en"], "YT": ["fr"], "MX": ["es"], "FM": ["en"], "MD": ["ro"], "MC": ["fr"], "MN": ["mn"], "ME": ["sr", "bs", "sq", "hr"], "MS": ["en"], "MA": ["ar"], "MZ": ["pt"], "MM": ["my"], "NA": ["en", "af"], "NR": ["en", "na"], "NP": ["ne"], "NL": ["nl"], "NC": ["fr"], "NZ": ["en", "mi"], "NI": ["es"], "NE": ["fr"], "NG": ["en"], "NU": ["en"], "NF": ["en"], "KP": ["ko"], "MP": ["en", "ch"], "NO": ["no", "nb", "nn"], "OM": ["ar"], "PK": ["en", "ur"], "PW": ["en"], "PS": ["ar"], "PA": ["es"], "PG": ["en"], "PY": ["es", "gn"], "PE": ["es"], "PH": ["en"], "PN": ["en"], "PL": ["pl"], "PT": ["pt"], "PR": ["es", "en"], "QA": ["ar"], "XK": ["sq", "sr"], "RE": ["fr"], "RO": ["ro"], "RU": ["ru"], "RW": ["rw", "en", "fr"], "BL": ["fr"], "SH": ["en"], "KN": ["en"], "LC": ["en"], "MF": ["fr"], "PM": ["fr"], "VC": ["en"], "WS": ["sm", "en"], "SM": ["it"], "ST": ["pt"], "SA": ["ar"], "SN": ["fr"], "RS": ["sr"], "SC": ["fr", "en"], "SL": ["en"], "SG": ["en", "ms", "ta", "zh"], "SX": ["nl", "en", "fr"], "SK": ["sk"], "SI": ["sl"], "SB": ["en"], "SO": ["so", "ar"], "ZA": ["af", "en", "nr", "st", "ss", "tn", "ts", "ve", "xh", "zu"], "GS": ["en"], "KR": ["ko"], "SS": ["en"], "ES": ["es", "eu", "ca", "gl", "oc"], "LK": ["si", "ta"], "SD": ["ar", "en"], "SR": ["nl"], "SJ": ["no"], "SZ": ["en", "ss"], "SE": ["sv"], "CH": ["de", "fr", "it"], "SY": ["ar"], "TW": ["zh"], "TJ": ["tg", "ru"], "TZ": ["sw", "en"], "TH": ["th"], "TL": ["pt"], "TG": ["fr"], "TK": ["en"], "TO": ["en", "to"], "TT": ["en"], "TN": ["ar"], "TR": ["tr"], "TM": ["tk", "ru"], "TC": ["en"], "TV": ["en"], "UG": ["en", "sw"], "UA": ["uk"], "AE": ["ar"], "GB": ["en"], "US": ["en"], "UM": ["en"], "VI": ["en"], "UY": ["es"], "UZ": ["uz", "ru"], "VU": ["bi", "en", "fr"], "VE": ["es"], "VN": ["vi"], "WF": ["fr"], "EH": ["es"], "YE": ["ar"], "ZM": ["en"], "ZW": ["en", "sn", "nd"] };
                return LocaleHelper;
            })();
            Common.LocaleHelper = LocaleHelper;
        })(Common = APP.Common || (APP.Common = {}));
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));
// https://docs.google.com/spreadsheets/d/1FAzx2hInaTFNugjinWACNul568e84pu0tHb8QsE6tdk/edit?usp=sharing
// http://www.convertcsv.com/csv-to-json.htm
var BD;
(function (BD) {
    var APP;
    (function (APP) {
        var Locale;
        (function (Locale) {
            Locale.sliderStrings = [
                {
                    "key": "deals_header",
                    "en": "Best Deals",
                    "fr": "Super offres",
                    "de": "Top-Schnäppchen",
                    "it": "Offerte speciali",
                    "es": "Grandes ofertas",
                    "ru": "супер предложения",
                    "pt": "Ofertas Incríveis",
                    "pl": "Gorące oferty",
                    "ja": "お買い得",
                    "nl": "Populaire deals",
                    "sv": "Heta erbjudanden",
                    "da": "Fantastiske tilbud",
                    "he": "דילים חמים",
                    "ar": "عروض رائعة"
                },
                {
                    "key": "coupons_header",
                    "en": "Best Coupons",
                    "fr": "Meilleurs coupons",
                    "de": "Beste Gutscheine",
                    "it": "Coupon migliori",
                    "es": "Mejores cupones",
                    "ru": "Лучшие купоны",
                    "pt": "Melhores Cupons",
                    "pl": "Najlepsze kupony",
                    "ja": "最得クーポン",
                    "nl": "Beste coupons",
                    "sv": "Bästa kuponger",
                    "da": "Bedste kuponer",
                    "he": "קופונים",
                    "ar": "أفضل الكوبونات"
                },
                {
                    "key": "coupons_tab",
                    "en": "Coupons",
                    "fr": "Coupons",
                    "de": "Gutscheine",
                    "it": "Coupon",
                    "es": "Cupones",
                    "ru": "купоны",
                    "pt": "Cupons",
                    "pl": "Kupony",
                    "ja": "クーポン",
                    "nl": "Coupons",
                    "sv": "Kuponger",
                    "da": "Kuponer",
                    "he": "קופונים",
                    "ar": "الكوبونات"
                },
                {
                    "key": "deals_tab",
                    "en": "Deals",
                    "fr": "Offres",
                    "de": "Angebote",
                    "it": "Offerte",
                    "es": "Ofertas",
                    "ru": "сделка",
                    "pt": "Ofertas",
                    "pl": "Oferty",
                    "ja": "割引",
                    "nl": "Deals",
                    "sv": "erbjudanden",
                    "da": "Tilbud",
                    "he": "דילים",
                    "ar": "العروض"
                },
                {
                    "key": "deals_header2",
                    "en": "Best Deal",
                    "fr": "Meilleur offre",
                    "de": "Beste",
                    "it": "Offerta migliore",
                    "es": "Mejor oferta",
                    "ru": "лучший",
                    "pt": "Melhor oferta",
                    "pl": "Najlepsze oferty",
                    "ja": "最大割引",
                    "nl": "Beste deal",
                    "sv": "Bästa erbjudanden",
                    "da": "Bedste tilbud",
                    "he": "דיל טוב",
                    "ar": "أفضل صفقة"
                },
                {
                    "key": "free_shipping",
                    "en": "Free Shipping",
                    "fr": "Port gratuit",
                    "de": "Gratisversand",
                    "it": "Spedizione gratuita",
                    "es": "Envío gratis",
                    "ru": "Бесплатная доставка",
                    "pt": "Frete grátis",
                    "pl": "Darmowa dostawa",
                    "ja": "送料無料",
                    "nl": "Gratis verzending",
                    "sv": "Gratis frakt",
                    "da": "Gratis forsendelse",
                    "he": "משלוח חינם",
                    "ar": "شحن مجاني"
                },
                {
                    "key": "click_here",
                    "en": "Click Here",
                    "fr": "Cliquez ici",
                    "de": "Hier klicken",
                    "it": "Clicca qui",
                    "es": "Haz clic aquí",
                    "ru": "Нажать сюда",
                    "pt": "Clique aqui",
                    "pl": "Kliknij tutaj",
                    "ja": "ここをクリック",
                    "nl": "Klik hier",
                    "sv": "Klicka här",
                    "da": "Klike her",
                    "he": "לחץ כאן",
                    "ar": "انقر هنا"
                },
                {
                    "key": "get_code",
                    "en": "Get Code",
                    "fr": "Recevoir le code",
                    "de": "Code erhalten",
                    "it": "Ricevi codice",
                    "es": "Obtener código",
                    "ru": "Получить код",
                    "pt": "Obter código",
                    "pl": "Otrzymaj kod",
                    "ja": "コードを入手",
                    "nl": "Krijg code",
                    "sv": "Hämta kod",
                    "da": "Hent kode",
                    "he": "חשוף קוד",
                    "ar": "احصل على كود"
                },
                {
                    "key": "see_more",
                    "en": "See more",
                    "fr": "Voir plus",
                    "de": "Mehr erfahren",
                    "it": "Vedi altro",
                    "es": "Ver más",
                    "ru": "См. подробнее",
                    "pt": "Ver mais",
                    "pl": "Zobacz więcej",
                    "ja": "もっと見る",
                    "nl": "Meer info",
                    "sv": "Visa mer",
                    "da": "Se mere",
                    "he": "ראה עוד",
                    "ar": "رؤية المزيد"
                },
                {
                    "key": "more_deals",
                    "en": "Get more deals",
                    "fr": "Recevoir plus d'offres",
                    "de": "Mehr Schnäppchen erhalten",
                    "it": "Ricevi altre offerte",
                    "es": "Obtener más ofertas",
                    "ru": "Получить больше акций",
                    "pt": "Receba mais ofertas",
                    "pl": "Otrzymaj więcej ofert",
                    "ja": "他の割引を利用",
                    "nl": "Krijg meer deals",
                    "sv": "Hämta fler erbjudanden",
                    "da": "Få flere tilbud",
                    "he": "ראה עוד",
                    "ar": "احصل على مزيد من الصفقات"
                },
                {
                    "key": "more_deals2",
                    "en": "See more deals",
                    "fr": "Recevoir plus d'offres",
                    "de": "Mehr Schnäppchen erhalten",
                    "it": "Ricevi altre offerte",
                    "es": "Obtener más ofertas",
                    "ru": "Получить больше акций",
                    "pt": "Receba mais ofertas",
                    "pl": "Otrzymaj więcej ofert",
                    "ja": "他の割引を利用",
                    "nl": "Krijg meer deals",
                    "sv": "Hämta fler erbjudanden",
                    "da": "Få flere tilbud",
                    "he": "ראה עוד",
                    "ar": "احصل على مزيد من الصفقات"
                },
                {
                    "key": "compare",
                    "en": "compare"
                },
                {
                    "key": "buy",
                    "en": "Buy Now",
                    "fr": "Acheter maintenant",
                    "de": "Jetzt kaufen",
                    "it": "Compra ora",
                    "es": "Comprar ahora",
                    "ru": "Купить сейчас",
                    "pt": "Compre já",
                    "pl": "Kup teraz",
                    "ja": "今すぐ購入",
                    "nl": "Koop nu",
                    "sv": "Köp nu",
                    "da": "Køb nu",
                    "he": "קנה עכשיו",
                    "ar": "الشراء الآن"
                },
                {
                    "key": "attribution1",
                    "en": "Powered by",
                    "fr": "Optimisé par",
                    "de": "Unterstützt von",
                    "it": "Powered by",
                    "es": "Tecnología de",
                    "ru": "На платформе от",
                    "pt": "Desenvolvido por",
                    "pl": "Wspierane przez",
                    "ja": "協力：",
                    "nl": "Geleverd door",
                    "sv": "Drivs av",
                    "da": "Drevet af",
                    "he": "powered by",
                    "ar": "بدعم من"
                },
                {
                    "key": "attribution2",
                    "en": "Brought by",
                    "fr": "Fourni par",
                    "de": "Präsentiert von",
                    "it": "Offerto da",
                    "es": "Ofrecido por",
                    "ru": "Представлено",
                    "pt": "Trazido por",
                    "pl": "Przedstawia",
                    "ja": "提供：",
                    "nl": "Gebracht door",
                    "sv": "Levererat av",
                    "da": "Udviklet af",
                    "he": "Brought by",
                    "ar": "جلبت من قبل"
                },
                {
                    "key": "click_to_use",
                    "en": "Get Coupon",
                    "fr": "Recevoir le coupon",
                    "de": "Gutschein erhalten",
                    "it": "Ottieni coupon",
                    "es": "Obtener cupón",
                    "ru": "Получить купон",
                    "pt": "Obter cupom",
                    "pl": "Otrzymaj kupon",
                    "ja": "クーポンを入手",
                    "nl": "Krijg coupon",
                    "sv": "Hämta kupong",
                    "da": "Hent kupon",
                    "he": "קח קופון",
                    "ar": "احصل على كوبون"
                },
                {
                    "key": "black_friday_deals",
                    "en": "Black friday <b>deals</b>",
                    "fr": "Spécial",
                    "de": "Heiße Angebote",
                    "it": "Speciale",
                    "es": "Ofertas calientes",
                    "ru": "супер предложения",
                    "pt": "Ofertas quentes",
                    "pl": "Gorące oferty",
                    "ja": "特価セール",
                    "nl": "",
                    "sv": "",
                    "da": "",
                    "he": "",
                    "ar": ""
                },
                {
                    "key": "copy_paste",
                    "en": "Copy/Paste code to use at Checkout",
                    "fr": "Copier/Coller le code à utiliser lors du paiement",
                    "de": "Code kopieren und bei Abschluss der Bestellung einfügen",
                    "it": "Copia/incolla codice da usare alla cassa",
                    "es": "Copiar/pegar código y usar al pagar",
                    "ru": "Купить/вставить код для использования при расчете",
                    "pt": "Copie/Cole código e use no Checkout",
                    "pl": "Kopiuj/Wklej kod do wykorzystania przy kasie",
                    "ja": "コードをコピー・ペーストして精算時にご利用ください",
                    "nl": "Kopieer/plak code bij het afrekenen",
                    "sv": "Kopiera/klistra in kod att använda i kassan",
                    "da": "Kopier/sæt ind koden, der skal bruges ved betaling",
                    "he": "העתק והדבק קופון על מנת להשתמש",
                    "ar": "نسخ / لصق الكود للسداد"
                },
                {
                    "key": "click_coupon",
                    "en": "Click to get the Coupon",
                    "fr": "Cliquer pour recevoir le coupon",
                    "de": "Klicken, um Gutschein zu erhalten",
                    "it": "Clicca per ricevere il coupon",
                    "es": "Haz clic para obtener cupón",
                    "ru": "Нажмите для получения купона",
                    "pt": "Clique para obter o cupom",
                    "pl": "Kliknij, by otrzymać kupon",
                    "ja": "クーポンはここをクリック",
                    "nl": "Klik om de coupon te krijgen",
                    "sv": "Klicka för att hämta kupong",
                    "da": "Klik for at hente kuponen",
                    "he": "לחץ לקבלת קופון",
                    "ar": "انقر للحصول على الكوبون"
                },
                {
                    "key": "more_deals_short",
                    "en": "Get more deals",
                    "fr": "Voir plus d'offres",
                    "de": "Mehr Angebote",
                    "it": "Trova offerte",
                    "es": "Ver más",
                    "ru": "См. подробнее",
                    "pt": "Veja mais ofertas",
                    "pl": "Zobacz więcej",
                    "ja": "もっと見る",
                    "nl": "Krijg meer deals",
                    "sv": "Hämta fler erbjudanden",
                    "da": "",
                    "he": "",
                    "ar": ""
                },
                {
                    "key": "cyber_monday_deals",
                    "en": "Cyber Monday <b>deals</b>",
                    "fr": "Spécial",
                    "de": "Heiße Angebote",
                    "it": "Speciale",
                    "es": "Ofertas calientes",
                    "ru": "супер предложения",
                    "pt": "Ofertas quentes",
                    "pl": "Gorące oferty",
                    "ja": "特価セール",
                    "nl": "",
                    "sv": "",
                    "da": "",
                    "he": "",
                    "ar": ""
                },
                {
                    "key": "mature_deals_header",
                    "en": "Sexy Deals",
                    "fr": "",
                    "de": "",
                    "it": "",
                    "es": "",
                    "ru": "",
                    "pt": "",
                    "pl": "",
                    "ja": "",
                    "nl": "",
                    "sv": "",
                    "da": "",
                    "he": "",
                    "ar": ""
                },
                {
                    "key": "visit_store",
                    "en": "Visit Store",
                    "fr": "Acheter maintenant",
                    "de": "Jetzt kaufen",
                    "it": "Compra ora",
                    "es": "Comprar ahora",
                    "ru": "Купить сейчас",
                    "pt": "Compre já",
                    "pl": "Kup teraz",
                    "ja": "今すぐ購入",
                    "nl": "Koop nu",
                    "sv": "Köp nu",
                    "da": "Køb nu",
                    "he": "קנה עכשיו",
                    "ar": "الشراء الآن"
                },
                {
                    "key": "more",
                    "en": "More",
                    "fr": "More",
                    "de": "More",
                    "it": "More",
                    "es": "More",
                    "ru": "More",
                    "pt": "More",
                    "pl": "More",
                    "ja": "More",
                    "nl": "More",
                    "sv": "More",
                    "da": "More",
                    "he": "עוד",
                    "ar": "More"
                }
            ];
        })(Locale = APP.Locale || (APP.Locale = {}));
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));
/// <reference path="EventsModel" />
/// <reference path="GenericBunnerModel" />
/// <reference path="../Data/Deal" />
/// <reference path="../Common/LocaleHelper" />
/// <reference path="../Locale/SliderStrings" />
/// <reference path="../Context/VisualContext.ts" />
var BD;
(function (BD) {
    var APP;
    (function (APP) {
        var Model;
        (function (Model) {
            var TicketsModel = (function (_super) {
                __extends(TicketsModel, _super);
                function TicketsModel(context, deals, ticketsContext, suspendIdentifier, onClose) {
                    var _this = this;
                    _super.call(this, context, suspendIdentifier, onClose);
                    this.hasDeals = BD.ko.computed(function () { return _this.bannersModel && _this.bannersModel.banners.length; });
                    this.dealScroll = BD.ko.computed(function () { return _this.bannersModel && _this.bannersModel.banners.length > 3; });
                    this.selectedTab = BD.ko.observable(0);
                    this.dealsDisplayed = false;
                    this.bannersModel = deals ? new Model.BannersModel(ticketsContext, deals) : new Model.BannersModel(null, []);
                    this.setPanelVisibilityAndBadges(this.bannersModel);
                    this.setMoreDealsTarget(this.bannersModel);
                    this.strings = APP.Common.LocaleHelper.getStringMapForCountry("US", APP.Locale.sliderStrings);
                }
                TicketsModel.prototype.setPanelVisibilityAndBadges = function (bannersModel) {
                    this.selectTab(0, false);
                };
                TicketsModel.prototype.setMoreDealsTarget = function (bannersModel) {
                    if (bannersModel.banners.length) {
                        this.moreDealsUrl = "http://bestdealwiz.com/productlist.html?q=" + bannersModel.banners[0].banner.keywords.split(" ").join("+");
                    }
                    else {
                        this.moreDealsUrl = "http://bestdealwiz.com/index.html";
                    }
                };
                TicketsModel.prototype.selectTab = function (tab, forceDisplay) {
                    if (forceDisplay === void 0) { forceDisplay = true; }
                    this.selectedTab(tab);
                    if (forceDisplay)
                        this.collapsed(false);
                    if (tab == 0 && !this.dealsDisplayed) {
                        this.dealsDisplayed = true;
                    }
                };
                return TicketsModel;
            })(Model.ProductModelBase);
            Model.TicketsModel = TicketsModel;
        })(Model = APP.Model || (APP.Model = {}));
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));
/// <reference path="../Products/IProductVisual" />
/// <reference path="../External/knockout" />
/// <reference path="../Common/Res.ts" />
/// <reference path="../Common/Collection.ts" />
/// <reference path="../Common/CollisionHelper.ts" />
/// <reference path="../Common/HtmlHelper.ts" />
/// <reference path="../Data/Deal.ts" />
/// <reference path="../DisplayHandlers/EllipsisHandler.ts" />
/// <reference path="../DisplayHandlers/ScrollHandler.ts" />
/// <reference path="../DisplayHandlers/SuspendBoxHandler.ts" />
/// <reference path="../Model/TicketsModel.ts" />.
var BD;
(function (BD) {
    var APP;
    (function (APP) {
        var Products;
        (function (Products) {
            var IFrameRightSlider = (function () {
                function IFrameRightSlider() {
                    this.element = null;
                }
                IFrameRightSlider.prototype.realEstate = function () {
                    return 1 /* RIGHT_PANEL */;
                };
                IFrameRightSlider.prototype.flag = function () {
                    return "rsif";
                };
                IFrameRightSlider.prototype.determineNeededItemCount = function (context) {
                    return 4;
                };
                IFrameRightSlider.prototype.declareResourcesPromise = function (context) {
                    return {
                        reset2_css: APP.Common.Res.injectCss(context.paths().staticContentRoot() + "/Partials/reset.css"),
                        panel_css: APP.Common.Res.injectCss(context.paths().staticContentRoot() + "/Partials/iframeRightSlider.css"),
                        html: APP.Common.Res.bring(context.paths().staticContentRoot() + "/Partials/panel.html"),
                        container: APP.Common.Res.bring(context.paths().staticContentRoot() + "/Partials/container.html")
                    };
                };
                IFrameRightSlider.prototype.getMainCssClass = function () {
                    return "fo-iframe-right-slider";
                };
                IFrameRightSlider.prototype.getParentElement = function () {
                    return document.documentElement.getElementsByTagName("body")[0];
                };
                IFrameRightSlider.prototype.draw = function (product, result, resources) {
                    var _this = this;
                    var dealsResult = result;
                    var deals = dealsResult ? dealsResult.data : null;
                    var dealsContext = dealsResult ? dealsResult.context : null;
                    var iframeString = resources["container"];
                    var iframeElement = BD.$(iframeString);
                    iframeElement.addClass("fo-right-container-frame");
                    var iframe = iframeElement[0];
                    APP.Common.CollisionHelper.treatForCollisions(iframeElement);
                    APP.Common.HtmlHelper.appendToBody(iframeElement);
                    return APP.Common.wait(100).then(function () {
                        var css1 = BD.$('<link rel="stylesheet" href="' + dealsContext.paths().staticContentRoot() + '/Partials/iframeRightSlider.css">');
                        BD.$(iframe.contentDocument.head).append(css1);
                        var htmlString = resources["html"];
                        var rootClass = _this.getMainCssClass();
                        var syncToPage = false;
                        var scrollArrows = true;
                        var autoScroll = 0;
                        var scrollIndependent = false;
                        var peekaboo = false;
                        var displayHandlers = [
                            new APP.DisplayHandlers.EllipsisHandler(),
                            new APP.DisplayHandlers.SuspendBoxHandler(),
                            new APP.DisplayHandlers.ScrollHandler(syncToPage, scrollArrows, autoScroll, scrollIndependent, peekaboo),
                            {
                                afterRender: function (jqElement) {
                                    window.setTimeout(function () { return iframeElement.height(jqElement.outerHeight() + 5); }, 10);
                                },
                                remove: function () {
                                    iframeElement.remove();
                                }
                            }
                        ];
                        var onClose = function () { return APP.Common.Collection.of(displayHandlers).each(function (ds) { return ds.remove && ds.remove(); }); };
                        var suspendIdentifier = Products.VisualRealEstate[_this.realEstate()];
                        var model = new APP.Model.TicketsModel(dealsContext, deals, dealsContext, suspendIdentifier, onClose);
                        // Visual composition and injection
                        var jqElement = BD.$(htmlString).addClass(rootClass);
                        APP.Common.CollisionHelper.treatForCollisions(jqElement);
                        model.selectedTab.subscribe(function () {
                            APP.Common.wait(100).then(function () {
                                iframeElement.height(jqElement.outerHeight() + 5);
                            });
                        });
                        var element = jqElement[0];
                        iframe.contentDocument.body.appendChild(element);
                        // Set display handlers
                        model.postRenderHandler = function () { return APP.Common.Collection.of(displayHandlers).each(function (ds) { return ds.afterRender(jqElement, element); }); };
                        try {
                            // Model binding
                            BD.ko.applyBindings(model, element);
                            BD.ko.applyBindings(model, iframe);
                        }
                        catch (e) {
                            APP.Common.Collection.of(displayHandlers).each(function (ds) { return ds.remove && ds.remove(); });
                            jqElement.remove();
                            throw e;
                        }
                        window.setInterval(function () {
                            try {
                                iframeElement.height(jqElement.outerHeight() + 5);
                            }
                            catch (ex) {
                            }
                        }, 100);
                        _this.element = element;
                        return element;
                    });
                };
                IFrameRightSlider.prototype.remove = function (context) {
                    BD.$(this.element).remove();
                };
                return IFrameRightSlider;
            })();
            Products.IFrameRightSlider = IFrameRightSlider;
        })(Products = APP.Products || (APP.Products = {}));
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));
/// <reference path="Promise.ts"/>
/// <reference path="IUserStore" />
/// <reference path="CommonHelper" />
/// <reference path="../External/JSON3" />
/// <reference path="IAsyncStore" />
var BD;
(function (BD) {
    var APP;
    (function (APP) {
        var Common;
        (function (Common) {
            var LooseUserSettings = (function () {
                function LooseUserSettings(asyncStore, data) {
                    this.asyncStore = asyncStore;
                    this.data = data;
                }
                LooseUserSettings.prototype.uuid = function () {
                    return this.data["uuid"];
                };
                LooseUserSettings.prototype.retrive = function (key) {
                    return this.data[key];
                };
                LooseUserSettings.prototype.store = function (key, value) {
                    this.data[key] = value;
                    this.commitChanges();
                };
                LooseUserSettings.prototype.remove = function (key) {
                    delete this.data[key];
                    this.commitChanges();
                };
                LooseUserSettings.prototype.retriveAndRemove = function (key) {
                    var value = this.data[key];
                    delete this.data[key];
                    this.commitChanges();
                    return value;
                };
                LooseUserSettings.prototype.reload = function () {
                    var _this = this;
                    return this.asyncStore.retrieve(LooseUserSettings.USER_SETTINGS_KEY).alwaysThen(function (data, err) {
                        if (err) {
                            if (err)
                                APP.Logger.warn("Failed reloading userSetting.");
                        }
                        else {
                            _this.data = data;
                        }
                    });
                };
                LooseUserSettings.prototype.commitChanges = function () {
                    this.asyncStore.store(LooseUserSettings.USER_SETTINGS_KEY, this.data);
                    // Save to local storage for fallback
                    localStorage.setItem(LooseUserSettings.USER_SETTINGS_KEY, JSON3.stringify(this.data));
                };
                LooseUserSettings.fromAsyncStorePromise = function (asyncStore, defaultUUID) {
                    var defautValue = { uuid: defaultUUID, suspend: {} };
                    return asyncStore.retrieveOrSet(LooseUserSettings.USER_SETTINGS_KEY, defautValue).alwaysThen(function (data, err) {
                        var settings = null;
                        if (err) {
                            APP.Logger.warn("Failed getting real userSetting using default: " + (err && err.message));
                            // Try and get from local storage
                            var rawLocal = localStorage.getItem(LooseUserSettings.USER_SETTINGS_KEY);
                            var local = null;
                            try {
                                local = JSON3.parse(rawLocal);
                            }
                            catch (e) {
                            }
                            // Sanity check - we expect at least a uuid property
                            if (local && local["uuid"]) {
                                APP.Logger.warn("Using localStorage info in place of iframe settings:");
                                APP.Logger.info(rawLocal);
                                settings = local;
                            }
                            else {
                                APP.Logger.info("localStorage info missing or misshaped will use default values for user settings");
                                settings = defautValue;
                            }
                        }
                        else {
                            APP.Logger.info("Using true iframe data for user settings");
                            settings = data;
                            // Save to local storage for fallback
                            localStorage.setItem(LooseUserSettings.USER_SETTINGS_KEY, JSON3.stringify(data));
                        }
                        return new LooseUserSettings(asyncStore, settings);
                    }).fail(function (e) {
                        APP.Logger.error("Failed loading async store for userSettings: " + e.message);
                    });
                    //return asyncStore.retrieveOrSet(UserSettings.USER_SETTINGS_KEY, defautValue).then((data) => {
                    //    return new UserSettings(asyncStore, data);
                    //}).fail((e) => {
                    //    Logger.error("Failed loading async store for userSettings: " + e.message);
                    //});
                };
                LooseUserSettings.USER_SETTINGS_KEY = "userSettings";
                return LooseUserSettings;
            })();
            Common.LooseUserSettings = LooseUserSettings;
        })(Common = APP.Common || (APP.Common = {}));
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));
/// <reference path="Common/CommonHelper" />
/// <reference path="Common/Promise" />
/// <reference path="Common/AsyncHelper" />
/// <reference path="Common/Res" />
/// <reference path="Common/IFrameStore" />
/// <reference path="Common/RealEstateHelper.ts" />
/// <reference path="Common/KoBindings" />
/// <reference path="Common/ExternalResources" />
/// <reference path="Common/DataSynchronizer.ts" />
/// <reference path="Common/DefaultSuspender.ts" />
/// <reference path="Products/Product.ts" />
/// <reference path="Products/TicketsLogic.ts" />
/// <reference path="Products/IFrameRightSlider.ts" />
/// <reference path="External/JSON3.d.ts" />
/// <reference path="AppParams.ts" />
/// <reference path="Context/AppContext.ts" />
/// <reference path="Context/Paths.ts" />
/// <reference path="Common/LooseUserSettings.ts" />
/// <reference path="Logger/Logger.ts" />
var BD;
(function (BD) {
    var APP;
    (function (APP) {
        var BestDealApp = (function () {
            function BestDealApp() {
            }
            BestDealApp.prototype.init = function (params, domain) {
                var _this = this;
                var paths = new APP.Context.Paths(domain);
                var context = new APP.Context.AppContext(paths, params);
                var externalRoot = context.paths().outerResourcesRoot() + "/";
                var json3Promise = APP.Common.Res.injectScript(externalRoot + 'json3.js').then(function () { return window['JSON3'] = JSON3.noConflict(); });
                var knockoutPromise = APP.Common.Res.injectScript(externalRoot + 'knockout-3.2.0.js').then(function () {
                    APP.Common.KoBindings.registerCustomBindings();
                });
                var jqueryAndPluginsPromise = APP.Common.ExternalResources.getJQuery(externalRoot).then(function () {
                    return APP.Common.when(APP.Common.Res.injectScript(externalRoot + 'jquery.xdr.js'), APP.Common.Res.injectScript(externalRoot + 'jquery.dotdotdot.js'));
                });
                var libraryPromises = [json3Promise, knockoutPromise, jqueryAndPluginsPromise];
                APP.Common.typedWhen(libraryPromises).done(function () { return _this.loadApplicationSettings(context); }).fail(function (err) { return APP.Logger.error("Shared: Library load failed: " + err.message); });
            };
            BestDealApp.prototype.loadApplicationSettings = function (appCotext) {
                var _this = this;
                APP.Logger.log("Libraries loaded. Loading application context");
                var iframeStore = new APP.Common.IFrameStore(appCotext.paths(), true);
                var freshGeneratedUUID = APP.Common.generateUUID();
                var userSettingsPromise = APP.Common.LooseUserSettings.fromAsyncStorePromise(iframeStore, freshGeneratedUUID);
                var suspenderPromise = userSettingsPromise.then(function (userSettings) { return new APP.Common.DefaultSuspender(userSettings); });
                var contextPromise = APP.Context.DomainContext.initializePromise(appCotext, userSettingsPromise, suspenderPromise, iframeStore, null);
                var contextAndProductPromises = {};
                contextAndProductPromises["CTX"] = contextPromise;
                APP.Common.namedWhen2(contextAndProductPromises).done(function (res) {
                    _this.continueWithContextAndProducts(res, freshGeneratedUUID);
                }).fail(function (err) {
                    APP.Logger.error("Shared: preload failed: " + err.message);
                    //SharedApp.injectAlt(bootstrapContext, "fail-init");
                });
            };
            BestDealApp.prototype.continueWithContextAndProducts = function (resources, freshGeneratedUUID) {
                APP.Logger.log("Continuing with Context and Products");
                var context = resources["CTX"];
                var now = new Date();
                var dailyTimestamp = now.getFullYear() + '' + now.getMonth() + '' + now.getDate();
                var userType = (context.userSettings().uuid() == freshGeneratedUUID) ? "generated" : "active";
                //Logger.Analytics.notify(context, Logger.Analytics.USER, {
                //    t: dailyTimestamp, usertype: userType, hid: context.userSettings().uuid(),
                //    partid: context.params().partnerCode, subid: context.params().subId
                // }, 1.0, false);
                var products = new APP.Products.Product("tickets", new APP.Products.TicketsLogic(), new APP.Products.IFrameRightSlider());
                this.loadProduct(context, products);
            };
            BestDealApp.prototype.loadProduct = function (context, product) {
                var _this = this;
                APP.Logger.info("initializing Product");
                var realestateSuspendId = APP.Products.VisualRealEstate[product.visual.realEstate()];
                var isSuspended = context.suspender().isSuspended(realestateSuspendId);
                var visualContext = new APP.Context.VisualContext(context, product.name, product.visual);
                if (isSuspended) {
                    APP.Logger.info("Realestate " + realestateSuspendId + " Is suspended. Product " + product.name + " will not be displayed");
                    // todo: a visual context??
                    // Logger.Analytics.notify(visualContext, Logger.Analytics.NO_SHOW, {'reason': 'suspended'}, 0);
                    return;
                }
                var sync = new APP.Common.DataSynchronizer();
                var dataPromise = this.obtainProductData(context, product, sync).fail(function (err) {
                    APP.Logger.error("Failed retrieving data for product " + product.name + ": " + err.message);
                });
                var visualResourcesPromise = APP.Common.namedWhen2(product.visual.declareResourcesPromise(visualContext)).fail(function (err) {
                    APP.Logger.error("Failed retrieving visual resources for product " + product.name + ": " + err.message);
                });
                return APP.Common.namedWhen2({ 'data': dataPromise, 'visres': visualResourcesPromise }).then(function (results) {
                    return _this.displayProduct(visualContext, product, results['data'], results['visres']);
                }).done(function () {
                    APP.Logger.log("Product " + product.name + " displayed");
                });
            };
            BestDealApp.prototype.obtainProductData = function (appContext, product, sync) {
                var logic = product.logic;
                var context = new APP.Context.LVContext(appContext, product.name, logic, product.visual);
                var neededItemCount = product.visual.determineNeededItemCount(context);
                return logic.scrapeAndObtainData(context, neededItemCount, sync).then(function (result) {
                    return result;
                });
            };
            BestDealApp.prototype.displayProduct = function (visualContext, product, data, visualResources) {
                var hasAnyResults = data.hasData();
                var drawPromise = null;
                if (!hasAnyResults) {
                    APP.Logger.log(product.name + " will halt. no results returned");
                    drawPromise = APP.Common.reject(new Error("zero_results"));
                }
                else {
                    APP.Logger.log("Initializing visual for product " + product.name);
                    try {
                        drawPromise = product.visual.draw(product, data, visualResources);
                    }
                    catch (e) {
                        APP.Logger.error("Failed drawing " + product.name + ": " + e.message);
                        drawPromise = APP.Common.reject(new Error("Draw Failue: " + (e && e.message)));
                    }
                }
                drawPromise.fail(function (err) {
                    APP.Logger.warn("Failed drawing " + visualContext.productName + ": " + err.message);
                    //  Logger.Analytics.notify(visualContext, Logger.Analytics.NO_SHOW, {'reason': err.message}, 0);
                    var realEstateString = APP.Products.VisualRealEstate[product.visual.realEstate()];
                    APP.Common.RealEstateHelper.releaseRealestate(realEstateString);
                });
                return drawPromise;
            };
            return BestDealApp;
        })();
        APP.BestDealApp = BestDealApp;
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));

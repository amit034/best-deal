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

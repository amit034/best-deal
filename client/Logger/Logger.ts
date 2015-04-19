/// <reference path="../Context/Paths"/>
/// <reference path="../Context/IBaseContext"/>
/// <reference path="Analytics"/>
/// <reference path="../Common/Stacktrace" />

// todo: refactor logging
module BD.APP.Logger {

    export enum LogLevel {
        //OFF = Number.MAX_VALUE,
        FATAL = 50000,
        ERROR = 40000,
        WARN = 30000,
        INFO = 20000,
        LOG = 15000,
        DEBUG = 10000,
        TRACE = 5000,
        //ALL = Number.MIN_VALUE
    }

    var levelToConsoleFunc = {
        10000: (msg) => console.debug(msg),
        15000: (msg) => console.log(msg),
        20000: (msg) => console.info(msg),
        30000: (msg) => console.warn(msg),
        40000: (msg) => console.error(msg)
    };


    export interface ILogEvent {
        time:number;
        level:LogLevel;
        msg: any;
        source?:string;
    }

    export var logToConsole:boolean;
    export var logstack:ILogEvent[];
    export var callHomeLevel:LogLevel = LogLevel.ERROR;

    export var logContext:Context.IBaseContext;

    export function intialize(context:Context.IBaseContext) {
        logContext = context;
        logToConsole = context.isDebugMode();

        if (window['BD_NATIVE_DEBUG']) {
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

    export function time(title:string) {
        if (logToConsole && console.time) console.time(title);
        log("TIMER_START: " + title);
    }

    export function timeEnd(title:string):number {
        if (logToConsole && console.timeEnd) console.timeEnd(title);

        if (logstack) {
            for (var i = 0; i < logstack.length; i++) {
                var event = logstack[i];
                if (event.msg == "TIMER_START: " + title) {
                    var elapsed = Date.now() - event.time;
                    log("TIMER END: " + title + "(" + elapsed + "ms elapsed)");
                    return elapsed;
                }
            }
        }
    }


    export function log(msg: string) {
        logEvent(LogLevel.LOG, msg);
    }

    export function info(msg: string) {
        logEvent(LogLevel.INFO, msg);
    }

    export function warn(msg: string) {
        logEvent(LogLevel.WARN, msg);
    }

    export function error(msg: string) {
        logEvent(LogLevel.ERROR, msg);
    }


    function logEvent(level:LogLevel, msg:string) {

        try {
            var caller = getCaller();

            if (logToConsole) {
                var logFunc:(msg:string) => void = levelToConsoleFunc[level];
                if (!logFunc) logFunc = (msg) => console.log(msg);
                var msgEx = "BD - " + (caller ?  msg + " @ " + caller : msg);
                logFunc(msgEx);


            }

            if (level >= LogLevel.ERROR) {
                Logger.Analytics.notifyClient(logContext,Logger.Analytics.EXCEPTION, { 'reason': 'exception', 'sreason': msg }, 0);
            }

            if (!logstack) logstack = [];

            var event = {
                time: Date.now(),
                level: level,
                msg: msg,
                source: caller
            };

            logstack.push(event);

            if (event.level >= callHomeLevel) {
                callHome(logstack);
            }
        }
        catch (e) {}
    }

    function getCaller() {

        try {
            var st = Common.printStackTrace();
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

    function callHome(events:ILogEvent[]) {
        try {
            var errorsString = "";
            for (var i = 0; i < events.length; i++) {
                var event = events[i];
                if (event.level >= LogLevel.WARN && typeof event.msg == 'string') {
                    if (errorsString.length > 0) errorsString += " --- ";
                    errorsString += LogLevel[event.level] + " " + event.msg;
                }
            }

            // If so many errors the query string will be too long - just send the last part (latest errors)
            if (errorsString.length > 1024)
                errorsString = errorsString.substr(errorsString.length - 1024);

            var params:{[index:string]: string} = {
                'ex': errorsString
            };

            // Only notify once every 1000 times to spare elastic search
              Analytics.notify(logContext, Analytics.EXCEPTION, params, 0);
        }
        catch (e) { }
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

    export function flushToConsole() {
        printEvents(logstack);
    }

    function printEvents(events:ILogEvent[]) {

        if (events) {
            for (var i = 0; i < events.length; i++) {
                var event:ILogEvent = events[i];

                if (event.level == LogLevel.DEBUG) console.debug(event.msg);
                if (event.level == LogLevel.LOG) console.log(event.msg);
                if (event.level == LogLevel.INFO) console.info(event.msg);
                if (event.level == LogLevel.WARN) console.warn(event.msg);
                if (event.level == LogLevel.ERROR) console.error(event.msg);
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


    export function expect(title:string, condition:(event:ILogEvent, events:ILogEvent[]) => boolean, withinMS:number) {
        window.setTimeout(() => {
            for (var i = 0; i < logstack.length; i++) {
                var event = logstack[i];
                var passed = condition(event, logstack);
                if (passed) {
                    // todo: remove this
                    //console.log("Expect passed " + title)
                    return;
                }
            }

            error("Failure on EXPECT " + title);
        }, withinMS);
    }
}
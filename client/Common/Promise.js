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

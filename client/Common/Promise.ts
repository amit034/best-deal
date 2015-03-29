/// <reference path="../Logger/Logger.ts" />
/// <reference path="AsyncHelper.ts" />
/**
	Module P: Generic Promises for TypeScript

	Project, documentation, and license: https://github.com/pragmatrix/Promise
*/

module BD.APP.Common {

    /**
     Returns a new "Deferred" value that may be resolved or rejected.
     */

    export function defer<Value>(): Deferred<Value>
    {
        return new DeferredI<Value>();
    }

    /**
     Converts a value to a resolved promise.
     */

    export function resolve<Value>(v: Value): Promise<Value>
    {
        return defer<Value>().resolve(v).promise();
    }

    /**
     Returns a rejected promise.
     */

    export function reject<Value>(err: Rejection): Promise<Value>
    {
        return defer<Value>().reject(err).promise();
    }

    /**
     http://en.wikipedia.org/wiki/Anamorphism

     Given a seed value, unfold calls the unspool function, waits for the returned promise to be resolved, and then
     calls it again if a next seed value was returned.

     All the values of all promise results are collected into the resulting promise which is resolved as soon
     the last generated element value is resolved.
     */

    export function unfold<Seed, Element>(
        unspool: (current: Seed) => { promise: Promise<Element>; next?: Seed },
        seed: Seed)
        : Promise<Element[]>
    {
        var d = defer<Element[]>();
        var elements: Element[] = new Array<Element>();

        unfoldCore<Seed, Element>(elements, d, unspool, seed)

        return d.promise();
    }

    function unfoldCore<Seed, Element>(
        elements: Element[],
        deferred: Deferred<Element[]>,
        unspool: (current: Seed) => { promise: Promise<Element>; next?: Seed },
        seed: Seed): void
    {
        var result = unspool(seed);
        if (!result) {
            deferred.resolve(elements);
            return;
        }

        // fastpath: don't waste stack space if promise resolves immediately.

        while (result.next && result.promise.getStatus() == Status.Resolved)
        {
            elements.push(result.promise.getResult());
            result = unspool(result.next);
            if (!result) {
                deferred.resolve(elements);
                return;
            }
        }

        result.promise
            .done(v =>
            {
                elements.push(v);
                if (!result.next)
                    deferred.resolve(elements);
                else
                    unfoldCore<Seed, Element>(elements, deferred, unspool, result.next);
            } )
            .fail(e =>
            {
                deferred.reject(e);
            } );
    }

    /**
     The status of a Promise. Initially a Promise is Unfulfilled and may
     change to Rejected or Resolved.

     Once a promise is either Rejected or Resolved, it can not change its
     status anymore.
     */

    export enum Status {
        Unfulfilled,
        Rejected,
        Resolved
    }

    /**
     If a promise gets rejected, at least a message that indicates the error or
     reason for the rejection must be provided.
     */

    export interface Rejection
    {
        message: string;
    }

    /**
     Both Promise<T> and Deferred<T> share these properties.
     */

    export interface PromiseState<Value>
    {
        /// The current status of the promise.
        getStatus(): Status;

        /// If the promise got resolved, the result of the promise.
        getResult(): Value;

        /// If the promise got rejected, the rejection message.
        getError(): Rejection;
    }

    /**
     A Promise<Value> supports basic composition and registration of handlers that are called when the
     promise is fulfilled.

     When multiple handlers are registered with done(), fail(), or always(), they are called in the
     same order.
     */

    export interface Promise<Value> extends PromiseState<Value>
    {
        /**
         Returns a promise that represents a promise chain that consists of this
         promise and the promise that is returned by the function provided.
         The function receives the value of this promise as soon it is resolved.

         If this promise fails, the function is never called and the returned promise
         will also fail.
         */
        then<T2>(f: (v: Value) => Promise<T2>): Promise<T2>;
        then<T2>(f: (v: Value) => T2): Promise<T2>;




        // GUY ADDITION
        alwaysThen<T2>(f: (v?: Value, err?: Rejection) => T2 ): Promise<T2>;
        alwaysThen<T2>(f: (v?: Value, err?: Rejection) => Promise<T2> ): Promise<T2>;

        logPassthrough(logPrefix:string): Promise<Value>;

        /// Add a handler that is called when the promise gets resolved.
        done(f: (v: Value) => void ): Promise<Value>;
        /// Add a handler that is called when the promise gets rejected.
        fail(f: (err: Rejection) => void ): Promise<Value>;
        /// Add a handler that is called when the promise gets fulfilled (either resolved or rejected).
        always(f: (v?: Value, err?: Rejection) => void ): Promise<Value>;
    }

    /**
     Deferred<Value> supports the explicit resolving and rejecting of the
     promise and the registration of fulfillment handlers.

     A Deferred<Value> should be only visible to the function that initially sets up
     an asynchronous process. Callers of that function should only see the Promise<Value> that
     is returned by promise().
     */

    export interface Deferred<Value> extends PromiseState<Value>
    {
        /// Returns the encapsulated promise of this deferred instance.
        /// The returned promise supports composition but removes the ability to resolve or reject
        /// the promise.
        promise(): Promise<Value>;

        /// Resolve the promise.
        resolve(result: Value): Deferred<Value>;
        /// Reject the promise.
        reject(err: Rejection): Deferred<Value>;

        done(f: (v: Value) => void ): Deferred<Value>;
        fail(f: (err: Rejection) => void ): Deferred<Value>;
        always(f: (v?: Value, err?: Rejection) => void ): Deferred<Value>;
    }

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
    export function wait(interval:number):Promise<any> {
        return waitFor<any>(() => true, Number.MAX_VALUE, interval, false);
    }

    export function waitForEvent<T extends Event>(setEventFn:(handler:(ev:T) => void) => void, timeout = Number.MAX_VALUE):Promise<T> {

        var d = defer<T>();
        var done = false;

        window.setTimeout(() => {
            if (!done) {
                done = true;
                d.reject({message: "Timed out after " + timeout});
            }
        });

        setEventFn((ev:T) => {
            if (!done) {
                done = true;
                d.resolve(ev);
            }
        });

        return d.promise();
    }


    export function waitFor<T>(fn:() => T, timeout:number = 0, interval:number = 500, tryImmediately = true):Promise<T> {

        var d = defer<T>();
        var start = Date.now();

        var action = () => {
            var elapsed = Date.now() - start;
            if (elapsed >= timeout) {
                clearInterval(intervalId);
                d.reject(Error("Timed out after " + elapsed));
                //d.resolve(null);
            }
            else {
                var result:T = fn();

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
        if (tryImmediately) action();


        return d.promise();
    }

    export function when(...promises: Promise<any>[]): Promise<any[]>
    {
        var allDone = defer<any[]>();
        if (!promises.length) {
            allDone.resolve([]);
            return allDone.promise();
        }

        var resolved = 0;
        var results = [];

        for (var i = 0; i < promises.length; i++) {
            var p = promises[i];
            p
                .done(v => {
                    results.push(v);
                    ++resolved;
                    if (resolved === promises.length && allDone.getStatus() !== Status.Rejected)
                        allDone.resolve(results);
                } )
                .fail(e => {
                    if (allDone.getStatus() !== Status.Rejected)
                        allDone.reject(e);
                } );
        }

        return allDone.promise();
    }

    // GUY ADDITION
    export function typedWhen<R>(promises: Promise<R>[], continueOnFail:boolean = false): Promise<R[]>
    {
        var allDone = defer<R[]>();
        if (!promises.length) {
            allDone.resolve([]);
            return allDone.promise();
        }

        var resolved = 0;
        var results = [];

        for (var i = 0; i < promises.length; i++) {
            var p = promises[i];
            p
                .done(v => {
                    results.push(v);
                    ++resolved;
                    if (resolved === promises.length && allDone.getStatus() !== Status.Rejected)
                        allDone.resolve(results);
                } )
                .fail(e => {
                    if (continueOnFail) {
                        Logger.warn("Continuing after inner error: " + e.message);
                        ++resolved;
                    }
                    else if (allDone.getStatus() !== Status.Rejected) {
                        allDone.reject(e);
                    }
                } );
        }

        return allDone.promise();
    }

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

    export function namedWaterfall<R>(fns:INamedValue<(attempt:number) => Promise<R>>[], isValid:(result:R) => boolean = (result:R) => true):Promise<INamedValue<R>> {

        // Initialize the chain with an undetermined result
        var chain:Promise<INamedValue<R>> = resolve(null);

        for (var i = 0; i < fns.length; i++) {
            var wrappedFn = wrapFnForChain(fns[i], isValid, i + 1);
            chain = chain.alwaysThen<INamedValue<R>>(wrappedFn);
        }

        return chain;
    }

    function wrapFnForChain<R>(fn: INamedValue<(attempt:number) => Promise<R>>, isValid:(result:R) => boolean, attempt:number):(prevValue?:INamedValue<R>, rej?:Common.Rejection) => Promise<INamedValue<R>> {
        var wrapped = (attempt:number,  prevValue?:INamedValue<R>, rej?:Common.Rejection) => {

            if (!rej && prevValue != null && isValid(prevValue.value)) {
                return resolve(prevValue);
            }
            else {
                return fn.value(attempt).then((value) => {
                    return {name: fn.name, value: value};
                });
            }
        };

        return lambda3(wrapped, attempt);
    }

    export function lambda1<T1, R>(fn:(value:T1) => R, value:T1):() => R {
        return () => fn(value);
    }

    export function lambda2<T1, T2, R>(fn:(value:T1, value2:T2) => R, value:T1):(value2:T2) => R {
        return (value2:T2) => fn(value, value2);
    }

    export function lambda3<T1, T2, T3, R>(fn:(value:T1, value2:T2, value3:T3) => R, value:T1):(value2:T2, value3:T3) => R {
        return (value2:T2, value3:T3) => fn(value, value2, value3);
    }

    export function lambda4<T1, T2, T3, T4, R>(fn:(value:T1, value2:T2, value3:T3, value4:T4) => R, value:T1):(value2:T2, value3:T3, value4:T4) => R {
        return (value2:T2, value3:T3, value4:T4) => fn(value, value2, value3, value4);
    }

//    export function lambda4<T1, T2, T3, T4, R>(fn:(value:T1, value2:T2, value3:T3, value4:T4) => R, value:T1, value2:T2):(value3:T3, value4:T4) => R {
//        return (value3:T3, value4:T4) => fn(value, value2, value3, value4);
//    }



    export function retryPromise<T>(fn:() => Promise<T>, tryCount:number = 1):Promise<T> {

        var chain:Promise<T> = reject<T>({message:'initial state'});

        for (var i = 0; i < tryCount; i++) {
            chain = chain.alwaysThen<T>((value:T, err:Rejection) => err ? fn() : resolve(value));
        }

        return chain;
    }


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

    class PromiseI<Value> implements Promise<Value>
    {
        constructor(public deferred: DeferredI<Value>)
        { }

        getStatus(): Status { return this.deferred.getStatus(); }
        getResult(): Value { return this.deferred.getResult(); }
        getError(): Rejection { return this.deferred.getError(); }

        done(f: (v: Value) => void ): Promise<Value> {
            this.deferred.done(f);
            return this;
        }

        fail(f: (err: Rejection) => void ): Promise<Value> {
            this.deferred.fail(f);
            return this;
        }

        always(f: (v?: Value, err?: Rejection) => void ): Promise<Value> {
            this.deferred.always(f);
            return this;
        }

        // GUY ADDITION
        alwaysThen<T2>(f: (v?: Value, err?: Rejection) => any ): Promise<T2> {
            return this.deferred.alwaysThen<T2>(f);
        }

        then<T2>(f: (v: Value) => any): Promise<T2>
        {
            return this.deferred.then<any>(f);
        }

        logPassthrough(logPrefix:string):Promise<Value> {

            return <Promise<Value>>this.then((value:Value) => {

                if (typeof value == 'string' || value instanceof String) {
                    Logger.log(logPrefix + ": " + value);
                }
                else {
                    Logger.log(logPrefix + ": " + JSON.stringify(value));
                }

                return value;
            });
        }
    }

    /**
     Implementation of a deferred.
     */

    class DeferredI<Value> implements Deferred<Value>{

        private _resolved: (v: Value) => void = _ => { };
        private _rejected: (err: Rejection) => void = _ => { };

        private _status: Status = Status.Unfulfilled;
        private _result: Value;
        private _error: Rejection = { message: "" };
        private _promise: Promise<Value>;

        constructor() {
            this._promise = new PromiseI<Value>(this);
        }

        promise(): Promise<Value> {
            return this._promise;
        }

        getStatus(): Status {
            return this._status;
        }

        getResult(): Value {
            if (this._status != Status.Resolved)
                throw new Error("Promise: result not available");
            return this._result;
        }

        getError(): Rejection {
            if (this._status != Status.Rejected)
                throw new Error("Promise: rejection reason not available");
            return this._error;
        }


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

        thenOld<Result>(f: (v: Value) => any): Promise<Result>
        {
            var d = defer<Result>();

            this
                .done(v =>
                {
                    var promiseOrValue = f(v);

                    // todo: need to find another way to check if r is really of interface
                    // type Promise<any>, otherwise we would not support other
                    // implementations here.
                    //if (promiseOrValue instanceof PromiseI)
                    if (promiseOrValue && typeof promiseOrValue.done === "function" && promiseOrValue.deferred)
                    {
                        var p = <Promise<Result>> promiseOrValue;
                        p.done(v2 => d.resolve(v2))
                            .fail(err => d.reject(err));
                        return p;
                    }

                    d.resolve(promiseOrValue);
                } )
                .fail(err => d.reject(err));

            return d.promise();
        }

        then<Result>(f: (v: Value) => any): Promise<Result>
        {
            var d = defer<Result>();

            this
                .done(v =>
                {
                    // GUY ADDITION - the try catch reject wrapping
                    var promiseOrValue = null;
                    try {
                        promiseOrValue = f(v);
                    }
                    catch (e) {
                        Logger.warn("First level error: " + e.message + " @ " + f);
                        d.reject(e);
                        return;
                    }

                    // todo: need to find another way to check if r is really of interface
                    // type Promise<any>, otherwise we would not support other
                    // implementations here.
                    //if (promiseOrValue instanceof PromiseI) {
                    if (promiseOrValue && typeof promiseOrValue.done === "function" && promiseOrValue.deferred) {
                        var p = <Promise<Result>> promiseOrValue;
                        p.done(v2 => d.resolve(v2))
                            .fail(err => d.reject(err));
                        return p;
                    }

                    d.resolve(promiseOrValue);
                })
                .fail(err => d.reject(err));

            return d.promise();
        }

        alwaysThen<Result>(f: (v: Value, err?: Rejection) => any): Promise<Result>
        {
            var d = defer<Result>();

            var handler = (v?:Value, err?:Rejection) => {
                var promiseOrValue = null;
                try {
                    promiseOrValue = f(v, err);
                }
                catch (e) {
                    Logger.warn("First level error: " + e.message  + " @ " + f);
                    d.reject(e);
                    return;
                }

                // todo: need to find another way to check if r is really of interface
                // type Promise<any>, otherwise we would not support other
                // implementations here.
                //if (promiseOrValue instanceof PromiseI) {
                if (promiseOrValue && typeof promiseOrValue.done === "function" && promiseOrValue.deferred) {
                    var p = <Promise<Result>> promiseOrValue;
                    p.done(v2 => d.resolve(v2))
                        .fail(err => d.reject(err));
                    return p;
                }

                d.resolve(promiseOrValue);
            };

            this.done(v => handler(v, null))
                .fail(err => handler(null, err));

            return d.promise();
        }

        done(f: (v: Value) => void ): Deferred<Value>
        {
            if (this.getStatus() === Status.Resolved) {
                f(this._result);
                return this;
            }

            if (this.getStatus() !== Status.Unfulfilled)
                return this;

            var prev = this._resolved;
            this._resolved = v => { prev(v); f(v); }

            return this;
        }

        fail(f: (err: Rejection) => void ): Deferred<Value>
        {
            if (this.getStatus() === Status.Rejected) {
                f(this._error);
                return this;
            }

            if (this.getStatus() !== Status.Unfulfilled)
                return this;

            var prev = this._rejected;
            this._rejected = e => { prev(e); f(e); }

            return this;
        }

        always(f: (v?: Value, err?: Rejection) => void ): Deferred<Value>
        {
            this
                .done(v => f(v))
                .fail(err => f(null, err));

            return this;
        }

        resolve(result: Value) {
            if (this._status !== Status.Unfulfilled) {
                throw new Error("tried to resolve a fulfilled promise");
            }

            this._result = result;
            this._status = Status.Resolved;
            this._resolved(result);

            this.detach();
            return this;
        }

        reject(err: Rejection) {
            if (this._status !== Status.Unfulfilled) {
                throw new Error("tried to reject a fulfilled promise");
            }

            this._error = err;
            this._status = Status.Rejected;
            this._rejected(err);

            this.detach();
            return this;
        }

        private detach()
        {
            this._resolved = _ => { };
            this._rejected = _ => { };
        }
    }

    /**
     Promise Generators and Iterators.
     */

    export interface Generator<E>
    {
        (): Iterator<E>;
    }

    export interface Iterator<E>
    {
        advance(): Promise<boolean>;
        current: E;
    }

    export function generator<E>(g: () => () => Promise<E>): Generator<E>
    {
        return () => iterator<E>(g());
    };

    export function iterator<E>(f: () => Promise<E>): Iterator<E>
    {
        return new IteratorI<E>(f);
    }

    class IteratorI<E> implements Iterator<E>
    {
        current: E = undefined;

        constructor(private f: () => Promise<E>)
        { }

        advance() : Promise<boolean>
        {
            var res = this.f();
            return res.then(value =>
            {
                if (isUndefined(value))
                    return false;

                this.current = value;
                return true;
            } );
        }
    }

    /**
     Iterator functions.
     */

    export function each<E>(gen: Generator<E>, f: (e: E) => void ): Promise<{}>
    {
        var d = defer();
        eachCore(d, gen(), f);
        return d.promise();
    }

    function eachCore<E>(fin: Deferred<{}>, it: Iterator<E>, f: (e: E) => void ) : void
    {
        it.advance()
            .done(hasValue =>
            {
                if (!hasValue)
                {
                    fin.resolve({});
                    return;
                }

                f(it.current)
                eachCore<E>(fin, it, f);
            } )
            .fail(err => fin.reject(err));
    }

    /**
     std
     */

    export function isUndefined(v)
    {
        return typeof v === 'undefined';
    }
}
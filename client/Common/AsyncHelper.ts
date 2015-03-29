
/// <reference path="Collection.ts"/>
/// <reference path="../Logger/Logger.ts"/>
/// <reference path="../External/jquery.d.ts"/>
/// <reference path="Promise.ts"/>

module BD.APP.Common {

    export interface INamedValue<V> {
        name:string;
        value:V;
    }

    export function toNamed<T>(name:string, value:T):INamedValue<T> {
        return {name: name, value: value};
    }

    export function toNamedPromise<T>(name:string, promise:Promise<T>):Promise<INamedValue<T>> {
        return promise.then((value:T) => toNamed(name, value));
    }



    export function namedWhen3<T>(promises :{[index:string]: Common.Promise<T>},continueOfFail:boolean = false): Common.Promise<{[index: string]: T}> {

        var promiseArray:Common.Promise<INamedValue<T>>[] = [];

        for (var name in promises) {
            var namedPromise = namePromise(name, promises[name]);
            promiseArray.push(namedPromise);
        }

        return namedWhen(promiseArray, continueOfFail);

    }

    export function namedWhen2(promises :{[index:string]: Common.Promise<any>},continueOfFail:boolean = false): Common.Promise<{[index: string]: any}> {

        var promiseArray:Common.Promise<INamedValue<any>>[] = [];

        for (var name in promises) {
            var namedPromise = namePromise(name, promises[name]);
            promiseArray.push(namedPromise);
        }

        return namedWhen(promiseArray, continueOfFail);

    }

    export function namedWhen(promises :Common.Promise<INamedValue<any>>[], continueOfFail:boolean = false): Common.Promise<{[index: string]: any}> {
        var allDone = Common.defer<{[index: string]: any}>();
        var targetCount = promises.length;
        var results:  {[index: string]: any} = {};


        if (targetCount == 0) {
            allDone.resolve({});
            return allDone.promise();
        }

        for (var i = 0; i < promises.length; i++) {
            var promise: Common.Promise<any> = promises[i];

            promise
                .done(value => {
                    //console.debug("namedWhen: " + value.name + " promise resolved: " + value.value);
                    results[value.name] = value.value;

                    if (Collection.getKeys(results).length == targetCount)
                        allDone.resolve(results);
                })
                .fail(err => {
                    if (continueOfFail) {
                        Logger.warn("Continuing ofter inner error: " + err.message);
                        var randomKey = '' + Math.random();
                        results[randomKey] = null;
                    }
                    else if (allDone.getStatus() !== Common.Status.Rejected) {
                        allDone.reject(err);
                    }
                });
        }

        return allDone.promise();

    }

    function toNativePromise<T>(jqPromise:JQueryPromise<T>) {

        var d = Common.defer<T>();

        jqPromise.done((result) => {
            d.resolve(result);
        });

        jqPromise.fail((xhr, status, err) => {
            d.reject(err);
        });

        return d.promise();
    }

    export function namePromise<T>(name:string, promise:Common.Promise<T>):Common.Promise<INamedValue<T>> {

        return promise.then((value => {
            return { name: name, value: value};
        }))

    }

    export function  jqGetPromise(url:string) : Common.Promise<string> {

        var d = Common.defer<string>();

        $.ajax(url, {dataType: 'text' })
            .done((result:string) => {
                d.resolve(result);
            })
            .fail((xhr:JQueryXHR, status:string, err) => {
                var errorString = (err && err.message) || (status != "error" && status)  ||  xhr.status || xhr.responseText || "generic error";
                Logger.warn("First level error on jqGet '" + url + "': " + errorString);

                d.reject({message: errorString});
            });

        return d.promise();
    }




}
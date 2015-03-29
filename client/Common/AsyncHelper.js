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

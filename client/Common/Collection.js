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

/// <reference path="CommonHelper.ts"/>

module BD.APP.Common {

    export interface Keyed<V> {
        key:string;
        value:V
    }


    export class Collection<E> {

        private source:Array<E> = null;

        constructor(source:Array<E>) {
            this.source = source;
        }

        static of<T>(source:T[]):Collection<T> {
            return new Collection<T>(source);
        }

        static ofElements<T extends Element>(source:HTMLCollection):Collection<T> {

            var array:T[] = [];

            for (var i = 0; i < source.length; i++) {
                array.push(<T>source.item(i));
            }

            return new Collection<T>(array);
        }

        static empty<T>() {
            return new Collection<T>([]);
        }

        length():number {
            return this.source.length;
        }

        getItem(index:number):E {
            return this.source[index];
        }

        each(fn:(item:E, index:number) => void):void {
            Collection.each(this.source, fn);
        }

        select<R>(fn:(item:E, index:number) => R):Collection<R> {
            return Collection.of(Collection.select(this.source, fn));
        }

        slice(startIndex:number, endIndex:number):Collection<E> {

            var newArray:E[] = [];

            for (var i = startIndex; i < endIndex; i++) {
                newArray.push(this.source[i]);
            }

            return new Collection<E>(newArray);
        }

        stableSort(fn?:(a:E, b:E) => number):Collection<E> {

            /**
             * Merge sort (http://en.wikipedia.org/wiki/Merge_sort)
             */
            function mergeSort(arr, compareFn) {
                if (arr == null) {
                    return [];
                } else if (arr.length < 2) {
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
                    } else {
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

            var newSource:E[] = mergeSort(this.source, fn);
            return Collection.of(newSource);
        }

        sort(fn:(a:E, b:E) => number):Collection<E> {
            var newSource:E[] = this.source.slice(0);
            newSource.sort(fn);
            return Collection.of(newSource);
        }

        orderBy(fn:(item:E) => number):Collection<E> {
            return this.sort((a, b) => fn(a) - fn(b));
        }

        orderByDesc(fn:(item:E) => number):Collection<E> {
            return this.sort((a, b) => fn(b) - fn(a));
        }

        where(fn:(item:E) => boolean):Collection<E> {
            return Collection.of(Collection.where(this.source, fn));
        }

        skip(count:number):Collection<E> {
            if (count >= this.source.length) {
                return new Collection<E>([]);
            }
            else {
                var newSource:E[] = this.source.slice(count);
                return Collection.of(newSource);
            }
        }

        take(count:number):Collection<E> {
            var newSource:E[] = this.source.slice(0, count);
            return Collection.of(newSource);
        }

        firstOrValue(value:E):E {
            return this.source.length ? this.source[0] : value;
        }

        first(fn:(item:E) => boolean):E {

            for (var i = 0; i < this.source.length; i++) {
                if (fn(this.source[i])) return this.source[i];
            }

            return null;
        }

        count(fn:(item:E) => boolean):number {
            return Collection.count(this.source, fn);
        }

        any(fn:(item:E) => boolean):boolean {
            return Collection.any(this.source, fn);
        }

        mergeCol(other:Collection<E>):Collection<E> {
            var merged:E[] = this.source.concat(other.source);
            return Collection.of(merged);
        }


        merge(other:E[]):Collection<E> {
            var merged:E[] = this.source.concat(other);
            return Collection.of(merged);
        }

        normalize(selector:(item:E) => number, setter:(item:E, value:number)=> void, min:number = 0, max:number = 1):void {
            if (this.length() == 0) return;

            var minValue = selector(this.minBy(selector));
            var maxValue = selector(this.maxBy(selector));

            this.each(item => {
                var rawValue = selector(item);
                var normValue = maxValue > minValue ? (rawValue - minValue) / (maxValue - minValue) : (max - min / 2);
                setter(item, normValue);
            });
        }


        distinct(keySelector:(item:E) => string):Collection<E> {
            return Collection.of(Collection.distinct(this.source, keySelector));
        }

        sum(selector:(item:E) => number):number {
            return Collection.aggregate(this.source, 0, (item:E, prevSum:number) => prevSum + selector(item));
        }

        maxBy(selector:(item:E) => number):E {
            return Collection.maxBy(this.source, selector);
        }

        minBy(selector:(item:E) => number):E {
            return Collection.maxBy(this.source, (e) => -selector(e));
        }

        stringJoin(seperator?:string):string {
            return this.source.join(seperator);
        }

        groupBy(keySelector:(item:E) => string):Map<E[]> {
            var groupedHash = Collection.orderedGroupByString(this.source, keySelector);
            return groupedHash;
        }


        selectMany<R>(selector:(item:E) => R[]):Collection<R> {
            var results:R[] = [];
            this.each(item => results = results.concat(selector(item)));

            return Collection.of(results);
        }

        selectFirst<R>(selector:(item:E) => R, validCondition:(result:R) => boolean = (result:R) => !!result):R {

            for (var i = 0; i < this.source.length; i++) {
                var itemResult:R = selector(this.source[i]);
                if (validCondition(itemResult)) return itemResult;
            }

            return null;
        }

        toMap<R>(keySelector:(item:E) => string, valueSelector:(item:E) => R):Map<R> {

            var keyedCollection = this.select(x => {
                return { key: keySelector(x), value: valueSelector(x) };
            })

            return new Map<R>(keyedCollection.toArray());
        }

        toHashmap(keySelector:(item:E) => string):{[index:string]: E} {
            return Collection.toHashmap(this.source, keySelector);
        }


        toHashmap2<R>(keySelector:(item:E) => string, valueSelector:(item:E) => R):{[index:string]: R} {
            return Collection.toHashmap2(this.source, keySelector, valueSelector);
        }

        toArray():E[] {
            return this.source;
        }


        // Statics

        static count<T>(source:T[], fn:(item:T) => boolean):number {
            var count = 0;
            for (var i = 0; i < source.length; i++) {
                if (fn(source[i])) count++;
            }
            return count;

        }

        static any<T>(source:T[], fn:(item:T) => boolean):boolean {
            for (var i = 0; i < source.length; i++) {
                if (fn(source[i])) return true;
            }
            return false;

        }

        static each<T>(source:T[], fn:(item:T, index:number) => void):void {
            for (var i = 0; i < source.length; i++) {
                fn(source[i], i);
            }
        }

        static hashEach<T>(source:{[index:string]: T}, fn:(key:string, value:T) => void):void {

            for (var key in source) {
                if (source.hasOwnProperty(key)) {
                    fn(key, source[key]);
                }
            }
        }

        static select<T,R>(source:T[], fn:(item:T, index:number) => R):R[] {
            var results:R[] = [];
            for (var i = 0; i < source.length; i++) {
                var res = fn(source[i], i);
                results.push(res);
            }
            return results;
        }

        static where<T>(source:T[], fn:(item:T) => boolean):T[] {
            var results:T[] = [];
            for (var i = 0; i < source.length; i++) {
                var res = fn(source[i]);
                if (res) results.push(source[i]);
            }
            return results;
        }

        static filterSelect<T,R>(source:T[], fn:(item:T) => R):R[] {
            var results:R[] = [];
            for (var i = 0; i < source.length; i++) {
                var res = fn(source[i]);
                if (res != null) results.push(res);
            }
            return results;
        }


        static flatMap<T>(source:T[][]):T[] {
            var results:T[] = [];
            for (var i = 0; i < source.length; i++) {
                results = results.concat(source[i]);
            }
            return results;
        }



        static distinct<T>(source:T[], keySelector:(item:T) => string):T[] {

            var map:{[index:string]: boolean} = {};
            var results:T[] = [];

            for (var i = 0; i < source.length; i++) {
                var item = source[i];
                var key = keySelector(item);

                if (!(key in map)) {
                    map[keySelector(item)] = true;
                    results.push(item);
                }
            }

            return results;
        }



        static exclude(source:Array<string>, exclude:Array<string>):Array<string> {

            var result:Array<string> = [];

            for (var i = 0; i < source.length; i++) {
                var matched = false;
                for (var j = 0; j < exclude.length; i++) {
                    if (source[i].toLowerCase() == exclude[j].toLowerCase()) {
                        matched = true;
                        break;
                    }
                }

                if (!matched) result.push(source[i]);
            }

            return result;
        }


        static contains(source:Array<string>, value:string):boolean {

            for (var i = 0; i < source.length; i++) {
                if (source[i].toLowerCase() == value.toLowerCase()) return true;
            }
            return false;
        }

        static groupByString<T>(source:Array<T>, keySelector:(item:T) => string):{[index:string]: T[]} {
            var group:{[index:string]: T[]} = {};

            for (var i = 0; i < source.length; i++) {
                var item = source[i];
                var key = keySelector(item);

                if (!(key in group))
                    group[key] = [];

                group[key].push(item);
            }

            return group;
        }

        static orderedGroupByString<T>(source:Array<T>, keySelector:(item:T) => string):Map<T[]> {
            var group:{[index:string]: number} = {};
            var ordered:Keyed<T[]>[] = [];

            for (var i = 0; i < source.length; i++) {
                var item = source[i];
                var key = keySelector(item);

                if (!(key in group)) {
                    ordered.push({key: key, value: []})
                    group[key] = ordered.length - 1;
                }

                var index = group[key];
                ordered[index].value.push(item);
            }

            return new Map<T[]>(ordered);
        }


        static hashSelect<T, R>(source:{[index:string]: T}, transform:(item:T) => R):{[index:string]: R} {
            var result:{[index:string]: R} = {};

            for (var key in source) {
                if (source.hasOwnProperty(key)) {
                    result[key] = transform(source[key]);
                }
            }

            return result;
        }

        static aggregate<T, R>(source:T[], initialValue:R, fn:(item:T, prevResult:R) => R):R {
            var agg:R = initialValue;
            for (var i = 0; i < source.length; i++) {
                agg = fn(source[i], agg);
            }
            return agg;
        }


        static hashAggregate<V, R>(source:{[index:string]: V}, initialValue:R, fn:(key:string, value:V, prevResult:R) => R):R {
            var agg:R = initialValue;
            for (var key in source) {
                var value:V = source[key];
                agg = fn(key, value, agg);
            }
            return agg;
        }

        static sum<T>(source:T[], selector:(item:T) => number):number {
            return Collection.aggregate(source, 0, (item:T, prevSum:number) => prevSum + selector(item));
        }

        static hashSum<T>(source:{[index:string]: T}, selector:(key:string, value:T) => number) {
            return Collection.hashAggregate(source, 0, (key:string, value:T, prevSum:number) => prevSum + selector(key, value));
        }


        static values<T>(dict:{[index:string]: T}) {
            var values:T[] = [];
            for (var key in dict) {
                values.push(dict[key]);
            }

            return values;
        }

        static numValues<T>(dict:{[index:number]: T}) {
            var values:T[] = [];
            for (var key in dict) {
                values.push(dict[key]);
            }

            return values;
        }

        static maxBy<T>(source:T[], selector:(item:T) => number):T {

            var bestResult:number = null;
            var bestItem:T = null;

            for (var i = 0; i < source.length; i++) {
                var result = selector(source[i]);

                if (bestResult == null || result > bestResult) {
                    bestResult = result;
                    bestItem = source[i];
                }
            }

            return bestItem
        }

        static intersect<T>(first:T[], second:T[]):T[] {

            var result:T[] = [];

            for (var f = 0; f < first.length; f++) {
                for (var s = 0; s < second.length; s++) {
                    if (first[f] == second[s]) {
                        result.push(first[f]);
                        break;
                    }
                }
            }

            return result;
        }

        static getKeys(source:{[index:string]: any}) {

            var keys:string[] = [];
            for (var key in source) {
                keys.push(key);
            }

            return keys;
        }

        static toArray<T, R>(source:{[index:string]: T}, selector:(key:string, value:T) => R):R[] {

            var result:R[] = [];

            for (var key in source) {
                var value = source[key];
                var record = selector(key, value);
                result.push(record);
            }

            return result;
        }


        static valuesCollection<T>(source:{[index:string]: T}):Collection<T> {
            var values:T[] = [];

            for (var key in source) {
                if (source.hasOwnProperty(key)) {
                    values.push(source[key]);
                }
            }

            return Collection.of(values);

        }

        static toHashmap<T>(source:T[], keySelector:(item:T) => string):{[index:string]: T} {
            return Collection.toHashmap2<T, T>(source, keySelector, x => x);
        }


        static toHashmap2<T, R>(source:T[], keySelector:(item:T) => string, valueSelector:(item:T) => R):{[index:string]: R} {

            var hashmap:{[index:string]: R} = {};

            for (var i = 0; i < source.length; i++) {
                var item:T = source[i];
                var resultItem = valueSelector(item);
                var key = keySelector(item);

                hashmap[key] = resultItem;
            }

            return hashmap;
        }

        static join<T1, T2, R>(firstSource:T1[], secondSource:T2[], comparerSelector:(first:T1, second:T2) => R):R[] {


            var results:R[] = [];

            for (var f = 0; f < firstSource.length; f++) {
                var first = firstSource[f];

                for (var s = 0; s < secondSource.length; s++) {
                    var second = secondSource[s];

                    var resultItem:R = comparerSelector(first, second);
                    if (resultItem != null) {
                        results.push(resultItem);
                    }
                }
            }

            return results;
        }


        static hashMerge<T>(first:{[index:string]: T}, second:{[index:string]:T}, onConflict:(key:string, first:T, second:T) => T = Collection.hashMergeDefaultConflictFn) {

            var result:{[index:string]: T} = {};

            Collection.hashEach(first, (key, value) => result[key] = value);
            Collection.hashEach(second, (key, value) => {
                if (key in result) {
                    result[key] = onConflict(key, result[key], value);
                }
                else {
                    result[key] = value;
                }
            });

            return result;
        }

        private static hashMergeDefaultConflictFn<T>(key:string, first:T, second:T) {
            throw new Error("Conflict on hash merge. Key: " + key + ". First: " + first + ". Second: " + second);
            return null;
        }

        static recurseElements(root:HTMLElement, fn:(element:HTMLElement, parentElement:HTMLElement) => RecursionFlow, parentElement:HTMLElement = null):RecursionFlow {

            var flowBreak = fn(root, parentElement);
            if (flowBreak == RecursionFlow.BREAK_NODE || flowBreak == RecursionFlow.BREAK_ALL) return flowBreak;

            for (var i = 0; i < root.children.length; i++) {
                var child = <HTMLElement>root.children.item(i);
                var childFlowBreak = Collection.recurseElements(child, fn);

                if (childFlowBreak == RecursionFlow.BREAK_ALL) return RecursionFlow.BREAK_ALL;
            }

            return flowBreak;
        }

        static recurseNodes(root:Node, fn:(element:Node, parentElement:Node) => RecursionFlow, parentElement:Node = null):RecursionFlow {

            var flowBreak = fn(root, parentElement);
            if (flowBreak == RecursionFlow.BREAK_NODE || flowBreak == RecursionFlow.BREAK_ALL) return flowBreak;

            for (var i = 0; i < root.childNodes.length; i++) {
                var child = root.childNodes.item(i);
                var childFlowBreak = Collection.recurseNodes(child, fn);

                if (childFlowBreak == RecursionFlow.BREAK_ALL) return RecursionFlow.BREAK_ALL;
            }

            return flowBreak;
        }

        static repeatString(value:string, count:number):string[] {
            var arr:string[] = [];
            for (var i = 0; i < count; i++) {
                arr.push(value);
            }

            return arr;
        }






    }

    export class Pair<A, B> {
        first: A;
        second: B;
    }

    export enum RecursionFlow { CONTINUE, BREAK_NODE, BREAK_ALL }


    export class Map<E> extends Collection<Keyed<E>> {

        constructor(source:Keyed<E>[]) {
            super(source);
        }

        static ofHash<T>(source:{[index:string]: T}):Map<T> {

            var pairs:Keyed<T>[] = [];

            for (var key in source) {
                if (source.hasOwnProperty(key)) {
                    pairs.push({key: key, value: source[key]});
                }
            }

            return new Map<T>(pairs);
        }

        static ofUrlString(source:string):Map<string> {
            return Map.ofHashString(source, "&", "=", (raw:string) => decodeURIComponent(raw));
        }

        static ofHashString<T>(source:string, pairSeperator:string, keyValSeperator:string, valueTransform:(value:string) => T):Map<T> {

            var pairsStringCollection = Collection.of(source.split(pairSeperator));
            var hashCollection = pairsStringCollection.select(pairString => {
                var pair = pairString.split(keyValSeperator);
                var key = pair[0];
                var rawVal = pair[1];
                var val = valueTransform(rawVal);

                return {key: key, value: val};
            }).toArray();

            return new Map<T>(hashCollection);
        }

        static emptyMap<T>():Map<T> {
            return Map.ofHash<T>({});
        }


        get(key:string):E {
            var kv = this.first((kv:Keyed<E>) => kv.key == key);
            return kv ? kv.value : null;
        }


        keys():Collection<string> {
            return this.select((x:Keyed<E>) => x.key);
        }

        values():Collection<E> {
            return this.select((x:Keyed<E>) => x.value);
        }

        selectValues<R>(fn:(item:Keyed<E>) => R):Map<R> {
            var raw = this.select((item:Keyed<E>) => {
                return {key: item.key, value: fn(item)};
            });
            return new Map(raw.toArray());
        }

    }

}

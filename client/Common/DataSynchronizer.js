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

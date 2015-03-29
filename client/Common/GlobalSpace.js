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

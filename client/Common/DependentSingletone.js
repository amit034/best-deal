var BD;
(function (BD) {
    var APP;
    (function (APP) {
        var Common;
        (function (Common) {
            var DependentSingletone = (function () {
                function DependentSingletone(keyFunc, valueFunc) {
                    this.virgin = true;
                    this.keyFunc = keyFunc;
                    this.valueFunc = valueFunc;
                }
                DependentSingletone.prototype.value = function () {
                    var currentKey = this.keyFunc();
                    if (this.virgin || currentKey != this.key) {
                        this._value = this.valueFunc();
                        this.key = currentKey;
                        this.virgin = false;
                    }
                    return this._value;
                };
                return DependentSingletone;
            })();
            Common.DependentSingletone = DependentSingletone;
        })(Common = APP.Common || (APP.Common = {}));
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));

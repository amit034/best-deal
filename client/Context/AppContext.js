var BD;
(function (BD) {
    var APP;
    (function (APP) {
        var Context;
        (function (Context) {
            var AppContext = (function () {
                function AppContext(paths, params) {
                    this._paths = paths;
                    this._params = params;
                    this._host = window.location.host;
                }
                AppContext.prototype.paths = function () {
                    return this._paths;
                };
                AppContext.prototype.params = function () {
                    return this._params;
                };
                AppContext.prototype.host = function () {
                    return this._host;
                };
                AppContext.prototype.isDebugMode = function () {
                    return true;
                };
                return AppContext;
            })();
            Context.AppContext = AppContext;
        })(Context = APP.Context || (APP.Context = {}));
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));

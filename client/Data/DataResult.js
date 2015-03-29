/// <reference path="../Context/LVContext" />
/// <reference path="../Common/Promise" />
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
        var Data;
        (function (Data) {
            var PlainDataResult = (function () {
                function PlainDataResult(source, context, data, extras) {
                    if (extras === void 0) { extras = {}; }
                    this.source = source;
                    this.context = context;
                    this.data = data;
                    this.extras = extras;
                }
                PlainDataResult.prototype.hasData = function () {
                    return this.data && this.data.length > 0;
                };
                return PlainDataResult;
            })();
            Data.PlainDataResult = PlainDataResult;
            var StubDataResult = (function () {
                function StubDataResult(source, context) {
                    this.source = source;
                    this.context = context;
                }
                StubDataResult.prototype.hasData = function () {
                    return true;
                };
                return StubDataResult;
            })();
            Data.StubDataResult = StubDataResult;
            var DataGeneratorResult = (function (_super) {
                __extends(DataGeneratorResult, _super);
                function DataGeneratorResult(source, context, generator) {
                    _super.call(this, source, context);
                    this.generator = generator;
                }
                DataGeneratorResult.prototype.generateData = function (param, context, counts) {
                    return this.generator(param, context, counts);
                };
                return DataGeneratorResult;
            })(StubDataResult);
            Data.DataGeneratorResult = DataGeneratorResult;
        })(Data = APP.Data || (APP.Data = {}));
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));

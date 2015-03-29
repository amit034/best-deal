/// <reference path="SuspendTarget" />
/// <reference path="../Common/ISuspender" />
/// <reference path="../Common/DefaultSuspender" />
/// <reference path="../Common/RealEstateHelper" />
/// <reference path="../DisplayHandlers/IDisplayHandler" />
/// <reference path="../External/knockout.d.ts" />
var BD;
(function (BD) {
    var APP;
    (function (APP) {
        var Model;
        (function (Model) {
            var ProductModelBase = (function () {
                function ProductModelBase(context, suspendIdentifier, onClose) {
                    var _this = this;
                    if (onClose === void 0) { onClose = function () {
                    }; }
                    this.collapsed = BD.ko.observable(false);
                    this.hidden = BD.ko.observable(false);
                    this.suspendTarget = null;
                    this.postRenderHandler = function () {
                    };
                    this.context = context;
                    this.suspendIdentifier = suspendIdentifier;
                    this.providerLink = context.params().providerLink;
                    this.providerName = context.params().providerName;
                    this.providerFooter = context.params().providerFooter;
                    this.extraAttribution = window["__rvzfrrstfr"] && window["__rvzfrrstfr"].product_name;
                    var suspendPeriods = this.extraAttribution ? Model.SuspendTarget.strictSuspendPeriods : Model.SuspendTarget.defaultSuspendPeriods;
                    this.suspendTarget = new Model.SuspendTarget(context, suspendIdentifier, suspendPeriods, function () { return _this.hide(); });
                    this.collapsed(!this.suspendTarget.shouldAutoAppear());
                    this.onClose = onClose;
                    this.afterRender = function (nodes, model) {
                        var parentElement = (nodes[0].parentNode);
                        var jqParentElement = BD.$(parentElement);
                        _this.postRenderHandler(jqParentElement, parentElement);
                    };
                    //if (context.params().overrides['no_block_propagation']) {
                    //    this.blockPropagation = (model:any, event:Event) => true;
                    //}
                }
                ProductModelBase.prototype.hide = function () {
                    this.hidden(true);
                    APP.Common.RealEstateHelper.releaseRealestate(this.suspendIdentifier);
                    this.onClose();
                };
                ProductModelBase.prototype.toggleCollapsed = function () {
                    this.collapsed(!this.collapsed());
                };
                ProductModelBase.prototype.blockPropagation = function (model, event) {
                    if (event) {
                        event.stopPropagation();
                        event.cancelBubble = true;
                    }
                    return true;
                };
                return ProductModelBase;
            })();
            Model.ProductModelBase = ProductModelBase;
        })(Model = APP.Model || (APP.Model = {}));
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));

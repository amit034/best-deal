/// <reference path="../Products/IProductVisual" />
/// <reference path="../External/knockout" />
/// <reference path="../Common/Res.ts" />
/// <reference path="../Common/Collection.ts" />
/// <reference path="../Common/CollisionHelper.ts" />
/// <reference path="../Common/HtmlHelper.ts" />
/// <reference path="../Data/Deal.ts" />
/// <reference path="../DisplayHandlers/EllipsisHandler.ts" />
/// <reference path="../DisplayHandlers/ScrollHandler.ts" />
/// <reference path="../DisplayHandlers/SuspendBoxHandler.ts" />
/// <reference path="../Model/TicketsModel.ts" />
var BD;
(function (BD) {
    var APP;
    (function (APP) {
        var Products;
        (function (Products) {
            var IFrameRightSlider = (function () {
                function IFrameRightSlider() {
                    this.element = null;
                }
                IFrameRightSlider.prototype.realEstate = function () {
                    return 1 /* RIGHT_PANEL */;
                };
                IFrameRightSlider.prototype.flag = function () {
                    return "rsif";
                };
                IFrameRightSlider.prototype.determineNeededItemCount = function (context) {
                    return 4;
                };
                IFrameRightSlider.prototype.declareResourcesPromise = function (context) {
                    return {
                        reset2_css: APP.Common.Res.injectCss(context.paths().staticContentRoot() + "/Visual/reset.css"),
                        panel_css: APP.Common.Res.injectCss(context.paths().staticContentRoot() + "/Visual/New/iframeRightSlider.css"),
                        html: APP.Common.Res.bring(context.paths().staticContentRoot() + "/Visual/New/panel.html"),
                        container: APP.Common.Res.bring(context.paths().staticContentRoot() + "/Visual/New/container.html")
                    };
                };
                IFrameRightSlider.prototype.getMainCssClass = function () {
                    return "fo-iframe-right-slider";
                };
                IFrameRightSlider.prototype.getParentElement = function () {
                    return document.documentElement.getElementsByTagName("body")[0];
                };
                IFrameRightSlider.prototype.draw = function (product, result, resources) {
                    var _this = this;
                    var dealsResult = result;
                    var deals = dealsResult ? dealsResult.data : null;
                    var dealsContext = dealsResult ? dealsResult.context : null;
                    var iframeString = resources["container"];
                    var iframeElement = BD.$(iframeString);
                    iframeElement.addClass("fo-right-container-frame");
                    var iframe = iframeElement[0];
                    APP.Common.CollisionHelper.treatForCollisions(iframeElement);
                    APP.Common.HtmlHelper.appendToBody(iframeElement);
                    return APP.Common.wait(100).then(function () {
                        var css1 = BD.$('<link rel="stylesheet" href="' + dealsContext.paths().staticContentRoot() + '/Visual/New/iframeRightSlider.css">');
                        BD.$(iframe.contentDocument.head).append(css1);
                        var htmlString = resources["html"];
                        var rootClass = _this.getMainCssClass();
                        var syncToPage = false;
                        var scrollArrows = true;
                        var autoScroll = 0;
                        var scrollIndependent = false;
                        var peekaboo = false;
                        var displayHandlers = [
                            new APP.DisplayHandlers.EllipsisHandler(),
                            new APP.DisplayHandlers.SuspendBoxHandler(),
                            new APP.DisplayHandlers.ScrollHandler(syncToPage, scrollArrows, autoScroll, scrollIndependent, peekaboo),
                            {
                                afterRender: function (jqElement) {
                                    window.setTimeout(function () { return iframeElement.height(jqElement.outerHeight() + 5); }, 10);
                                },
                                remove: function () {
                                    iframeElement.remove();
                                }
                            }
                        ];
                        var onClose = function () { return APP.Common.Collection.of(displayHandlers).each(function (ds) { return ds.remove && ds.remove(); }); };
                        var suspendIdentifier = Products.VisualRealEstate[_this.realEstate()];
                        var model = new APP.Model.TicketsModel(dealsContext, deals, dealsContext, suspendIdentifier, onClose);
                        // Visual composition and injection
                        var jqElement = BD.$(htmlString).addClass(rootClass);
                        APP.Common.CollisionHelper.treatForCollisions(jqElement);
                        model.selectedTab.subscribe(function () {
                            APP.Common.wait(100).then(function () {
                                iframeElement.height(jqElement.outerHeight() + 5);
                            });
                        });
                        var element = jqElement[0];
                        iframe.contentDocument.body.appendChild(element);
                        // Set display handlers
                        model.postRenderHandler = function () { return APP.Common.Collection.of(displayHandlers).each(function (ds) { return ds.afterRender(jqElement, element); }); };
                        try {
                            // Model binding
                            BD.ko.applyBindings(model, element);
                            BD.ko.applyBindings(model, iframe);
                        }
                        catch (e) {
                            APP.Common.Collection.of(displayHandlers).each(function (ds) { return ds.remove && ds.remove(); });
                            jqElement.remove();
                            throw e;
                        }
                        window.setInterval(function () {
                            try {
                                iframeElement.height(jqElement.outerHeight() + 5);
                            }
                            catch (ex) {
                            }
                        }, 100);
                        _this.element = element;
                        return element;
                    });
                };
                IFrameRightSlider.prototype.remove = function (context) {
                    BD.$(this.element).remove();
                };
                return IFrameRightSlider;
            })();
            Products.IFrameRightSlider = IFrameRightSlider;
        })(Products = APP.Products || (APP.Products = {}));
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));

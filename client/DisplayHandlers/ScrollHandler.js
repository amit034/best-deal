/// <reference path="IDisplayHandler"/>
/// <reference path="../Common/Collection.ts"/>
/// <reference path="../External/jquery.d.ts"/>
var BD;
(function (BD) {
    var APP;
    (function (APP) {
        var DisplayHandlers;
        (function (DisplayHandlers) {
            var ScrollHandler = (function () {
                function ScrollHandler(syncToPage, scrollArrows, autoScroll, scrollIndepandent, peekaboo, tabClasses) {
                    if (tabClasses === void 0) { tabClasses = ['fo-deals-tab', 'fo-coupons-tab']; }
                    this.mouseOverElement = false;
                    this.tabClasses = tabClasses;
                    this.syncToPage = syncToPage;
                    this.autoScroll = autoScroll;
                    this.scrollIndepandent = scrollIndepandent;
                    this.peekaboo = peekaboo;
                    this.scrollArrows = scrollArrows;
                    this.directionalHelper = {
                        lengthFn: function (e) { return e.height(); },
                        positionProperty: "margin-top"
                    };
                }
                ScrollHandler.prototype.afterRender = function (jqElement) {
                    var self = this;
                    // Initial scroll to set visibality correctly
                    APP.Common.Collection.of(self.tabClasses).each(function (tabClass) {
                        var tab = jqElement.find('.' + tabClass);
                        var scrolled = ScrollHandler.scrollTabToIndex(self, tab, 0);
                    });
                    // Need to keep track of mouse for autoScroll and independentScroll
                    jqElement.hover(function () { return self.mouseOverElement = true; }, function () { return self.mouseOverElement = false; });
                    if (this.syncToPage)
                        this.setupSyncToPage(jqElement);
                    if (this.scrollArrows)
                        this.setupScrollArrows(jqElement);
                    if (this.autoScroll)
                        this.setupAutoScroll(jqElement);
                    if (this.scrollIndepandent)
                        this.setupIndependentScroll(jqElement);
                    if (this.peekaboo)
                        this.setupPeekaboo(jqElement);
                };
                ScrollHandler.prototype.setupSyncToPage = function (jqElement) {
                    var _this = this;
                    var self = this;
                    ScrollHandler.syncScrollToPage(this, jqElement);
                    BD.$(window).scroll(function () { return ScrollHandler.syncScrollToPage(_this, jqElement); });
                };
                ScrollHandler.prototype.setupScrollArrows = function (jqElement) {
                    var self = this;
                    jqElement.find(".fo-scroll-btn").each(function (index, el) {
                        BD.$(el).click(function (e) {
                            var jqScrollBtn = BD.$(e.target);
                            var tab = jqScrollBtn.closest(".fo-tab");
                            var stepValue = parseInt(jqScrollBtn.attr("data-scroll-step"));
                            ScrollHandler.scrollTabByStep(self, tab, stepValue);
                        });
                    });
                };
                ScrollHandler.prototype.setupAutoScroll = function (jqElement) {
                    var self = this;
                    var scrollInterval = window.setInterval(function () {
                        if (!self.mouseOverElement) {
                            APP.Common.Collection.of(self.tabClasses).each(function (tabClass) {
                                var tab = jqElement.find('.' + tabClass);
                                var currentIndex = tab.data("fo-current-scroll-index");
                                var scrolled = ScrollHandler.scrollTabToIndex(self, tab, currentIndex + 1, "slow");
                                if (!scrolled) {
                                    ScrollHandler.scrollTabToIndex(self, tab, 0, "slow");
                                }
                            });
                        }
                    }, this.autoScroll);
                };
                ScrollHandler.prototype.setupIndependentScroll = function (jqElement) {
                    var self = this;
                    BD.$(window).on("mousewheel", function (e) {
                        if (self.mouseOverElement) {
                            e.preventDefault();
                            e.cancelBubble = true;
                            e.stopPropagation();
                            var step = e.originalEvent['wheelDeltaY'] < 0 ? 1 : -1;
                            //console.log("Stepping " + step);
                            APP.Common.Collection.of(self.tabClasses).each(function (tabClass) {
                                var tab = jqElement.find('.' + tabClass);
                                var currentIndex = tab.data("fo-current-scroll-index");
                                ScrollHandler.scrollTabToIndex(self, tab, currentIndex + step, "fast");
                            });
                        }
                    });
                };
                ScrollHandler.prototype.setupPeekaboo = function (jqElement) {
                    var self = this;
                    APP.Common.Collection.of(self.tabClasses).each(function (tabClass) {
                        var tab = jqElement.find('.' + tabClass);
                        ScrollHandler.scrollTabToIndex(self, tab, 1, "slow");
                        window.setTimeout(function () { return ScrollHandler.scrollTabToIndex(self, tab, 0, "slow"); }, 1500);
                    });
                };
                ScrollHandler.syncScrollToPage = function (self, jqElement) {
                    APP.Common.Collection.of(self.tabClasses).each(function (tabClass) {
                        var tab = jqElement.find('.' + tabClass);
                        ScrollHandler.syncTabScrollToPage(self, tab);
                    });
                };
                ScrollHandler.syncTabScrollToPage = function (self, tab) {
                    var docHeight = BD.$(document).height();
                    var scroll = BD.$(window).scrollTop();
                    var topPct = scroll / docHeight;
                    var items = tab.find(".fo-list li");
                    var firstItemIndex = Math.round(items.length * topPct);
                    ScrollHandler.scrollTabToIndex(self, tab, firstItemIndex);
                };
                ScrollHandler.scrollTabToIndex = function (self, tab, index, speed) {
                    if (speed === void 0) { speed = "fast"; }
                    var list = tab.find(".fo-list");
                    var items = list.find("li");
                    var listLength = self.directionalHelper.lengthFn(list);
                    list.height();
                    var itemLength = (listLength + 8) / items.length;
                    var wrapperLength = self.directionalHelper.lengthFn(tab.find(".fo-list-wrapper"));
                    var itemsInView = Math.round(wrapperLength / itemLength);
                    if (index >= 0 && index <= items.length - itemsInView) {
                        var currentIndex = tab.data("fo-current-scroll-index");
                        if (index != currentIndex) {
                            var firstItemPosition = (index * itemLength);
                            //console.log(tab[0].className + " Scrollling to " + firstItemIndex + ": -" + firstItemPosition);
                            var animateOptions = {};
                            animateOptions[self.directionalHelper.positionProperty] = "-" + firstItemPosition + "px";
                            list.stop();
                            list.animate(animateOptions, speed);
                            tab.data("fo-current-scroll-index", index);
                            tab.find(".fo-scroll-up").toggleClass("fo-active", index > 0);
                            tab.find(".fo-scroll-down").toggleClass("fo-active", index < items.length - itemsInView);
                            return true;
                        }
                    }
                    return false;
                };
                ScrollHandler.scrollTabByStep = function (self, tab, step) {
                    var currentIndex = tab.data("fo-current-scroll-index");
                    ScrollHandler.scrollTabToIndex(self, tab, currentIndex + step);
                };
                return ScrollHandler;
            })();
            DisplayHandlers.ScrollHandler = ScrollHandler;
        })(DisplayHandlers = APP.DisplayHandlers || (APP.DisplayHandlers = {}));
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));

/// <reference path="IDisplayHandler"/>
/// <reference path="../Common/Collection.ts"/>
/// <reference path="../External/jquery.d.ts"/>


module BD.APP.DisplayHandlers {

    interface IDirectionalHelper {
        lengthFn:(e:JQuery) => number;
        positionProperty:string;
    }

    export class ScrollHandler implements IDisplayHandler {

        private tabClasses:string[];
        private syncToPage:boolean;
        private autoScroll:number;
        private scrollIndepandent:boolean;
        private peekaboo:boolean;
        private scrollArrows:boolean;

        private directionalHelper:IDirectionalHelper;

        private mouseOverElement:boolean = false;


        constructor(syncToPage:boolean, scrollArrows:boolean, autoScroll:number, scrollIndepandent:boolean, peekaboo:boolean, tabClasses:string[] = ['bd-deals-tab', 'bd-coupons-tab']) {
            this.tabClasses = tabClasses;
            this.syncToPage = syncToPage;
            this.autoScroll = autoScroll;
            this.scrollIndepandent = scrollIndepandent;
            this.peekaboo = peekaboo;
            this.scrollArrows = scrollArrows;

            this.directionalHelper = {
                lengthFn: (e:JQuery) => e.height(),
                positionProperty: "margin-top"
            };
        }

        afterRender(jqElement:JQuery) {
            var self = this;

            // Initial scroll to set visibality correctly
            Common.Collection.of(self.tabClasses).each(tabClass => {
                var tab = jqElement.find('.' + tabClass);
                var scrolled = ScrollHandler.scrollTabToIndex(self, tab, 0);
            });

            // Need to keep track of mouse for autoScroll and independentScroll
            jqElement.hover(() => self.mouseOverElement = true, () => self.mouseOverElement = false);

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
        }


        private setupSyncToPage(jqElement:JQuery) {
            var self = this;

            ScrollHandler.syncScrollToPage(this, jqElement);
            $(window).scroll(() => ScrollHandler.syncScrollToPage(this, jqElement))
        }

        private setupScrollArrows(jqElement:JQuery) {
            var self = this;

            jqElement.find(".bd-scroll-btn").each((index:number, el:HTMLElement) => {
                $(el).click((e:Event) => {
                    var jqScrollBtn = $(e.target);
                    var tab = jqScrollBtn.closest(".bd-tab");
                    var stepValue = parseInt(jqScrollBtn.attr("data-scroll-step"));

                    ScrollHandler.scrollTabByStep(self, tab, stepValue);
                })
            })
        }

        private setupAutoScroll(jqElement:JQuery) {
            var self = this;

            var scrollInterval = window.setInterval(() => {
                if (!self.mouseOverElement) {
                    Common.Collection.of(self.tabClasses).each(tabClass => {
                        var tab = jqElement.find('.' + tabClass);

                        var currentIndex = tab.data("bd-current-scroll-index");
                        var scrolled = ScrollHandler.scrollTabToIndex(self, tab, currentIndex + 1, "slow");

                        if (!scrolled) {
                            ScrollHandler.scrollTabToIndex(self, tab, 0, "slow");
                        }
                    });
                }

            }, this.autoScroll);
        }


        private setupIndependentScroll(jqElement:JQuery) {
            var self = this;

            $(window).on("mousewheel", (e:JQueryMouseEventObject) => {
                if (self.mouseOverElement) {
                    e.preventDefault();
                    e.cancelBubble = true;
                    e.stopPropagation();

                    var step = e.originalEvent['wheelDeltaY'] < 0 ? 1 : -1;

                    //console.log("Stepping " + step);

                    Common.Collection.of(self.tabClasses).each(tabClass => {
                        var tab = jqElement.find('.' + tabClass);

                        var currentIndex = tab.data("bd-current-scroll-index");
                        ScrollHandler.scrollTabToIndex(self, tab, currentIndex + step, "fast");
                    });
                }
            });
        }


        private setupPeekaboo(jqElement:JQuery) {
            var self = this;

            Common.Collection.of(self.tabClasses).each(tabClass => {
                var tab = jqElement.find('.' + tabClass);

                ScrollHandler.scrollTabToIndex(self, tab, 1, "slow");
                window.setTimeout(() => ScrollHandler.scrollTabToIndex(self, tab, 0, "slow"), 1500);

            });
        }




        private static syncScrollToPage(self:ScrollHandler, jqElement:JQuery) {
            Common.Collection.of(self.tabClasses).each(tabClass => {
                var tab = jqElement.find('.' + tabClass);
                ScrollHandler.syncTabScrollToPage(self, tab);
            })
        }

        private static syncTabScrollToPage(self:ScrollHandler, tab:JQuery) {

            var docHeight = $(document).height();
            var scroll = $(window).scrollTop();
            var topPct = scroll / docHeight;
            var items = tab.find(".bd-list li");
            var firstItemIndex = Math.round(items.length * topPct);

            ScrollHandler.scrollTabToIndex(self, tab, firstItemIndex);
        }



        private static scrollTabToIndex(self:ScrollHandler, tab:JQuery, index:number, speed:string = "fast"):boolean {

            var list = tab.find(".bd-list");
            var items = list.find("li");

            var listLength = self.directionalHelper.lengthFn(list); list.height();
            var itemLength = (listLength + 8) / items.length;
            var wrapperLength = self.directionalHelper.lengthFn(tab.find(".bd-list-wrapper"));
            var itemsInView = Math.round(wrapperLength / itemLength);


            if (index >= 0 && index <= items.length - itemsInView) {
                var currentIndex = tab.data("bd-current-scroll-index");

                if (index != currentIndex) {
                    var firstItemPosition = (index * itemLength);
                    //console.log(tab[0].className + " Scrollling to " + firstItemIndex + ": -" + firstItemPosition);

                    var animateOptions = {};
                    animateOptions[self.directionalHelper.positionProperty] =  "-" + firstItemPosition + "px";

                    list.stop();
                    list.animate(animateOptions, speed);
                    tab.data("bd-current-scroll-index", index)

                    tab.find(".bd-scroll-up").toggleClass("bd-active", index > 0);
                    tab.find(".bd-scroll-down").toggleClass("bd-active", index < items.length - itemsInView);

                    return true;
                }
            }
            return false;
        }

        private static scrollTabByStep(self:ScrollHandler, tab:JQuery, step:number) {
            var currentIndex = tab.data("bd-current-scroll-index");
            ScrollHandler.scrollTabToIndex(self, tab, currentIndex + step);
        }

    }
}

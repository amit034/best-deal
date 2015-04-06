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
/// <reference path="../Model/TicketsModel.ts" />.

module BD.APP.Products {
    import VisualRealEstate = Products.VisualRealEstate;
    export class IFrameRightSlider implements Products.IProductVisual {

        private element:HTMLElement = null;

        realEstate():Products.VisualRealEstate {
            return Products.VisualRealEstate.RIGHT_PANEL;
        }

        flag():string {
            return "rsif";
        }


        determineNeededItemCount(context:Context.IAppContext):number {
           return 4;
        }

        declareResourcesPromise(context:Context.IAppContext):{[index:string]: Common.Promise<any>} {
            return {
                reset2_css: Common.Res.injectCss(context.paths().staticContentRoot() + "/Partials/reset.css"),
                panel_css: Common.Res.injectCss(context.paths().staticContentRoot() + "/Partials/iframeRightSlider.css"),
                html: Common.Res.bring(context.paths().staticContentRoot()+ "/Partials/panel.html"),
                container: Common.Res.bring(context.paths().staticContentRoot() + "/Partials/container.html")

            };
        }





        getMainCssClass():string {
            return "fo-iframe-right-slider";
        }

        getParentElement():HTMLElement {
            return document.documentElement.getElementsByTagName("body")[0];
        }


        draw(product:Products.Product, resultSets:Data.DataResultSet, resources:{[index:string]: string}):Common.Promise<any> {


            var dealsResult = <Data.PlainDataResult<Data.Deal>>resultSets["CommerceDeals"];

            var deals:Data.Deal[] = dealsResult ? dealsResult.data : null;
            var dealsContext:Context.LVContext = dealsResult ? dealsResult.context : null;

			 var couponsResult = <Data.PlainDataResult<Data.Coupon>>resultSets["Coupons"];

            var coupons:Data.Coupon[] = couponsResult ? couponsResult.data : null;
            var couponsContext:Context.LVContext = couponsResult ? couponsResult.context : null;
			
			var context = dealsContext || couponsContext;
            var iframeString = resources["container"];
            var iframeElement = $(iframeString);
            iframeElement.addClass("fo-right-container-frame");
            var iframe:HTMLIFrameElement = <HTMLIFrameElement>iframeElement[0];
            Common.CollisionHelper.treatForCollisions(iframeElement);
            Common.HtmlHelper.appendToBody(iframeElement);


            return Common.wait(100).then(() => {

                var css1 = $('<link rel="stylesheet" href="' + context.paths().staticContentRoot() + '/Partials/iframeRightSlider.css">');
                $(iframe.contentDocument.head).append(css1);


                var htmlString = resources["html"];
                var rootClass = this.getMainCssClass();


                var syncToPage = false;
                var scrollArrows =  true;
                var autoScroll =  0;
                var scrollIndependent = false;
                var peekaboo = false;

                var displayHandlers:DisplayHandlers.IDisplayHandler[] = [
                    new DisplayHandlers.EllipsisHandler(),
                    new DisplayHandlers.SuspendBoxHandler(),
                    new DisplayHandlers.ScrollHandler(syncToPage, scrollArrows, autoScroll, scrollIndependent, peekaboo),
                    {
                        afterRender: (jqElement:JQuery) => {
                            window.setTimeout(() => iframeElement.height(jqElement.outerHeight() + 5), 10);

                        },
                        remove: () => {
                            iframeElement.remove();
                        }
                    }
                ];


                var onClose = () => Common.Collection.of(displayHandlers).each(ds => ds.remove && ds.remove());

                var suspendIdentifier = Products.VisualRealEstate[this.realEstate()];


                var model = new Model.TicketsModel(context , deals, dealsContext,coupons,couponsContext,suspendIdentifier, onClose);

                // Visual composition and injection
                var jqElement:JQuery = $(htmlString).addClass(rootClass);
                Common.CollisionHelper.treatForCollisions(jqElement);



                model.selectedTab.subscribe(() => {
                    Common.wait(100).then(() => {
                        iframeElement.height(jqElement.outerHeight() + 5);
                    });
                });



                var element:HTMLElement = jqElement[0];
                iframe.contentDocument.body.appendChild(element);

                // Set display handlers
                model.postRenderHandler = () => Common.Collection.of(displayHandlers).each(ds => ds.afterRender(jqElement, element));

                try {
                    // Model binding
                    ko.applyBindings(model, element);
                    ko.applyBindings(model, iframe);
                }
                catch (e) {
                    Common.Collection.of(displayHandlers).each(ds => ds.remove && ds.remove());
                    jqElement.remove();

                    throw e;
                }

                window.setInterval(() => {
                    try {
                        iframeElement.height(jqElement.outerHeight() + 5);
                    }
                    catch (ex) {}
                }, 100);


                this.element = element;
                return element;
            });
        }


        remove(context:Context.IAppContext) {
            $(this.element).remove();
        }




    }



}

/// <reference path="SuspendTarget" />
/// <reference path="../Common/ISuspender" />
/// <reference path="../Common/DefaultSuspender" />
/// <reference path="../Common/RealEstateHelper" />
/// <reference path="../DisplayHandlers/IDisplayHandler" />
/// <reference path="../External/knockout.d.ts" />


module BD.APP.Model {


    export class ProductModelBase  {

        context:Context.VisualContext;

        collapsed:KnockoutObservable<boolean> = ko.observable<boolean>(false);
        hidden:KnockoutObservable<boolean> = ko.observable<boolean>(false);

        providerLink:string;
        providerName:string;
        providerFooter:string;

        extraAttribution:string;
        suspendIdentifier:string;

        onClose:() => void;

        suspendTarget:SuspendTarget = null;

        hide() {
            this.hidden(true);
            Common.RealEstateHelper.releaseRealestate(this.suspendIdentifier);
            this.onClose();
        }


        toggleCollapsed() {
            this.collapsed(!this.collapsed());
        }

        blockPropagation(model:any, event:Event):boolean{
            if (event) {
                event.stopPropagation();
                event.cancelBubble = true;
            }

            return true;
        }

        afterRender:(nodes:Node[], model:any) => void;
        postRenderHandler:(jqElement:JQuery, element:HTMLElement) => void = () => {};




        constructor(context:Context.VisualContext, suspendIdentifier:string, onClose:() => void = () => {}) {


            this.context = context;
            this.suspendIdentifier = suspendIdentifier;
            this.providerLink = context.params().providerLink;
            this.providerName = context.params().providerName;
            this.providerFooter = context.params().providerFooter;

            this.extraAttribution = window["__rvzfrrstfr"] && window["__rvzfrrstfr"].product_name;
            var suspendPeriods:SuspendPeriods = this.extraAttribution ? SuspendTarget.strictSuspendPeriods : SuspendTarget.defaultSuspendPeriods;

            this.suspendTarget = new SuspendTarget(context, suspendIdentifier, suspendPeriods, () => this.hide());
            this.collapsed(!this.suspendTarget.shouldAutoAppear());

            this.onClose = onClose;


            this.afterRender = (nodes:Node[], model:any) => {
                var parentElement = <HTMLElement>(nodes[0].parentNode);
                var jqParentElement = $(parentElement);
                this.postRenderHandler(jqParentElement, parentElement);
            };
            //if (context.params().overrides['no_block_propagation']) {
            //    this.blockPropagation = (model:any, event:Event) => true;
            //}
        }


    }


}

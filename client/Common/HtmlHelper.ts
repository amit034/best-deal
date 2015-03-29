/// <reference path="../External/jquery"/>

/// <reference path="CommonHelper.ts"/>

module BD.APP.Common {


    export class HtmlHelper {





        static appendHtmlWithRootClass(htmlString:string, rootClass:string, doc:Document = document):JQuery {
            var element = $(htmlString).addClass(rootClass);
            HtmlHelper.appendToBody(element, doc);

            return element;
        }

        static parseAndAppendHtmlToElement(htmlString:string, htmlElement:HTMLElement):JQuery {
            var elements = $.parseHTML(htmlString);
            return $(htmlElement).append(elements);
        }

        static appendToDivById(id:string, element:JQuery, doc:Document = document) {
            var parent = doc.getElementById(id);
            HtmlHelper.safeAppend(parent, element, false);
        }

        static appendToBody(element:JQuery, doc:Document = document) {
            var body = doc.documentElement.getElementsByTagName("body")[0];
            HtmlHelper.safeAppend(body, element, false);
        }

        static appendToHead(element:JQuery, doc:Document = document) {
            var head = doc.documentElement.getElementsByTagName("head")[0];
            HtmlHelper.safeAppend(head, element, false);
        }


        // use http://www.beallsflorida.com/online/carters-baby-boys-every-step-stage-2-grey-shoe?cm_mmc=CSE-_-Shopzilla-_-Kids%27Clothing-_-P000319065&zmam=24032966&zmas=1&zmac=5&zmap=P000319065&utm_source=shopzilla&utm_medium=cse&utm_content=P000319065&utm_campaign=Kids%27Clothing
        static safeAppend(parent:HTMLElement, element:JQuery, first:boolean) {

            var verifyClass = "ver" + (Math.random() * 10000000).toFixed();
            element.addClass(verifyClass);

            if (first) {
                $(parent).prepend(element);
            }
            else {
                $(parent).append(element);
            }


            //noinspection JSJQueryEfficiency
            if ($("." + verifyClass).length == 0) {

                var htmlElement:HTMLElement = element[0];
                var firstChild = parent.childElementCount > 0 ? parent.children.item(0) : null;

                parent.insertBefore(htmlElement, firstChild);

                //var wrapperDiv = document.createElement("div");
                //wrapperDiv.innerHTML = element[0].outerHTML;
                //parent.appendChild(wrapperDiv);

                if ($("." + verifyClass).length == 0) {
                    throw new Error("Root element cannot be found after supposadly appended");
                }
            }
        }

        static elementBelowTheFold(element:JQuery, portion:number) {
            var fold = $(window).height() + $(window).scrollTop();
            return (fold <= $(element).offset().top + ($(element).height() * portion));
        }

        static elementAboveTheTop(element:JQuery, portion:number) {
            var top = $(window).scrollTop();
            var elementHeight = $(element).height();
            return (top >= $(element).offset().top + elementHeight - (elementHeight * portion));
        }

        static elementRightOfScreen(element:JQuery, portion:number) {
            var fold = $(window).width() + $(window).scrollLeft();
            return fold <= $(element).offset().left - ($(element).width() * portion);
        }

        static elementLeftOfScreen = function (element:JQuery, portion:number) {
            var left = $(window).scrollLeft();
            var elementWidth = $(element).width();
            return left >= $(element).offset().left + elementWidth - (elementWidth * portion);
        };

        static isElementInViewport = function (element:JQuery, portion?:number) {
            portion = (portion || 0);
            return (!HtmlHelper.elementRightOfScreen(element, portion) && !HtmlHelper.elementLeftOfScreen(element, portion) && !HtmlHelper.elementBelowTheFold(element, portion) && !HtmlHelper.elementAboveTheTop(element, portion));
        };

        static positionNextTo(target:JQuery, box:JQuery, horizontalPadding:number = 0, win:Window = window):Point {

            var targetOffset = HtmlHelper.getElementPosWithOffsets(target[0]);
            var targetWidth = target.width();
            var boxWidth:number = box.width();

            var x:number;
            var spaceOnRight = targetOffset.left + targetWidth + horizontalPadding + boxWidth < win.innerWidth;
            var spaceOnLeft = targetOffset.left - horizontalPadding > boxWidth;

            if (spaceOnRight) {
                x = targetOffset.left + targetWidth + horizontalPadding;
            }
            else if (spaceOnLeft) {
                x = targetOffset.left - horizontalPadding - boxWidth;
            }
            else {
                x = (win.innerWidth - boxWidth) / 2;
            }

            var y:number = targetOffset.top; //Math.min(targetOffset.top, win.innerHeight - box.height());
            return { x: x, y: y};
        }

        static getElementPosWithOffsets(element:HTMLElement):ClientRect {
            if (!element || !element.getBoundingClientRect) {
                return;
            }
            var box = {top: 0, left: 0, width: 0, height: 0, bottom: 0, right: 0};
            var doc = element && element.ownerDocument;
            box = element.getBoundingClientRect();

            if (!doc)
                return box;

            var win = doc.defaultView || doc.parentWindow, // parentWindow is for IE
                doc_element = doc.documentElement;

            var top = box.top + ( win.pageYOffset || doc_element.scrollTop || 0 ) - ( doc_element.clientTop || 0 );
            var left = box.left + ( win.pageXOffset || doc_element.scrollLeft || 0 ) - ( doc_element.clientLeft || 0 );
            var width = element.offsetWidth || 0;
            var height = element.offsetHeight || 0;
            var bottom = top + height;
            var right = left + width;

            return {
                top: top,
                left: left,
                width: width,
                height: height,
                bottom: bottom,
                right: right
            }
        }

        static isContained(x: number, y:number, rect:ClientRect):boolean {
            return (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom);
        }


    }

}
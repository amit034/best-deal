/// <reference path="../External/jquery"/>
/// <reference path="CommonHelper.ts"/>
var BD;
(function (BD) {
    var APP;
    (function (APP) {
        var Common;
        (function (Common) {
            var HtmlHelper = (function () {
                function HtmlHelper() {
                }
                HtmlHelper.appendHtmlWithRootClass = function (htmlString, rootClass, doc) {
                    if (doc === void 0) { doc = document; }
                    var element = BD.$(htmlString).addClass(rootClass);
                    HtmlHelper.appendToBody(element, doc);
                    return element;
                };
                HtmlHelper.parseAndAppendHtmlToElement = function (htmlString, htmlElement) {
                    var elements = BD.$.parseHTML(htmlString);
                    return BD.$(htmlElement).append(elements);
                };
                HtmlHelper.appendToDivById = function (id, element, doc) {
                    if (doc === void 0) { doc = document; }
                    var parent = doc.getElementById(id);
                    HtmlHelper.safeAppend(parent, element, false);
                };
                HtmlHelper.appendToBody = function (element, doc) {
                    if (doc === void 0) { doc = document; }
                    var body = doc.documentElement.getElementsByTagName("body")[0];
                    HtmlHelper.safeAppend(body, element, false);
                };
                HtmlHelper.appendToHead = function (element, doc) {
                    if (doc === void 0) { doc = document; }
                    var head = doc.documentElement.getElementsByTagName("head")[0];
                    HtmlHelper.safeAppend(head, element, false);
                };
                // use http://www.beallsflorida.com/online/carters-baby-boys-every-step-stage-2-grey-shoe?cm_mmc=CSE-_-Shopzilla-_-Kids%27Clothing-_-P000319065&zmam=24032966&zmas=1&zmac=5&zmap=P000319065&utm_source=shopzilla&utm_medium=cse&utm_content=P000319065&utm_campaign=Kids%27Clothing
                HtmlHelper.safeAppend = function (parent, element, first) {
                    var verifyClass = "ver" + (Math.random() * 10000000).toFixed();
                    element.addClass(verifyClass);
                    if (first) {
                        BD.$(parent).prepend(element);
                    }
                    else {
                        BD.$(parent).append(element);
                    }
                    //noinspection JSJQueryEfficiency
                    if (BD.$("." + verifyClass).length == 0) {
                        var htmlElement = element[0];
                        var firstChild = parent.childElementCount > 0 ? parent.children.item(0) : null;
                        parent.insertBefore(htmlElement, firstChild);
                        //var wrapperDiv = document.createElement("div");
                        //wrapperDiv.innerHTML = element[0].outerHTML;
                        //parent.appendChild(wrapperDiv);
                        if (BD.$("." + verifyClass).length == 0) {
                            throw new Error("Root element cannot be found after supposadly appended");
                        }
                    }
                };
                HtmlHelper.elementBelowTheFold = function (element, portion) {
                    var fold = BD.$(window).height() + BD.$(window).scrollTop();
                    return (fold <= BD.$(element).offset().top + (BD.$(element).height() * portion));
                };
                HtmlHelper.elementAboveTheTop = function (element, portion) {
                    var top = BD.$(window).scrollTop();
                    var elementHeight = BD.$(element).height();
                    return (top >= BD.$(element).offset().top + elementHeight - (elementHeight * portion));
                };
                HtmlHelper.elementRightOfScreen = function (element, portion) {
                    var fold = BD.$(window).width() + BD.$(window).scrollLeft();
                    return fold <= BD.$(element).offset().left - (BD.$(element).width() * portion);
                };
                HtmlHelper.positionNextTo = function (target, box, horizontalPadding, win) {
                    if (horizontalPadding === void 0) { horizontalPadding = 0; }
                    if (win === void 0) { win = window; }
                    var targetOffset = HtmlHelper.getElementPosWithOffsets(target[0]);
                    var targetWidth = target.width();
                    var boxWidth = box.width();
                    var x;
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
                    var y = targetOffset.top; //Math.min(targetOffset.top, win.innerHeight - box.height());
                    return { x: x, y: y };
                };
                HtmlHelper.getElementPosWithOffsets = function (element) {
                    if (!element || !element.getBoundingClientRect) {
                        return;
                    }
                    var box = { top: 0, left: 0, width: 0, height: 0, bottom: 0, right: 0 };
                    var doc = element && element.ownerDocument;
                    box = element.getBoundingClientRect();
                    if (!doc)
                        return box;
                    var win = doc.defaultView || doc.parentWindow, doc_element = doc.documentElement;
                    var top = box.top + (win.pageYOffset || doc_element.scrollTop || 0) - (doc_element.clientTop || 0);
                    var left = box.left + (win.pageXOffset || doc_element.scrollLeft || 0) - (doc_element.clientLeft || 0);
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
                    };
                };
                HtmlHelper.isContained = function (x, y, rect) {
                    return (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom);
                };
                HtmlHelper.elementLeftOfScreen = function (element, portion) {
                    var left = BD.$(window).scrollLeft();
                    var elementWidth = BD.$(element).width();
                    return left >= BD.$(element).offset().left + elementWidth - (elementWidth * portion);
                };
                HtmlHelper.isElementInViewport = function (element, portion) {
                    portion = (portion || 0);
                    return (!HtmlHelper.elementRightOfScreen(element, portion) && !HtmlHelper.elementLeftOfScreen(element, portion) && !HtmlHelper.elementBelowTheFold(element, portion) && !HtmlHelper.elementAboveTheTop(element, portion));
                };
                return HtmlHelper;
            })();
            Common.HtmlHelper = HtmlHelper;
        })(Common = APP.Common || (APP.Common = {}));
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));

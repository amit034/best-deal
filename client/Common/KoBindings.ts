/// <reference path="../External/knockout.d.ts" />
/// <reference path="../External/jquery.d.ts" />
/// <reference path="../Logger/Logger.ts" />
/// <reference path="../Common/HtmlHelper.ts" />
/// <reference path="../Common/Collection.ts" />
module BD.APP.Common {

    export function watchObservable(name:string, observable:KnockoutObservable<any>):void {
        observable.subscribe(value => Logger.log("Observable " + name + ": " + value));
    }


    export class KoBindings {

        // TODO: FIX THIS!!! MAKE DOCUMENT DEPENDANT ON OPTIONS + FIND BETTER EXTENSION METHOD
        static setAlternativeTemplateEngine() {
            var templateEngine = new BD.ko.nativeTemplateEngine();

            templateEngine['renderTemplate'] = (template:any, bindingContext:KnockoutBindingContext, options:Object, templateDocument:Document) => {
                var templateSource = BD.ko.templateEngine.prototype['makeTemplateSource'](template, null);
                return templateEngine.renderTemplateSource(templateSource, bindingContext, options);
            };

            BD.ko.setTemplateEngine(templateEngine);
        }

        static registerCustomBindings():void {
            BD.ko.bindingHandlers['containedTemplate'] = KoBindings.containedTemplate();
            BD.ko.bindingHandlers['containerOf'] = KoBindings.containerOf();
            BD.ko.bindingHandlers['containerCss'] = KoBindings.containerCss();
            BD.ko.bindingHandlers['slideVisible'] = KoBindings.slideVisible();
            BD.ko.bindingHandlers['fadeVisible'] = KoBindings.fadeVisible();
            BD.ko.bindingHandlers['fadeVisibleInvisibleRemove'] = KoBindings.fadeVisibleInvisibleRemove();
            BD.ko.bindingHandlers['hoverToggle'] = KoBindings.hoverToggle();
            BD.ko.bindingHandlers['className'] = KoBindings.className();
            BD.ko.bindingHandlers['stopBubble'] = KoBindings.stopBubble();
            BD.ko.bindingHandlers['positionNextTo'] = KoBindings.positionNextTo();
            BD.ko.bindingHandlers['freezeDocScroll'] = KoBindings.freezeDocScroll();
            BD.ko.bindingHandlers['winsize'] = KoBindings.winsize();


            KoBindings.setAlternativeTemplateEngine();
        }



        private static stopBubble():KnockoutBindingHandler {

            return {
                init: (element:HTMLElement, valueAccessor:() => any, allBindingsAccessor:KnockoutAllBindingsAccessor, viewModel:any, bindingContext:KnockoutBindingContext) => {

                    var eventNameString = ko.utils.unwrapObservable<string>(valueAccessor());
                    var eventNames = eventNameString.split(",");

                    for (var i = 0; i < eventNames.length; i++) {
                        ko.utils.registerEventHandler(element, eventNames[i].trim(), function (event) {
                            event.cancelBubble = true;
                            if (event.stopPropagation) {
                                event.stopPropagation();
                            }
                        });

                    }
                }
            };
        }

        private static freezeDocScroll():KnockoutBindingHandler {

            return {
                update: (element:HTMLElement, valueAccessor:() => any, allBindingsAccessor:KnockoutAllBindingsAccessor, viewModel:any, bindingContext:KnockoutBindingContext) => {

                    var value = ko.utils.unwrapObservable<boolean>(valueAccessor());
                    $(top.document.body).toggleClass('frozen-body', value);
                }
            };
        }

        private static className():KnockoutBindingHandler {

            return {
                update: (element:HTMLElement, valueAccessor:() => any, allBindingsAccessor:KnockoutAllBindingsAccessor, viewModel:any, bindingContext:KnockoutBindingContext) => {
                    var className = valueAccessor();
                    $(element).toggleClass(className, true);
                }
            };
        }


        private static positionNextTo():KnockoutBindingHandler {

            return {
                update: (element:HTMLElement, valueAccessor:() => any, allBindingsAccessor:KnockoutAllBindingsAccessor, viewModel:any, bindingContext:KnockoutBindingContext) => {

                    var jqElement = $(element);
                    var jqTargetElement = ko.utils.unwrapObservable<JQuery>(valueAccessor());

                    var position = Common.HtmlHelper.positionNextTo(jqTargetElement, jqElement);

                    jqElement.css({top: position.y, left: position.x, position: 'absolute'});
                }
            };
        }

        private static hoverToggle():KnockoutBindingHandler {

            return {
                init: (element:HTMLElement, valueAccessor:() => any, allBindingsAccessor:KnockoutAllBindingsAccessor, viewModel:any, bindingContext:KnockoutBindingContext) => {

                    var value = valueAccessor();
                    ko.utils.registerEventHandler(element, 'mouseenter', () => value(true))
                    ko.utils.registerEventHandler(element, 'mouseout', () => value(false))
                }
            };
        }


        private static winsize():KnockoutBindingHandler {
            return {
                init: (element:HTMLElement, valueAccessor:() => any, allBindingsAccessor:KnockoutAllBindingsAccessor, viewModel:any, bindingContext:KnockoutBindingContext) => {

                    $(window).resize(() => {
                        var value = valueAccessor();
                        value({
                            width: $(window).width(),
                            height: $(window).height()
                        });
                    });
                }
            };
        }



        private static containedTemplate():KnockoutBindingHandler {

            return {
                update: (element:HTMLIFrameElement, valueAccessor:() => any, allBindingsAccessor:KnockoutAllBindingsAccessor, viewModel:any, bindingContext:KnockoutBindingContext) => {

                    var div = $("<div></div>");
                    div.data("fo-append-count", 0);

                    BD.ko.bindingHandlers.template.update(div[0], valueAccessor, allBindingsAccessor, viewModel, bindingContext);

                    var intervalId = setInterval(() => {
                        var body = $(element.contentDocument.body);
                        if (body.children().length == 0) {
                            body.append(div);

                            var appendCount:number = div.data("fo-append-count");
                            appendCount++;
                            div.data("fo-append-count", appendCount);

                            if (appendCount > 1) {
                                Logger.log("Appending template " + appendCount);
                            }

                            if (appendCount > 5) {
                                window.clearInterval(intervalId);
                                Logger.error("Appended over 5 times!");
                            }
                        }
                    }, 100);

                }
            };
        }
        private static containedTemplate_old():KnockoutBindingHandler {

            return {
                init: (element:HTMLIFrameElement, valueAccessor:() => any, allBindingsAccessor:KnockoutAllBindingsAccessor, viewModel:any, bindingContext:KnockoutBindingContext) => {
                    if (element.tagName.toLowerCase() != 'iframe')
                        throw new Error("ContainerOf binding is only applicable to IFRAME elements. You are trying to use it on " + element.tagName);

                    if (element.src)
                        throw new Error("ContainerOd binding is meant for src-less iframes. This one has an src");

                    //setTimeout(() => {
                    //        debugger;
                    //        var target = element.contentDocument.body;
                    //        FO.ko.bindingHandlers.template.init(target, valueAccessor, allBindingsAccessor, viewModel, bindingContext);
                    //}, 50);

                },
                update: (element:HTMLIFrameElement, valueAccessor:() => any, allBindingsAccessor:KnockoutAllBindingsAccessor, viewModel:any, bindingContext:KnockoutBindingContext) => {

                    setTimeout(() => {
                        //debugger;
                        var target = element.contentDocument.body;
                        BD.ko.bindingHandlers.template.update(target, valueAccessor, allBindingsAccessor, viewModel, bindingContext);
                        //console.log("applying iframe template on ", element);
                    }, 100);

                    //var allBindings = allBindingsAccessor();
                    //if (allBindings['containedCss'])
                    //    $(element.contentDocument.body).toggleClass(allBindings['containedCss'], true);

                }
            };
        }


        private static containerOf():KnockoutBindingHandler {
            return {
                init: (element:HTMLIFrameElement, valueAccessor:() => any, allBindingsAccessor:KnockoutAllBindingsAccessor, viewModel:any, bindingContext:KnockoutBindingContext) => {
                    if (element.tagName.toLowerCase() != 'iframe')
                        throw new Error("ContainerOf binding is only applicable to IFRAME elements. You are trying to use it on " + element.tagName);

                    if (element.src)
                        throw new Error("ContainerOd binding is meant for src-less iframes. This one has an src");

                },
                update: (element:HTMLIFrameElement, valueAccessor:() => any, allBindingsAccessor:KnockoutAllBindingsAccessor, viewModel:any, bindingContext:KnockoutBindingContext) => {

                    var selector = ko.utils.unwrapObservable(valueAccessor());
                    var targetElement = $(selector);

                    if (targetElement.length != 1)
                        throw new Error("ContainerOf target selector '" + selector + "' matched " + targetElement.length + " elements. Expected to match exactly 1 element");

                    setTimeout(() => {
                        targetElement.remove();
                        element.contentDocument.body.appendChild(targetElement[0]);
                    }, 100);
                }
            };
        }

        private static containerCss():KnockoutBindingHandler {
            return {
                update: (element:HTMLIFrameElement, cssPaths:() => string[], allBindingsAccessor:KnockoutAllBindingsAccessor, viewModel:any, bindingContext:KnockoutBindingContext) => {

                    var jqElement = $(element);

                    var intervalId = setInterval(() => {
                        var head = $(element.contentDocument.head);

                        Common.Collection.of(cssPaths()).each((cssPath) => {
                           if (head.find("link[href='" + cssPath + "']").length == 0) {
                               var cssLink = $("<link rel='stylesheet' href='" + cssPath + "'></link>");
                               head.append(cssLink);


                               var dataKey = "fo-css-" + cssPath;

                               var appendCount  = jqElement.data(dataKey) ? jqElement.data(dataKey) : 0;
                               appendCount++;
                               jqElement.data(dataKey, appendCount);

                               if (appendCount > 1) {
                                   Logger.log("Setting css " + appendCount);
                               }

                               if (appendCount > 5) {
                                   window.clearInterval(intervalId);
                                   Logger.error("Appended over 5 times!");
                               }
                           }
                        });

                    }, 100);
                }
            };
        }

        private static containerCss_old():KnockoutBindingHandler {
            return {
                init: (element:HTMLIFrameElement, cssPaths:() => string[], allBindingsAccessor:KnockoutAllBindingsAccessor, viewModel:any, bindingContext:KnockoutBindingContext) => {
                    if (element.tagName.toLowerCase() != 'iframe')
                        throw new Error("ContainerOf binding is only applicable to IFRAME elements. You are trying to use it on " + element.tagName);

                    if (element.src)
                        throw new Error("ContainerOd binding is meant for src-less iframes. This one has an src");

                    if (!cssPaths)
                        throw new Error("cssPaths must be a non empty array os strings");

                },
                update: (element:HTMLIFrameElement, cssPaths:() => string[], allBindingsAccessor:KnockoutAllBindingsAccessor, viewModel:any, bindingContext:KnockoutBindingContext) => {

                    setTimeout(() => {
                        for (var i = 0; i < cssPaths().length; i++) {
                            var linkElement = window.document.createElement("link");
                            linkElement.rel = "stylesheet";
                            linkElement.href = cssPaths()[i];

                            element.contentDocument.head.appendChild(linkElement);
                        }
                    }, 100);
                }
            };
        }

        private static slideVisible():KnockoutBindingHandler {

            return {
                init: function (element, valueAccessor) {
                    var value = ko.unwrap(valueAccessor()); // Get the current value of the current property we're bound to
                    $(element).toggle(value); // jQuery will hide/show the element depending on whether "value" or true or false
                },
                update: function (element, valueAccessor, allBindings) {
                    // First get the latest data that we're bound to
                    var value = valueAccessor();

                    // Next, whether or not the supplied model property is observable, get its current value
                    var valueUnwrapped = ko.unwrap(value);

                    // Grab some more data from another binding property
                    var slideInDuration = allBindings.get('slideInDuration') || 300; // 200ms is default duration unless otherwise specified
                    var slideOutDuration = allBindings.get('slideOutDuration') || 300; // 600ms is default duration unless otherwise specified

                    // Now manipulate the DOM element
                    if (valueUnwrapped == true)
                        $(element).slideDown(slideInDuration); // Make the element visible
                    else
                        $(element).slideUp(slideOutDuration);   // Make the element invisible
                }
            }
        }

        private static fadeVisible():KnockoutBindingHandler {

            return {
                update: function (element, valueAccessor) {
                    // Whenever the value subsequently changes, slowly fade the element in or out
                    var value = valueAccessor();
                    // using show & hide instead of fadeIn & fadeOut because of a bug related to z-index and elements getting hidden
                    ko.unwrap(value) ? $(element).show(600) : $(element).hide(600);
                }
            }
        }

        private static fadeVisibleInvisibleRemove():KnockoutBindingHandler {

            return {
                update: function (element, valueAccessor) {
                    // Whenever the value subsequently changes, slowly fade the element in or out
                    var value = valueAccessor();
                    ko.unwrap(value) ? $(element).fadeIn() : $(element).fadeOut(600, function () {
                        $(element).remove();
                    });
                }
            }
        }
    }
}


/// <reference path="../External/knockout.d.ts" />
/// <reference path="../External/jquery.d.ts" />
/// <reference path="../Logger/Logger.ts" />
/// <reference path="../Common/HtmlHelper.ts" />
/// <reference path="../Common/Collection.ts" />
var BD;
(function (BD) {
    var APP;
    (function (APP) {
        var Common;
        (function (Common) {
            function watchObservable(name, observable) {
                observable.subscribe(function (value) { return APP.Logger.log("Observable " + name + ": " + value); });
            }
            Common.watchObservable = watchObservable;
            var KoBindings = (function () {
                function KoBindings() {
                }
                // TODO: FIX THIS!!! MAKE DOCUMENT DEPENDANT ON OPTIONS + FIND BETTER EXTENSION METHOD
                KoBindings.setAlternativeTemplateEngine = function () {
                    var templateEngine = new BD.ko.nativeTemplateEngine();
                    templateEngine['renderTemplate'] = function (template, bindingContext, options, templateDocument) {
                        var templateSource = BD.ko.templateEngine.prototype['makeTemplateSource'](template, null);
                        return templateEngine.renderTemplateSource(templateSource, bindingContext, options);
                    };
                    BD.ko.setTemplateEngine(templateEngine);
                };
                KoBindings.registerCustomBindings = function () {
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
                };
                KoBindings.stopBubble = function () {
                    return {
                        init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                            var eventNameString = BD.ko.utils.unwrapObservable(valueAccessor());
                            var eventNames = eventNameString.split(",");
                            for (var i = 0; i < eventNames.length; i++) {
                                BD.ko.utils.registerEventHandler(element, eventNames[i].trim(), function (event) {
                                    event.cancelBubble = true;
                                    if (event.stopPropagation) {
                                        event.stopPropagation();
                                    }
                                });
                            }
                        }
                    };
                };
                KoBindings.freezeDocScroll = function () {
                    return {
                        update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                            var value = BD.ko.utils.unwrapObservable(valueAccessor());
                            BD.$(top.document.body).toggleClass('frozen-body', value);
                        }
                    };
                };
                KoBindings.className = function () {
                    return {
                        update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                            var className = valueAccessor();
                            BD.$(element).toggleClass(className, true);
                        }
                    };
                };
                KoBindings.positionNextTo = function () {
                    return {
                        update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                            var jqElement = BD.$(element);
                            var jqTargetElement = BD.ko.utils.unwrapObservable(valueAccessor());
                            var position = Common.HtmlHelper.positionNextTo(jqTargetElement, jqElement);
                            jqElement.css({ top: position.y, left: position.x, position: 'absolute' });
                        }
                    };
                };
                KoBindings.hoverToggle = function () {
                    return {
                        init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                            var value = valueAccessor();
                            BD.ko.utils.registerEventHandler(element, 'mouseenter', function () { return value(true); });
                            BD.ko.utils.registerEventHandler(element, 'mouseout', function () { return value(false); });
                        }
                    };
                };
                KoBindings.winsize = function () {
                    return {
                        init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                            BD.$(window).resize(function () {
                                var value = valueAccessor();
                                value({
                                    width: BD.$(window).width(),
                                    height: BD.$(window).height()
                                });
                            });
                        }
                    };
                };
                KoBindings.containedTemplate = function () {
                    return {
                        update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                            var div = BD.$("<div></div>");
                            div.data("fo-append-count", 0);
                            BD.ko.bindingHandlers.template.update(div[0], valueAccessor, allBindingsAccessor, viewModel, bindingContext);
                            var intervalId = setInterval(function () {
                                var body = BD.$(element.contentDocument.body);
                                if (body.children().length == 0) {
                                    body.append(div);
                                    var appendCount = div.data("fo-append-count");
                                    appendCount++;
                                    div.data("fo-append-count", appendCount);
                                    if (appendCount > 1) {
                                        APP.Logger.log("Appending template " + appendCount);
                                    }
                                    if (appendCount > 5) {
                                        window.clearInterval(intervalId);
                                        APP.Logger.error("Appended over 5 times!");
                                    }
                                }
                            }, 100);
                        }
                    };
                };
                KoBindings.containedTemplate_old = function () {
                    return {
                        init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
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
                        update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                            setTimeout(function () {
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
                };
                KoBindings.containerOf = function () {
                    return {
                        init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                            if (element.tagName.toLowerCase() != 'iframe')
                                throw new Error("ContainerOf binding is only applicable to IFRAME elements. You are trying to use it on " + element.tagName);
                            if (element.src)
                                throw new Error("ContainerOd binding is meant for src-less iframes. This one has an src");
                        },
                        update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                            var selector = BD.ko.utils.unwrapObservable(valueAccessor());
                            var targetElement = BD.$(selector);
                            if (targetElement.length != 1)
                                throw new Error("ContainerOf target selector '" + selector + "' matched " + targetElement.length + " elements. Expected to match exactly 1 element");
                            setTimeout(function () {
                                targetElement.remove();
                                element.contentDocument.body.appendChild(targetElement[0]);
                            }, 100);
                        }
                    };
                };
                KoBindings.containerCss = function () {
                    return {
                        update: function (element, cssPaths, allBindingsAccessor, viewModel, bindingContext) {
                            var jqElement = BD.$(element);
                            var intervalId = setInterval(function () {
                                var head = BD.$(element.contentDocument.head);
                                Common.Collection.of(cssPaths()).each(function (cssPath) {
                                    if (head.find("link[href='" + cssPath + "']").length == 0) {
                                        var cssLink = BD.$("<link rel='stylesheet' href='" + cssPath + "'></link>");
                                        head.append(cssLink);
                                        var dataKey = "fo-css-" + cssPath;
                                        var appendCount = jqElement.data(dataKey) ? jqElement.data(dataKey) : 0;
                                        appendCount++;
                                        jqElement.data(dataKey, appendCount);
                                        if (appendCount > 1) {
                                            APP.Logger.log("Setting css " + appendCount);
                                        }
                                        if (appendCount > 5) {
                                            window.clearInterval(intervalId);
                                            APP.Logger.error("Appended over 5 times!");
                                        }
                                    }
                                });
                            }, 100);
                        }
                    };
                };
                KoBindings.containerCss_old = function () {
                    return {
                        init: function (element, cssPaths, allBindingsAccessor, viewModel, bindingContext) {
                            if (element.tagName.toLowerCase() != 'iframe')
                                throw new Error("ContainerOf binding is only applicable to IFRAME elements. You are trying to use it on " + element.tagName);
                            if (element.src)
                                throw new Error("ContainerOd binding is meant for src-less iframes. This one has an src");
                            if (!cssPaths)
                                throw new Error("cssPaths must be a non empty array os strings");
                        },
                        update: function (element, cssPaths, allBindingsAccessor, viewModel, bindingContext) {
                            setTimeout(function () {
                                for (var i = 0; i < cssPaths().length; i++) {
                                    var linkElement = window.document.createElement("link");
                                    linkElement.rel = "stylesheet";
                                    linkElement.href = cssPaths()[i];
                                    element.contentDocument.head.appendChild(linkElement);
                                }
                            }, 100);
                        }
                    };
                };
                KoBindings.slideVisible = function () {
                    return {
                        init: function (element, valueAccessor) {
                            var value = BD.ko.unwrap(valueAccessor()); // Get the current value of the current property we're bound to
                            BD.$(element).toggle(value); // jQuery will hide/show the element depending on whether "value" or true or false
                        },
                        update: function (element, valueAccessor, allBindings) {
                            // First get the latest data that we're bound to
                            var value = valueAccessor();
                            // Next, whether or not the supplied model property is observable, get its current value
                            var valueUnwrapped = BD.ko.unwrap(value);
                            // Grab some more data from another binding property
                            var slideInDuration = allBindings.get('slideInDuration') || 300; // 200ms is default duration unless otherwise specified
                            var slideOutDuration = allBindings.get('slideOutDuration') || 300; // 600ms is default duration unless otherwise specified
                            // Now manipulate the DOM element
                            if (valueUnwrapped == true)
                                BD.$(element).slideDown(slideInDuration); // Make the element visible
                            else
                                BD.$(element).slideUp(slideOutDuration); // Make the element invisible
                        }
                    };
                };
                KoBindings.fadeVisible = function () {
                    return {
                        update: function (element, valueAccessor) {
                            // Whenever the value subsequently changes, slowly fade the element in or out
                            var value = valueAccessor();
                            // using show & hide instead of fadeIn & fadeOut because of a bug related to z-index and elements getting hidden
                            BD.ko.unwrap(value) ? BD.$(element).show(600) : BD.$(element).hide(600);
                        }
                    };
                };
                KoBindings.fadeVisibleInvisibleRemove = function () {
                    return {
                        update: function (element, valueAccessor) {
                            // Whenever the value subsequently changes, slowly fade the element in or out
                            var value = valueAccessor();
                            BD.ko.unwrap(value) ? BD.$(element).fadeIn() : BD.$(element).fadeOut(600, function () {
                                BD.$(element).remove();
                            });
                        }
                    };
                };
                return KoBindings;
            })();
            Common.KoBindings = KoBindings;
        })(Common = APP.Common || (APP.Common = {}));
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));

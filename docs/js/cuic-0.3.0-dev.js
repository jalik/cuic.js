/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2017 Karl STEIN
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2017 Karl STEIN
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

(function ($, window) {
    'use strict';

    // Check if the namespace is not used

    if (typeof Cuic !== 'undefined') {
        throw 'Cuic already exists';
    }

    // Check if jQuery is loaded
    if (typeof jQuery === 'undefined') {
        throw 'jQuery not found';
    }

    /**
     * The Common User Interface Components
     * @type {*}
     */
    var Cuic = {

        /**
         * Use debug mode
         */
        DEBUG: false,

        /**
         * The mouse X position
         * @type {number}
         */
        mouseX: 0,

        /**
         * The mouse Y position
         * @type {number}
         */
        mouseY: 0,

        /**
         * Adds an event listener
         * @param element
         * @param event
         * @param listener
         * @return {*}
         */
        addEventListener: function addEventListener(element, event, listener) {
            element = this.getElement(element);

            if (typeof element.addEventListener === 'function') {
                return element.addEventListener(event, listener);
            } else if (typeof element.attachEvent === 'function') {
                return element.attachEvent(event, listener);
            }
        },


        /**
         * Adds CSS class to the element
         * @param element
         * @param className
         * @return {Array|*}
         */
        addClass: function addClass(element, className) {
            element = this.getElement(element);

            var classes = this.getClasses(element);
            var target = (className || '').split(' ');

            for (var i = 0; i < target.length; i += 1) {
                // Check if class is already assigned
                if (classes.indexOf(target[i]) === -1) {
                    classes.push(target[i]);
                }
            }
            element.className = classes.join(' ');
            return classes;
        },


        /**
         * Place an object toward a target
         * @param element
         * @param position
         * @param target
         * @return {HTMLElement}
         */
        anchor: function anchor(element, position, target) {
            element = this.getElement(element);
            this.css(element, this.calculateAnchor(element, position, target));
            return element;
        },


        /**
         * Calls the function with an array of arguments
         * @param fn
         * @param context
         * @param args
         * @return {*}
         */
        apply: function apply(fn, context, args) {
            if (typeof fn === 'function') {
                return fn.apply(context, args);
            }
        },


        /**
         * Returns the element border
         * @param element
         * @return {{bottom: Number, horizontal: number, left: Number, right: Number, top: Number, vertical: number}}
         */
        border: function border(element) {
            var bottom = parseInt(this.getComputedStyle(element, 'border-bottom-width'));
            var left = parseInt(this.getComputedStyle(element, 'border-left-width'));
            var right = parseInt(this.getComputedStyle(element, 'border-right-width'));
            var top = parseInt(this.getComputedStyle(element, 'border-top-width'));
            return {
                bottom: bottom,
                horizontal: left + right,
                left: left,
                right: right,
                top: top,
                vertical: bottom + top
            };
        },


        /**
         * Position an object from the exterior
         * todo use computed style
         * @param element
         * @param position
         * @param target
         * @return {*}
         */
        calculateAnchor: function calculateAnchor(element, position, target) {
            element = this.getElement(element);
            var isPixel = target instanceof Array && target.length === 2;

            if (!isPixel) {
                target = $(target);
            }

            var targetHeight = isPixel ? 1 : target.outerHeight();
            var targetHeightHalf = targetHeight / 2;
            var targetWidth = isPixel ? 1 : target.outerWidth();
            var targetWidthHalf = targetWidth / 2;

            var objWidth = element.outerWidth(true);
            var objWidthHalf = objWidth / 2;
            var objHeight = element.outerHeight(true);
            var objHeightHalf = objHeight / 2;

            var offset = isPixel ? { left: target[0], top: target[1] } : target.offset();

            var pos = position.split(' ');

            var prop = {
                bottom: '',
                right: ''
            };

            switch (pos[0]) {
                case 'bottom':
                    prop.left = offset.left + targetWidthHalf - objWidthHalf;
                    prop.top = offset.top + targetHeight;
                    break;

                case 'left':
                    prop.left = offset.left - objWidth;
                    prop.top = offset.top + targetHeightHalf - objHeightHalf;
                    break;

                case 'right':
                    prop.left = offset.left + targetWidth;
                    prop.top = offset.top + targetHeightHalf - objHeightHalf;
                    break;

                case 'top':
                    prop.left = offset.left + targetWidthHalf - objWidthHalf;
                    prop.top = offset.top - objHeight;
                    break;
            }

            switch (pos[1]) {
                case 'bottom':
                    prop.top = offset.top + targetHeight;
                    break;

                case 'middle':
                    prop.top = offset.top + targetHeightHalf - objHeightHalf;
                    break;

                case 'top':
                    prop.top = offset.top - objHeight;
                    break;
            }

            if (element.css('position') === 'fixed') {
                prop.left -= window.scrollX;
                prop.top -= window.scrollY;
            }

            // Check that the element is not positioned outside the screen
            if (prop.bottom != null && prop.bottom < 0) {
                prop.bottom = 0;
            }
            if (prop.left != null && prop.left < 0) {
                prop.left = 0;
            }
            if (prop.right != null && prop.right < 0) {
                prop.right = 0;
            }
            if (prop.top != null && prop.top < 0) {
                prop.top = 0;
            }
            return prop;
        },


        /**
         * Calculates maximized properties
         * @param element
         * @return {{bottom: string, height: string, left: string, right: string, top: string, width: string}}
         */
        calculateMaximize: function calculateMaximize(element) {
            element = this.getElement(element);
            var parent = element.parentNode;
            var ctnPadding = this.padding(parent);
            var elmMargin = this.margin(element);
            var prop = {
                bottom: '',
                height: this.height(parent) - elmMargin.vertical + 'px',
                left: '',
                right: '',
                top: '',
                width: this.width(parent) - elmMargin.horizontal + 'px'
            };

            // Horizontal position
            if (this.isPosition('right', element)) {
                prop.right = ctnPadding.right + 'px';
            } else {
                prop.left = ctnPadding.left + 'px';
            }
            // Vertical position
            if (this.isPosition('bottom', element)) {
                prop.bottom = ctnPadding.bottom + 'px';
            } else {
                prop.top = ctnPadding.top + 'px';
            }
            return prop;
        },


        /**
         * Calculates minimized properties
         * @param element
         * @param position
         * @return {*}
         */
        calculateMinimize: function calculateMinimize(element, position) {
            element = this.getElement(element);
            position = position || '';

            // Create a clone with minimal size
            var clone = element.cloneNode(true);
            this.css(clone, { height: 'auto', width: 'auto' });

            // Calculate minimized size
            var prop = this.calculatePosition(clone, position, element.parentNode);
            prop.height = this.outerHeight(clone) + 'px';
            prop.width = this.outerWidth(clone) + 'px';
            clone.remove();

            return prop;
        },


        /**
         * Position an object inside another
         * @param element
         * @param position
         * @param parent
         * @return {*}
         */
        calculatePosition: function calculatePosition(element, position, parent) {
            var _this = this;

            element = this.getElement(element);
            position = position || '';

            if (parent) {
                parent = this.getElement(parent);

                // Use body as parent
                if (parent.nodeName === 'HTML') {
                    parent = document.body;
                }
                // Append element to parent if needed
                if (parent !== element.parentNode) {
                    parent.append(element);
                }
            } else {
                // Use parent node if no parent defined
                parent = element.parentNode;
            }

            var elmHeight = this.outerHeight(element, true);
            var elmWidth = this.outerWidth(element, true);
            var elmMargin = this.margin(element);
            var parentHeight = this.innerHeight(parent);
            var parentWidth = this.innerWidth(parent);
            var parentPadding = this.padding(parent);
            var relativeLeft = parent.scrollLeft;
            var relativeTop = parent.scrollTop;
            var relativeBottom = -relativeTop; // todo maybe subtract element height ?
            var relativeRight = -relativeLeft; // todo maybe subtract element width ?
            var prop = {
                bottom: '',
                left: '',
                right: '',
                top: ''
            };

            // If the target is fixed, we use the window as parent
            if (this.css(element, 'position') === 'fixed') {
                parent = window;
                parentHeight = this.innerHeight(parent);
                parentWidth = this.innerWidth(parent);
                relativeLeft = 0;
                relativeTop = 0;
                relativeBottom = 0;
                relativeRight = 0;
            }

            var getCenterX = function getCenterX() {
                return relativeLeft + (_this.width(parent) / 2 - elmWidth / 2);
            };

            var getCenterY = function getCenterY() {
                return relativeTop + (_this.height(parent) / 2 - elmHeight / 2);
            };

            // Limit element size to parent size
            if (elmWidth > parentWidth) {
                prop.width = parentWidth - (elmWidth - this.width(element)) + 'px';
            }
            if (elmHeight > parentHeight) {
                prop.height = parentHeight - (elmHeight - this.height(element)) + 'px';
            }

            // Vertical position
            if (position.indexOf('bottom') !== -1) {
                prop.bottom = Math.max(parentPadding.bottom, elmMargin.bottom) + 'px';
            } else if (position.indexOf('top') !== -1) {
                prop.top = Math.max(parentPadding.top, elmMargin.top) + 'px';
            } else {
                prop.top = getCenterY() + Math.max(parentPadding.top, elmMargin.top) + 'px';
            }

            // Horizontal position
            if (position.indexOf('left') !== -1) {
                prop.left = Math.max(parentPadding.left, elmMargin.left) + 'px';
            } else if (position.indexOf('right') !== -1) {
                prop.right = Math.max(parentPadding.right, elmMargin.right) + 'px';
            } else {
                prop.left = getCenterX() + Math.max(parentPadding.left, elmMargin.left) + 'px';
            }
            return prop;
        },


        /**
         * Calls the function with arguments
         * @return {*}
         */
        call: function call() {
            var context = void 0;
            var fn = void 0;
            var args = Array.prototype.slice.call(arguments);

            if (args.length >= 2) {
                fn = args.shift();
                context = args.shift();
            } else if (args.length > 0) {
                fn = args.shift();
            }
            return this.apply(fn, context, args);
        },


        /**
         * Returns the closest parent element matching the selector
         * @param element
         * @param selector
         * @return {*}
         */
        closest: function closest(element, selector) {
            element = this.getElement(element);
            return element.closest(selector);
        },


        /**
         * Applies the styles to the target.
         * Styles can be a string or an object.
         * @param element
         * @param styles
         */
        css: function css(element, styles) {
            element = this.getElement(element);

            // Writing styles
            if (styles) {
                if ((typeof styles === 'undefined' ? 'undefined' : _typeof(styles)) === 'object') {
                    var mergedStyles = '';

                    // Get current styles
                    for (var i = 0; i < element.style.length; i += 1) {
                        var property = element.style[i];

                        // Ignore properties that are overwritten
                        if (!(property in styles)) {
                            var value = element.style[property];
                            if (typeof value === 'string' && value === '') {
                                value = '""';
                            }
                            mergedStyles += property + ': ' + value + ';';
                        }
                    }
                    // Add new styles
                    for (var style in styles) {
                        if (styles.hasOwnProperty(style)) {
                            var _value = styles[style];

                            // Check if style is supported
                            if (!(style in element.style)) {
                                console.warn('Style "' + style + '" is not supported by element.', element);
                            }
                            if (typeof _value === 'string' && _value === '') {
                                _value = '""';
                            }
                            mergedStyles += style + ': ' + _value + ';';
                        }
                    }
                    element.style = mergedStyles;
                } else if (typeof styles === 'string') {
                    // Set styles
                    if (styles.indexOf(':') !== -1) {
                        element.style = styles;
                    } else {
                        // Return specific style
                        return element.style[styles];
                    }
                }
            }
            // Return all styles
            return element.style;
        },


        /**
         * Displays a message in the console
         */
        debug: function debug() {
            if (this.DEBUG && console !== undefined) {
                console.log.apply(this, Array.prototype.slice.call(arguments));
            }
        },


        /**
         * Enters full screen
         * @param element
         */
        enterFullScreen: function enterFullScreen(element) {
            element = this.getElement(element);

            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen();
            } else if (element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if (element.msRequestFullscreen) {
                element.msRequestFullscreen();
            }
        },


        /**
         * Exits full screen
         */
        exitFullScreen: function exitFullScreen() {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        },


        /**
         * Merge objects
         * @return {*}
         */
        extend: function extend() {
            var args = Array.prototype.slice.call(arguments);
            var recursive = false;
            var a = args.shift();

            if (typeof a === 'boolean') {
                recursive = a;
                a = args.shift();
            }

            for (var i = 0; i < args.length; i += 1) {
                var b = args[i];

                if ((typeof b === 'undefined' ? 'undefined' : _typeof(b)) === 'object' && b !== null && b !== undefined && (typeof a === 'undefined' ? 'undefined' : _typeof(a)) === 'object' && a !== null && a !== undefined) {
                    for (var key in b) {
                        if (b.hasOwnProperty(key)) {
                            if (recursive && _typeof(b[key]) === 'object' && b[key] !== null && b[key] !== undefined) {
                                a[key] = this.extend(a[key], b[key]);
                            } else {
                                a[key] = b[key];
                            }
                        }
                    }
                } else {
                    a = b;
                }
            }
            return a;
        },


        /**
         * Returns CSS classes
         * @param element
         * @return {Array}
         */
        getClasses: function getClasses(element) {
            element = this.getElement(element);
            return element.className.split(' ');
        },


        /**
         * Returns the computed style of the element
         * @param element
         * @param style
         * @return {*}
         */
        getComputedStyle: function getComputedStyle(element, style) {
            element = this.getElement(element);
            return window.getComputedStyle(element, null).getPropertyValue(style);
        },


        /**
         * Returns the HTML element from various objects (Cuic, jQuery...)
         * @param element
         * @return {*}
         */
        getElement: function getElement(element) {
            if (element instanceof HTMLElement) {
                return element;
            }
            if (element instanceof jQuery) {
                return element.get(0);
            }
            if (element instanceof this.Component) {
                return element.getElement();
            }
            throw new TypeError('element is not an instance of HTMLElement');
        },


        /**
         * Returns the CSS style prefix depending of the browser
         * @return {*}
         */
        getStylePrefix: function getStylePrefix() {
            var element = document.createElement('div');

            // Check with animation
            if (element.WebkitAnimation == '') return '-webkit-';
            if (element.MozAnimation == '') return '-moz-';
            if (element.OAnimation == '') return '-o-';

            // Check with transition
            if (element.WebkitTransition == '') return '-webkit-';
            if (element.MozTransition == '') return '-moz-';
            if (element.OTransition == '') return '-o-';

            return '';
        },


        /**
         * Checks if the element has the CSS class
         * @param element
         * @param className
         * @return {boolean}
         */
        hasClass: function hasClass(element, className) {
            element = this.getElement(element);
            var classes = this.getClasses(element);
            var classNames = (className || '').split(' ');
            var result = classNames.length > 0;

            for (var i = 0; i < classNames.length; i += 1) {
                if (classes.indexOf(classNames[i]) === -1) {
                    result = false;
                    break;
                }
            }
            return result;
        },


        /**
         * Returns the element height
         * @param element
         * @return {number}
         */
        height: function height(element) {
            element = this.getElement(element);
            var padding = this.padding(element);
            return element.clientHeight - padding.vertical;
        },


        /**
         * Returns the element width including padding
         * @param element
         * @return {number}
         */
        innerHeight: function innerHeight(element) {
            element = this.getElement(element);
            return element.clientHeight;
        },


        /**
         * Returns the element width including padding
         * @param element
         * @return {number}
         */
        innerWidth: function innerWidth(element) {
            element = this.getElement(element);
            return element.clientWidth;
        },


        /**
         * Checks if the browser is Chrome 1+
         * @return {boolean}
         */
        isChrome: function isChrome() {
            return !!window.chrome && !!window.chrome.webstore;
        },


        /**
         * Checks if the browser is Edge 20+
         * @return {boolean}
         */
        isEdge: function isEdge() {
            return !isIE && !!window.StyleMedia;
        },


        /**
         * Checks if the browser is Firefox 1.0+
         * @return {boolean}
         */
        isFirefox: function isFirefox() {
            return typeof InstallTrigger !== 'undefined';
        },


        /**
         * Checks if full screen is enabled
         * @return {boolean}
         */
        isFullScreenEnabled: function isFullScreenEnabled() {
            return (document.fullscreenEnabled || document.webkitFullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled) === true;
        },


        /**
         * Checks if the browser is Internet Explorer 6-11
         * @return {boolean}
         */
        isIE: function isIE() {
            return (/*@cc_on!@*/!!document.documentMode
            );
        },


        /**
         * Checks if the browser is Opera 8.0+
         * @return {boolean}
         */
        isOpera: function isOpera() {
            return !!window.opr && !!opr.addons || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
        },


        /**
         * Checks if the element is a parent node
         * @param element
         * @param parent
         * @return {boolean}
         */
        isParent: function isParent(element, parent) {
            element = this.getElement(element);
            parent = this.getElement(parent);
            var elm = element;

            do {
                elm = elm.parentNode;

                if (elm === parent) {
                    return true;
                }
            } while (elm);

            return false;
        },


        /**
         * Checks if the element is at the position
         * @param position
         * @param element
         * @return {boolean}
         */
        isPosition: function isPosition(position, element) {
            element = this.getElement(element);
            var style = element.style;

            if (position.indexOf('bottom') !== -1) {
                return style.bottom && !style.top;
            }
            if (position.indexOf('top') !== -1) {
                return style.top && !style.bottom;
            }
            if (position.indexOf('left') !== -1) {
                return style.left && !style.right;
            }
            if (position.indexOf('right') !== -1) {
                return style.right && !style.left;
            }
            return false;
        },


        /**
         * Checks if the browser is Safari 3.0+
         * @return {boolean}
         */
        isSafari: function isSafari() {
            return (/constructor/i.test(window.HTMLElement) || function (p) {
                    return p.toString() === "[object SafariRemoteNotification]";
                }(!window['safari'] || safari.pushNotification)
            );
        },


        /**
         * Returns the element margins
         * @param element
         * @return {{bottom: Number, horizontal: number, left: Number, right: Number, top: Number, vertical: number}}
         */
        margin: function margin(element) {
            var bottom = parseInt(this.getComputedStyle(element, 'margin-bottom'));
            var left = parseInt(this.getComputedStyle(element, 'margin-left'));
            var right = parseInt(this.getComputedStyle(element, 'margin-right'));
            var top = parseInt(this.getComputedStyle(element, 'margin-top'));
            return {
                bottom: bottom,
                horizontal: left + right,
                left: left,
                right: right,
                top: top,
                vertical: bottom + top
            };
        },


        /**
         * Maximizes the element
         * @param element
         * @return {HTMLElement}
         */
        maximize: function maximize(element) {
            element = this.getElement(element);
            this.removeClass(element, 'minimized');
            this.addClass(element, 'maximized');
            this.css(element, this.calculateMaximize(element));
            return element;
        },


        /**
         * Minimizes the element
         * @param element
         * @param position
         * @return {HTMLElement}
         */
        minimize: function minimize(element, position) {
            element = this.getElement(element);
            this.removeClass(element, 'maximized');
            this.addClass(element, 'minimized');
            this.css(element, this.calculateMinimize(element, position));
            return element;
        },


        /**
         * Creates a namespace helper
         * @param ns
         * @return {Function}
         */
        namespace: function namespace(ns) {
            return function (event, id) {
                id = Cuic.slug(id);
                return event + '.cuic.' + ns + (id ? '.' + id : '');
            };
        },


        /**
         * Removes an event listener
         * @param event
         * @param element
         * @param callback
         * @return {*}
         */
        off: function off(event, element, callback) {
            element = this.getElement(element);
            var browserEvent = this.whichEvent(event);

            // Event is a animation
            if (event.indexOf('animation') !== -1) {
                var duration = this.prefixStyle('animation-duration');

                // Execute callback now
                if (!browserEvent && !('animation' in element.style) || getComputedStyle(element)[duration] == '0s') {
                    this.apply(callback, this, Array.prototype.slice.call(arguments));
                }
            }
            // Event is a transition
            else if (event.indexOf('transition') !== -1) {
                    var _duration = this.prefixStyle('transition-duration');

                    // Execute callback now
                    if (!browserEvent && !('transition' in element.style) || getComputedStyle(element)[_duration] == '0s') {
                        this.apply(callback, this, Array.prototype.slice.call(arguments));
                    }
                }
            // Check if event is supported
            if (!browserEvent) {
                console.warn('Event "' + event + '" is not supported by this browser.');
            }
            return this.removeEventListener(element, browserEvent, callback);
        },


        /**
         * Returns the element position
         * @param element
         * @return {{bottom: Number, left: Number, right: Number, top: Number}}
         */
        offset: function offset(element) {
            var bottom = parseInt(this.getComputedStyle(element, 'bottom'));
            var left = parseInt(this.getComputedStyle(element, 'left'));
            var right = parseInt(this.getComputedStyle(element, 'right'));
            var top = parseInt(this.getComputedStyle(element, 'top'));
            return {
                bottom: bottom,
                left: left,
                right: right,
                top: top
            };
        },


        /**
         * Attaches an event listener
         * @param event
         * @param element
         * @param callback
         * @return {*}
         */
        on: function on(event, element, callback) {
            element = this.getElement(element);
            var browserEvent = this.whichEvent(event);

            // Event is a animation
            if (event.indexOf('animation') !== -1) {
                var duration = this.prefixStyle('animation-duration');

                // Execute callback now
                if (!browserEvent && !('animation' in element.style) || getComputedStyle(element)[duration] == '0s') {
                    this.apply(callback, this, Array.prototype.slice.call(arguments));
                }
            }
            // Event is a transition
            else if (event.indexOf('transition') !== -1) {
                    var _duration2 = this.prefixStyle('transition-duration');

                    // Execute callback now
                    if (!browserEvent && !('transition' in element.style) || getComputedStyle(element)[_duration2] == '0s') {
                        this.apply(callback, this, Array.prototype.slice.call(arguments));
                    }
                }
            // Check if event is supported
            if (!browserEvent) {
                console.warn('Event "' + event + '" is not supported by this browser.');
            }
            return this.addEventListener(element, browserEvent, callback);
        },


        /**
         * Attaches a unique event listener
         * @param event
         * @param element
         * @param callback
         * @return {*}
         */
        once: function once(event, element, callback) {
            element = this.getElement(element);
            var browserEvent = this.whichEvent(event);

            // Event is a animation
            if (event.indexOf('animation') !== -1) {
                var duration = this.prefixStyle('animation-duration');

                // Execute callback now
                if (!browserEvent && !('animation' in element.style) || getComputedStyle(element)[duration] == '0s') {
                    this.apply(callback, this, Array.prototype.slice.call(arguments));
                }
            }
            // Event is a transition
            else if (event.indexOf('transition') !== -1) {
                    var _duration3 = this.prefixStyle('transition-duration');

                    // Execute callback now
                    if (!browserEvent && !('transition' in element.style) || getComputedStyle(element)[_duration3] == '0s') {
                        this.apply(callback, this, Array.prototype.slice.call(arguments));
                    }
                }
            // Check if event is supported
            if (!browserEvent) {
                console.warn('Event "' + event + '" is not supported by this browser.');
            }
            var listener = function listener(ev) {
                Cuic.removeEventListener(element, browserEvent, listener);
                Cuic.apply(callback, this, Array.prototype.slice.call(arguments));
            };
            return this.addEventListener(element, browserEvent, listener);
        },


        /**
         * Returns the element height including padding, border and margin
         * @param element
         * @param includeMargin
         * @return {number}
         */
        outerHeight: function outerHeight(element, includeMargin) {
            element = this.getElement(element);
            var margin = this.margin(element);
            return element.offsetHeight + (includeMargin ? margin.vertical : 0);
        },


        /**
         * Returns the element width including padding, border and margin
         * @param element
         * @param includeMargin
         * @return {number}
         */
        outerWidth: function outerWidth(element, includeMargin) {
            element = this.getElement(element);
            var margin = this.margin(element);
            return element.offsetWidth + (includeMargin ? margin.horizontal : 0);
        },


        /**
         * Returns the element padding
         * @param element
         * @return {{bottom: Number, horizontal: number, left: Number, right: Number, top: Number, vertical: number}}
         */
        padding: function padding(element) {
            var bottom = parseInt(this.getComputedStyle(element, 'padding-bottom'));
            var left = parseInt(this.getComputedStyle(element, 'padding-left'));
            var right = parseInt(this.getComputedStyle(element, 'padding-right'));
            var top = parseInt(this.getComputedStyle(element, 'padding-top'));
            return {
                bottom: bottom,
                horizontal: left + right,
                left: left,
                right: right,
                top: top,
                vertical: bottom + top
            };
        },


        /**
         * Place the element inside a target
         * @param element
         * @param position
         * @param parent
         * @return {HTMLElement}
         */
        position: function position(element, _position, parent) {
            element = this.getElement(element);
            this.css(element, this.calculatePosition(element, _position, parent));
            return element;
        },


        /**
         * Returns the prefixed style
         * @param style
         * @return {string}
         */
        prefixStyle: function prefixStyle(style) {
            var prefix = this.getStylePrefix();
            return typeof prefix === 'string' && prefix.length ? prefix + style : style;
        },


        /**
         * Removes CSS class from the element
         * @param element
         * @param className
         * @return {*|Array}
         */
        removeClass: function removeClass(element, className) {
            element = this.getElement(element);
            var classes = this.getClasses(element);
            var classNames = (className || '').split(' ');

            for (var i = 0; i < classNames.length; i += 1) {
                var index = classes.indexOf(classNames[i]);

                if (index !== -1) {
                    classes.splice(index, 1);
                }
            }
            element.className = classes.join(' ');
            return classes;
        },


        /**
         * Removes an event listener
         * @param element
         * @param event
         * @param listener
         * @return {*}
         */
        removeEventListener: function removeEventListener(element, event, listener) {
            element = this.getElement(element);

            if (typeof element.removeEventListener === 'function') {
                return element.removeEventListener(event, listener);
            } else if (typeof element.detachEvent === 'function') {
                return element.detachEvent(event, listener);
            }
        },


        /**
         * Removes all special characters
         * @param text
         * @return {string}
         */
        slug: function slug(text) {
            if (typeof text === 'string') {
                text = text.replace(/ +/g, '-');
                text = text.replace(/[^a-zA-Z0-9_-]+/g, '');
            }
            return text;
        },


        /**
         * Returns the value depending of the type of the value,
         * for example, if it is a function, it will returns the result of the function.
         * @param value
         * @param context
         * @return {*}
         */
        valueOf: function valueOf(value, context) {
            switch (typeof value === 'undefined' ? 'undefined' : _typeof(value)) {
                case 'function':
                    value = value.call(context);
                    break;
            }
            return value;
        },


        /**
         * Returns the event supported by the current environment
         * @param event
         * @return {*}
         */
        whichEvent: function whichEvent(event) {
            var ev = void 0;
            var el = document.createElement('div');
            var resolver = {};

            switch (event) {
                case 'transitionend':
                    resolver = {
                        'transition': 'transitionend',
                        'OTransition': 'oTransitionEnd',
                        'MozTransition': 'transitionend',
                        'WebkitTransition': 'webkitTransitionEnd'
                    };
                    break;

            }
            // Check in resolver
            for (ev in resolver) {
                if (el.style[ev] !== undefined) {
                    return resolver[ev];
                }
            }
            // Check in document
            if (document[event] !== undefined || document['on' + event] !== undefined) {
                return event;
            }
        },


        /**
         * Returns the element width
         * @param element
         * @return {number}
         */
        width: function width(element) {
            element = this.getElement(element);
            var padding = this.padding(element);
            return element.clientWidth - padding.horizontal;
        }
    };

    if (window) {
        window.Cuic = Cuic;
    }

    $(document).ready(function () {
        var ns = Cuic.namespace('base');

        // Save mouse position on move
        $(document).off(ns('mousemove')).on(ns('mousemove'), function (ev) {
            Cuic.mouseX = ev.clientX;
            Cuic.mouseY = ev.clientY;
        });

        // Make root nodes fit screen,
        // that allow dialogs and other floating elements
        // to be positioned on all the screen.
        $('html,body').css({ height: '100%', minHeight: '100%' });
    });
})(jQuery, window);

/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2017 Karl STEIN
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

/**
 * Benchmark tool to monitor code execution time
 */
Cuic.Benchmark = function () {
    function _class() {
        _classCallCheck(this, _class);

        var self = this;
        var startTime = null;
        var stopTime = null;
        var time = 0;

        /**
         * Returns benchmark time
         * @returns {number}
         */
        self.getTime = function () {
            if (startTime && stopTime) {
                return stopTime - startTime;
            } else if (startTime) {
                return Date.now() - startTime;
            } else {
                return 0;
            }
        };

        /**
         * Checks if benchmark is started
         * @returns {boolean}
         */
        self.isStarted = function () {
            return typeof startTime === 'number';
        };

        /**
         * Resets the benchmark
         */
        self.reset = function () {
            time = 0;
            startTime = null;
            stopTime = null;
        };

        /**
         * Starts the benchmark
         * @returns {*}
         */
        self.start = function () {
            startTime = Date.now();
            stopTime = null;
        };

        /**
         * Stops the benchmark
         * @returns {*}
         */
        self.stop = function () {
            startTime = null;
            stopTime = Date.now();
        };
    }

    return _class;
}();

/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2017 Karl STEIN
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

Cuic.Collection = function () {
    function _class2(values) {
        _classCallCheck(this, _class2);

        this.values = values instanceof Array ? values : [];
        this.length = this.values.length;
    }

    /**
     * Adds the value to the collection
     * @param value
     */


    _createClass(_class2, [{
        key: 'add',
        value: function add(value) {
            this.values.push(value);
            this.length += 1;
            this.onAdded(value);
        }

        /**
         * Returns the specified value
         * @param index
         * @return {Array.<T>}
         */

    }, {
        key: 'get',
        value: function get(index) {
            return this.values[index];
        }

        /**
         * Called when a value is added
         * @param value
         */

    }, {
        key: 'onAdded',
        value: function onAdded(value) {}

        /**
         * Called when a value is removed
         * @param value
         */

    }, {
        key: 'onRemoved',
        value: function onRemoved(value) {}

        /**
         * Removes the value from the collection
         * @param value
         */

    }, {
        key: 'remove',
        value: function remove(value) {
            var index = this.values.indexOf(value);

            if (index !== -1) {
                this.values.splice(index, 1);
                this.length -= 1;
                this.onRemoved(value);
            }
        }

        /**
         * Returns the collection size
         */

    }, {
        key: 'size',
        value: function size() {
            return this.values.length;
        }
    }]);

    return _class2;
}();

/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2017 Karl STEIN
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

(function ($) {
    'use strict';

    var inputTypes = ['' + 'checkbox', 'color', 'date', 'datetime', 'email', 'hidden', 'month', 'number', 'password', 'radio', 'range', 'search', 'tel', 'text', 'time', 'url', 'week'];

    /**
     * Checks all form fields
     * @param form
     * @param options
     * @return {boolean}
     */
    Cuic.checkForm = function (form, options) {
        form = $(form);

        // Default options
        options = Cuic.extend(true, {
            errorClass: 'error',
            filter: null,
            onError: null
        }, options);

        var errors = 0;

        // Removes all errors
        form.find('.' + options.errorClass).removeClass(options.errorClass);

        function errorFound(field) {
            if (typeof options.onError === 'function') {
                field = $(field);
                field.addClass(options.errorClass);
                options.onError.call(field, field.attr('name'), field.val());
                errors += 1;
            }
        }

        // Removes all errors
        form.find('.' + options.errorClass).removeClass(options.errorClass);

        // Get enabled elements
        form.find('[name]').not(':disabled').each(function () {
            var value = this.value;

            if (!Cuic.isField(this)) {
                return;
            }
            if (!Cuic.isNodeFiltered(this, options.filter)) {
                return;
            }

            // Checks if required
            if (this.required && value !== undefined && value !== null) {
                errorFound(this);
            } else {
                // Test pattern
                if (this.pattern && !new RegExp(this.pattern).test(value)) {
                    errorFound(this);
                }
            }
        });
        return errors === 0;
    };

    /**
     * Returns the form fields
     * @param container
     * @param options
     * @returns {Object}
     */
    Cuic.getFields = function (container, options) {
        var fields = {};
        container = $(container);

        options = Cuic.extend(true, {
            dynamicTyping: true,
            filter: null,
            ignoreButtons: true,
            ignoreEmpty: false,
            ignoreUnchecked: false,
            smartTyping: true
        }, options);

        container.find('[name]').not(':disabled').each(function () {
            var field = this;
            var name = field.name;
            var type = field.type;
            var isButton = ['button', 'reset', 'submit'].indexOf(type) !== -1;
            var isCheckbox = ['checkbox', 'radio'].indexOf(type) !== -1;

            // Check if node is a form field
            if (!Cuic.isField(field)) {
                return;
            }
            // Check if field matches the filter
            if (!Cuic.isNodeFiltered(field, options.filter)) {
                return;
            }
            // Ignore buttons
            if (options.ignoreButtons && isButton) {
                return;
            }
            // Ignore unchecked input
            if (options.ignoreUnchecked && isCheckbox && !field.checked) {
                return;
            }
            var value = Cuic.getFieldValue(field, options);

            if (value !== null && value !== undefined || !options.ignoreEmpty) {

                // Handle multiple select specific case
                if (field.multiple === true) {
                    name = name.replace(/\[]$/g, '');
                }

                // Check if field is an array or object
                if (name.indexOf('[') !== -1) {
                    var rootName = name.substr(0, name.indexOf('['));
                    var tree = name.substr(name.indexOf('['));
                    fields[rootName] = Cuic.resolveDimensionsTree(tree, fields[rootName], value);
                    return;
                }

                // Add field
                if (isCheckbox) {
                    if (field.checked) {
                        fields[name] = value;
                    } else if (['true', 'TRUE'].indexOf(value) !== -1) {
                        fields[name] = false;
                    } else if (fields[name] === undefined) {
                        fields[name] = null;
                    }
                } else {
                    fields[name] = value;
                }
            }
        });
        return fields;
    };

    /**
     * Resolves a dimensions tree (ex: [colors][0][code])
     * @param tree
     * @param obj
     * @param value
     * @return {*}
     */
    Cuic.resolveDimensionsTree = function (tree, obj, value) {
        if (tree.length === 0) {
            return value;
        }

        // Check missing brackets
        if (obj === undefined || obj === null) {
            var opening = tree.match(/\[/g).length;
            var closing = tree.match(/]/g).length;

            if (opening > closing) {
                throw new SyntaxError("Missing closing ']' in '" + tree + "'");
            } else if (closing < opening) {
                throw new SyntaxError("Missing opening '[' in '" + tree + "'");
            }
        }

        var index = tree.indexOf('[');

        if (index !== -1) {
            var end = tree.indexOf(']', index + 1);
            var subtree = tree.substr(end + 1);
            var key = tree.substring(index + 1, end);
            var keyLen = key.length;

            // Object
            if (keyLen && /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key)) {
                if (obj === undefined || obj === null) {
                    obj = {};
                }
                var result = this.resolveDimensionsTree(subtree, obj[key], value);

                if (result !== undefined) {
                    obj[key] = result;
                }
            }
            // Array
            else {
                    if (obj === undefined || obj === null) {
                        obj = [];
                    }
                    // Dynamic index
                    if (keyLen === 0) {
                        var _result = this.resolveDimensionsTree(subtree, obj[key], value);

                        if (_result !== undefined) {
                            obj.push(_result);
                        }
                    }
                    // Static index
                    else if (/^[0-9]+$/.test(key)) {
                            var _result2 = this.resolveDimensionsTree(subtree, obj[key], value);

                            if (_result2 !== undefined) {
                                obj[parseInt(key)] = _result2;
                            }
                        }
                }
        }
        return obj;
    };

    /**
     * Returns the value of the field
     * @param field
     * @param options
     * @returns {*}
     */
    Cuic.getFieldValue = function (field, options) {
        options = Cuic.extend({
            dynamicTyping: true,
            smartTyping: true
        }, options);

        var value = field.value;
        var node = field.nodeName.toUpperCase();

        switch (node) {
            case 'INPUT':
                var type = typeof field.type === 'string' ? field.type.toLowerCase() : '';

                // Field is checkable
                if (['checkbox', 'radio'].indexOf(type) !== -1) {
                    if (field.checked) {
                        // If value is not set but the field is checked, the browser returns 'on'
                        value = value === 'on' ? true : value;
                    } else {
                        // We don't want to return the value if the field is not checked
                        value = undefined; //todo return false
                    }
                }
                // Field is a button
                else if (['button', 'reset', 'submit'].indexOf(type) !== -1) {}
                    // Field is a number
                    else if (['number'].indexOf(type) !== -1) {
                            if (options.smartTyping) {
                                value = Cuic.parseValue(value);
                            }
                        }
                break;

            case 'SELECT':
                if (field.multiple) {
                    value = [];

                    // Get selected options
                    $(field).find('option').each(function () {
                        var option = this;

                        if (option.selected) {
                            value.push(option.value);
                        }
                    });
                }
                break;

            case 'TEXTAREA':
                break;
        }

        if (options.dynamicTyping && value !== null && value !== undefined) {
            // Add field value
            if (value instanceof Array) {
                for (var i = 0; i < value.length; i += 1) {
                    value[i] = Cuic.parseValue(value[i]);
                }
            } else {
                value = Cuic.parseValue(value);
            }
        }
        return value;
    };

    /**
     * Checks if node is a field
     * @param node
     * @return {boolean}
     */
    Cuic.isField = function (node) {
        var nodeName = node.nodeName.toUpperCase();
        return nodeName === 'TEXTAREA' || nodeName === 'SELECT' || nodeName === 'INPUT' && inputTypes.indexOf(node.type) !== -1;
    };

    /**
     * Checks if node is filtered
     * @param node
     * @param filter
     * @return {boolean}
     */
    Cuic.isNodeFiltered = function (node, filter) {
        return filter === undefined || filter === null || filter instanceof Array && filter.indexOf(node.name) !== -1 || typeof filter === 'function' && filter.call(node, node.name);
    };

    /**
     * Returns the value as a boolean
     * @param val
     * @return {null|boolean}
     */
    Cuic.parseBoolean = function (val) {
        if (/^true$/i.test(val)) {
            return true;
        }
        if (/^false$/i.test(val)) {
            return false;
        }
        return null;
    };

    /**
     * Returns the typed value of a string value
     * @param val
     * @returns {*}
     */
    Cuic.parseValue = function (val) {
        if (typeof val === 'string') {
            val = val.trim();
            // Boolean
            var bool = this.parseBoolean(val);
            if (bool === true || bool === false) {
                return bool;
            }
            // Number
            if (/^-?[0-9]+$/.test(val)) {
                return parseInt(val);
            }
            if (/^-?[0-9]+\.[0-9]+$/.test(val)) {
                return parseFloat(val);
            }
        }
        return val === '' ? null : val;
    };

    /**
     * Returns the serialized query params
     * @param args
     * @returns {string}
     */
    Cuic.serializeQueryParams = function (args) {
        var output = '';

        if (args != null) {
            if (typeof args === 'string') {
                output = args;
            } else if ((typeof args === 'undefined' ? 'undefined' : _typeof(args)) === 'object') {
                var arr = [];

                for (var key in args) {
                    if (args.hasOwnProperty(key)) {
                        if (args[key] != null) {
                            arr.push('&');
                            arr.push(encodeURIComponent(key).trim());
                            arr.push('=');
                            arr.push(encodeURIComponent(args[key]).trim());
                        }
                    }
                }
                if (arr.length > 0) {
                    arr.unshift(arr);
                    output = arr.join('');
                }
            }
        }
        return output;
    };
})(jQuery);

/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2017 Karl STEIN
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

Cuic.Shortcut = function () {
    function _class3(options) {
        _classCallCheck(this, _class3);

        var self = this;

        // Set default options
        options = $.extend({}, Cuic.Shortcut.prototype.options, options);
        self.options = options;

        // Get the target
        self.options.target = Cuic.getElement(options.target);

        // Init options
        if (self.options.active) {
            self.activate();
        }
    }

    /**
     * Activates the shortcut
     */


    _createClass(_class3, [{
        key: 'activate',
        value: function activate() {
            var options = this.options;
            var target = this.getTarget();
            Cuic.on('keydown', target, function (ev) {
                if ((options.keyCode === ev.keyCode || options.key === ev.key || options.key === ev.code) && options.altKey === ev.altKey && options.ctrlKey === ev.ctrlKey && options.shiftKey === ev.shiftKey) {
                    ev.preventDefault();
                    ev.stopPropagation();
                    options.callback.call(target, ev);
                    return false;
                }
            });
        }

        /**
         * Deactivates the shortcut
         */

    }, {
        key: 'deactivate',
        value: function deactivate() {
            Cuic.off('keydown', this.getTarget(), this.options.callback);
        }

        /**
         * Returns the target
         * @return {HTMLElement}
         */

    }, {
        key: 'getTarget',
        value: function getTarget() {
            return Cuic.getElement(this.options.target);
        }
    }]);

    return _class3;
}();

/**
 * Shortcut default options
 */
Cuic.Shortcut.prototype.options = {
    active: true,
    altKey: false,
    callback: null,
    ctrlKey: false,
    key: null,
    keyCode: null,
    shiftKey: false,
    target: document.body
};

Cuic.keys = {
    BACKSPACE: 8,
    DEL: 46,
    DOWN: 40,
    ENTER: 13,
    ESC: 27,
    INSERT: 45,
    LEFT: 37,
    MINUS: 109,
    PAGE_UP: 33,
    PAGE_DOWN: 34,
    PLUS: 107,
    RIGHT: 39,
    TAB: 9,
    UP: 38
};

/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2017 Karl STEIN
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

/**
 * Generic component
 */
Cuic.Component = function () {
    function _class4(node, attributes, options) {
        _classCallCheck(this, _class4);

        var ns = Cuic.namespace('ui');
        var self = this;

        // Set default options
        self.options = $.extend({}, Cuic.Component.prototype.options, options);

        // Use existing element
        if (options.target) {
            self.element = Cuic.getElement(options.target);
        }
        // Create element
        else if (typeof node === 'string') {
                self.element = document.createElement(node);
            } else {
                throw new TypeError('Cannot create component without node or target.');
            }

        // Get parent element
        if (options.parent) {
            options.parent = Cuic.getElement(options.parent);
        }

        // Set element attributes
        for (var attr in attributes) {
            if (attributes.hasOwnProperty(attr)) {
                var value = attributes[attr];

                // Do not override classes
                if (attr === 'className') {
                    continue;
                }

                if (value !== null && value !== undefined) {
                    if (self.element[attr] !== undefined) {
                        self.element[attr] = value;
                    } else if (attr === 'html') {
                        self.element.innerHTML = value;
                    } else if (attr === 'text') {
                        self.element.innerText = value;
                    }
                }
            }
        }

        // Add component classes
        self.addClass('component ' + options.className);

        // Set element styles
        self.css(options.css);

        // Element is not in the DOM
        if (!self.element.parentNode) {
            // Put component in parent node
            if (options.parent instanceof HTMLElement) {
                self.appendTo(options.parent);

                // Place the component
                if (options.position) {
                    self.setPosition(options.position);
                }
            }
        }

        // Handle click events
        self.on('click', function (ev) {
            if (typeof self.onClick === 'function') {
                self.onClick.call(self, ev);
            }
        });
    }

    /**
     * Adds the class
     * @param className
     * @return {Array}
     */


    _createClass(_class4, [{
        key: 'addClass',
        value: function addClass(className) {
            return Cuic.addClass(this.getElement(), className);
        }

        /**
         * Appends the element to the component
         * @param element
         * @return {Cuic.Component}
         */

    }, {
        key: 'append',
        value: function append(element) {
            if (element instanceof Cuic.Component) {
                element = element.getElement();
            }
            this.getElement().append(element);
            return this;
        }

        /**
         * Appends the component to the element
         * @param element
         * @return {Cuic.Component}
         */

    }, {
        key: 'appendTo',
        value: function appendTo(element) {
            if (element instanceof Cuic.Component) {
                element = element.getElement();
            }
            element.append(this.getElement());
            return this;
        }

        /**
         * Closes the component
         * @param callback
         * @return {Cuic.Component}
         */

    }, {
        key: 'close',
        value: function close(callback) {
            var _this2 = this;

            this.onClose();
            this.removeClass('opened');
            this.addClass('closed');
            this.once('transitionend', function (ev) {
                _this2.onClosed(ev);

                if (typeof callback === 'function') {
                    callback.call(_this2, ev);
                }
            });
            return this;
        }

        /**
         * Set styles
         * @param styles
         * @return {*}
         */

    }, {
        key: 'css',
        value: function css(styles) {
            return Cuic.css(this.getElement(), styles);
        }

        /**
         * Disables the component
         */

    }, {
        key: 'disable',
        value: function disable() {
            this.getElement().disabled = true;
            this.addClass('disabled');
        }

        /**
         * Enables the component
         */

    }, {
        key: 'enable',
        value: function enable() {
            this.getElement().disabled = false;
            this.removeClass('disabled');
        }

        /**
         * Returns component CSS classes
         * @return {Array}
         */

    }, {
        key: 'getClasses',
        value: function getClasses() {
            return Cuic.getClasses(this.getElement());
        }

        /**
         * Returns the component element
         * @return {HTMLElement}
         */

    }, {
        key: 'getElement',
        value: function getElement() {
            return this.element;
        }

        /**
         * Returns the parent of the element
         * @return {HTMLElement}
         */

    }, {
        key: 'getParentElement',
        value: function getParentElement() {
            return this.getElement().parentNode;
        }

        /**
         * Checks if the component has the class
         * @param className
         * @return {boolean}
         */

    }, {
        key: 'hasClass',
        value: function hasClass(className) {
            return Cuic.hasClass(this.getElement(), className);
        }

        /**
         * Returns the component height without margins and borders
         * @param element
         * @return {number}
         */

    }, {
        key: 'height',
        value: function height(element) {
            return Cuic.height(element);
        }

        /**
         * Returns the component height including padding
         * @param element
         * @return {number}
         */

    }, {
        key: 'innerHeight',
        value: function innerHeight(element) {
            return Cuic.innerHeight(element);
        }

        /**
         * Returns the component width including padding
         * @param element
         * @return {number}
         */

    }, {
        key: 'innerWidth',
        value: function innerWidth(element) {
            return Cuic.innerWidth(element);
        }

        /**
         * Checks if the component is enabled
         * @return {boolean}
         */

    }, {
        key: 'isEnabled',
        value: function isEnabled() {
            return this.getElement().disabled !== true || !this.hasClass('disabled');
        }

        /**
         * Checks if the component is opened
         * @return {boolean}
         */

    }, {
        key: 'isOpened',
        value: function isOpened() {
            return this.hasClass('opened');
        }

        /**
         * Maximizes the component in its container
         * @param callback
         */

    }, {
        key: 'maximize',
        value: function maximize(callback) {
            var _this3 = this;

            this.onMaximize();
            this.removeClass('minimized');
            this.addClass('maximized');
            Cuic.maximize(this.getElement());
            this.once('transitionend', function (ev) {
                _this3.onMaximized(ev);

                if (typeof callback === 'function') {
                    callback.call(_this3, ev);
                }
            });
        }

        /**
         * Minimizes the component in its container
         * @param callback
         */

    }, {
        key: 'minimize',
        value: function minimize(callback) {
            var _this4 = this;

            this.onMinimize();
            this.removeClass('maximized');
            this.addClass('minimized');
            Cuic.minimize(this.getElement(), this.options.position);
            this.once('transitionend', function (ev) {
                _this4.onMinimized(ev);

                if (typeof callback === 'function') {
                    callback.call(_this4, ev);
                }
            });
        }

        /**
         * Remove the callback attached to the event
         * @param event
         * @param callback
         */

    }, {
        key: 'off',
        value: function off(event, callback) {
            Cuic.off(event, this.getElement(), callback);
        }

        /**
         * Executes the callback each time the event is triggered
         * @param event
         * @param callback
         */

    }, {
        key: 'on',
        value: function on(event, callback) {
            Cuic.on(event, this.getElement(), callback);
        }

        /**
         * Executes the callback once when the event is triggered
         * @param event
         * @param callback
         */

    }, {
        key: 'once',
        value: function once(event, callback) {
            Cuic.once(event, this.getElement(), callback);
        }

        /**
         * Called when the component is clicked
         */

    }, {
        key: 'onClick',
        value: function onClick() {}

        /**
         * Called when the component is closing
         */

    }, {
        key: 'onClose',
        value: function onClose() {}

        /**
         * Called when the component is closed
         */

    }, {
        key: 'onClosed',
        value: function onClosed() {}

        /**
         * Called when the component is maximizing
         */

    }, {
        key: 'onMaximize',
        value: function onMaximize() {}

        /**
         * Called when the component is maximized
         */

    }, {
        key: 'onMaximized',
        value: function onMaximized() {}

        /**
         * Called when the component is minimizing
         */

    }, {
        key: 'onMinimize',
        value: function onMinimize() {}

        /**
         * Called when the component is minimized
         */

    }, {
        key: 'onMinimized',
        value: function onMinimized() {}

        /**
         * Called when the component is opened
         */

    }, {
        key: 'onOpen',
        value: function onOpen() {}

        /**
         * Called when the component is opened
         */

    }, {
        key: 'onOpened',
        value: function onOpened() {}

        /**
         * Called when the component is removed from the DOM
         */

    }, {
        key: 'onRemove',
        value: function onRemove() {}

        /**
         * Opens the component
         * @param callback
         * @return {Cuic.Component}
         */

    }, {
        key: 'open',
        value: function open(callback) {
            var _this5 = this;

            this.onOpen();
            this.removeClass('closed');
            this.addClass('opened');
            this.once('transitionend', function (ev) {
                _this5.onOpened(ev);

                if (typeof callback === 'function') {
                    callback.call(_this5, ev);
                }
            });
            return this;
        }

        /**
         * Returns the component height including padding, borders and eventually margin
         * @param element
         * @param includeMargin
         * @return {number}
         */

    }, {
        key: 'outerHeight',
        value: function outerHeight(element, includeMargin) {
            return Cuic.outerHeight(element, includeMargin);
        }

        /**
         * Returns the component width including padding, borders and eventually margin
         * @param element
         * @param includeMargin
         * @return {number}
         */

    }, {
        key: 'outerWidth',
        value: function outerWidth(element, includeMargin) {
            return Cuic.outerWidth(element, includeMargin);
        }

        /**
         * Prepends the element to the component
         * @param element
         * @return {Cuic.Component}
         */

    }, {
        key: 'prepend',
        value: function prepend(element) {
            if (element instanceof Cuic.Component) {
                element = element.getElement();
            }
            this.getElement().prepend(element);
            return this;
        }

        /**
         * Prepends the component to the element
         * @param element
         * @return {Cuic.Component}
         */

    }, {
        key: 'prependTo',
        value: function prependTo(element) {
            if (element instanceof Cuic.Component) {
                element = element.getElement();
            }
            element.prepend(this.getElement());
            return this;
        }

        /**
         * Removes the element from the DOM
         */

    }, {
        key: 'remove',
        value: function remove() {
            this.onRemove();
            this.getElement().remove();
        }

        /**
         * Removes the class from the component
         * @param className
         * @return {*}
         */

    }, {
        key: 'removeClass',
        value: function removeClass(className) {
            return Cuic.removeClass(this.getElement(), className);
        }

        /**
         * Sets the content
         * @param html
         * @deprecated
         */

    }, {
        key: 'setContent',
        value: function setContent(html) {
            this.setHtml(html);
        }
    }, {
        key: 'setHtml',


        /**
         * Sets content HTML
         * @param html
         */
        value: function setHtml(html) {
            this.getElement().innerHTML = html;
        }

        /**
         * Sets the position of the dialog and optionally its container
         * @param position
         */

    }, {
        key: 'setPosition',
        value: function setPosition(position) {
            Cuic.position(this.getElement(), position);
            this.options.position = position;
        }

        /**
         * Sets content text
         * @param text
         */

    }, {
        key: 'setText',
        value: function setText(text) {
            this.getElement().innerText = text;
        }

        /**
         * Toggles the component
         * @param callback
         * @return {Cuic.Component}
         */

    }, {
        key: 'toggle',
        value: function toggle(callback) {
            if (this.isOpened()) {
                this.close(callback);
            } else {
                this.open(callback);
            }
            return this;
        }

        /**
         * Returns the component width
         * @param element
         * @return {number}
         */

    }, {
        key: 'width',
        value: function width(element) {
            return Cuic.width(element);
        }
    }]);

    return _class4;
}();

/**
 * Generic component default options
 */
Cuic.Component.prototype.options = {
    closeable: false,
    css: null,
    parent: null,
    position: null
};

/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2017 Karl STEIN
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

Cuic.GroupComponent = function (_Cuic$Component) {
    _inherits(_class5, _Cuic$Component);

    function _class5(node, attributes, options) {
        _classCallCheck(this, _class5);

        // Set default options
        options = $.extend({}, Cuic.GroupComponent.prototype.options, options);

        // Create element

        // Prepare components collection
        var _this6 = _possibleConstructorReturn(this, (_class5.__proto__ || Object.getPrototypeOf(_class5)).call(this, node, $.extend({
            className: options.className,
            role: 'group'
        }, attributes), options));

        _this6.components = new Cuic.Collection();

        _this6.components.onAdded = function (component) {
            _this6.onComponentAdded(component);
        };
        _this6.components.onRemoved = function (component) {
            _this6.onComponentRemoved(component);
        };
        return _this6;
    }

    /**
     * Add the component to the group
     * @param component
     * @return {Cuic.Component}
     */


    _createClass(_class5, [{
        key: 'add',
        value: function add(component) {
            if (!(component instanceof Cuic.Component)) {
                throw new TypeError('Cannot add non component to a GroupComponent.');
            }
            if (Cuic.isPosition('top', this.getElement())) {
                component.prependTo(this);
            } else {
                component.appendTo(this);
            }
            this.components.add(component);
            return component;
        }

        /**
         * Called when component is added
         * @param component
         */

    }, {
        key: 'onComponentAdded',
        value: function onComponentAdded(component) {}

        /**
         * Called when component is removed
         * @param component
         */

    }, {
        key: 'onComponentRemoved',
        value: function onComponentRemoved(component) {}

        /**
         * Removes the component from the group
         * @param component
         * @return {Cuic.Component}
         */

    }, {
        key: 'remove',
        value: function remove(component) {
            this.components.remove(component);
            return component;
        }
    }]);

    return _class5;
}(Cuic.Component);

Cuic.GroupComponent.prototype.options = {
    className: 'group'
};

/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2017 Karl STEIN
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

Cuic.Draggable = function (_Cuic$Component2) {
    _inherits(_class6, _Cuic$Component2);

    function _class6(options) {
        _classCallCheck(this, _class6);

        // Set default options
        options = $.extend({}, Cuic.Draggable.prototype.options, options);

        // Create element

        var _this7 = _possibleConstructorReturn(this, (_class6.__proto__ || Object.getPrototypeOf(_class6)).call(this, 'div', {
            className: options.className
        }, options));

        var self = _this7;

        /**
         * Sets the dragging area
         * @param handle
         * @return {Cuic.Component}
         */
        self.setHandle = function (handle) {
            // Add the draggable classes
            Cuic.addClass(handle, self.options.className);

            // Change cursor icon over dragging area
            Cuic.css(handle, { cursor: 'move' });
            Cuic.addClass(handle, self.options.handleClassName);

            // Start dragging
            Cuic.on('mousedown', handle, function (ev) {
                // Ignore dragging if the target is not the root
                if (self.options.rootOnly && ev.target !== ev.currentTarget) return;

                // Execute callback
                if (self.onDragStart(ev) === false) {
                    return;
                }

                // Prevent text selection
                ev.preventDefault();

                // Change element style
                self.addClass('dragging');

                var parent = self.getParentElement();
                var isInBody = parent === document.body;

                var margin = Cuic.margin(self);
                var height = Cuic.outerHeight(self);
                var width = Cuic.outerWidth(self);
                var startOffset = Cuic.offset(self);
                var startX = Cuic.mouseX;
                var startY = Cuic.mouseY;
                var scrollX = window.scrollX;
                var scrollY = window.scrollY;
                var timer = setInterval(function () {
                    var prop = {};
                    var parentPadding = Cuic.padding(parent);
                    var parentOffset = Cuic.offset(parent) || { left: 0, top: 0 };
                    var parentHeight = Cuic.innerHeight(parent);
                    var parentWidth = Cuic.innerWidth(parent);

                    var spaceBottom = Math.max(parentPadding.bottom);
                    var spaceLeft = Math.max(parentPadding.left);
                    var spaceRight = Math.max(parentPadding.right);
                    var spaceTop = Math.max(parentPadding.top);

                    // Calculate minimal values
                    var minX = (isInBody ? scrollX : 0) + spaceLeft;
                    var minY = (isInBody ? scrollY : 0) + spaceTop;
                    minX = spaceLeft;
                    minY = spaceTop;

                    // Calculate maximal values
                    var maxX = parentWidth - parentPadding.horizontal - margin.right;
                    var maxY = parentHeight - parentPadding.vertical - margin.bottom;

                    var stepX = self.options.stepX;
                    var stepY = self.options.stepY;
                    var mouseLeft = Cuic.mouseX - startX;
                    var mouseTop = Cuic.mouseY - startY;
                    var left = startOffset.left + Math.round(mouseLeft / stepX) * stepX;
                    var top = startOffset.top + Math.round(mouseTop / stepY) * stepY;

                    // Check horizontal location
                    if (left < minX) {
                        left = minX;
                    } else if (left + width > maxX) {
                        left = maxX - width;
                    }

                    // Check vertical location
                    if (top < minY) {
                        top = minY;
                    } else if (top + height > maxY) {
                        top = maxY - height;
                    }

                    // Execute callback
                    if (self.onDrag(left, top) === false) {
                        return;
                    }

                    // Move horizontally
                    if (self.options.horizontal) {
                        prop.left = left + 'px';
                        prop.right = '';
                    }
                    // Move vertically
                    if (self.options.vertical) {
                        prop.top = top + 'px';
                        prop.bottom = '';
                    }
                    // Move element
                    self.css(prop);
                }, Math.round(1000 / self.options.fps));

                // Stop dragging
                Cuic.once('mouseup', document.body, function (ev) {
                    clearInterval(timer);
                    self.removeClass('dragging');
                    self.onDragStop();
                });
            });
            return self;
        };

        // Force the target to be the relative parent
        if (self.css('position') === 'static') {
            self.css({ position: 'relative' });
        }

        // Set the dragging area
        self.setHandle(options.handle || self.getElement());
        return _this7;
    }

    /**
     * Called when dragging
     */


    _createClass(_class6, [{
        key: 'onDrag',
        value: function onDrag() {}

        /**
         * Called when drag start
         */

    }, {
        key: 'onDragStart',
        value: function onDragStart() {}

        /**
         * Called when drag stop
         */

    }, {
        key: 'onDragStop',
        value: function onDragStop() {}
    }]);

    return _class6;
}(Cuic.Component);

/**
 * Draggable default options
 */
Cuic.Draggable.prototype.options = {
    className: 'draggable',
    fps: 60,
    handle: null,
    handleClassName: 'draggable-handle',
    horizontal: true,
    rootOnly: true,
    stepX: 1,
    stepY: 1,
    vertical: true
};

/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2017 Karl STEIN
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

(function ($) {
    'use strict';

    var counter = -1;

    /**
     * Hook an element to the viewport,
     * so it is scrolled with the viewport
     * @param options
     * @return {*}
     */
    Cuic.Hook = function (options) {
        var self = this;
        var ns = Cuic.namespace('hook-' + (counter += 1));

        // Default options
        options = $.extend(true, {}, Cuic.Hook.prototype.options, options);

        var win = $(window);

        // Get the target
        var $target = $(options.target);
        if ($target.length === 0) {
            throw new Error('No target found for : ' + options.target);
        }

        // This is a fix to avoid offsetTop > 0
        $target.css({
            position: 'relative',
            top: '',
            width: ''
        });

        // Create the spacer item that will replace
        // the bar when it is scrolled
        var $spacer = $('<div>', {
            css: { display: 'none' }
        }).insertAfter($target);

        // Get the target's offset
        var offset = $target.offset();

        /**
         * Hook the element
         */
        self.hook = function () {
            if ($target.css('position') !== 'fixed') {
                offset = $target.offset();

                if (options.fixed) {
                    options.offsetTop = offset.top;
                }
                $spacer.css({
                    display: $target.css('display'),
                    float: $target.css('float'),
                    // height: target.height(),
                    marginBottom: $target.css('margin-bottom'),
                    marginLeft: $target.css('margin-left'),
                    marginRight: $target.css('margin-right'),
                    marginTop: $target.css('margin-top')
                });
                $target.css({
                    position: 'fixed',
                    left: offset.left,
                    top: options.offsetTop,
                    width: $spacer.width(),
                    zIndex: options.zIndex
                }).addClass(options.hookedClass);

                // Execute the hooked listener
                if (typeof options.onHook === 'function') {
                    options.onHook.call($target);
                }
            } else if ($spacer) {
                offset = $spacer.offset();
                $target.css({
                    left: offset.left,
                    width: $spacer.width()
                });
            }
        };

        /**
         * Unhook the element
         */
        self.unhook = function () {
            if ($target.css('position') !== 'relative') {
                $spacer.hide();
                $target.css({
                    position: 'relative',
                    bottom: '',
                    left: '',
                    right: '',
                    top: '',
                    width: ''
                }).removeClass(options.hookedClass);

                // Execute the unhooked listener
                if (typeof options.onUnhook === 'function') {
                    options.onUnhook.call($target);
                }
            }
        };

        var onScroll = function onScroll() {
            var targetFitsInScreen = $target.outerHeight(true) <= window.screen.availHeight;

            if (targetFitsInScreen) {
                if (options.fixed) {
                    self.hook();
                } else {
                    var marginTop = parseFloat($target.css('margin-top'));

                    if (win.scrollTop() > offset.top - marginTop) {
                        self.hook();
                    } else {
                        self.unhook();
                    }
                }
            } else {
                self.unhook();
            }
        };

        // If the window is scrolled when reloading the page,
        // the bar must be shown
        onScroll();

        // Scroll the bar when the window is scrolled
        win.off(ns('scroll')).on(ns('scroll'), function () {
            onScroll();
        });

        win.off(ns('resize')).on(ns('resize'), function () {
            onScroll();
        });
    };

    /**
     * Called when element is hooked
     * @type {function}
     */
    Cuic.Hook.prototype.onHook = null;

    /**
     * Called when element is unhooked
     * @type {function}
     */
    Cuic.Hook.prototype.onUnhook = null;

    /**
     * Default options
     * @type {*}
     */
    Cuic.Hook.prototype.options = {
        fixed: false,
        hookedClass: 'hooked',
        offsetBottom: 0,
        offsetLeft: 0,
        offsetRight: 0,
        offsetTop: 0,
        target: null,
        zIndex: 4
    };
})(jQuery);

/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2017 Karl STEIN
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

(function ($) {
    'use strict';

    var ns = Cuic.namespace('resizable');

    /**
     * Makes an object resizable
     * @param options
     * @constructor
     */
    Cuic.Resizable = function (options) {
        var self = this;
        var $container;
        var $element;
        var handlers = [];
        var horizontalHandlers = [];
        var verticalHandlers = [];
        var ratio = 1;

        // Default options
        options = Cuic.extend(true, Cuic.Resizable.prototype.options, options);

        // Define attributes
        self.className = options.className;
        self.fps = parseInt(options.fps);
        self.horizontal = options.horizontal === true;
        self.keepRatio = options.keepRatio === true;
        self.maxHeight = parseInt(options.maxHeight);
        self.maxWidth = parseInt(options.maxWidth);
        self.minHeight = parseInt(options.minHeight);
        self.minWidth = parseInt(options.minWidth);
        self.stepX = parseInt(options.stepX);
        self.stepY = parseInt(options.stepY);
        self.vertical = options.vertical === true;

        /**
         * Returns the element
         * @return {*}
         */
        self.getElement = function () {
            return $element;
        };

        /**
         * Set the container
         * @param obj
         * @return {*}
         */
        self.setContainer = function (obj) {
            $container = $(obj);
            return self;
        };

        // Find the target
        if (options.target) $element = $(options.target);

        // Add the resizable classes
        $element.addClass(self.className);

        // Force the target to be the relative parent
        if ($element.css('position') === 'static') {
            $element.css('position', 'relative');
        }

        // Set the top container of the element
        self.setContainer(options.container || $element.offsetParent());

        /**
         * This method is called the element is resizing
         * @param ev
         */
        var resize = function resize(ev) {
            // Execute callback
            if (self.onResizeStart && self.onResizeStart.call(self, ev) === false) {
                return;
            }

            // Prevent text selection
            ev.preventDefault();

            // Change element style
            $element.addClass('resizing');

            var containerLeft = $container.offset().left;
            var containerTop = $container.offset().top;
            var height = $element.height();
            var width = $element.width();
            var padding = Cuic.padding($element);

            // Calculate the ratio
            ratio = height / width;

            var timer = setInterval(function () {
                var containerHeight = $container.innerHeight();
                var containerWidth = $container.innerWidth();
                var elementLeft = $element.offset().left;
                var elementTop = $element.offset().top;
                var maxHeight = containerHeight - (elementTop - containerTop + padding.left + padding.right);
                var maxWidth = containerWidth - (elementLeft - containerLeft + padding.bottom + padding.top);
                var diffX = Cuic.mouseX - ev.clientX;
                var diffY = Cuic.mouseY - ev.clientY;
                var newHeight = null;
                var newWidth = null;

                // Check horizontal size
                if (horizontalHandlers.indexOf(ev.target) !== -1) {
                    newWidth = width + diffX;

                    if (newWidth > maxWidth) {
                        newWidth = maxWidth;
                    }
                }

                // Check vertical size
                if (verticalHandlers.indexOf(ev.target) !== -1) {
                    newHeight = height + diffY;

                    if (newHeight > maxHeight) {
                        newHeight = maxHeight;
                    }
                }

                if (self.keepRatio) {
                    if (newHeight !== null) {
                        newWidth = newHeight / ratio;
                    } else if (newWidth !== null) {
                        newHeight = newWidth * ratio;
                    }
                }

                // Execute callback
                if (self.onResize && self.onResize.call(self) === false) {
                    return;
                }

                // Resize horizontally
                if (self.horizontal && newWidth !== null && self.checkWidth(newWidth)) {
                    $element.width(self.stepX ? Math.round(newWidth / self.stepX) * self.stepX : newWidth);
                }

                // Resize vertically
                if (self.vertical && newHeight !== null && self.checkHeight(newHeight)) {
                    $element.height(self.stepY ? Math.round(newHeight / self.stepY) * self.stepY : newHeight);
                }
            }, Math.round(1000 / self.fps));

            // Stop resizing
            $(document).off(ns('mouseup')).one(ns('mouseup'), function (ev) {
                clearInterval(timer);
                $element.removeClass('resizing');

                if (self.onResizeStop) {
                    self.onResizeStop.call(self, ev);
                }
            });
        };

        // Right handler
        var rightHandler = $('<div>', {
            css: {
                cursor: 'e-resize',
                display: 'none',
                height: '100%',
                position: 'absolute',
                right: 0,
                top: 0,
                width: options.handlerSize,
                zIndex: 1
            }
        }).off(ns('mousedown')).on(ns('mousedown'), resize).appendTo($element);

        // Bottom handler
        var bottomHandler = $('<div>', {
            css: {
                bottom: 0,
                cursor: 's-resize',
                display: 'none',
                height: options.handlerSize,
                position: 'absolute',
                left: 0,
                width: '100%',
                zIndex: 1
            }
        }).off(ns('mousedown')).on(ns('mousedown'), resize).appendTo($element);

        // Bottom-Right handler
        var bottomRightHandler = $('<div>', {
            css: {
                bottom: 0,
                cursor: 'se-resize',
                display: 'none',
                height: options.handlerSize,
                position: 'absolute',
                right: 0,
                width: options.handlerSize,
                zIndex: 2
            }
        }).off('mousedown').on(ns('mousedown'), resize).appendTo($element);

        handlers = [rightHandler, bottomHandler, bottomRightHandler];
        horizontalHandlers = [rightHandler.get(0), bottomRightHandler.get(0)];
        verticalHandlers = [bottomHandler.get(0), bottomRightHandler.get(0)];

        // Display all handlers when mouse enters the target
        $element.off('mouseenter').on(ns('mouseenter'), function () {
            if (!$element.hasClass('resizing')) {
                for (var i = 0; i < handlers.length; i += 1) {
                    handlers[i].stop(true, false).fadeIn(0);
                }
            }
        });

        // Hide all handlers when mouse leaves the target
        $element.off('mouseleave').on(ns('mouseleave'), function () {
            if (!$element.hasClass('resizing')) {
                for (var i = 0; i < handlers.length; i += 1) {
                    handlers[i].stop(true, false).fadeOut(0);
                }
            }
        });
    };

    /**
     * Checks if the height is between min and max values
     * @param height
     * @return {boolean}
     */
    Cuic.Resizable.prototype.checkHeight = function (height) {
        return (!Number(this.maxHeight) || height <= this.maxHeight) && (!Number(this.minHeight) || height >= this.minHeight);
    };

    /**
     * Checks if the width is between min and max values
     * @param width
     * @return {boolean}
     */
    Cuic.Resizable.prototype.checkWidth = function (width) {
        return (!Number(this.maxWidth) || width <= this.maxWidth) && (!Number(this.minWidth) || width >= this.minWidth);
    };

    /**
     * Called when element is resizing
     * @type {function}
     */
    Cuic.Resizable.prototype.onResize = null;

    /**
     * Called when resize starts
     * @type {function}
     */
    Cuic.Resizable.prototype.onResizeStart = null;

    /**
     * Called when resize stops
     * @type {function}
     */
    Cuic.Resizable.prototype.onResizeStop = null;

    /**
     * Default options
     * @type {*}
     */
    Cuic.Resizable.prototype.options = {
        className: 'resizable',
        fps: 30,
        handlerSize: 10,
        horizontal: true,
        keepRatio: false,
        maxHeight: null,
        maxWidth: null,
        minHeight: 1,
        minWidth: 1,
        stepX: 1,
        stepY: 1,
        vertical: true
    };
})(jQuery);

/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2017 Karl STEIN
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

/**
 * Basic button
 */
Cuic.Button = function (_Cuic$Component3) {
    _inherits(_class7, _Cuic$Component3);

    function _class7(options) {
        _classCallCheck(this, _class7);

        // Set default options
        options = Cuic.extend({}, Cuic.Button.prototype.options, options);

        // Create element

        var _this8 = _possibleConstructorReturn(this, (_class7.__proto__ || Object.getPrototypeOf(_class7)).call(this, 'button', {
            className: options.className,
            disabled: false,
            html: options.label,
            title: options.title,
            type: options.type
        }, options));

        var self = _this8;

        // Create shortcut
        if (typeof options.shortcut === 'number') {
            self.shortcut = new Cuic.Shortcut({
                keyCode: options.shortcut,
                target: self.element,
                callback: self.onClick
            });
        }
        return _this8;
    }

    return _class7;
}(Cuic.Component);

/**
 * Basic button default options
 */
Cuic.Button.prototype.options = {
    className: 'btn btn-default',
    disabled: false,
    shortcut: null,
    title: null,
    type: 'button'
};

/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2017 Karl STEIN
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

var dialogZIndex = 0;

/**
 * Collection of dialogs
 */
Cuic.dialogs = new Cuic.Collection();

Cuic.dialogs.onAdded = function (value) {
    dialogZIndex += 1;
};

Cuic.dialogs.onRemoved = function (value) {
    dialogZIndex -= 1;
};

/**
 * Basic dialog
 */
Cuic.Dialog = function (_Cuic$Component4) {
    _inherits(_class8, _Cuic$Component4);

    function _class8(options) {
        _classCallCheck(this, _class8);

        // Set default options
        options = Cuic.extend({}, Cuic.Dialog.prototype.options, options);

        // Create element

        var _this9 = _possibleConstructorReturn(this, (_class8.__proto__ || Object.getPrototypeOf(_class8)).call(this, 'div', {
            className: options.className,
            role: 'dialog'
        }, options));

        var ns = Cuic.namespace('dialog');
        var self = _this9;

        var $buttons = void 0; //todo use a GroupComponent
        var $closeButton = void 0;
        var $content = void 0;
        var $footer = void 0;
        var $header = void 0;
        var $title = void 0;

        // Attributes
        self.buttons = new Cuic.Collection();

        /**
         * Adds a button to the dialog
         * @return {Cuic.Button}
         * @param button
         */
        self.addButton = function (button) {
            if (!(button instanceof Cuic.Button)) {
                (function () {
                    var callback = button.callback;

                    button = new Cuic.Button({
                        className: 'btn btn-default',
                        label: button.label
                    });

                    // Set button callback
                    if (typeof callback === 'function') {
                        button.onClick = function (ev) {
                            callback.call(self, ev);
                        };
                    } else if (callback === 'close') {
                        button.onClick = function () {
                            self.close();
                        };
                    }
                })();
            }

            // Add button in footer
            $buttons.append(button.getElement());
            self.buttons.add(button);

            // Hide footer if empty
            if (self.buttons.length > 1) {
                $footer.show();
            }
            // Maximize the only one button
            else if (self.buttons.length === 1) {
                    $footer.show();
                }
                // Hide footer if empty
                else {
                        $footer.hide();
                    }
            return button;
        };

        /**
         * Returns the content
         * @deprecated
         * @return {jQuery}
         */
        self.getBody = function () {
            return $content;
        };

        /**
         * Returns the content
         * @return {jQuery}
         */
        self.getContent = function () {
            return $content;
        };

        /**
         * Returns the footer
         * @return {jQuery}
         */
        self.getFooter = function () {
            return $footer;
        };

        /**
         * Returns the header
         * @return {jQuery}
         */
        self.getHeader = function () {
            return $header;
        };

        /**
         * Called when the dialog is closing
         */
        self.onClose = function () {
            fader.close(function () {
                if (self.options.autoRemove) {
                    fader.remove();
                }
            });
        };

        /**
         * Called when the dialog is closed
         */
        self.onClosed = function () {
            if (self.options.autoRemove) {
                self.remove();
            }
        };

        /**
         * Called when the dialog is opening
         */
        self.onOpen = function () {
            // Calculate z-index
            var zIndex = options.zIndex + dialogZIndex;
            self.css({ 'z-index': zIndex });

            self.resizeContent();

            // Open fader
            if (self.options.modal) {
                self.css({ 'z-index': zIndex + 1 });
                fader.css({ 'z-index': zIndex });
                fader.open();
            }
            // Maximize or position the dialog
            if (self.options.maximized) {
                self.maximize();
            } else {
                self.setPosition(self.options.position);
            }
            // Focus the last button
            if (self.buttons.length > 0) {
                var button = self.buttons.get(self.buttons.length - 1);
                button.getElement().focus();
            }
        };

        /**
         * Called when the dialog is opened
         */
        self.onOpened = function () {
            // // Find images
            // let images = self.$element.find('img');
            //
            // if (images.length > 0) {
            //     // Position the dialog when images are loaded
            //     images.off(ns('load')).on(ns('load'), () => {
            //         self.resizeContent();
            //     });
            // } else {
            //     // Position the dialog in the wrapper
            //     self.resizeContent();
            // }
        };

        /**
         * Resizes the content
         * @return {Cuic.Dialog}
         */
        self.resizeContent = function () {
            var elm = self.getElement();
            var parent = self.getParentElement();
            var display = elm.style.display;
            var maxHeight = window.innerHeight;

            // Use parent for max height
            if (parent && parent !== document.body) {
                maxHeight = Cuic.height(parent);
            }

            // Set panel max height
            var border = Cuic.border(elm);
            var margin = Cuic.margin(elm);
            maxHeight -= margin.vertical;
            maxHeight -= border.vertical;
            self.css({ 'max-height': maxHeight + 'px' });

            // Set content max height
            var contentMaxHeight = maxHeight;

            if ($header) {
                contentMaxHeight -= Cuic.outerHeight($header, true);
            }
            if ($footer) {
                contentMaxHeight -= Cuic.outerHeight($footer, true);
            }

            Cuic.css($content, {
                'max-height': contentMaxHeight + 'px',
                overflow: 'auto'
            });

            // Restore initial display state
            self.css({ display: display });

            return self;
        };

        /**
         * Sets the title
         * @param html
         * @return {Cuic.Dialog}
         */
        self.setTitle = function (html) {
            $title.html(html);
            return self;
        };

        // Set dialog position
        var fixed = self.getParentElement() === document.body;
        self.css({ position: fixed ? 'fixed' : 'absolute' });

        // Create the fader
        var fader = new Cuic.Fader({
            className: 'fader dialog-fader'
        }).appendTo(options.parent);

        // Set fader position
        if (fixed) {
            fader.css({ position: 'fixed' });
        }

        // If the dialog is not modal,
        // a click on the wrapper will close the dialog
        fader.onClick = function (ev) {
            self.close();
        };

        // Add header
        $header = $('<header>', {
            'class': 'dialog-header',
            css: { display: options.title != null ? 'block' : 'none' }
        }).appendTo(self.getElement());

        // Add title
        $title = $('<h3>', {
            html: options.title,
            'class': 'dialog-title'
        }).appendTo($header);

        // Add close button
        $closeButton = $('<span>', {
            'class': 'dialog-close-btn glyphicon glyphicon-remove-sign'
        }).prependTo($header);

        // Add content
        $content = $('<section>', {
            'html': options.content,
            'class': 'dialog-content',
            style: 'overflow: auto'
        }).appendTo(self.getElement());

        // Add footer
        $footer = $('<footer>', {
            'class': 'dialog-footer',
            css: { display: options.buttons != null ? 'block' : 'none' }
        }).appendTo(self.getElement());

        // Add buttons group
        $buttons = $('<div>', {
            'class': 'btn-group',
            role: 'group'
        }).appendTo($footer);

        // Set content height
        if (parseFloat(options.contentHeight) > 0) {
            $content.css('height', options.contentHeight);
        }

        // Set content width
        if (parseFloat(options.contentWidth) > 0) {
            $content.css('width', options.contentWidth);
        }

        // Add buttons
        if (options.buttons instanceof Array) {
            for (var i = 0; i < options.buttons.length; i += 1) {
                self.addButton(options.buttons[i]);
            }
        }

        // Close dialog when close button is clicked
        $closeButton.on(ns('click'), function () {
            self.close();
        });

        // let timer;
        // $(window).off(ns('resize')).on(ns('resize'), () => {
        //     clearTimeout(timer);
        //
        //     if (self.options.autoResize) {
        //         timer = setTimeout(() => {
        //             self.resizeContent();
        //         }, 50);
        //     }
        // });

        // Add dialog to collection
        Cuic.dialogs.add(self);

        // Make the dialog draggable
        if (self.options.draggable) {
            self.draggable = new Cuic.Draggable({
                handle: $title,
                parent: self.getParentElement(),
                rootOnly: false,
                target: self.getElement()
            });
        }

        // Define the close shortcut
        new Cuic.Shortcut({
            keyCode: 27, //Esc
            target: self.getElement(),
            callback: function callback() {
                self.close();
            }
        });
        return _this9;
    }

    _createClass(_class8, [{
        key: 'onRemove',
        value: function onRemove() {
            Cuic.dialogs.remove(this);
        }
    }]);

    return _class8;
}(Cuic.Component);

/**
 * Default options
 * @type {*}
 */
Cuic.Dialog.prototype.options = {
    autoRemove: true,
    autoResize: true,
    buttons: [],
    className: 'dialog',
    content: null,
    contentHeight: null,
    contentWidth: null,
    draggable: true,
    maximized: false,
    parent: document.body,
    position: 'center',
    modal: true,
    target: null,
    title: null,
    zIndex: 5
};

/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2017 Karl STEIN
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

/**
 * Basic screen fader
 */
Cuic.Fader = function (_Cuic$Component5) {
    _inherits(_class9, _Cuic$Component5);

    function _class9(options) {
        _classCallCheck(this, _class9);

        // Set default options
        options = Cuic.extend({}, Cuic.Fader.prototype.options, options);

        // Create element
        return _possibleConstructorReturn(this, (_class9.__proto__ || Object.getPrototypeOf(_class9)).call(this, 'div', { className: options.className }, options));
    }

    return _class9;
}(Cuic.Component);

/**
 * Basic button default options
 */
Cuic.Button.prototype.options = {
    className: 'fader'
};

/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2017 Karl STEIN
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

(function ($) {
    'use strict';

    var counter = 0;

    /**
     * Creates a Grid
     * @param options
     * @constructor
     */
    Cuic.Grid = function (options) {
        var grid = this;

        // Default options
        options = $.extend(true, Cuic.Grid.prototype.options, options);

        // Set the options
        grid.animSpeed = parseInt(options.animSpeed);
        grid.autoResize = options.autoResize === true;
        grid.colsWidth = parseFloat(options.colsWidth);
        grid.editable = options.editable === true;
        grid.fps = parseInt(options.fps);
        grid.maxCols = parseInt(options.maxCols);
        grid.maxRows = parseInt(options.maxRows);
        grid.minCols = parseInt(options.minCols);
        grid.minRows = parseInt(options.minRows);
        grid.rowsHeight = parseFloat(options.rowsHeight);
        grid.spacing = parseFloat(options.spacing);
        grid.widgets = {};

        // Get the grid
        grid.element = $(options.target);

        // Set the grid style
        grid.element.css({
            display: 'block',
            minHeight: options.height,
            minWidth: options.width
        });

        // Set the grid size
        grid.resize(options.cols, options.rows);

        // Set the grid resizable
        new Cuic.Resizable({
            target: grid.element

        }).onResizeStop = function () {
            var cols = grid.getSizeX(grid.element.outerWidth());
            var rows = grid.getSizeY(grid.element.outerHeight());
            grid.maxCols = cols;
            grid.maxRows = rows;
            grid.maximize();
        };

        // Create the widget preview
        grid.preview = $('<div>', {
            'class': 'preview',
            css: {
                'box-sizing': 'border-box',
                height: grid.rowsHeight,
                left: grid.spacing,
                position: 'absolute',
                top: grid.spacing,
                width: grid.colsWidth,
                zIndex: 1
            }
        });

        // Add widgets to the grid
        grid.element.children(options.widgetSelector).each(function () {
            var id = this.id || 'widget-' + (counter += 1);
            grid.addWidget(id, new Cuic.Grid.Widget({
                target: this
            }));
        });

        if (grid.autoResize) {
            grid.minimize();
        }
    };

    /**
     * Adds a widget to the grid
     * @param id
     * @param widget
     * @return {Cuic.Widget}
     */
    Cuic.Grid.prototype.addWidget = function (id, widget) {
        var grid = this;
        var element = widget.element;
        var preview = grid.preview;

        // Remove any widget having the same id
        grid.removeWidget(id);

        // Keep a reference to the widget
        grid.widgets[id] = widget;

        // Add the widget to the grid
        grid.element.append(widget.element);

        // Set the widget id
        widget.element.attr('id', id);

        // Override widget style
        widget.element.css({
            'box-sizing': 'border-box',
            display: 'block',
            margin: 0,
            overflow: 'hidden',
            position: 'absolute'
        });

        // Position the widget
        grid.moveWidget(widget, widget.col, widget.row);

        // Resize the widget
        grid.resizeWidget(widget, widget.sizeX, widget.sizeY);

        // Extend the grid if needed
        if (widget.col - 1 + widget.sizeX > grid.cols) {
            grid.resize(widget.col - 1 + widget.sizeX, widget.sizeY);
        }
        if (widget.row - 1 + widget.sizeY > grid.rows) {
            grid.resize(widget.sizeX, widget.row - 1 + widget.sizeY);
        }

        var height;
        var width;

        // Make the widget resizable
        var resizable = new Cuic.Resizable({
            target: widget.element,
            container: grid.element
        });

        // Set behavior when resizing widget
        resizable.onResize = function () {
            var tmpHeight = element.outerHeight();
            var tmpWidth = element.outerWidth();
            var sizeX = Math.round(tmpWidth / (grid.colsWidth + grid.spacing));
            var sizeY = Math.round(tmpHeight / (grid.rowsHeight + grid.spacing));

            // Make sure the widget does not overlap the grid
            if (sizeX + widget.col - 1 > grid.maxCols) {
                sizeX = grid.maxCols - (widget.col - 1);
            } else if (sizeX < widget.minSizeX) {
                sizeX = widget.minSizeX;
            }
            // Make sure the widget does not overlap the grid
            if (sizeY + widget.row - 1 > grid.maxRows) {
                sizeY = grid.maxRows - (widget.row - 1);
            } else if (sizeY < widget.minSizeY) {
                sizeY = widget.minSizeY;
            }

            // Resize the preview
            preview.css({
                height: grid.calculateHeight(sizeY),
                width: grid.calculateWidth(sizeX)
            });
        };

        // Set behavior when resizing starts
        resizable.onResizeStart = function () {
            if (grid.editable && widget.resizable && !widget.isDragging()) {
                height = element.outerHeight();
                width = element.outerWidth();

                // Move widget to foreground
                element.css({ zIndex: 2 });

                // Display the widget preview
                grid.element.append(preview.css({
                    left: element.css('left'),
                    height: height,
                    top: element.css('top'),
                    width: width
                }));

                // Maximize the grid
                if (grid.autoResize) {
                    grid.maximize();
                }
                return true;
            }
            return false;
        };

        // Set behavior when resizing stops
        resizable.onResizeStop = function () {
            // Remove the preview
            preview.detach();

            // Resize the widget
            var sizeX = grid.getSizeX(preview.outerWidth());
            var sizeY = grid.getSizeY(preview.outerHeight());
            grid.resizeWidget(widget, sizeX, sizeY);

            // Fit the grid to its content
            if (grid.autoResize) {
                grid.minimize();
            }
        };

        // Make the widget draggable
        var draggable = new Cuic.Draggable({
            target: widget.element,
            rootOnly: true,
            container: grid.element
        });

        // Set behavior when dragging widget
        draggable.onDrag = function () {
            var left = parseFloat(element.css('left'));
            var top = parseFloat(element.css('top'));
            var col = grid.getPositionX(left);
            var row = grid.getPositionY(top);

            if (!(col > 0 && col + widget.sizeX <= grid.cols + 1 && row > 0 && row + widget.sizeY <= grid.rows + 1)) {
                col = widget.col;
                row = widget.row;
            }
            preview.css({
                left: grid.calculateLeft(col),
                top: grid.calculateTop(row)
            });
        };

        // Set behavior when dragging starts
        draggable.onDragStart = function (ev) {
            if (grid.editable && widget.draggable && !widget.isResizing()) {
                height = element.outerHeight();
                width = element.outerWidth();

                // Move widget to foreground
                element.css({ zIndex: 2 });

                // Display the widget preview
                grid.element.append(preview.css({
                    left: element.css('left'),
                    height: height,
                    top: element.css('top'),
                    width: width
                }));

                // Maximize the grid
                if (grid.autoResize) {
                    grid.maximize();
                }
                return true;
            }
            return false;
        };

        // Set behavior when dragging stops
        draggable.onDragStop = function () {
            // Remove the preview
            preview.detach();

            // Position the widget
            var left = parseFloat(element.css('left'));
            var top = parseFloat(element.css('top'));
            var col = grid.getSizeX(left) + 1;
            var row = grid.getSizeY(top) + 1;
            grid.moveWidget(widget, col, row);

            // Fit the grid to its content
            if (grid.autoResize) {
                grid.minimize();
            }
        };
        return widget;
    };

    /**
     * Returns the height of a size
     * @param sizeY
     * @return {number}
     */
    Cuic.Grid.prototype.calculateHeight = function (sizeY) {
        return parseInt(sizeY) * (this.rowsHeight + this.spacing) - this.spacing;
    };

    /**
     * Returns the left offset of a position
     * @param posX
     * @return {number}
     */
    Cuic.Grid.prototype.calculateLeft = function (posX) {
        return parseInt(posX) * (this.colsWidth + this.spacing) - this.colsWidth;
    };

    /**
     * Returns the top offset of a position
     * @param posY
     * @return {number}
     */
    Cuic.Grid.prototype.calculateTop = function (posY) {
        return parseInt(posY) * (this.rowsHeight + this.spacing) - this.rowsHeight;
    };

    /**
     * Returns the width of a size
     * @param sizeX
     * @return {number}
     */
    Cuic.Grid.prototype.calculateWidth = function (sizeX) {
        return parseInt(sizeX) * (this.colsWidth + this.spacing) - this.spacing;
    };

    /**
     * Removes all widgets from the grid
     * @return {Cuic.Grid}
     */
    Cuic.Grid.prototype.clear = function () {
        for (var id in this.widgets) {
            if (this.widgets.hasOwnProperty(id)) {
                this.removeWidget(id);
            }
        }
        return this;
    };

    /**
     * Returns the column and row of a position
     * @param left
     * @param top
     * @return {number[]}
     */
    Cuic.Grid.prototype.getPosition = function (left, top) {
        return [this.getPositionX(left), this.getPositionY(top)];
    };

    /**
     * Returns the column of a position
     * @param posX
     * @return {number}
     */
    Cuic.Grid.prototype.getPositionX = function (posX) {
        return Math.round(parseFloat(posX) / (this.colsWidth + this.spacing)) + 1;
    };

    /**
     * Returns the row of a position
     * @param posY
     * @return {number}
     */
    Cuic.Grid.prototype.getPositionY = function (posY) {
        return Math.round(parseFloat(posY) / (this.rowsHeight + this.spacing)) + 1;
    };

    /**
     * Returns a size from a width and height
     * @param width
     * @param height
     * @return {number[]}
     */
    Cuic.Grid.prototype.getSize = function (width, height) {
        return [this.getSizeX(width), this.getSizeY(height)];
    };

    /**
     * Returns a size from a width
     * @param width
     * @return {number}
     */
    Cuic.Grid.prototype.getSizeX = function (width) {
        return Math.round(parseFloat(width) / (this.colsWidth + this.spacing));
    };

    /**
     * Returns a size from a height
     * @param height
     * @return {number}
     */
    Cuic.Grid.prototype.getSizeY = function (height) {
        return Math.round(parseFloat(height) / (this.rowsHeight + this.spacing));
    };

    /**
     * Returns a widget
     * @param id
     * @return {Cuic.Grid.Widget}
     */
    Cuic.Grid.prototype.getWidget = function (id) {
        return this.widgets[id];
    };

    /**
     * Makes the grid as big as possible
     * @return {Cuic.Grid}
     */
    Cuic.Grid.prototype.maximize = function () {
        return this.resize(this.maxCols, this.maxRows);
    };

    /**
     * Makes the grid fit its content
     * @return {Cuic.Grid}
     */
    Cuic.Grid.prototype.minimize = function () {
        var col = this.minCols || 1;
        var row = this.minRows || 1;

        for (var id in this.widgets) {
            if (this.widgets.hasOwnProperty(id)) {
                var widget = this.widgets[id];

                if (widget.col + widget.sizeX - 1 > col) {
                    col = widget.col + widget.sizeX - 1;
                }
                if (widget.row + widget.sizeY - 1 > row) {
                    row = widget.row + widget.sizeY - 1;
                }
            }
        }
        return this.resize(col, row);
    };

    /**
     * Moves a widget to a new position
     * @param widget
     * @param col
     * @param row
     * @return {Cuic.Grid}
     */
    Cuic.Grid.prototype.moveWidget = function (widget, col, row) {
        var grid = this;

        if (!(col > 0 && col - 1 + widget.sizeX <= grid.cols && row > 0 && row - 1 + widget.sizeY <= grid.rows)) {
            col = widget.col;
            row = widget.row;
        }

        if (col > 0 && row > 0) {
            widget.col = col;
            widget.row = row;
            widget.element.css({ zIndex: 2 });
            widget.element.animate({
                left: grid.calculateLeft(col),
                top: grid.calculateTop(row)
            }, {
                complete: function complete() {
                    widget.element.removeClass('dragging');
                    widget.element.css({ zIndex: 1 });

                    // Execute callback
                    if (typeof grid.onWidgetMoved === 'function') {
                        grid.onWidgetMoved.call(grid, widget);
                    }
                },

                duration: grid.animSpeed,
                queue: false
            });
        }
        return grid;
    };

    /**
     * Removes the widget from the grid
     * @param id
     * @return {Cuic.Grid.Widget}
     */
    Cuic.Grid.prototype.removeWidget = function (id) {
        var widget = this.widgets[id];

        if (widget) {
            delete this.widgets[id];
            widget.element.stop(true, false).animate({
                height: 0,
                width: 0
            }, {
                complete: function complete() {
                    $(this).remove();
                },

                duration: this.animSpeed,
                queue: false
            });
        }
        return widget;
    };

    /**
     * Sets the grid size
     * @param cols
     * @param rows
     * @return {Cuic.Grid}
     */
    Cuic.Grid.prototype.resize = function (cols, rows) {
        cols = parseInt(cols);
        rows = parseInt(rows);

        if (cols < 1) {
            cols = 1;
        }
        if (rows < 1) {
            rows = 1;
        }

        if (cols > 0 && cols <= this.maxCols && rows > 0 && rows <= this.maxRows) {
            this.cols = cols;
            this.rows = rows;
            this.element.stop(true, false).animate({
                height: this.calculateHeight(rows) + this.spacing * 2,
                width: this.calculateWidth(cols) + this.spacing * 2
            }, {
                duration: this.animSpeed,
                queue: false
            });
        }
        return this;
    };

    /**
     * Sets the size of a widget
     * @param widget
     * @param sizeX
     * @param sizeY
     * @return {Cuic.Grid}
     */
    Cuic.Grid.prototype.resizeWidget = function (widget, sizeX, sizeY) {
        var grid = this;
        sizeX = parseInt(sizeX);
        sizeY = parseInt(sizeY);

        if (sizeX < widget.minSizeX) {
            sizeX = widget.minSizeX;
        }
        if (sizeY < widget.minSizeY) {
            sizeY = widget.minSizeY;
        }

        if ((!grid.maxSizeX || sizeX <= grid.maxSizeX) && (!grid.maxSizeY || sizeY >= grid.maxSizeY)) {
            widget.sizeX = sizeX;
            widget.sizeY = sizeY;
            widget.element.css({ zIndex: 2 });
            widget.element.animate({
                height: sizeY * (grid.rowsHeight + grid.spacing) - grid.spacing,
                width: sizeX * (grid.colsWidth + grid.spacing) - grid.spacing
            }, {
                complete: function complete() {
                    widget.element.removeClass('resizing');
                    widget.element.css({ zIndex: 1 });

                    // Execute callback
                    if (typeof grid.onWidgetResized === 'function') {
                        grid.onWidgetResized.call(grid, widget);
                    }
                },

                duration: grid.animSpeed,
                queue: false
            });
        }
        return grid;
    };

    /**
     * Called when widget has been moved
     * @type {function}
     */
    Cuic.Grid.prototype.onWidgetMoved = null;

    /**
     * Called when widget has been resized
     * @type {function}
     */
    Cuic.Grid.prototype.onWidgetResized = null;

    /**
     * Default options
     * @type {*}
     */
    Cuic.Grid.prototype.options = {
        animSpeed: 200,
        autoResize: true,
        cols: null,
        colsWidth: 100,
        editable: true,
        fps: 30,
        maxCols: null,
        maxRows: null,
        minCols: null,
        minRows: null,
        rows: null,
        rowsHeight: 100,
        spacing: 10,
        widgetSelector: '.widget'
    };

    /**
     * Creates a grid widget
     * @param options
     * @constructor
     */
    Cuic.Grid.Widget = function (options) {
        var self = this;

        // Default options
        options = $.extend(true, {}, Cuic.Grid.Widget.prototype.options, options);

        // Set the options
        self.col = parseInt(options.col);
        self.draggable = options.draggable === true;
        self.resizable = options.resizable === true;
        self.row = parseInt(options.row);
        self.maxSizeX = parseInt(options.maxSizeX);
        self.maxSizeY = parseInt(options.maxSizeY);
        self.minSizeX = parseInt(options.minSizeX);
        self.minSizeY = parseInt(options.minSizeY);
        self.sizeX = parseInt(options.sizeX);
        self.sizeY = parseInt(options.sizeY);

        // Find the target
        if (options.target) {
            self.element = $(options.target);

            if (self.element.length > 0) {
                self.col = parseInt(self.element.attr('data-col')) || options.col;
                self.draggable = !!self.element.attr('data-draggable') ? /^true$/gi.test(self.element.attr('data-draggable')) : options.draggable;
                self.maxSizeX = parseInt(self.element.attr('data-max-size-x')) || options.maxSizeX;
                self.maxSizeY = parseInt(self.element.attr('data-max-size-y')) || options.maxSizeY;
                self.minSizeX = parseInt(self.element.attr('data-min-size-x')) || options.minSizeX;
                self.minSizeY = parseInt(self.element.attr('data-min-size-y')) || options.minSizeY;
                self.resizable = !!self.element.attr('data-resizable') ? /^true$/gi.test(self.element.attr('data-resizable')) : options.resizable;
                self.row = parseInt(self.element.attr('data-row')) || options.row;
                self.sizeX = parseInt(self.element.attr('data-size-x')) || options.sizeX;
                self.sizeY = parseInt(self.element.attr('data-size-y')) || options.sizeY;
            }
        }

        // Create the element HTML node
        if (!self.element || self.element.length < 1) {
            self.element = $('<div>', {
                html: options.content
            });
        }

        // Set the style
        self.element.addClass('widget');
    };

    /**
     * Checks if the widget is dragging
     * @return {Boolean}
     */
    Cuic.Grid.Widget.prototype.isDragging = function () {
        return this.element.hasClass('dragging');
    };

    /**
     * Checks if the widget is resizing
     * @return {Boolean}
     */
    Cuic.Grid.Widget.prototype.isResizing = function () {
        return this.element.hasClass('resizing');
    };

    /**
     * Default options
     * @type {*}
     */
    Cuic.Grid.Widget.prototype.options = {
        col: 1,
        content: null,
        draggable: true,
        maxSizeX: null,
        maxSizeY: null,
        minSizeX: 1,
        minSizeY: 1,
        resizable: true,
        row: 1,
        sizeX: 1,
        sizeY: 1,
        target: null
    };
})(jQuery);

/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2017 Karl STEIN
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

/**
 * Collection of notifications
 */
Cuic.notifications = new Cuic.Collection();

/**
 * Notification component
 */
Cuic.Notification = function (_Cuic$Component6) {
    _inherits(_class10, _Cuic$Component6);

    function _class10(options) {
        _classCallCheck(this, _class10);

        // Set default options
        options = Cuic.extend({}, Cuic.Notification.prototype.options, options);

        // Create element

        var _this11 = _possibleConstructorReturn(this, (_class10.__proto__ || Object.getPrototypeOf(_class10)).call(this, 'div', {
            className: options.className,
            html: options.content
        }, options));

        var self = _this11;

        var closeTimer = void 0;

        /**
         * Auto closes the notification
         */
        self.autoClose = function () {
            clearTimeout(closeTimer);
            closeTimer = setTimeout(function () {
                if (self.options.autoClose) {
                    self.close();
                }
            }, self.options.duration);
        };

        /**
         * Called when the notification is closed
         */
        self.onClosed = function () {
            if (self.options.autoRemove) {
                self.remove();
            }
        };

        /**
         * Called when the notification is opening
         */
        self.onOpen = function () {
            // Place the component if a position is set
            if (self.options.position) {
                var isFixed = self.getParentElement() === document.body;
                self.css({ position: isFixed ? 'fixed' : 'absolute' });
                self.setPosition(self.options.position);
            }
        };

        /**
         * Called when the notification is opened
         */
        self.onOpened = function () {
            self.autoClose();
        };

        // Set element styles
        self.css({ zIndex: options.zIndex });

        // Avoid closing notification when mouse is over
        self.on('mouseenter', function (ev) {
            clearTimeout(closeTimer);
        });

        // Close notification when mouse is out
        self.on('mouseleave', function (ev) {
            if (ev.currentTarget === self.getElement()) {
                self.autoClose();
            }
        });

        // Add the close button
        // if (self.options.closeable) {
        //     element.find('.close-notification').remove();
        //     $('<span>', {
        //         class: 'close-notification',
        //         html: self.closeButton
        //     }).appendTo(element);
        // }
        // If the content of the notification has changed,
        // we need to check if there is a close button
        // $element.find('.close-notification').off(ns('click')).one(ns('click'), self.close);

        // Add dialog to collection
        Cuic.notifications.add(self);
        return _this11;
    }

    _createClass(_class10, [{
        key: 'onRemove',
        value: function onRemove() {
            Cuic.notifications.remove(this);
        }
    }]);

    return _class10;
}(Cuic.Component);

/**
 * Default options
 * @type {*}
 */
Cuic.Notification.prototype.options = {
    autoClose: true,
    autoRemove: true,
    className: 'notification',
    closeable: true,
    closeButton: '×',
    content: null,
    css: null,
    duration: 2000,
    parent: document.body,
    position: 'center',
    zIndex: 10
};

/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2017 Karl STEIN
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

/**
 * Creates a notification stack
 * @param options
 * @constructor
 */
Cuic.NotificationStack = function (_Cuic$GroupComponent) {
    _inherits(_class11, _Cuic$GroupComponent);

    function _class11(options) {
        _classCallCheck(this, _class11);

        // Set default options
        options = $.extend({}, Cuic.NotificationStack.prototype.options, options);

        // Create element

        var _this12 = _possibleConstructorReturn(this, (_class11.__proto__ || Object.getPrototypeOf(_class11)).call(this, 'div', {
            className: options.className,
            html: options.content
        }, options));

        var self = _this12;

        // Set position
        if (self.options.position) {
            var isFixed = self.getParentElement() === document.body;
            self.css({ position: isFixed ? 'fixed' : 'absolute' });
            self.setPosition(self.options.position);
        }
        return _this12;
    }

    _createClass(_class11, [{
        key: 'onComponentAdded',
        value: function onComponentAdded(component) {
            // Display the notification when it's added to the stack
            if (component instanceof Cuic.Notification) {
                // fixme Not using a timeout to open blocks the animation
                setTimeout(function () {
                    component.open();
                }, 10);
            }
        }
    }, {
        key: 'onComponentRemoved',
        value: function onComponentRemoved(component) {
            // Display the notification when it's added to the stack
            if (component instanceof Cuic.Notification) {
                component.close();
            }
        }
    }]);

    return _class11;
}(Cuic.GroupComponent);

/**
 * Default options
 * @type {*}
 */
Cuic.NotificationStack.prototype.options = {
    className: 'notification-stack',
    container: null,
    css: null,
    position: 'right top',
    zIndex: 10
};

/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2017 Karl STEIN
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

Cuic.Panel = function (_Cuic$Component7) {
    _inherits(_class12, _Cuic$Component7);

    function _class12(options) {
        _classCallCheck(this, _class12);

        // Set default options
        options = $.extend({}, Cuic.Panel.prototype.options, options);

        // Create element

        var _this13 = _possibleConstructorReturn(this, (_class12.__proto__ || Object.getPrototypeOf(_class12)).call(this, 'div', {
            className: options.className
        }, options));

        var self = _this13;

        var $content = void 0;
        var $footer = void 0;
        var $header = void 0;
        var $title = void 0;

        // Define attributes
        self.closeButton = options.closeButton;

        /**
         * Returns the content
         * @deprecated
         * @return {jQuery}
         */
        self.getBody = function () {
            return $content;
        };

        /**
         * Returns the content
         * @return {jQuery}
         */
        self.getContent = function () {
            return $content;
        };

        /**
         * Returns the footer
         * @return {jQuery}
         */
        self.getFooter = function () {
            return $footer;
        };

        /**
         * Returns the header
         * @return {jQuery}
         */
        self.getHeader = function () {
            return $header;
        };

        /**
         * Called when the panel is closing
         */
        self.onClose = function () {
            var elm = self.getElement();
            var height = Cuic.outerHeight(elm, true);
            var width = Cuic.outerWidth(elm, true);
            var prop = {};

            // Horizontal position
            if (Cuic.isPosition('left', elm)) {
                prop.left = -width + 'px';
                prop.right = '';
            } else if (Cuic.isPosition('right', elm)) {
                prop.right = -width + 'px';
                prop.left = '';
            } else {}
            // todo center


            // Vertical position
            if (Cuic.isPosition('bottom', elm)) {
                prop.bottom = -height + 'px';
                prop.top = '';
            } else if (Cuic.isPosition('top', elm)) {
                prop.top = -height + 'px';
                prop.bottom = '';
            } else {}
            // todo center


            // Hide panel
            self.css(prop);
        };

        /**
         * Called when the panel is minimized
         */
        self.onMinimize = function () {
            var elm = self.getElement();
            var parent = elm.parentNode;
            var clone = elm.cloneNode(true);
            Cuic.css(clone, { height: 'auto', width: 'auto' });

            // Calculate minimized size
            var prop = Cuic.calculatePosition(clone, self.options.position, parent);
            prop.height = Cuic.height(clone);
            prop.width = Cuic.width(clone);
            clone.remove();

            if (!self.isOpened()) {
                // Horizontal position
                if (Cuic.isPosition('left', elm)) {
                    prop.left = -Cuic.outerWidth(elm, true);
                    prop.right = '';
                } else if (Cuic.isPosition('right', elm)) {
                    prop.right = -Cuic.outerWidth(elm, true);
                    prop.left = '';
                }
                // Vertical position
                if (Cuic.isPosition('bottom', elm)) {
                    prop.bottom = -Cuic.outerHeight(elm, true);
                    prop.top = '';
                } else if (Cuic.isPosition('top', elm)) {
                    prop.top = -Cuic.outerHeight(elm, true);
                    prop.bottom = '';
                }
            }

            self.resizeContent();

            // Minimize panel
            self.css(prop);
        };

        /**
         * Called when the panel is opening
         */
        self.onOpen = function () {
            // Resize content
            self.resizeContent();
            // Recalculate position
            self.setPosition(self.options.position);
        };

        //     // todo position panel when closed
        // const pos = Cuic.offset(self);

        // // Panel is hidden
        // if (pos.bottom < 0 || pos.left < 0 || pos.right < 0 || pos.top < 0) {
        //     const elm = self.getElement();
        //     let prop = Cuic.calculatePosition(elm, position);
        //
        //     // Horizontal position
        //     if (position.indexOf('left') !== -1) {
        //         prop.left = -$(elm).outerWidth(true) + 'px';
        //         prop.right = '';
        //     } else if (position.indexOf('right') !== -1) {
        //         prop.right = -$(elm).outerWidth(true) + 'px';
        //         prop.left = '';
        //     }
        //     // Vertical position
        //     if (position.indexOf('bottom') !== -1) {
        //         prop.bottom = -$(elm).outerHeight(true) + 'px';
        //         prop.top = '';
        //     } else if (position.indexOf('top') !== -1) {
        //         prop.top = -$(elm).outerHeight(true) + 'px';
        //         prop.bottom = '';
        //     }
        //
        //     self.css(prop);
        //     self.options.position = position;
        // }

        /**
         * Resizes the content
         * @return {Cuic.Panel}
         */
        self.resizeContent = function () {
            var elm = self.getElement();
            var parent = self.getParentElement();
            var display = elm.style.display;
            var maxHeight = window.innerHeight;

            // Use parent for max height
            if (parent && parent !== document.body) {
                maxHeight = Cuic.height(parent);
            }

            // Set panel max height
            var border = Cuic.border(elm);
            var margin = Cuic.margin(elm);
            maxHeight -= margin.vertical;
            maxHeight -= border.vertical;
            self.css({ 'max-height': maxHeight + 'px' });

            // Set content max height
            var contentMaxHeight = maxHeight;

            if ($header) {
                contentMaxHeight -= Cuic.outerHeight($header, true);
            }
            if ($footer) {
                contentMaxHeight -= Cuic.outerHeight($footer, true);
            }

            Cuic.css($content, {
                'max-height': contentMaxHeight + 'px',
                overflow: 'auto'
            });

            // Restore initial display state
            self.css({ display: display });

            return self;
        };

        /**
         * Sets the title
         * @param html
         * @return {Cuic.Panel}
         */
        self.setTitle = function (html) {
            $title.html(html);
            return self;
        };

        if (options.target) {
            // Find panel parts
            $header = $(self.getElement()).find('.panel-header');
            $title = $(self.getElement()).find('.panel-title');
            $content = $(self.getElement()).find('.panel-content');
            $footer = $(self.getElement()).find('.panel-footer');
        } else {
            // Add the header
            $header = $('<header>', {
                'class': 'panel-header'
            }).appendTo(self.getElement());

            // Add the title
            $title = $('<h5>', {
                'class': 'panel-title',
                html: options.title
            }).appendTo($header);

            // Add the body
            $content = $('<section>', {
                'class': 'panel-content',
                html: options.content
            }).appendTo(self.getElement());

            // Add the footer
            $footer = $('<footer>', {
                'class': 'panel-footer',
                html: options.footer
            }).appendTo(self.getElement());

            // Hide the header if not used
            if (!options.title) {
                $header.hide();
            }

            // Hide the footer if not used
            if (!options.footer) {
                $footer.hide();
            }
        }

        // Set panel position
        var fixed = self.getParentElement() === document.body;
        self.css({ position: fixed ? 'fixed' : 'absolute' });

        self.setPosition(self.options.position);
        self.resizeContent();

        // To hide the panel in the container,
        // the container must have a hidden overflow
        Cuic.css(self.getParentElement(), { overflow: 'hidden' });

        // Set the panel visibility
        // Since the visible option is used to check if the panel is visible
        // we force the panel to show or hide by setting visible to the inverse value.
        if (options.visible) {
            self.open();
        } else {
            self.close();
        }

        // Maximize the panel
        if (options.maximized) {
            self.maximize();
        }

        // Add the close button
        if (self.options.closeable) {
            $('<span>', {
                class: 'close-panel',
                html: self.closeButton
            }).prependTo($header);
        }

        // Close button
        Cuic.on('click', self.getElement(), function (ev) {
            if (Cuic.hasClass(ev.target, 'close-panel')) {
                ev.preventDefault();
                self.close();
            }
        });

        // Toggle button
        Cuic.on('click', self.getElement(), function (ev) {
            if (Cuic.hasClass(ev.target, 'toggle-panel')) {
                ev.preventDefault();
                self.toggle();
            }
        });

        // Close the panel when the user clicks outside of it
        Cuic.on('click', document.body, function (ev) {
            var elm = self.getElement();

            if (ev.target !== elm && Cuic.isParent(elm, ev.target)) {
                if (self.options.autoClose) {
                    self.close();
                }
            }
        });
        return _this13;
    }

    return _class12;
}(Cuic.Component);

/**
 * Panel default options
 */
Cuic.Panel.prototype.options = {
    autoClose: false,
    className: 'panel',
    closeable: true,
    closeButton: '×',
    parent: null,
    content: null,
    css: null,
    footer: null,
    maximized: false,
    position: 'left top',
    title: null,
    visible: false,
    zIndex: 1
};

/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2017 Karl STEIN
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

(function ($) {
    'use strict';

    var ns = Cuic.namespace('popup');

    /**
     * Creates a popup
     * @param options
     * @constructor
     */
    Cuic.Popup = function (options) {
        var self = this;
        var $element;
        var isClosing = false;
        var isOpened = false;
        var isOpening = false;
        var position;
        var $target;

        // Default options
        options = $.extend(true, {}, Cuic.Popup.prototype.options, options);

        // Define attributes
        self.autoClose = options.autoClose === true;
        self.autoRemove = options.autoRemove === true;
        self.closeable = options.closeable === true;
        self.closeButton = options.closeButton;

        // Define vars
        position = options.position;
        $target = $(options.target);

        /**
         * Closes the popup
         * @param callback
         * @return {Cuic.Popup}
         */
        self.close = function (callback) {
            if (isOpening || isOpened && !isClosing) {
                isClosing = true;
                isOpening = false;
                $element.stop(true, false).fadeOut(200, function () {
                    if (typeof callback === 'function') {
                        callback.call(self);
                    }
                    if (self.autoRemove) {
                        $element.remove();
                    }
                    isClosing = false;
                    isOpened = false;
                });
            }
            return self;
        };

        /**
         * Returns the element
         * @return {*}
         */
        self.getElement = function () {
            return $element;
        };

        /**
         * Checks if the popup is opened
         * @return {boolean}
         */
        self.isOpened = function () {
            return isOpened;
        };

        /**
         * Opens the popup
         * @param callback
         * @return {Cuic.Popup}
         */
        self.open = function (callback) {
            if (isClosing || !isOpened && !isOpening) {
                isClosing = false;
                isOpening = true;

                // Add the close button
                if (self.closeable) {
                    $element.find('.close-popup').remove();
                    $('<span>', {
                        class: 'close-popup',
                        html: self.closeButton
                    }).appendTo($element);
                }

                // If the content of the popup has changed,
                // we need to check if there is a close button
                $element.find('.close-popup').off('click').one(ns('click'), self.close);

                // Position the element
                self.setAnchor(position, $target);

                $element.stop(true, false).fadeIn(200, function () {
                    if (typeof callback === 'function') {
                        callback.call(self);
                    }
                    isOpening = false;
                    isOpened = true;
                });
            }
            return self;
        };

        /**
         * Sets the position relative to a target
         * @param pos
         * @param targ
         * @return {Cuic.Popup}
         */
        self.setAnchor = function (pos, targ) {
            position = pos;
            $target = $(targ || $target);
            Cuic.anchor($element, pos, $target);
            return self;
        };

        /**
         * Sets the content
         * @param html
         * @return {Cuic.Popup}
         */
        self.setContent = function (html) {
            $element.html(html);
            return self;
        };

        /**
         * Toggles the popup visibility
         * @param callback
         * @return {Cuic.Popup}
         */
        self.toggle = function (callback) {
            if (isClosing || !isOpened && !isOpening) {
                self.open(callback);
            } else {
                self.close(callback);
            }
            return self;
        };

        // Create the element
        $element = $('<div>', {
            class: options.className,
            html: options.content
        }).appendTo(document.body);

        // Set custom styles
        Cuic.css($element, options.css);

        // Set required styles
        $element.css({
            display: 'none',
            position: 'absolute',
            zIndex: options.zIndex
        });

        // Close the popup when the user clicks outside of it
        $(document).off(ns('mousedown')).on(ns('mousedown'), function (ev) {
            var target = $(ev.target);

            if (target !== $element && target.closest($element).length === 0) {
                if (self.autoClose && isOpened) {
                    self.close();
                }
            }
        });
    };

    /**
     * Default options
     * @type {*}
     */
    Cuic.Popup.prototype.options = {
        autoClose: true,
        autoRemove: true,
        className: 'popup',
        closeable: false,
        closeButton: '×',
        content: null,
        css: null,
        position: 'right',
        target: null,
        zIndex: 9
    };
})(jQuery);

/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2017 Karl STEIN
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

(function ($) {
    'use strict';

    Cuic.Switcher = function (options) {
        var self = this;
        var activeElement;
        var index = 0;
        var started = false;
        var timer;

        // Default options
        options = Cuic.extend(true, {
            autoStart: true,
            delay: 3000,
            repeat: true,
            target: null
        }, options);

        // Define attributes
        self.autoStart = options.autoStart === true;
        self.delay = parseInt(options.delay);
        self.repeat = options.repeat === true;

        // Get target
        var element = $(options.target);

        if (element.length < 1) {
            throw new Error("Invalid target");
        }

        /**
         * Displays the first element
         */
        self.first = function () {
            self.goTo(0);
        };

        /**
         * Returns the active element
         * @return {*}
         */
        self.getActiveElement = function () {
            return activeElement;
        };

        /**
         * Returns the switcher's element
         * @return {*|HTMLElement}
         */
        self.getElement = function () {
            return element;
        };

        /**
         * Returns the element at the specified index
         * @return {*}
         */
        self.getElementAt = function (index) {
            return element.children().eq(index);
        };

        /**
         * Returns the index of the visible element
         * @return {*}
         */
        self.getIndex = function () {
            return element.children().index(activeElement) || 0;
        };

        /**
         * Displays the element at the specified index
         * @param pos
         */
        self.goTo = function (pos) {
            var started = self.isStarted();
            var children = element.children();
            var childrenSize = children.length;
            pos = parseInt(pos);

            if (pos >= childrenSize) {
                index = self.repeat ? 0 : childrenSize - 1;
            } else if (pos < 0) {
                index = self.repeat ? childrenSize - 1 : 0;
            } else {
                index = pos;
            }

            if (index !== self.getIndex()) {
                self.stop();

                // Get the visible element
                activeElement = children.eq(index);

                // Hide visible elements
                children.hide();

                // Show the active element
                activeElement.fadeIn(500, function () {
                    if (started) {
                        self.start();
                    }
                });
            }
        };

        /**
         * Checks if the switcher is started
         * @return {boolean}
         */
        self.isStarted = function () {
            return started;
        };

        /**
         * Displays the last element
         */
        self.last = function () {
            self.goTo(element.children().length - 1);
        };

        /**
         * Displays the next element
         */
        self.next = function () {
            self.goTo(index + 1);
        };

        /**
         * Displays the previous element
         */
        self.previous = function () {
            self.goTo(index - 1);
        };

        /**
         * Starts the started
         */
        self.start = function () {
            if (!started) {
                timer = setInterval(self.next, self.delay);
                started = true;
            }
        };

        /**
         * Stop the started
         */
        self.stop = function () {
            if (started) {
                clearInterval(timer);
                started = false;
            }
        };

        // Hide elements
        activeElement = self.getElementAt(0);
        element.children().not(activeElement).hide();

        // Auto start timer
        if (self.autoStart) {
            self.start();
        }
    };
})(jQuery);

/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2017 Karl STEIN
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

(function ($) {
    'use strict';

    var ns = Cuic.namespace('table');

    /**
     * Enables interactions on a table
     * @todo create an object
     * @param options
     * @return {jQuery}
     */
    Cuic.Table = function (options) {
        // Set default options
        options = $.extend(true, {
            onSorted: null,
            selectedClass: 'selected',
            selectRowOnClick: false,
            sortableClass: 'sortable',
            sortColumn: 0,
            sortOrder: 'asc',
            target: null
        }, options);

        // Get target
        var table = $(options.target);

        if (table.length > 1) {
            throw 'Only one table is expected as target';
        } else if (table.length === 0) {
            throw 'Invalid table target';
        }

        // Check if the element table
        if (!table.is('table')) {
            throw 'The target is not a table : ' + options.target;
        }

        // Get the table zones
        var thead = table.children('thead');
        var tbody = table.children('tbody');
        var tfoot = table.children('tfoot');

        // Mark selected rows when clicked
        if (options.selectRowOnClick) {
            tbody.children('tr').off(ns('click')).on(ns('click'), function (ev) {
                if (ev.target.nodeName === 'TD') {
                    $(this).toggleClass(options.selectedClass);
                }
            });
        }

        /**
         * Sorts the table rows
         * @param index
         * @param order
         */
        table.sort = function (index, order) {
            var rows = [];

            // Get all rows
            tbody.children('tr').each(function () {
                rows.push($(this));
            });

            // Removes order from other columns
            var column = thead.find('tr > th').eq(index);
            thead.find('tr > th').not(column).removeClass('ascendant descendant sorted');

            // Add the sorted class to the column
            column.addClass('sorted');
            tbody.find('tr > td').removeClass('sorted');
            tbody.find('tr').each(function () {
                $(this).children().eq(index).addClass('sorted');
            });

            if (rows.length > 1) {
                // Sort the rows
                rows.sort(function (row1, row2) {
                    if (row1 !== undefined && row1 !== null && row2 !== undefined && row2 !== null) {
                        var value1 = row1.children('td').eq(index).html();
                        var value2 = row2.children('td').eq(index).html();

                        if (typeof value1 === 'string') {
                            value1 = value1.toLowerCase();
                        }

                        if (typeof value2 === 'string') {
                            value2 = value2.toLowerCase();
                        }

                        if (value1 > value2) {
                            return 1;
                        }

                        if (value1 === value2) {
                            return 0;
                        }
                    }
                    return -1;
                });

                // Reverse the order
                if (order === 'desc' || order == -1) {
                    rows.reverse();
                }

                // Sort all rows
                for (var i = 0; i < rows.length; i += 1) {
                    rows[i].appendTo(tbody);
                }

                // Calls the listener
                if (typeof options.onSorted === 'function') {
                    options.onSorted(index, order);
                }
            }
        };

        // Sort the table
        var defaultColumn = thead.find('.default');
        defaultColumn = defaultColumn.length === 1 ? defaultColumn : thead.find('.sortable:first');

        table.sort(defaultColumn.index(), defaultColumn.hasClass('descendant') ? 'desc' : 'asc');

        // Handle clicks on sortable columns
        thead.find('tr > .' + options.sortableClass).off(ns('click')).on(ns('click'), function (ev) {
            if (ev.currentTarget === ev.target) {
                var column = $(this);
                var index = column.index();
                var order;

                if (column.hasClass('ascendant')) {
                    column.removeClass('ascendant');
                    column.addClass('descendant');
                    order = 'desc';
                } else {
                    column.removeClass('descendant');
                    column.addClass('ascendant');
                    order = 'asc';
                }

                // Sort the column
                table.sort(index, order);
            }
        });

        return table;
    };
})(jQuery);

/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2017 Karl STEIN
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

(function ($) {
    'use strict';

    var ns = Cuic.namespace('tabs');
    var tabIndex = 0;

    /**
     * Creates a group of tabs
     * @param options
     * @constructor
     */
    Cuic.Tabs = function (options) {
        var self = this;

        // Set default options
        options = $.extend(true, {
            content: null,
            defaultTab: 0,
            target: null
        }, options);

        // Get the tabs
        var target = $(options.target);
        self.tabs = target.children('.tab');
        self.content = $(options.content);

        var defaultTab = self.tabs.filter('.default');

        if (defaultTab.length === 1) {
            // Set the default tab
            self.defaultTab = defaultTab.index();
        } else {
            // Set the first tab as default if the default tab is not defined in the HTML
            self.defaultTab = options.defaultTab;
            self.tabs.eq(self.defaultTab).addClass('default');
        }

        // Set default tab as active
        self.tabs.filter('.default').addClass('active');

        self.tabs.each(function () {
            var tab = $(this);
            var tabContent = self.content.find('#' + tab.attr('data-content'));

            // Set the tabindex for keyboard tabulation
            tab.attr('tabindex', tabIndex += 1);

            // Hide all tabs but not the default tab
            if (!tab.hasClass('default')) {
                tabContent.hide();
            }
        });

        // Display the content of the tab when it is focused
        self.tabs.off(ns('focus')).on(ns('focus'), function (ev) {
            self.selectTab($(ev.currentTarget).index());
        });
    };

    /**
     * Disables a tab
     * @param index
     * @return {jQuery}
     */
    Cuic.Tabs.prototype.disableTab = function (index) {
        if (index == this.getActiveTabIndex()) {
            this.selectPreviousTab();
        }
        return this.getTab(index).addClass('disabled');
    };

    /**
     * Enables a tab
     * @param index
     * @return {jQuery}
     */
    Cuic.Tabs.prototype.enableTab = function (index) {
        return this.getTab(index).removeClass('disabled');
    };

    /**
     * Returns the active tab
     * @return {jQuery}
     */
    Cuic.Tabs.prototype.getActiveTab = function () {
        return this.tabs.filter('.active:first');
    };

    /**
     * Returns the index of the active tab
     * @return {number}
     */
    Cuic.Tabs.prototype.getActiveTabIndex = function () {
        return this.getActiveTab().index();
    };

    /**
     * Returns a tab
     * @param index
     * @return {jQuery}
     */
    Cuic.Tabs.prototype.getTab = function (index) {
        return this.tabs.eq(index);
    };

    /**
     * Returns a tab content
     * @param index
     * @return {jQuery}
     */
    Cuic.Tabs.prototype.getTabContent = function (index) {
        var tab = this.getTab(index);
        return this.content.find('#' + tab.attr('data-content'));
    };

    /**
     * Selects the default tab
     * @return {jQuery}
     */
    Cuic.Tabs.prototype.selectDefaultTab = function () {
        return this.selectTab(this.defaultTab);
    };

    /**
     * Selects the next tab
     * @return {jQuery}
     */
    Cuic.Tabs.prototype.selectNextTab = function () {
        return this.selectTab(this.getActiveTab().next(':not(.disabled)').index());
    };

    /**
     * Selects the previous tab
     * @return {jQuery}
     */
    Cuic.Tabs.prototype.selectPreviousTab = function () {
        return this.selectTab(this.getActiveTab().prev(':not(.disabled)').index());
    };

    /**
     * Selects a tab by index
     * @param index
     * @return {jQuery}
     */
    Cuic.Tabs.prototype.selectTab = function (index) {
        var tab = this.getTab(index);
        var tabContent = this.getTabContent(index);

        if (!tab.hasClass('disabled')) {
            this.tabs.removeClass('active');
            tab.addClass('active');
            this.content.children().not(tabContent).hide();
            tabContent.stop(true, false).fadeIn(200);
        }
    };
})(jQuery);

/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2017 Karl STEIN
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

(function ($) {
    'use strict';

    var ns = Cuic.namespace('tooltip');
    var tooltips = [];

    /**
     * Creates a tooltip
     * @param options
     * @constructor
     */
    Cuic.Tooltip = function (options) {
        var self = this;
        var element;
        var $element;
        var position;
        var selector;

        // Set default options
        options = Cuic.extend(true, {}, Cuic.Tooltip.prototype.options, options);

        // Define attributes
        self.attribute = options.attribute;
        self.followPointer = options.followPointer === true;

        // Define vars
        position = options.position;
        selector = options.selector;

        // Add the tooltip to the list
        tooltips.push(self);

        /**
         * Closes the tooltip
         * @param callback
         * @return {Cuic.Tooltip}
         */
        self.close = function (callback) {
            if (self.isOpened()) {
                Cuic.once('transitionend', element, function () {
                    Cuic.debug('Tooltip.closed');
                    // $elm.removeClass('closing');
                    Cuic.call(callback, self);
                    $element.css({ display: 'none' });

                    if (self.autoRemove) {
                        $element.remove();
                    }
                });
                Cuic.debug('Tooltip.close');
                $element.addClass('closed');
                // $elm.addClass('closing');
                $element.removeClass('opening');
                $element.removeClass('opened');
            }
            return self;
        };

        /**
         * Returns the element
         * @return {*}
         */
        self.getElement = function () {
            return $element;
        };

        /**
         * Checks if the tooltip is closing
         * @return {boolean}
         */
        self.isClosing = function () {
            return $element.hasClass('closing');
        };

        /**
         * Checks if the tooltip is opened
         * @return {boolean}
         */
        self.isOpened = function () {
            return $element.hasClass('opened');
        };

        /**
         * Checks if the tooltip is opening
         * @return {boolean}
         */
        self.isOpening = function () {
            return $element.hasClass('opening');
        };

        /**
         * Opens the tooltip
         * @param callback
         * @return {Cuic.Tooltip}
         */
        self.open = function (callback) {
            if (!self.isOpened()) {
                Cuic.once('transitionend', element, function () {
                    Cuic.debug('Tooltip.opened');
                    // $elm.removeClass('opening');
                    Cuic.call(callback, self);
                });
                Cuic.debug('Tooltip.open');
                $element.addClass('opened');
                // $elm.addClass('opening');
                $element.removeClass('closing');
                $element.removeClass('closed');
                $element.css({ display: 'block' });
            }
            return self;
        };

        /**
         * Sets the tooltip content
         * @param html
         * @return {Cuic.Tooltip}
         */
        self.setContent = function (html) {
            content.html(html);
            return self;
        };

        /**
         * Sets the position relative
         * @param pos
         * @return {Cuic.Tooltip}
         */
        self.setPosition = function (pos) {
            position = pos;
            return self;
        };

        /**
         * Toggles the tooltip visibility
         * @param callback
         * @return {Cuic.Tooltip}
         */
        self.toggle = function (callback) {
            if (self.isClosing() || !self.isOpened()) {
                self.open(callback);
            } else {
                self.close(callback);
            }
            return self;
        };

        // Create the element
        $element = $('<div>', {
            'class': options.className
        }).appendTo(document.body);

        // Get element reference
        element = $element.get(0);

        // Set custom styles
        Cuic.css($element, options.css);

        // Set required styles
        $element.css({
            display: 'none',
            position: 'absolute',
            zIndex: options.zIndex
        });

        var body = $(document.body);
        var content = $('<div>', {}).appendTo($element);
        var tail = $('<span>', {
            'class': 'tail',
            style: { position: 'absolute', display: 'inline-block' }
        }).appendTo($element);

        function refreshTail() {
            switch (position) {
                case 'top':
                    tail.removeClass('tail-top tail-left tail-right').addClass('tail-bottom');
                    tail.css({
                        left: '50%',
                        right: 'auto',
                        top: 'auto',
                        bottom: -tail.height() + 'px',
                        margin: '0 0 0 ' + -tail.width() / 2 + 'px'
                    });
                    break;

                case 'bottom':
                    tail.removeClass('tail-bottom tail-left tail-right').addClass('tail-top');
                    tail.css({
                        left: '50%',
                        right: 'auto',
                        top: -tail.height() + 'px',
                        bottom: 'auto',
                        margin: '0 0 0 ' + -tail.width() / 2 + 'px'
                    });
                    break;

                case 'right':
                    tail.removeClass('tail-top tail-bottom tail-right').addClass('tail-left');
                    tail.css({
                        left: -tail.width() + 'px',
                        right: 'auto',
                        top: '50%',
                        bottom: 'auto',
                        margin: -tail.height() / 2 + 'px 0 0 0'
                    });
                    break;

                case 'left':
                    tail.removeClass('tail-top tail-bottom tail-left').addClass('tail-right');
                    tail.css({
                        left: 'auto',
                        right: -tail.width() + 'px',
                        top: '50%',
                        bottom: 'auto',
                        margin: -tail.height() / 2 + 'px 0 0 0'
                    });
                    break;
            }
        }

        // Open tooltip when mouse enter area
        body.off(ns('mouseenter', selector)).on(ns('mouseenter', selector), selector, function (ev) {
            var t = $(ev.currentTarget);
            var text = t.attr(self.attribute);

            if (!text || !text.length) {
                text = t.attr('data-tooltip');
            }

            if (text && text.length) {
                t.attr(self.attribute, '');
                t.attr('data-tooltip', text);

                content.html(text);

                if (self.followPointer) {
                    Cuic.anchor($element, position, [ev.pageX, ev.pageY]);
                } else {
                    Cuic.anchor($element, position, ev.currentTarget);
                    refreshTail();
                }
                self.open();
            }
        });

        // Move tooltip when mouse moves over area
        // todo optimize
        body.off(ns('mousemove', selector)).on(ns('mousemove', selector), selector, function (ev) {
            if (self.followPointer) {
                Cuic.anchor($element, position, [ev.pageX, ev.pageY]);
            } else {
                Cuic.anchor($element, position, ev.currentTarget);
                refreshTail();
            }
        });

        // Close tooltip when mouse leaves area
        body.off(ns('mouseleave', selector)).on(ns('mouseleave', selector), selector, function (ev) {
            self.close();
        });
    };

    /**
     * Default options
     * @type {*}
     */
    Cuic.Tooltip.prototype.options = {
        attribute: 'title',
        className: 'tooltip',
        css: null,
        followPointer: true,
        position: 'right bottom',
        selector: '[title]',
        zIndex: 10
    };

    $(document).ready(function () {
        // Closes the tooltip on click (to avoid tooltip to remain if the page content changed)
        $(document.body).off(ns('click')).on(ns('click'), function () {
            for (var i = 0; i < tooltips.length; i += 1) {
                tooltips[i].close();
            }
        });
    });
})(jQuery);

/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2017 Karl STEIN
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

(function ($) {
    'use strict';

    var ns = Cuic.namespace('tree');

    /**
     * Enables interactions on a tree
     * @todo create an object
     * @param options
     * @return {jQuery}
     */
    Cuic.Tree = function (options) {
        // Set default options
        options = Cuic.extend(true, {
            collapsed: true,
            itemClass: 'tree-item',
            itemContentClass: 'tree-item-content',
            itemNameClass: 'tree-item-name',
            target: null
        }, options);

        var tree = $(options.target);

        if (tree.length !== 1) {
            throw new Error('Target not found : ' + options.target);
        }

        var items = tree.find('.' + options.itemClass);

        // Set the first item as default
        if (items.filter('.default').length == 0) {
            items.first().addClass('default');
        }

        items.filter('.default').addClass('active');

        if (options.collapsed) {
            tree.find('.' + options.itemClass).not('.expanded').not('.default').children('.' + options.itemContentClass).hide();
        } else {
            tree.find('.collapsed').children('.' + options.itemContentClass).hide();
        }

        items.each(function () {
            var item = $(this);
            var name = item.children('.' + options.itemNameClass);
            var content = item.children('.' + options.itemContentClass);

            // Apply the class corresponding to the state
            if (content.length == 1) {
                item.addClass(content.is(':visible') ? 'expanded' : 'collapsed');
            }

            item.children('.' + options.itemNameClass).off(ns('click')).on(ns('click'), function () {
                if (!item.hasClass('disabled')) {
                    if (content.length === 1) {
                        // Update the active item
                        tree.find('.active').removeClass('active');

                        if (content.is(':visible')) {
                            item.removeClass('expanded').addClass('collapsed');
                        } else {
                            item.addClass('active');
                            item.removeClass('collapsed').addClass('expanded');
                        }
                        content.toggle(200);
                    }
                }
            });
        });
        return tree;
    };
})(jQuery);
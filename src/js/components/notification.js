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

    var ns = Cuic.namespace('notification');

    /**
     * Creates a notification
     * @param options
     * @constructor
     */
    Cuic.Notification = function (options) {
        var self = this;
        var $container;
        var $element;
        var isClosing = false;
        var isOpened = false;
        var isOpening = false;
        var position;
        var timer;

        // Default options
        options = $.extend(true, {}, Cuic.Notification.prototype.options, options);

        // Define attributes
        self.autoClose = options.autoClose === true;
        self.autoRemove = options.autoRemove === true;
        self.closeable = options.closeable === true;
        self.closeButton = options.closeButton;
        self.duration = parseInt(options.duration);

        // Define vars
        $container = $(options.container);
        position = options.position;

        // Use document body as container
        if ($container.length === 0) {
            $container = $(document.body);
        }

        /**
         * Closes the notification
         * @param callback
         * @return {Cuic.Notification}
         */
        self.close = function (callback) {
            if (isOpening || (isOpened && !isClosing)) {
                isClosing = true;
                isOpening = false;

                $element.stop(true, false).hide();

                if (typeof callback === 'function') {
                    callback.call(self);
                }
                if (self.autoRemove) {
                    $element.remove();
                }
                isClosing = false;
                isOpened = false;
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
         * Checks if the notification is opened
         * @return {boolean}
         */
        self.isOpened = function () {
            return isOpened;
        };

        /**
         * Opens the notification
         * @param callback
         * @return {Cuic.Notification}
         */
        self.open = function (callback) {
            var autoClose = function () {
                clearTimeout(timer);
                timer = setTimeout(function () {
                    if (self.autoClose) {
                        self.close();
                    }
                }, self.duration);
            };

            if (isClosing || (!isOpened && !isOpening)) {
                isClosing = false;
                isOpening = true;

                // Add the close button
                // if (self.closeable) {
                //     element.find('.close-notification').remove();
                //     $('<span>', {
                //         class: 'close-notification',
                //         html: self.closeButton
                //     }).appendTo(element);
                // }

                // If the content of the notification has changed,
                // we need to check if there is a close button
                $element.find('.close-notification').off(ns('click')).one(ns('click'), self.close);

                // Avoid closing the notification if the mouse is over
                $element.hover(function () {
                    clearTimeout(timer);
                }, function () {
                    autoClose();
                });

                // Position the notification
                $element.css({position: $container.get(0).nodeName === 'BODY' ? 'fixed' : 'absolute'});

                // Set the position
                self.setPosition(position);

                // Stop animation
                $element.stop(true, false);
                $element.show();

                if (typeof callback === 'function') {
                    callback.call(self);
                }
                isOpening = false;
                isOpened = true;

                if (self.autoClose) {
                    autoClose();
                }

            } else if (isOpened) {
                // Restart timeout
                autoClose();
            }
            return self;
        };

        /**
         * Sets the content
         * @param html
         * @return {Cuic.Notification}
         */
        self.setContent = function (html) {
            $element.html(html);
            return self;
        };

        /**
         * Sets the position of the notification and optionally its container
         * @param pos
         * @param cont
         * @return {Cuic.Notification}
         */
        self.setPosition = function (pos, cont) {
            position = pos;
            $container = $(cont || $container);
            Cuic.position($element, position, $container);
            return self;
        };

        /**
         * Toggles the notification visibility
         * @param callback
         * @return {Cuic.Notification}
         */
        self.toggle = function (callback) {
            if (isClosing || (!isOpened && !isOpening)) {
                self.open(callback);
            } else {
                self.close(callback);
            }
            return self;
        };

        // Create the element
        $element = $('<div>', {
            'class': options.className,
            html: options.content
        });

        // Set custom styles
        Cuic.css($element, options.css);

        // Override styles
        $element.css({
            display: 'none',
            position: 'absolute',
            zIndex: options.zIndex
        });
    };

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
        container: null,
        content: null,
        css: null,
        duration: 2000,
        position: 'center',
        zIndex: 10
    };

    /**
     * Creates a notification stack
     * @param options
     * @constructor
     */
    Cuic.Notification.Stack = function (options) {
        var self = this;
        var container;
        var element;
        var position;

        // Set default options
        options = $.extend(true, {}, Cuic.Notification.Stack.prototype.options, options);

        // Define vars
        container = $(options.container);
        position = options.position;

        // Use document body as container
        if (container.length === 0) {
            container = $(document.body);
        }

        /**
         * Add a notification to the stack
         * @param options
         * @param callback
         * @return {Cuic.Notification}
         */
        self.add = function (options, callback) {
            options = $.extend({}, options, {
                container: element,
                position: ''
            });

            // Create the notification
            var notif = new Cuic.Notification(options);
            var notifElement = notif.getElement();

            // Insert the notification
            if (position.indexOf('bottom') !== -1) {
                element.append(notifElement);
            } else {
                element.prepend(notifElement);
            }
            notif.open(callback);

            notifElement.css({
                position: 'static',
                display: 'block',
                height: '',
                width: ''
            });
            return notif;
        };

        /**
         * Returns the element
         * @return {*}
         */
        self.getElement = function () {
            return element;
        };

        /**
         * Returns the number of elements in the stack
         * @return {Number}
         */
        self.getSize = function () {
            return element.children().length;
        };

        /**
         * Sets the position of the stack and optionally its container
         * @param pos
         * @param cont
         * @return {Cuic.Notification.Stack}
         */
        self.setPosition = function (pos, cont) {
            position = pos;
            container = $(cont || container);
            Cuic.position(element, position, container);
            return self;
        };

        // Create the element
        element = $('<div>', {
            'class': options.className
        }).appendTo(container);

        // Set custom styles
        Cuic.css($element, options.css);

        // Override styles
        element.css({
            position: container.get(0).nodeName === 'BODY' ? 'fixed' : 'absolute',
            zIndex: self.zIndex
        });

        // Position the element
        Cuic.position(element, position, container);
    };

    /**
     * Default options
     * @type {*}
     */
    Cuic.Notification.Stack.prototype.options = {
        className: 'notification-area',
        container: null,
        css: null,
        position: 'right top',
        zIndex: 10
    };

})
(jQuery);

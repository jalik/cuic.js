/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2016 Karl STEIN
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

    var ns = Cuic.namespace('shortcut');

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

    /**
     * Creates a shortcut
     * @param options
     */
    Cuic.Shortcut = function (options) {
        var self = this;

        options = $.extend(true, {
            altKey: false,
            callback: null,
            ctrlKey: false,
            shiftKey: false,
            keyCode: null,
            target: document.body
        }, options);

        // Define attributes
        self.altKey = options.altKey;
        self.callback = options.callback;
        self.ctrlKey = options.ctrlKey;
        self.keyCode = options.keyCode;
        self.shiftKey = options.shiftKey;

        // Get the target
        var target = $(options.target);

        // Watch key up event
        target.off(ns('keyup')).on(ns('keyup'), function (ev) {
            if ((self.keyCode === ev.keyCode || self.keyCode === ev.which)
                && self.altKey === ev.altKey
                && self.ctrlKey === ev.ctrlKey
                && self.shiftKey === ev.shiftKey) {
                options.callback.call(target, ev);
            }
        });
    };

})(jQuery);

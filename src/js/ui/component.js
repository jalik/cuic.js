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
Cuic.Component = class {

    constructor(node, attributes, options) {
        const ns = Cuic.namespace('ui');
        const self = this;

        // Set default options
        options = $.extend({}, Cuic.Component.prototype.options, options);

        // Create element
        self.element = document.createElement(node);
        self.$element = $(self.element);

        // Set element attributes
        for (let attr in attributes) {
            if (attributes.hasOwnProperty(attr)) {
                const value = attributes[attr];

                if (value !== null && value !== undefined) {
                    if (self.element[attr] !== undefined) {
                        self.element[attr] = value;
                    }
                    else if (attr === 'html') {
                        self.element.innerHTML = value;
                    }
                    else if (attr === 'text') {
                        self.element.innerText = value;
                    }
                }
            }
        }

        // Set element styles
        self.css(options.css);

        // Handle click events
        self.$element.on(ns('click'), (ev) => {
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
    addClass(className) {
        return Cuic.addClass(this.getElement(), className);
    }

    /**
     * Appends the element to the component
     * @param element
     */
    append(element) {
        if (element instanceof Cuic.Component) {
            element = element.getElement();
        }
        this.getElement().append(element);
    }

    /**
     * Appends the component to the element
     * @param element
     */
    appendTo(element) {
        if (element instanceof Cuic.Component) {
            element = element.getElement();
        }
        element.append(this.getElement());
    }

    /**
     * Closes the component
     * @param callback
     */
    close(callback) {
        this.onClose();
        this.removeClass('opened');
        this.addClass('closed');
        this.once('transitionend', (ev) => {
            this.onClosed(callback, ev);
        });
    }

    /**
     * Set styles
     * @param styles
     */
    css(styles) {
        return Cuic.css(this.getElement(), styles);
    }

    /**
     * Disables the component
     */
    disable() {
        this.getElement().disabled = true;
        this.addClass('disabled');
    }

    /**
     * Enables the component
     */
    enable() {
        this.getElement().disabled = false;
        this.removeClass('disabled');
    }

    /**
     * Returns component CSS classes
     * @return {Array|*}
     */
    getClasses() {
        return Cuic.getClasses(this.getElement());
    }

    /**
     * Returns the component element
     * @return {HTMLElement}
     */
    getElement() {
        return this.element;
    }

    /**
     * Checks if the component has the class
     * @param className
     * @return {*}
     */
    hasClass(className) {
        return Cuic.hasClass(this.getElement(), className);
    }

    /**
     * Checks if the component is enabled
     * @return {boolean}
     */
    isEnabled() {
        return this.getElement().disabled !== true
            || !this.hasClass('disabled');
    }

    /**
     * Maximizes the component in its container
     * @param position
     */
    maximize(position) {
        Cuic.maximize(this.getElement(), position);
    }

    /**
     * Minimizes the component in its container
     * @param position
     */
    minimize(position) {
        Cuic.minimize(this.getElement(), position);
    }

    /**
     * Remove the callback attached to the event
     * @param event
     * @param callback
     */
    off(event, callback) {
        Cuic.off(event, this.getElement(), callback);
    }

    /**
     * Executes the callback each time the event is triggered
     * @param event
     * @param callback
     */
    on(event, callback) {
        Cuic.on(event, this.getElement(), callback);
    }

    /**
     * Executes the callback once when the event is triggered
     * @param event
     * @param callback
     */
    once(event, callback) {
        Cuic.once(event, this.getElement(), callback);
    }

    /**
     * Called when the component is clicked
     */
    onClick() {
    }

    /**
     * Called when the component is closing
     */
    onClose() {
    }

    /**
     * Called when the component is closed
     */
    onClosed() {
    }

    /**
     * Called when the component is opened
     */
    onOpen() {
    }

    /**
     * Called when the component is opened
     */
    onOpened() {
    }

    /**
     * Opens the component
     * @param callback
     */
    open(callback) {
        this.bench = new Cuic.Benchmark();
        this.bench.start();
        this.onOpen();
        this.removeClass('closed');
        this.addClass('opened');
        this.once('transitionend', (ev) => {
            this.onOpened(callback, ev);
        });
    }

    /**
     * Removes the element from the DOM
     */
    remove() {
        this.getElement().remove();
    }

    /**
     * Removes the class from the component
     * @param className
     * @return {*}
     */
    removeClass(className) {
        return Cuic.removeClass(this.getElement(), className);
    }

    /**
     * Toggles the component
     * @param callback
     */
    toggle(callback) {
        if (this.isOpened()) {
            this.close(callback);
        } else {
            this.open(callback);
        }
    }
};

/**
 * Generic component default options
 */
Cuic.Component.prototype.options = {
    closeable: false,
    css: null
};

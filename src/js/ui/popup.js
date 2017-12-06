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

import Cuic from "../cuic";
import {Closable} from "./closable";
import {Collection} from "../utils/collection";
import {Element} from "./element";
import {Shortcut} from "../utils/shortcut";

export class Popup extends Closable {

    constructor(options) {
        // Set default options
        options = Cuic.extend({}, Popup.prototype.options, options, {
            mainClass: "popup"
        });

        // Create element
        super("div", {className: options.className}, options);

        // Add content
        this.content = new Element("div", {
            className: "popup-content",
            html: options.content
        }).appendTo(this);

        // Add tail
        this.tail = new Element("span", {
            className: "popup-tail"
        }).appendTo(this);

        /**
         * Popup shortcuts
         * @type {{close: *}}
         */
        this.shortcuts = {
            close: new Shortcut({
                element: this,
                keyCode: Cuic.keys.ESC,
                callback: () => {
                    this.close();
                }
            })
        };

        const autoClose = (ev) => {
            if (this.isOpened() && this.options.autoClose) {
                if (ev.target !== this.node() && !Cuic.element(ev.target).isChildOf(this)) {
                    this.close();
                }
            }
        };

        this.on("click", (ev) => {
            // Close button
            if (Cuic.element(ev.target).hasClass("btn-close")) {
                ev.preventDefault();
                this.close();
            }
        });

        // Reposition tail when popup position change
        this.onAnchored(() => {
            this.updateTail();
        });

        this.onClosed(() => {
            Cuic.off("click", document, autoClose);

            if (this.options.autoRemove) {
                this.remove();
            }
        });

        this.onOpen(() => {
            const target = Cuic.element(this.options.target);
            this.appendTo(target.parent());
            // Get anchor from data attribute
            const anchor = target.data("anchor") || this.options.anchor;
            const anchorPoint = target.data("anchor-point") || this.options.anchorPoint;
            this.anchor(anchor, anchorPoint, target);
        });

        this.onOpened(() => {
            // Close the popup when the user clicks outside of it
            Cuic.on("click", document, autoClose);
        });

        // Add element to collection
        Cuic.popups.add(this);
    }

    /**
     * Returns the content
     * @return {Element}
     */
    getContent() {
        return this.content;
    }

    /**
     * Sets popup content
     * @param html
     * @return {Popup}
     */
    setContent(html) {
        this.content.html(html);
        return this;
    }

    /**
     * Position the tail
     * @return {Popup}
     */
    updateTail() {
        let prop = {
            bottom: "",
            left: "",
            right: "",
            top: "",
        };

        // todo copy popup background color
        // prop["border-color"] = this.css("background-color");

        // Remove previous classes
        this.tail.removeClass("popup-tail-bottom popup-tail-left popup-tail-right popup-tail-top");

        // Top tail
        if (this.isAnchored("bottom")) {
            this.tail.addClass("popup-tail-top");
        }
        // Bottom tail
        if (this.isAnchored("top")) {
            this.tail.addClass("popup-tail-bottom");
        }
        // Right tail
        if (this.isAnchored("left")) {
            this.tail.addClass("popup-tail-right");
        }
        // Left tail
        if (this.isAnchored("right")) {
            this.tail.addClass("popup-tail-left");
        }

        // Apply CSS
        this.tail.css(prop);

        return this;
    }
}

Popup.prototype.options = {
    anchor: "top",
    autoClose: true,
    autoRemove: false,
    content: null,
    namespace: "popup",
    opened: false,
    target: null,
    zIndex: 9
};

Cuic.popups = new Collection();

Cuic.onWindowResized(() => {
    Cuic.popups.each((popup) => {
        if (popup.isInDOM() && popup.isShown()) {
            popup._disableTransitions();
            popup.anchor();
            popup._enableTransitions();
        }
    });
});
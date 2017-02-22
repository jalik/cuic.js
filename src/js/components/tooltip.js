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

Cuic.tooltips = new Cuic.Collection();

Cuic.Tooltip = class extends Cuic.Component {

    constructor(options) {
        // Set default options
        options = Cuic.extend({}, Cuic.Tooltip.prototype.options, options, {
            mainClass: 'tooltip'
        });

        // Create element
        super('div', {className: options.className}, options);

        // Public attributes
        this.currentTarget = null;

        // Add content
        this.content = new Cuic.Element('div', {
            className: 'tooltip-content'
        }).appendTo(this);

        // Add tooltip tail
        this.tail = new Cuic.Element('span', {
            className: 'tooltip-tail'
        }).appendTo(this);

        // Find tooltip targets
        const targets = Cuic.find(this.options.selector);

        targets.each((target) => {
            // Open tooltip when mouse enter area
            target.on('mouseenter', (ev) => {
                // Get stored tooltip content
                let content = target.data('tooltip');

                if (!content || !content.length) {
                    // Get tooltip content from attribute
                    content = target.attr(this.options.attribute);
                    // Avoid tooltip conflict
                    target.attr(this.options.attribute, '');
                    // Store tooltip content
                    target.data('tooltip', content);
                }

                // Update tooltip content
                if (content && content.length) {
                    this.content.html(content);
                }

                // Keep reference to current target
                this.currentTarget = ev.currentTarget;

                // Position tooltip
                this.update();
                this.open();
            });

            // Close tooltip when mouse leaves area
            target.on('mouseleave', () => {
                this.close();
                // Clear reference to current target
                this.currentTarget = null;
            });
        });

        // Add the tooltip to the list
        Cuic.tooltips.add(this);

        // Move tooltip when mouse moves and tooltip is opened
        Cuic.on('mousemove', document, (ev) => {
            if (this.options.followPointer && !this.isHidden()) {
                this.update(ev);
            }
        });

        const autoClose = (ev) => {
            if (this.isOpened() && this.options.autoClose) {
                if (ev.target !== this.node() && !Cuic.element(ev.target).isChildOf(this)) {
                    this.close();
                }
            }
        };

        // Reposition tail when tooltip position change
        this.onAnchored(() => {
            this.updateTail();
        });

        this.onClosed(() => {
            Cuic.off('click', document, autoClose);

            if (this.options.autoRemove) {
                this.remove();
            }
        });

        this.onOpened(() => {
            // Close the popup when the user clicks outside of it
            Cuic.on('click', document, autoClose);
        });
    }

    /**
     * Sets tooltip content
     * @param html
     * @return {Cuic.Tooltip}
     */
    setContent(html) {
        this.content.html(html);
        return this;
    }

    /**
     * Updates tooltip location
     * @param ev
     * @return {Cuic.Tooltip}
     */
    update(ev) {
        if (this.options.followPointer && ev) {
            if (this.parentNode() !== document.body) {
                this.appendTo(document.body);
            }
            this.anchor(this.options.anchor, [ev.pageX, ev.pageY]);
        }
        else if (this.currentTarget) {
            if (this.parentNode() !== this.currentTarget.parentNode) {
                this.appendTo(this.currentTarget.parentNode);
            }
            this.anchor(this.options.anchor, this.currentTarget);
        }
        return this;
    }

    /**
     * Position the tooltip tail
     * @return {Cuic.Tooltip}
     */
    updateTail() {
        let prop = {
            'margin-bottom': 0,
            'margin-left': 0,
            'margin-right': 0,
            'margin-top': 0,
            bottom: '',
            left: '',
            right: '',
            top: '',
        };

        // todo copy tooltip background color
        // prop['border-color'] = this.css('background-color');

        // Remove previous classes
        this.tail.removeClass('tooltip-tail-bottom tooltip-tail-left tooltip-tail-right tooltip-tail-top');

        // Top tail
        if (this.options.anchor.indexOf('bottom') !== -1) {
            this.tail.addClass('tooltip-tail-top');
            prop.top = -this.tail.outerHeight();
            prop['margin-left'] = -this.tail.outerWidth() / 2;
        }
        // Bottom tail
        if (this.options.anchor.indexOf('top') !== -1) {
            this.tail.addClass('tooltip-tail-bottom');
            prop.bottom = -this.tail.outerHeight();
            prop['margin-left'] = -this.tail.outerWidth() / 2;
        }
        // Right tail
        if (this.options.anchor.indexOf('left') !== -1) {
            this.tail.addClass('tooltip-tail-right');
            prop.right = -this.tail.outerWidth();
            prop['margin-top'] = -this.tail.outerHeight() / 2;
        }
        // Left tail
        if (this.options.anchor.indexOf('right') !== -1) {
            this.tail.addClass('tooltip-tail-left');
            prop.left = -this.tail.outerWidth();
            prop['margin-top'] = -this.tail.outerHeight() / 2;
        }
        // todo position tail in diagonal (top left, top right...)

        // Apply CSS
        this.tail.css(prop);

        return this;
    }
};

Cuic.Tooltip.prototype.options = {
    anchor: 'right',
    attribute: 'title',
    followPointer: true,
    namespace: 'tooltip',
    opened: false,
    selector: '[title]',
    zIndex: 10
};

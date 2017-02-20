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
        options = Cuic.extend({}, Cuic.Tooltip.prototype.options, options);

        // Create element
        super('div', {className: options.className}, options);

        const self = this;

        // Add component classes
        self.addClass('tooltip');

        // Add content
        self.content = new Cuic.Element('div', {
            className: 'tooltip-content'
        }).appendTo(self);

        // Add tooltip tail
        self.tail = new Cuic.Element('span', {
            className: 'tooltip-tail'
        }).appendTo(self);

        // Find tooltip targets
        const targets = Cuic.find(self.options.selector);

        targets.each((target) => {
            // Open tooltip when mouse enter area
            target.on('mouseenter', (ev) => {
                // Get stored tooltip content
                let content = target.data('tooltip');

                if (!content || !content.length) {
                    // Get tooltip content from attribute
                    content = target.attr(self.options.attribute);
                    // Avoid tooltip conflict
                    target.attr(self.options.attribute, '');
                    // Store tooltip content
                    target.data('tooltip', content);
                }

                // Update tooltip content
                if (content && content.length) {
                    self.content.html(content);
                }
                self.open();
            });

            // Move tooltip when mouse moves over area
            target.on('mousemove', (ev) => {
                if (self.isOpened()) {
                    if (self.options.followPointer) {
                        self.appendTo(document.body);
                        self.anchor(self.options.anchor, [ev.pageX, ev.pageY]);
                    } else {
                        self.appendTo(ev.target.parentNode);
                        self.anchor(self.options.anchor, ev.target);
                        self.refreshTail();
                    }
                }
            });

            // Close tooltip when mouse leaves area
            target.on('mouseleave', () => {
                self.close();
            });
        });

        // Close the panel when the user clicks outside of it
        Cuic.on('click', document, (ev) => {
            const elm = self.getElement();

            if (ev.target !== elm && !Cuic.isParent(elm, ev.target)) {
                self.close();
            }
        });

        // Add the tooltip to the list
        Cuic.tooltips.add(self);
    }

    /**
     * Called when the tooltip is closed
     */
    onClosed() {
        if (this.options.autoRemove) {
            this.remove();
        }
    }

    refreshTail() {
        switch (this.options.position) {
            case 'top':
                this.tail.removeClass('tail-top tail-left tail-right').addClass('tail-bottom');
                this.tail.css({
                    left: '50%',
                    right: 'auto',
                    top: 'auto',
                    bottom: -this.tail.height(),
                    margin: '0 0 0 ' + (-this.tail.width() / 2) + 'px'
                });
                break;

            case 'bottom':
                this.tail.removeClass('tail-bottom tail-left tail-right').addClass('tail-top');
                this.tail.css({
                    left: '50%',
                    right: 'auto',
                    top: -this.tail.height(),
                    bottom: 'auto',
                    margin: '0 0 0 ' + (-this.tail.width() / 2) + 'px'
                });
                break;

            case 'right':
                this.tail.removeClass('tail-top tail-bottom tail-right').addClass('tail-left');
                this.tail.css({
                    left: -this.tail.width(),
                    right: 'auto',
                    top: '50%',
                    bottom: 'auto',
                    margin: (-this.tail.height() / 2) + 'px 0 0 0'
                });
                break;

            case 'left':
                this.tail.removeClass('tail-top tail-bottom tail-left').addClass('tail-right');
                this.tail.css({
                    left: 'auto',
                    right: -this.tail.width(),
                    top: '50%',
                    bottom: 'auto',
                    margin: (-this.tail.height() / 2) + 'px 0 0 0'
                });
                break;
        }
    }

    /**
     * Sets the popup content
     * @param html
     * @return {Cuic.Tooltip}
     */
    setContent(html) {
        this.content.setHtml(html);
        return this;
    }
};

Cuic.Tooltip.prototype.options = {
    anchor: 'right bottom',
    attribute: 'title',
    className: 'tooltip',
    followPointer: true,
    namespace: 'tooltip',
    selector: '[title]',
    zIndex: 10
};

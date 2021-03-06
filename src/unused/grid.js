/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2020 Karl STEIN
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
 * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import extend from '@jalik/extend';
import Movable from '../js/ui/movable';
import Resizable from '../js/ui/resizable';

let counter = 0;

/**
 * Creates a Grid
 * @param options
 * @constructor
 */
function Grid(options) {
  let grid = this;

  // Default options
  options = extend(true, Grid.prototype.options, options);

  // Set the options
  grid.animSpeed = Number.parseInt(options.animSpeed, 10);
  grid.autoResize = options.autoResize === true;
  grid.colsWidth = parseFloat(options.colsWidth);
  grid.editable = options.editable === true;
  grid.fps = Number.parseInt(options.fps, 10);
  grid.maxCols = Number.parseInt(options.maxCols, 10);
  grid.maxRows = Number.parseInt(options.maxRows, 10);
  grid.minCols = Number.parseInt(options.minCols, 10);
  grid.minRows = Number.parseInt(options.minRows, 10);
  grid.rowsHeight = parseFloat(options.rowsHeight);
  grid.spacing = parseFloat(options.spacing);
  grid.widgets = {};

  // Get the grid
  grid.element = $(options.target);

  // Set the grid style
  grid.element.css({
    display: 'block',
    minHeight: options.height,
    minWidth: options.width,
  });

  // Set the grid size
  grid.resize(options.cols, options.rows);

  // Set the grid resizable
  new Resizable({ target: grid.element }).onResizeEnd(() => {
    const cols = grid.getSizeX(grid.element.outerWidth());
    const rows = grid.getSizeY(grid.element.outerHeight());
    grid.maxCols = cols;
    grid.maxRows = rows;
    grid.maximize();
  });

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
      zIndex: 1,
    },
  });

  // Add widgets to the grid
  grid.element.children(options.widgetSelector).each(function () {
    let id = this.id || 'widget-' + (counter += 1);
    grid.addWidget(id, new Grid.Widget({
      target: this,
    }));
  });

  if (grid.autoResize) {
    grid.minimize();
  }
}

/**
 * Adds a widget to the grid
 * @param id
 * @param widget
 * @return {Widget}
 */
Grid.prototype.addWidget = function (id, widget) {
  let grid = this;
  let element = widget.element;
  let preview = grid.preview;

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
    position: 'absolute',
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

  let height;
  let width;

  // Make the widget resizable
  let resizable = new Resizable({
    target: widget.element,
    container: grid.element,
  });

  // Set behavior when resizing widget
  resizable.onResize = function () {
    let tmpHeight = element.outerHeight();
    let tmpWidth = element.outerWidth();
    let sizeX = Math.round(tmpWidth / (grid.colsWidth + grid.spacing));
    let sizeY = Math.round(tmpHeight / (grid.rowsHeight + grid.spacing));

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
      width: grid.calculateWidth(sizeX),
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
        width: width,
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
  resizable.onResizeEnd(function () {
    // Remove the preview
    preview.detach();

    // Resize the widget
    let sizeX = grid.getSizeX(preview.outerWidth());
    let sizeY = grid.getSizeY(preview.outerHeight());
    grid.resizeWidget(widget, sizeX, sizeY);

    // Fit the grid to its content
    if (grid.autoResize) {
      grid.minimize();
    }
  });

  // Make the widget movable
  let movable = new Movable({
    target: widget.element,
    rootOnly: true,
    container: grid.element,
  });

  // Set behavior when dragging widget
  movable.onMove = function () {
    let left = parseFloat(element.css('left'));
    let top = parseFloat(element.css('top'));
    let col = grid.getPositionX(left);
    let row = grid.getPositionY(top);

    if (!(col > 0 && col + widget.sizeX <= grid.cols + 1
      && row > 0 && row + widget.sizeY <= grid.rows + 1)) {
      col = widget.col;
      row = widget.row;
    }
    preview.css({
      left: grid.calculateLeft(col),
      top: grid.calculateTop(row),
    });
  };

  // Set behavior when dragging starts
  movable.onMoveStart = function (ev) {
    if (grid.editable && widget.movable && !widget.isResizing()) {
      height = element.outerHeight();
      width = element.outerWidth();

      // Move widget to foreground
      element.css({ zIndex: 2 });

      // Display the widget preview
      grid.element.append(preview.css({
        left: element.css('left'),
        height: height,
        top: element.css('top'),
        width: width,
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
  movable.onMoveEnd = function () {
    // Remove the preview
    preview.detach();

    // Position the widget
    let left = parseFloat(element.css('left'));
    let top = parseFloat(element.css('top'));
    let col = grid.getSizeX(left) + 1;
    let row = grid.getSizeY(top) + 1;
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
Grid.prototype.calculateHeight = function (sizeY) {
  return Number.parseInt(sizeY) * (this.rowsHeight + this.spacing, 10) - this.spacing;
};

/**
 * Returns the left offset of a position
 * @param posX
 * @return {number}
 */
Grid.prototype.calculateLeft = function (posX) {
  return Number.parseInt(posX) * (this.colsWidth + this.spacing, 10) - this.colsWidth;
};

/**
 * Returns the top offset of a position
 * @param posY
 * @return {number}
 */
Grid.prototype.calculateTop = function (posY) {
  return Number.parseInt(posY) * (this.rowsHeight + this.spacing, 10) - this.rowsHeight;
};

/**
 * Returns the width of a size
 * @param sizeX
 * @return {number}
 */
Grid.prototype.calculateWidth = function (sizeX) {
  return Number.parseInt(sizeX) * (this.colsWidth + this.spacing, 10) - this.spacing;
};

/**
 * Removes all widgets from the grid
 * @return {Grid}
 */
Grid.prototype.clear = function () {
  for (let id in this.widgets) {
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
Grid.prototype.getPosition = function (left, top) {
  return [this.getPositionX(left), this.getPositionY(top)];
};

/**
 * Returns the column of a position
 * @param posX
 * @return {number}
 */
Grid.prototype.getPositionX = function (posX) {
  return Math.round(parseFloat(posX) / (this.colsWidth + this.spacing)) + 1;
};

/**
 * Returns the row of a position
 * @param posY
 * @return {number}
 */
Grid.prototype.getPositionY = function (posY) {
  return Math.round(parseFloat(posY) / (this.rowsHeight + this.spacing)) + 1;
};

/**
 * Returns a size from a width and height
 * @param width
 * @param height
 * @return {number[]}
 */
Grid.prototype.getSize = function (width, height) {
  return [this.getSizeX(width), this.getSizeY(height)];
};

/**
 * Returns a size from a width
 * @param width
 * @return {number}
 */
Grid.prototype.getSizeX = function (width) {
  return Math.round(parseFloat(width) / (this.colsWidth + this.spacing));
};

/**
 * Returns a size from a height
 * @param height
 * @return {number}
 */
Grid.prototype.getSizeY = function (height) {
  return Math.round(parseFloat(height) / (this.rowsHeight + this.spacing));
};

/**
 * Returns a widget
 * @param id
 * @return {Grid.Widget}
 */
Grid.prototype.getWidget = function (id) {
  return this.widgets[id];
};

/**
 * Makes the grid as big as possible
 * @return {Grid}
 */
Grid.prototype.maximize = function () {
  return this.resize(this.maxCols, this.maxRows);
};

/**
 * Makes the grid fit its content
 * @return {Grid}
 */
Grid.prototype.minimize = function () {
  let col = this.minCols || 1;
  let row = this.minRows || 1;

  for (let id in this.widgets) {
    if (this.widgets.hasOwnProperty(id)) {
      let widget = this.widgets[id];

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
 * @return {Grid}
 */
Grid.prototype.moveWidget = function (widget, col, row) {
  let grid = this;

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
      top: grid.calculateTop(row),
    }, {
      complete() {
        widget.element.removeClass('dragging');
        widget.element.css({ zIndex: 1 });

        // Execute callback
        if (typeof grid.onWidgetMoved === 'function') {
          grid.onWidgetMoved.call(grid, widget);
        }
      },
      duration: grid.animSpeed,
      queue: false,
    });
  }
  return grid;
};

/**
 * Removes the widget from the grid
 * @param id
 * @return {Grid.Widget}
 */
Grid.prototype.removeWidget = function (id) {
  let widget = this.widgets[id];

  if (widget) {
    delete this.widgets[id];
    widget.element.stop(true, false).animate({
      height: 0,
      width: 0,
    }, {
      complete() {
        $(this).remove();
      },
      duration: this.animSpeed,
      queue: false,
    });
  }
  return widget;
};

/**
 * Sets the grid size
 * @param cols
 * @param rows
 * @return {Grid}
 */
Grid.prototype.resize = function (cols, rows) {
  cols = Number.parseInt(cols, 10);
  rows = Number.parseInt(rows, 10);

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
      width: this.calculateWidth(cols) + this.spacing * 2,
    }, {
      duration: this.animSpeed,
      queue: false,
    });
  }
  return this;
};

/**
 * Sets the size of a widget
 * @param widget
 * @param sizeX
 * @param sizeY
 * @return {Grid}
 */
Grid.prototype.resizeWidget = function (widget, sizeX, sizeY) {
  let grid = this;
  sizeX = Number.parseInt(sizeX, 10);
  sizeY = Number.parseInt(sizeY, 10);

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
      width: sizeX * (grid.colsWidth + grid.spacing) - grid.spacing,
    }, {
      complete() {
        widget.element.removeClass('resizing');
        widget.element.css({ zIndex: 1 });

        // Execute callback
        if (typeof grid.onWidgetResized === 'function') {
          grid.onWidgetResized.call(grid, widget);
        }
      },
      duration: grid.animSpeed,
      queue: false,
    });
  }
  return grid;
};

/**
 * Called when widget has been moved
 * @type {function}
 */
Grid.prototype.onWidgetMoved = null;

/**
 * Called when widget has been resized
 * @type {function}
 */
Grid.prototype.onWidgetResized = null;

/**
 * Default options
 * @type {*}
 */
Grid.prototype.options = {
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
  widgetSelector: '.widget',
};

/**
 * Creates a grid widget
 * @param options
 * @constructor
 */
Grid.Widget = function (options) {
  let self = this;

  // Default options
  options = extend(true, {}, Grid.Widget.prototype.options, options);

  // Set the options
  self.col = Number.parseInt(options.col, 10);
  self.movable = options.movable === true;
  self.resizable = options.resizable === true;
  self.row = Number.parseInt(options.row, 10);
  self.maxSizeX = Number.parseInt(options.maxSizeX, 10);
  self.maxSizeY = Number.parseInt(options.maxSizeY, 10);
  self.minSizeX = Number.parseInt(options.minSizeX, 10);
  self.minSizeY = Number.parseInt(options.minSizeY, 10);
  self.sizeX = Number.parseInt(options.sizeX, 10);
  self.sizeY = Number.parseInt(options.sizeY, 10);

  // Find the target
  if (options.target) {
    self.element = $(options.target);

    if (self.element.length > 0) {
      self.col = Number.parseInt(self.element.attr('data-col'), 10) || options.col;
      self.movable = !!self.element.attr('data-movable') ? /^true$/gi.test(self.element.attr('data-movable')) : options.movable;
      self.maxSizeX = Number.parseInt(self.element.attr('data-max-size-x'), 10) || options.maxSizeX;
      self.maxSizeY = Number.parseInt(self.element.attr('data-max-size-y'), 10) || options.maxSizeY;
      self.minSizeX = Number.parseInt(self.element.attr('data-min-size-x'), 10) || options.minSizeX;
      self.minSizeY = Number.parseInt(self.element.attr('data-min-size-y'), 10) || options.minSizeY;
      self.resizable = !!self.element.attr('data-resizable') ? /^true$/gi.test(self.element.attr('data-resizable')) : options.resizable;
      self.row = Number.parseInt(self.element.attr('data-row'), 10) || options.row;
      self.sizeX = Number.parseInt(self.element.attr('data-size-x'), 10) || options.sizeX;
      self.sizeY = Number.parseInt(self.element.attr('data-size-y'), 10) || options.sizeY;
    }
  }

  // Create the element HTML node
  if (!self.element || self.element.length < 1) {
    self.element = $('<div>', {
      html: options.content,
    });
  }

  // Set the style
  self.element.addClass('widget');
};

/**
 * Checks if the widget is dragging
 * @return {Boolean}
 */
Grid.Widget.prototype.isDragging = function () {
  return this.element.hasClass('dragging');
};

/**
 * Checks if the widget is resizing
 * @return {Boolean}
 */
Grid.Widget.prototype.isResizing = function () {
  return this.element.hasClass('resizing');
};

/**
 * Default options
 * @type {*}
 */
Grid.Widget.prototype.options = {
  col: 1,
  content: null,
  movable: true,
  maxSizeX: null,
  maxSizeY: null,
  minSizeX: 1,
  minSizeY: 1,
  resizable: true,
  row: 1,
  sizeX: 1,
  sizeY: 1,
  target: null,
};

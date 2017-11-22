# Cuic

Cuic stands for **Common User Interface Components** and aims to offer various UI components like dialogs, popups, notifications, tooltips, etc.

## All-In-One (AIO) lib

The recommended way to load Cuic components is to load them using `import` syntax, the benefit is that you will only load what you actually use in your application.

However for old classic applications, you can still load a single file that contains everything, this is the all-in-one lib. When you use this method, all components will be available in the `Cuic` namespace (example: `Cuic.Button` instead of `Button`).

```js
// Load uncompressed lib
import Cuic from "cuic/dist/cuic-aio";

// Load uncompressed lib
import Cuic2 from "cuic/dist/cuic-aio.min";
```

## Styling

Cuic has a default styling that you must load to display components correctly.

```js
// Load uncompressed styles
import cuicStyles from "cuic/dist/cuic.css";

// Load compressed styles
import cuicStyles2 from "cuic/dist/cuic.css";
```

## Components

### Element

This is the most generic component that contains all the logic of any component, all components inherit from `Element`.

```js
import {Element} from "cuit/dist/ui/element";

const element = new Element({
    className: null,
    css: null,
    debug: false,
    maximized: false,
    maximizedX: false,
    maximizedY: false,
    namespace: null,
    parent: null
});

// Element methods
element.close(Function);
element.isOpened();
element.onClose(Function);
element.onClosed(Function);
element.onOpen(Function);
element.onOpened(Function);
element.open(Function);
element.toggle(Function);
```

### Button

A basic clickable button.

This component inherits from `Element`.

```js
import {Button} from "cuit/dist/ui/button";

const button = new Button({
    className: "btn-primary",
    disabled: false,
    label: "Submit",
    title: "Save modifications",
    type: "submit"
});

button.on("click", () => {
    console.log("button clicked");
});
```

### Closable

This is a generic component with opening and closing capabilities.

This component inherits from `Element`.

```js
import {Closable} from "cuit/dist/ui/component";

const component = new Closable({
    closable: false,
    opened: true
});

// Closable methods
component.close(Function);
component.isOpened();
component.onClose(Function);
component.onClosed(Function);
component.onOpen(Function);
component.onOpened(Function);
component.open(Function);
component.toggle(Function);
```

### Dialog

A dialog can be configured with a header and title, a body and a footer with buttons.

This component inherits from `Closable`.

```js
import {Dialog} from "cuit/dist/ui/dialog";

const dialog = new Dialog({
    autoClose: false,
    autoRemove: true,
    autoResize: true,
    buttons: [],
    closable: true,
    closeButton: null,
    closeButtonClass: "glyphicon glyphicon-remove-sign",
    content: null,
    contentHeight: null,
    contentWidth: null,
    movable: true,
    maximized: false,
    modal: true,
    namespace: "dialog",
    opened: false,
    parent: document.body,
    position: "center",
    resizable: false,
    title: null,
    zIndex: 10
});

// Dialog methods
dialog.addButton(Button);
dialog.close(Function);
dialog.getContent();
dialog.getFooter();
dialog.getHeader();
dialog.open(Function);
dialog.resizeContent();
dialog.setContent(String);
dialog.setFooter(String);
dialog.setHeader(String);
dialog.setTitle(String);
```

### Movable

A generic component that can be moved with the mouse.

This component inherits from `Element`.

```js
import {Element} from "cuit/dist/ui/element";
import {Movable} from "cuit/dist/ui/movable";

const movable = new Movable({
    handle: null,
    handleClassName: "movable-handle",
    constraintToParent: true,
    horizontal: true,
    namespace: "movable",
    rootOnly: true,
    vertical: true
});

// Resizable methods
movable.addMoveHandle(Element);
movable.onMove(Function);
movable.onMoveEnd(Function);
movable.onMoveStart(Function);
```

### Notification

A simple notification where you can put anything inside.

This component inherits from `Closable`.

```js
import {Notification} from "cuit/dist/ui/notification";

const notification = new Notification({
    autoClose: true,
    autoRemove: true,
    closable: true,
    closeButton: null,
    closeButtonClass: "glyphicon glyphicon-remove-sign",
    content: null,
    duration: 2000,
    opened: false,
    parent: document.body,
    position: "center",
    zIndex: 100
});

// Notification methods
notification.close(Function);
notification.getContent();
notification.open(Function);
notification.setContent(String);
```

### NotificationStack

A notification stack is a group of notifications, easier to manage.

This component inherits from `Group`.

```js
import {NotificationStack} from "cuit/dist/ui/notification-stack";

const stack = new NotificationStack({
    position: "right top",
    zIndex: 10
});

// NotificationStack methods
stack.close(Function);
stack.open(Function);
```

### Overlay

An overlay is used to cover areas with a screen.

This component inherits from `Closable`.

```js
import {Overlay} from "cuit/dist/ui/overlay";

const overlay = new Overlay({
    autoClose: false,
    autoRemove: false,
    opened: false,
    zIndex: 1
});

// Overlay methods
overlay.close(Function);
overlay.open(Function);
```

### Panel

A panel can be configured with a header and title, a body and a footer.

This component inherits from `Closable`.

```js
import {Panel} from "cuit/dist/ui/panel";

const panel = new Panel({
    autoClose: false,
    closable: true,
    closeButton: null,
    closeButtonClass: "glyphicon glyphicon-remove-sign",
    content: null,
    footer: null,
    maximized: false,
    opened: false,
    parent: null,
    position: "left top",
    title: null,
    zIndex: 1
});

// Panel methods
panel.close(Function);
panel.getContent();
panel.getFooter();
panel.getHeader();
panel.open(Function);
panel.resizeContent();
panel.setContent(String);
panel.setFooter(String);
panel.setHeader(String);
panel.setTitle(String);
```

### Popup

A popup can be used to display things that are hidden by default.

This component inherits from `Closable`.

```js
import {Popup} from "cuit/dist/ui/popup";

const popup = new Popup({
    anchor: "top",
    autoClose: true,
    autoRemove: false,
    content: null,
    opened: false,
    target: null,
    zIndex: 9
});

// Popup methods
popup.close(Function);
popup.getContent();
popup.open(Function);
popup.setContent(String);
popup.updateTail();
```

### Resizable

A generic component that can be resized.

This component inherits from `Element`.

```js
import {Resizable} from "cuit/dist/ui/resizable";

const resizable = new Resizable({
    handleSize: 10,
    horizontal: true,
    keepRatio: false,
    maxHeight: null,
    maxWidth: null,
    minHeight: 1,
    minWidth: 1,
    namespace: "resizable",
    vertical: true
});

// Resizable methods
resizable.onResize(Function);
resizable.onResizeEnd(Function);
resizable.onResizeStart(Function);
```

### Selectable

A generic component that can be selected.

This component inherits from `Element`.

```js
import {Selectable} from "cuit/dist/ui/selectable";

const selectable = new Selectable({
    selected: false
});

// Selectable methods
selectable.deselect(Function);
selectable.isSelected();
selectable.onDeselected(Function);
selectable.onSelected(Function);
selectable.select(Function);
```

### Switcher

A switcher simply loops through its children, it can be used as a slider.

This component inherits from `Closable`.

```js
import {Switcher} from "cuit/dist/ui/switcher";

const switcher = new Switcher({
    autoStart: true,
    delay: 3000,
    repeat: true
});

// Switcher methods
switcher.first();
switcher.getActiveElement();
switcher.getElementAt();
switcher.getIndex();
switcher.goTo();
switcher.isStarted();
switcher.last();
switcher.next();
switcher.previous();
switcher.start();
switcher.stop();
```

### Tooltip

A tooltip is used to display text near the pointer, it can be static or it can follow the pointer.

This component inherits from `Closable`.

```js
import {Tooltip} from "cuit/dist/ui/tooltip";

const tooltip = new Tooltip({
    anchor: "right",
    attribute: "title",
    followPointer: true,
    opened: false,
    selector: "[title]",
    zIndex: 100
});

// Tooltip methods
tooltip.close(Function);
tooltip.getContent();
tooltip.open(Function);
tooltip.setContent(String);
tooltip.updateTail();
```

## Changelog

### v0.9.0
- Uses ES6 import/export syntax

## License

The code is released under the [MIT License](http://www.opensource.org/licenses/MIT).

If you find this lib useful and would like to support my work, donations are welcome :)

[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=7S7P9W7L2CNQG)

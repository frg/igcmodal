# Modal
v1.1.0

## Description
A light Modal plugin, providing basic functionality with intent of high flexibility.

## Dependencies
None.

## Todo
 - Create extension examples

##  Installation & Usage

1. Clone repository
2. Run npm install
3. Run npm run build
4. Reference dist/igc-modal.min.js & dist/igc-modal.min.css

Example:

```sh
var modalDemo = IgcModal({
    className: "modal-demo",
    content: "<h1>This is a modal.</h1>",
    maxWidth: 600, // 600 = 600px
    minWidth: 280,
    beforeShow: function() {
        console.info("[MODAL] Before Show", this);
        
        // Hide modal on esc key press
        this.listener = function(evt) {
            evt = evt || window.event;
            if (evt.keyCode == 27) {
                this.hide();
            }
        }.bind(this);

        document.addEventListener('keydown', this.listener, false);
    },
    afterShow: function() {
        console.info("[MODAL] After Show", this);
    },
    beforeHide: function() {
        console.info("[MODAL] Before Hide", this);
    },
    afterHide: function() {
        console.info("[MODAL] After Hide", this);
        document.removeEventListener('keydown', this.listener, false);
    },
    afterDomInit: function() {
        console.info("[MODAL] After DOM init", this);
    },
    onOverlayClick: function(event) {
        // Close Modal on overlay click
        return this.hide.call(this);
    }
});
```

## API

### Options
Possible options:
* `className` – appends to default container class name – *string* : `demo-modal another-class`
* `content` – sets initial Modal content – *string* / *DOM element*: `<h1>content</h1>` / `$('#header').get(0)` / `"Content"`
* `maxWidth` – sets Modal max width – *number* : `600`
* `minWidth` – sets Modal min width – *number* : `280`
* `closeButton` – sets close button – *boolean* / *DOM element*: `$('#header').get(0)` / `false`
* `beforeShow` – function called before Modal is shown - *function*: `function () {  }`
* `afterShow` – function called after Modal is shown - *function*: `function () {  }`
* `beforeHide` – function called before Modal is hidden - *function*: `function () {  }`
* `afterHide` – function called after Modal is hidden - *function*: `function () {  }`
* `afterDomInit` – function called after Modal is written to DOM - *function*: `function () {  }`
* `onOverlayClick` – function called upon overlay click - *function*: `function (event) { return this.hide.call(this); }`

Instance functions:
* `show` – adds class to show modal, fires beforeShow and afterShow callbacks
* `hide` – removes class to hide modal, fires beforeHide and afterHide callbacks
* `forceShow` - adds class to show modal
* `forceHide` – removes class to hide modal
* `destroy` – removes Modal DOM nodes from document
* `setContent` – sets Modal content – *string* / *DOM element*: `<h1>content</h1>` / `$('#header').get(0)` / `"Content"`
* `isShowing` – checks if Modal is currently showing
* `isHidden` – checks if Modal is currently hidden
* `isVisible` - checks if Modal is visible with fidelity to z-index

Global functions:
* `hideAll` – hides all modal instances (arguments[0] - shouldForceHide) – *boolean* : true
* `setDefaultOptions` – overrides default options (arguments[0] - options) – *object* : {}

## Browser Compatibility
 - Chrome
 - Firefox
 - Edge
 - IE 10+

## License
MIT

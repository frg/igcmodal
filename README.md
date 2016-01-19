# Modal
v1.0

## Description
A Modal plugin.

## Todo
 - Test Browser Compatibility

##  Installation

##  Usage
1. Import 'igc-modal.js' from folder 'src'
3. Initialise using "var modalDemo = new IgcModal();"

Example:

```sh
window.modalDemo = IgcModal({
    className: "modal-demo",
    content: "<h1>This is a modal.</h1>",//"http://www.w3schools.com",//$('#header').get(0),//"This is a modal",
    maxWidth: 600, // 600 = 600px
    minWidth: 280,
    closeButton: true,//$('#header').get(0),
    beforeShow: function () {
        console.info("[MODAL] Before Show", this.modal);
    },
    afterShow: function () {
        console.info("[MODAL] After Show", this.modal);
    },
    beforeHide: function () {
        console.info("[MODAL] Before Hide", this.modal);
    },
    afterHide: function () {
        console.info("[MODAL] After Hide", this.modal);
    }
});
```

## API

### Options
Possible options:

* `show` – adds class to show modal, fires beforeShow and afterShow callbacks
* `hide` – removes class to hide modal, fires beforeHide and afterHide callbacks
* `forceShow` - adds class to show modal
* `forceHide` – removes class to hide modal
* `destroy` – removes Modal DOM nodes from document
* `closeButton` – sets close button - *boolean* / *DOM element*: `$('#header').get(0)` / `false`
* `setContent` – sets Modal content – *string* / *DOM element*: `<h1>content</h1>` / `$('#header').get(0)` / `"Content"`
* `isShowing` – checks if Modal is currently showing
* `isHidden` – checks if Modal is currently hidden
* `overlayClick` – function called upon overlay click - *function*: `function (event) { return this.hide.call(this); }`


## License
MIT

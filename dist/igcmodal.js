(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.igcmodal = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

'use strict';

var className, openClassName, closeBtnClassName, contentClassName, cellClassName, boxClassName, innerClassName, modalArr;

className = 'igcmodal';
openClassName = className + '-visible';
closeBtnClassName = className + '-closebtn';
contentClassName = className + '-content';
cellClassName = className + '-cell';
boxClassName = className + '-box';
innerClassName = className + '-inner';
modalArr = [];

var defaultOptions = {
    className: null,
    // content: $('#header').get(0),
    // content: "This is a modal",
    // content = '<iframe src="' + contentA + '" frameborder="0" allowfullscreen align="center" style="overflow:hidden;height:100%;width:100%" height="100%" width="100%"><p>Your browser does not support iframes.</p></iframe>',
    content: '',
    maxWidth: null, // 600 = 600px
    minWidth: null,
    closeButton: true, // accepts same args as content property
    hideOverlayOnClick: true,
    /**
     * (callback fired before the modal is shown)
     */
    beforeShow: function () { },
    /**
     * (callback fired after the modal is shown)
     */
    afterShow: function () { },
    /**
     * (callback fired before the modal is hid)
     */
    beforeHide: function () { },
    /**
     * (callback fired after the modal is hid)
     */
    afterHide: function () { },
    /**
     * (callback fired after the modal dom is initiated)
     */
    afterDomInit: function () { },
    /**
     * (callback fired when a "click" event is triggered on the modal overlay)
     */
    onOverlayClick: function () { }
};

/**
 * (builds modal instance DOM structure)
 */
function buildModal() {
    var contentHolder, cellHolder, boxHolder, innerHolder, docFrag;

    docFrag = document.createDocumentFragment();

    // modal container
    this.modal = document.createElement('div');
    this.modal.className = className + ((typeof this.options.className === 'string') ? ' ' + this.options.className : '');

    contentHolder = document.createElement('div');
    cellHolder = document.createElement('div');
    boxHolder = document.createElement('div');
    innerHolder = document.createElement('div');

    contentHolder.className = contentClassName;
    cellHolder.className = cellClassName;
    boxHolder.className = boxClassName;
    innerHolder.className = innerClassName;

    contentHolder.style.minWidth = this.options.minWidth + 'px';
    contentHolder.style.maxWidth = this.options.maxWidth + 'px';

    if (this.options.closeButton === true) {
        this.closeButton = document.createElement('a');
        this.closeButton.className = closeBtnClassName;
        this.closeButton.innerHTML = '×';
        boxHolder.appendChild(this.closeButton);
    } else if (this.options.closeButton.tagName) {
        this.closeButton = this.options.closeButton;
        boxHolder.appendChild(this.closeButton);
    }

    this.content = buildModalContent(this.options.content);

    contentHolder.appendChild(cellHolder);
    cellHolder.appendChild(boxHolder);
    boxHolder.appendChild(innerHolder);
    innerHolder.appendChild(this.content);

    this.modal.appendChild(contentHolder);

    docFrag.appendChild(this.modal);

    document.body.appendChild(docFrag);

    this.options.afterDomInit.call(this);
}

/**
 * (builds modal content DOM structure)
 * 
 * @param content (same values as defined for the "content" property within the options)
 * @returns (element with modal content DOM structure)
 */
function buildModalContent(content) {
    var contentHolder = document.createElement('div');

    if (content.innerHTML) {
        content = content.innerHTML;
    }
    contentHolder.innerHTML = content;

    return contentHolder;
}

/**
 * (initialization of element events)
 */
function initEvents() {
    // close button click -- hide modal
    if (this.closeButton) {
        this.closeButton.addEventListener('click', this.hide.bind(this));
    }

    if (this.options.hideOverlayOnClick === true) {
        this.modal.addEventListener('click', function (e) {
            if (this.content !== e.target && !elementIsDescendant(this.content, e.target) && (this.closeButton && this.closeButton !== e.target)) {
                this.hide();
            }
        }.bind(this));
    }
}

/**
 * (compares modal z-indices)
 * 
 * @param modalA (modal instance)
 * @param modalB (modal instance)
 * @returns (-Number, 0, +Number)
 */
function compareModalZIndex(modalA, modalB) {
    return getModalZIndex(modalB.modal) - getModalZIndex(modalA.modal);
}

/**
 * (returns modal z-index)
 * 
 * @param element (modal container element)
 * @returns (Number)
 */
function getModalZIndex(element) {
    // auto, inherit, initial, unset values are regarded as 0
    return parseInt(document.defaultView.getComputedStyle(element, null).getPropertyValue('z-index')) || 0;
}

/**
 * (checks if element has class)
 * 
 * @param element (element)
 * @param className (class name)
 * @returns (boolean)
 */
function elementHasClass(element, className) {
    return ((' ' + element.className + ' ').replace(/[\n\t]/g, ' ').indexOf(' ' + className + ' ') > -1);
}

/**
 * (removes class from "class" attribute string)
 * 
 * @param element (element)
 * @param className (class name to be removed)
 * @returns (new "class" attribute string)
 */
function elementRemoveClass(element, className) {
    return element.className.replace(new RegExp('(\\s|^)' + className + '(\\s|$)'), '');
}

/**
 * (check if element is decendent of element)
 * 
 * @param parent (expected parent element)
 * @param child (expected child element)
 * @returns (boolean)
 */
function elementIsDescendant(parent, child) {
    var node = child.parentNode;
    while (node != null) {
        if (node == parent) {
            return true;
        }
        node = node.parentNode;
    }
    return false;
}

/**
 * (extends properties of one object from another)
 * 
 * @param defaults (default object)
 * @param options (object to be extended with)
 * @returns (extended object)
 */
function extendDefaults(defaults, options) {
    var deafultProperty;
    for (deafultProperty in defaults) {
        if (defaults.hasOwnProperty(deafultProperty)) {
            if (options[deafultProperty] === undefined) {
                // if defaults property is undefined in options
                // add the default property to options
                options[deafultProperty] = defaults[deafultProperty];
            }
        }
    }
    return options;
}

/**
 * (Shortcut for removing the "new" keyword when creating an instance of the modal)
 * 
 * @param options (plugin options)
 * @returns (a new modal instance)
 */
var _igcmodal = function (options) {
    return new _igcmodal.init(options);
};

_igcmodal.prototype = {
    /**
     * (function that shows the modal while also calling the respective callbacks passed in the options)
     * 
     * @returns (the current instance of the modal)
     */
    show: function () {
        if (this.options.beforeShow.call(this) !== false) {
            _igcmodal.prototype.forceShow.call(this);
            this.options.afterShow.call(this);
        }

        return this;
    },
    /**
     * (function that hides the modal while also calling the respective callbacks passed in the options)
     * 
     * @returns (the current instance of the modal)
     */
    hide: function () {
        if (this.options.beforeHide.call(this) !== false) {
            _igcmodal.prototype.forceHide.call(this);
            this.options.afterHide.call(this);
        }

        return this;
    },
    /**
     * (function that shows the modal while taking into account that other modals might already be visible)
     * 
     * @returns (the current instance of the modal)
     */
    forceShow: function () {
        // get highest z-index occupied my a modal
        var highestZIndex = getModalZIndex(modalArr.sort(compareModalZIndex)[0].modal);

        // increment modal z-index
        this.modal.style.zIndex = highestZIndex + 1;

        if (!elementHasClass(this.modal, openClassName)) {
            this.modal.className = this.modal.className + ' ' + openClassName;
        }

        return this;
    },
    /**
     * (function that hides the modal)
     * 
     * @returns (the current instance of the modal)
     */
    forceHide: function () {
        if (elementHasClass(this.modal, openClassName)) {
            this.modal.className = elementRemoveClass(this.modal, openClassName);
        }

        return this;
    },
    /**
     * (function that destroys the modal dom and its referenced instance)
     * 
     * @returns (null)
     */
    destroy: function () {
        // remove modal DOM
        document.body.removeChild(this.modal);

        // remove modal reference
        var index = modalArr.indexOf(this);
        if (index > -1) {
            modalArr.splice(index, 1);
        }

        return null;
    },
    /**
     * (function that sets the content of the modal)
     * 
     * @param content (same values as defined for the "content" property within the options)
     * @returns (the current instance of the modal)
     */
    setContent: function (content) {
        var contentHolder = this.content.parentNode;
        var newContent = buildModalContent(content);

        contentHolder.removeChild(this.content);
        contentHolder.appendChild(newContent);

        this.content = newContent;

        return this;
    },
    /**
     * (function that checks if the modal is hidden (doesnt have has constant class))
     * 
     * @returns (boolean)
     */
    isHidden: function () {
        return !elementHasClass(this.modal, openClassName);
    },
    /**
     * (function that checks if the modal is showing (has has constant class))
     * 
     * @returns (boolean)
     */
    isShowing: function () {
        return elementHasClass(this.modal, openClassName);
    },
    /**
     * (function that checks if the modal is visible (considers z-index order))
     * 
     * @returns (boolean)
     */
    isVisible: function () {
        var isShowing = _igcmodal.prototype.isShowing.call(this);

        if (isShowing) {
            // check if modal instance has the highest z-index

            // order modals by highest z-index
            var orderModalArr = modalArr.sort(compareModalZIndex);
            for (var i = 0, len = orderModalArr.length; i < len; i++) {
                if (orderModalArr[i].isShowing()) {
                    // if current modal is showing
                    if (getModalZIndex(orderModalArr[i].modal) > getModalZIndex(this.modal)) {
                        // if current modal has a higher z-index
                        // it must mean that "this" modal is not visible
                        return false;
                    }
                }
            }

            // if no currently showing modals have a higher z-index
            // it must mean that "this" modal is visible
            return true;
        }

        // if "this" modal is not showing it cannot be visible            
        return false;
    }
};

/**
 * (initialization of a modal instance)
 * 
 * @param options (modal instance options)
 * @returns (modal instance)
 */
_igcmodal.init = function (options) {
    this.closeButton = null;
    this.modal = null;
    this.options = null;

    // Create options by extending defaults with the passed in arugments
    if (options && typeof options === 'object') {
        this.options = extendDefaults(defaultOptions, options);
    } else {
        this.options = defaultOptions;
    }

    buildModal.call(this);
    initEvents.call(this);

    modalArr.push(this);

    return this;
};

/**
 * (function that hides all modal instances)
 * 
 * @param shouldForceHide (boolean that sets if the modals should be hidden forcely without firing events)
 */
_igcmodal.hideAll = function (shouldForceHide) {
    for (var i = 0, len = modalArr.length; i < len; i++) {
        if (shouldForceHide) {
            modalArr[i].forceHide();
        } else {
            modalArr[i].hide();
        }
    }
};

/**
 * (function that sets new default options)
 * 
 * @param options (options object that will override the default options)
 */
_igcmodal.setDefaultOptions = function (options) {
    if (options && typeof options === 'object') {
        defaultOptions = extendDefaults(defaultOptions, options);
    } else {
        throw new Error('Invalid options parameter, typeof object required!');
    }
};

_igcmodal.init.prototype = _igcmodal.prototype;

module.exports = _igcmodal;
},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL1VzZXJzL2plYW4uZmFycnVnaWEvQXBwRGF0YS9Sb2FtaW5nL25wbS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwic3JjL2lnY21vZGFsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBjbGFzc05hbWUsIG9wZW5DbGFzc05hbWUsIGNsb3NlQnRuQ2xhc3NOYW1lLCBjb250ZW50Q2xhc3NOYW1lLCBjZWxsQ2xhc3NOYW1lLCBib3hDbGFzc05hbWUsIGlubmVyQ2xhc3NOYW1lLCBtb2RhbEFycjtcclxuXHJcbmNsYXNzTmFtZSA9ICdpZ2Ntb2RhbCc7XHJcbm9wZW5DbGFzc05hbWUgPSBjbGFzc05hbWUgKyAnLXZpc2libGUnO1xyXG5jbG9zZUJ0bkNsYXNzTmFtZSA9IGNsYXNzTmFtZSArICctY2xvc2VidG4nO1xyXG5jb250ZW50Q2xhc3NOYW1lID0gY2xhc3NOYW1lICsgJy1jb250ZW50JztcclxuY2VsbENsYXNzTmFtZSA9IGNsYXNzTmFtZSArICctY2VsbCc7XHJcbmJveENsYXNzTmFtZSA9IGNsYXNzTmFtZSArICctYm94JztcclxuaW5uZXJDbGFzc05hbWUgPSBjbGFzc05hbWUgKyAnLWlubmVyJztcclxubW9kYWxBcnIgPSBbXTtcclxuXHJcbnZhciBkZWZhdWx0T3B0aW9ucyA9IHtcclxuICAgIGNsYXNzTmFtZTogbnVsbCxcclxuICAgIC8vIGNvbnRlbnQ6ICQoJyNoZWFkZXInKS5nZXQoMCksXHJcbiAgICAvLyBjb250ZW50OiBcIlRoaXMgaXMgYSBtb2RhbFwiLFxyXG4gICAgLy8gY29udGVudCA9ICc8aWZyYW1lIHNyYz1cIicgKyBjb250ZW50QSArICdcIiBmcmFtZWJvcmRlcj1cIjBcIiBhbGxvd2Z1bGxzY3JlZW4gYWxpZ249XCJjZW50ZXJcIiBzdHlsZT1cIm92ZXJmbG93OmhpZGRlbjtoZWlnaHQ6MTAwJTt3aWR0aDoxMDAlXCIgaGVpZ2h0PVwiMTAwJVwiIHdpZHRoPVwiMTAwJVwiPjxwPllvdXIgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IGlmcmFtZXMuPC9wPjwvaWZyYW1lPicsXHJcbiAgICBjb250ZW50OiAnJyxcclxuICAgIG1heFdpZHRoOiBudWxsLCAvLyA2MDAgPSA2MDBweFxyXG4gICAgbWluV2lkdGg6IG51bGwsXHJcbiAgICBjbG9zZUJ1dHRvbjogdHJ1ZSwgLy8gYWNjZXB0cyBzYW1lIGFyZ3MgYXMgY29udGVudCBwcm9wZXJ0eVxyXG4gICAgaGlkZU92ZXJsYXlPbkNsaWNrOiB0cnVlLFxyXG4gICAgLyoqXHJcbiAgICAgKiAoY2FsbGJhY2sgZmlyZWQgYmVmb3JlIHRoZSBtb2RhbCBpcyBzaG93bilcclxuICAgICAqL1xyXG4gICAgYmVmb3JlU2hvdzogZnVuY3Rpb24gKCkgeyB9LFxyXG4gICAgLyoqXHJcbiAgICAgKiAoY2FsbGJhY2sgZmlyZWQgYWZ0ZXIgdGhlIG1vZGFsIGlzIHNob3duKVxyXG4gICAgICovXHJcbiAgICBhZnRlclNob3c6IGZ1bmN0aW9uICgpIHsgfSxcclxuICAgIC8qKlxyXG4gICAgICogKGNhbGxiYWNrIGZpcmVkIGJlZm9yZSB0aGUgbW9kYWwgaXMgaGlkKVxyXG4gICAgICovXHJcbiAgICBiZWZvcmVIaWRlOiBmdW5jdGlvbiAoKSB7IH0sXHJcbiAgICAvKipcclxuICAgICAqIChjYWxsYmFjayBmaXJlZCBhZnRlciB0aGUgbW9kYWwgaXMgaGlkKVxyXG4gICAgICovXHJcbiAgICBhZnRlckhpZGU6IGZ1bmN0aW9uICgpIHsgfSxcclxuICAgIC8qKlxyXG4gICAgICogKGNhbGxiYWNrIGZpcmVkIGFmdGVyIHRoZSBtb2RhbCBkb20gaXMgaW5pdGlhdGVkKVxyXG4gICAgICovXHJcbiAgICBhZnRlckRvbUluaXQ6IGZ1bmN0aW9uICgpIHsgfSxcclxuICAgIC8qKlxyXG4gICAgICogKGNhbGxiYWNrIGZpcmVkIHdoZW4gYSBcImNsaWNrXCIgZXZlbnQgaXMgdHJpZ2dlcmVkIG9uIHRoZSBtb2RhbCBvdmVybGF5KVxyXG4gICAgICovXHJcbiAgICBvbk92ZXJsYXlDbGljazogZnVuY3Rpb24gKCkgeyB9XHJcbn07XHJcblxyXG4vKipcclxuICogKGJ1aWxkcyBtb2RhbCBpbnN0YW5jZSBET00gc3RydWN0dXJlKVxyXG4gKi9cclxuZnVuY3Rpb24gYnVpbGRNb2RhbCgpIHtcclxuICAgIHZhciBjb250ZW50SG9sZGVyLCBjZWxsSG9sZGVyLCBib3hIb2xkZXIsIGlubmVySG9sZGVyLCBkb2NGcmFnO1xyXG5cclxuICAgIGRvY0ZyYWcgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XHJcblxyXG4gICAgLy8gbW9kYWwgY29udGFpbmVyXHJcbiAgICB0aGlzLm1vZGFsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICB0aGlzLm1vZGFsLmNsYXNzTmFtZSA9IGNsYXNzTmFtZSArICgodHlwZW9mIHRoaXMub3B0aW9ucy5jbGFzc05hbWUgPT09ICdzdHJpbmcnKSA/ICcgJyArIHRoaXMub3B0aW9ucy5jbGFzc05hbWUgOiAnJyk7XHJcblxyXG4gICAgY29udGVudEhvbGRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgY2VsbEhvbGRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgYm94SG9sZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICBpbm5lckhvbGRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG5cclxuICAgIGNvbnRlbnRIb2xkZXIuY2xhc3NOYW1lID0gY29udGVudENsYXNzTmFtZTtcclxuICAgIGNlbGxIb2xkZXIuY2xhc3NOYW1lID0gY2VsbENsYXNzTmFtZTtcclxuICAgIGJveEhvbGRlci5jbGFzc05hbWUgPSBib3hDbGFzc05hbWU7XHJcbiAgICBpbm5lckhvbGRlci5jbGFzc05hbWUgPSBpbm5lckNsYXNzTmFtZTtcclxuXHJcbiAgICBjb250ZW50SG9sZGVyLnN0eWxlLm1pbldpZHRoID0gdGhpcy5vcHRpb25zLm1pbldpZHRoICsgJ3B4JztcclxuICAgIGNvbnRlbnRIb2xkZXIuc3R5bGUubWF4V2lkdGggPSB0aGlzLm9wdGlvbnMubWF4V2lkdGggKyAncHgnO1xyXG5cclxuICAgIGlmICh0aGlzLm9wdGlvbnMuY2xvc2VCdXR0b24gPT09IHRydWUpIHtcclxuICAgICAgICB0aGlzLmNsb3NlQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xyXG4gICAgICAgIHRoaXMuY2xvc2VCdXR0b24uY2xhc3NOYW1lID0gY2xvc2VCdG5DbGFzc05hbWU7XHJcbiAgICAgICAgdGhpcy5jbG9zZUJ1dHRvbi5pbm5lckhUTUwgPSAnw5cnO1xyXG4gICAgICAgIGJveEhvbGRlci5hcHBlbmRDaGlsZCh0aGlzLmNsb3NlQnV0dG9uKTtcclxuICAgIH0gZWxzZSBpZiAodGhpcy5vcHRpb25zLmNsb3NlQnV0dG9uLnRhZ05hbWUpIHtcclxuICAgICAgICB0aGlzLmNsb3NlQnV0dG9uID0gdGhpcy5vcHRpb25zLmNsb3NlQnV0dG9uO1xyXG4gICAgICAgIGJveEhvbGRlci5hcHBlbmRDaGlsZCh0aGlzLmNsb3NlQnV0dG9uKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmNvbnRlbnQgPSBidWlsZE1vZGFsQ29udGVudCh0aGlzLm9wdGlvbnMuY29udGVudCk7XHJcblxyXG4gICAgY29udGVudEhvbGRlci5hcHBlbmRDaGlsZChjZWxsSG9sZGVyKTtcclxuICAgIGNlbGxIb2xkZXIuYXBwZW5kQ2hpbGQoYm94SG9sZGVyKTtcclxuICAgIGJveEhvbGRlci5hcHBlbmRDaGlsZChpbm5lckhvbGRlcik7XHJcbiAgICBpbm5lckhvbGRlci5hcHBlbmRDaGlsZCh0aGlzLmNvbnRlbnQpO1xyXG5cclxuICAgIHRoaXMubW9kYWwuYXBwZW5kQ2hpbGQoY29udGVudEhvbGRlcik7XHJcblxyXG4gICAgZG9jRnJhZy5hcHBlbmRDaGlsZCh0aGlzLm1vZGFsKTtcclxuXHJcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGRvY0ZyYWcpO1xyXG5cclxuICAgIHRoaXMub3B0aW9ucy5hZnRlckRvbUluaXQuY2FsbCh0aGlzKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIChidWlsZHMgbW9kYWwgY29udGVudCBET00gc3RydWN0dXJlKVxyXG4gKiBcclxuICogQHBhcmFtIGNvbnRlbnQgKHNhbWUgdmFsdWVzIGFzIGRlZmluZWQgZm9yIHRoZSBcImNvbnRlbnRcIiBwcm9wZXJ0eSB3aXRoaW4gdGhlIG9wdGlvbnMpXHJcbiAqIEByZXR1cm5zIChlbGVtZW50IHdpdGggbW9kYWwgY29udGVudCBET00gc3RydWN0dXJlKVxyXG4gKi9cclxuZnVuY3Rpb24gYnVpbGRNb2RhbENvbnRlbnQoY29udGVudCkge1xyXG4gICAgdmFyIGNvbnRlbnRIb2xkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuXHJcbiAgICBpZiAoY29udGVudC5pbm5lckhUTUwpIHtcclxuICAgICAgICBjb250ZW50ID0gY29udGVudC5pbm5lckhUTUw7XHJcbiAgICB9XHJcbiAgICBjb250ZW50SG9sZGVyLmlubmVySFRNTCA9IGNvbnRlbnQ7XHJcblxyXG4gICAgcmV0dXJuIGNvbnRlbnRIb2xkZXI7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiAoaW5pdGlhbGl6YXRpb24gb2YgZWxlbWVudCBldmVudHMpXHJcbiAqL1xyXG5mdW5jdGlvbiBpbml0RXZlbnRzKCkge1xyXG4gICAgLy8gY2xvc2UgYnV0dG9uIGNsaWNrIC0tIGhpZGUgbW9kYWxcclxuICAgIGlmICh0aGlzLmNsb3NlQnV0dG9uKSB7XHJcbiAgICAgICAgdGhpcy5jbG9zZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuaGlkZS5iaW5kKHRoaXMpKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5vcHRpb25zLmhpZGVPdmVybGF5T25DbGljayA9PT0gdHJ1ZSkge1xyXG4gICAgICAgIHRoaXMubW9kYWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jb250ZW50ICE9PSBlLnRhcmdldCAmJiAhZWxlbWVudElzRGVzY2VuZGFudCh0aGlzLmNvbnRlbnQsIGUudGFyZ2V0KSAmJiAodGhpcy5jbG9zZUJ1dHRvbiAmJiB0aGlzLmNsb3NlQnV0dG9uICE9PSBlLnRhcmdldCkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaGlkZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIChjb21wYXJlcyBtb2RhbCB6LWluZGljZXMpXHJcbiAqIFxyXG4gKiBAcGFyYW0gbW9kYWxBIChtb2RhbCBpbnN0YW5jZSlcclxuICogQHBhcmFtIG1vZGFsQiAobW9kYWwgaW5zdGFuY2UpXHJcbiAqIEByZXR1cm5zICgtTnVtYmVyLCAwLCArTnVtYmVyKVxyXG4gKi9cclxuZnVuY3Rpb24gY29tcGFyZU1vZGFsWkluZGV4KG1vZGFsQSwgbW9kYWxCKSB7XHJcbiAgICByZXR1cm4gZ2V0TW9kYWxaSW5kZXgobW9kYWxCLm1vZGFsKSAtIGdldE1vZGFsWkluZGV4KG1vZGFsQS5tb2RhbCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiAocmV0dXJucyBtb2RhbCB6LWluZGV4KVxyXG4gKiBcclxuICogQHBhcmFtIGVsZW1lbnQgKG1vZGFsIGNvbnRhaW5lciBlbGVtZW50KVxyXG4gKiBAcmV0dXJucyAoTnVtYmVyKVxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0TW9kYWxaSW5kZXgoZWxlbWVudCkge1xyXG4gICAgLy8gYXV0bywgaW5oZXJpdCwgaW5pdGlhbCwgdW5zZXQgdmFsdWVzIGFyZSByZWdhcmRlZCBhcyAwXHJcbiAgICByZXR1cm4gcGFyc2VJbnQoZG9jdW1lbnQuZGVmYXVsdFZpZXcuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50LCBudWxsKS5nZXRQcm9wZXJ0eVZhbHVlKCd6LWluZGV4JykpIHx8IDA7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiAoY2hlY2tzIGlmIGVsZW1lbnQgaGFzIGNsYXNzKVxyXG4gKiBcclxuICogQHBhcmFtIGVsZW1lbnQgKGVsZW1lbnQpXHJcbiAqIEBwYXJhbSBjbGFzc05hbWUgKGNsYXNzIG5hbWUpXHJcbiAqIEByZXR1cm5zIChib29sZWFuKVxyXG4gKi9cclxuZnVuY3Rpb24gZWxlbWVudEhhc0NsYXNzKGVsZW1lbnQsIGNsYXNzTmFtZSkge1xyXG4gICAgcmV0dXJuICgoJyAnICsgZWxlbWVudC5jbGFzc05hbWUgKyAnICcpLnJlcGxhY2UoL1tcXG5cXHRdL2csICcgJykuaW5kZXhPZignICcgKyBjbGFzc05hbWUgKyAnICcpID4gLTEpO1xyXG59XHJcblxyXG4vKipcclxuICogKHJlbW92ZXMgY2xhc3MgZnJvbSBcImNsYXNzXCIgYXR0cmlidXRlIHN0cmluZylcclxuICogXHJcbiAqIEBwYXJhbSBlbGVtZW50IChlbGVtZW50KVxyXG4gKiBAcGFyYW0gY2xhc3NOYW1lIChjbGFzcyBuYW1lIHRvIGJlIHJlbW92ZWQpXHJcbiAqIEByZXR1cm5zIChuZXcgXCJjbGFzc1wiIGF0dHJpYnV0ZSBzdHJpbmcpXHJcbiAqL1xyXG5mdW5jdGlvbiBlbGVtZW50UmVtb3ZlQ2xhc3MoZWxlbWVudCwgY2xhc3NOYW1lKSB7XHJcbiAgICByZXR1cm4gZWxlbWVudC5jbGFzc05hbWUucmVwbGFjZShuZXcgUmVnRXhwKCcoXFxcXHN8XiknICsgY2xhc3NOYW1lICsgJyhcXFxcc3wkKScpLCAnJyk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiAoY2hlY2sgaWYgZWxlbWVudCBpcyBkZWNlbmRlbnQgb2YgZWxlbWVudClcclxuICogXHJcbiAqIEBwYXJhbSBwYXJlbnQgKGV4cGVjdGVkIHBhcmVudCBlbGVtZW50KVxyXG4gKiBAcGFyYW0gY2hpbGQgKGV4cGVjdGVkIGNoaWxkIGVsZW1lbnQpXHJcbiAqIEByZXR1cm5zIChib29sZWFuKVxyXG4gKi9cclxuZnVuY3Rpb24gZWxlbWVudElzRGVzY2VuZGFudChwYXJlbnQsIGNoaWxkKSB7XHJcbiAgICB2YXIgbm9kZSA9IGNoaWxkLnBhcmVudE5vZGU7XHJcbiAgICB3aGlsZSAobm9kZSAhPSBudWxsKSB7XHJcbiAgICAgICAgaWYgKG5vZGUgPT0gcGFyZW50KSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBub2RlID0gbm9kZS5wYXJlbnROb2RlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG59XHJcblxyXG4vKipcclxuICogKGV4dGVuZHMgcHJvcGVydGllcyBvZiBvbmUgb2JqZWN0IGZyb20gYW5vdGhlcilcclxuICogXHJcbiAqIEBwYXJhbSBkZWZhdWx0cyAoZGVmYXVsdCBvYmplY3QpXHJcbiAqIEBwYXJhbSBvcHRpb25zIChvYmplY3QgdG8gYmUgZXh0ZW5kZWQgd2l0aClcclxuICogQHJldHVybnMgKGV4dGVuZGVkIG9iamVjdClcclxuICovXHJcbmZ1bmN0aW9uIGV4dGVuZERlZmF1bHRzKGRlZmF1bHRzLCBvcHRpb25zKSB7XHJcbiAgICB2YXIgZGVhZnVsdFByb3BlcnR5O1xyXG4gICAgZm9yIChkZWFmdWx0UHJvcGVydHkgaW4gZGVmYXVsdHMpIHtcclxuICAgICAgICBpZiAoZGVmYXVsdHMuaGFzT3duUHJvcGVydHkoZGVhZnVsdFByb3BlcnR5KSkge1xyXG4gICAgICAgICAgICBpZiAob3B0aW9uc1tkZWFmdWx0UHJvcGVydHldID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIC8vIGlmIGRlZmF1bHRzIHByb3BlcnR5IGlzIHVuZGVmaW5lZCBpbiBvcHRpb25zXHJcbiAgICAgICAgICAgICAgICAvLyBhZGQgdGhlIGRlZmF1bHQgcHJvcGVydHkgdG8gb3B0aW9uc1xyXG4gICAgICAgICAgICAgICAgb3B0aW9uc1tkZWFmdWx0UHJvcGVydHldID0gZGVmYXVsdHNbZGVhZnVsdFByb3BlcnR5XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBvcHRpb25zO1xyXG59XHJcblxyXG4vKipcclxuICogKFNob3J0Y3V0IGZvciByZW1vdmluZyB0aGUgXCJuZXdcIiBrZXl3b3JkIHdoZW4gY3JlYXRpbmcgYW4gaW5zdGFuY2Ugb2YgdGhlIG1vZGFsKVxyXG4gKiBcclxuICogQHBhcmFtIG9wdGlvbnMgKHBsdWdpbiBvcHRpb25zKVxyXG4gKiBAcmV0dXJucyAoYSBuZXcgbW9kYWwgaW5zdGFuY2UpXHJcbiAqL1xyXG52YXIgX2lnY21vZGFsID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgIHJldHVybiBuZXcgX2lnY21vZGFsLmluaXQob3B0aW9ucyk7XHJcbn07XHJcblxyXG5faWdjbW9kYWwucHJvdG90eXBlID0ge1xyXG4gICAgLyoqXHJcbiAgICAgKiAoZnVuY3Rpb24gdGhhdCBzaG93cyB0aGUgbW9kYWwgd2hpbGUgYWxzbyBjYWxsaW5nIHRoZSByZXNwZWN0aXZlIGNhbGxiYWNrcyBwYXNzZWQgaW4gdGhlIG9wdGlvbnMpXHJcbiAgICAgKiBcclxuICAgICAqIEByZXR1cm5zICh0aGUgY3VycmVudCBpbnN0YW5jZSBvZiB0aGUgbW9kYWwpXHJcbiAgICAgKi9cclxuICAgIHNob3c6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmJlZm9yZVNob3cuY2FsbCh0aGlzKSAhPT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgX2lnY21vZGFsLnByb3RvdHlwZS5mb3JjZVNob3cuY2FsbCh0aGlzKTtcclxuICAgICAgICAgICAgdGhpcy5vcHRpb25zLmFmdGVyU2hvdy5jYWxsKHRoaXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9LFxyXG4gICAgLyoqXHJcbiAgICAgKiAoZnVuY3Rpb24gdGhhdCBoaWRlcyB0aGUgbW9kYWwgd2hpbGUgYWxzbyBjYWxsaW5nIHRoZSByZXNwZWN0aXZlIGNhbGxiYWNrcyBwYXNzZWQgaW4gdGhlIG9wdGlvbnMpXHJcbiAgICAgKiBcclxuICAgICAqIEByZXR1cm5zICh0aGUgY3VycmVudCBpbnN0YW5jZSBvZiB0aGUgbW9kYWwpXHJcbiAgICAgKi9cclxuICAgIGhpZGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmJlZm9yZUhpZGUuY2FsbCh0aGlzKSAhPT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgX2lnY21vZGFsLnByb3RvdHlwZS5mb3JjZUhpZGUuY2FsbCh0aGlzKTtcclxuICAgICAgICAgICAgdGhpcy5vcHRpb25zLmFmdGVySGlkZS5jYWxsKHRoaXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9LFxyXG4gICAgLyoqXHJcbiAgICAgKiAoZnVuY3Rpb24gdGhhdCBzaG93cyB0aGUgbW9kYWwgd2hpbGUgdGFraW5nIGludG8gYWNjb3VudCB0aGF0IG90aGVyIG1vZGFscyBtaWdodCBhbHJlYWR5IGJlIHZpc2libGUpXHJcbiAgICAgKiBcclxuICAgICAqIEByZXR1cm5zICh0aGUgY3VycmVudCBpbnN0YW5jZSBvZiB0aGUgbW9kYWwpXHJcbiAgICAgKi9cclxuICAgIGZvcmNlU2hvdzogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIC8vIGdldCBoaWdoZXN0IHotaW5kZXggb2NjdXBpZWQgbXkgYSBtb2RhbFxyXG4gICAgICAgIHZhciBoaWdoZXN0WkluZGV4ID0gZ2V0TW9kYWxaSW5kZXgobW9kYWxBcnIuc29ydChjb21wYXJlTW9kYWxaSW5kZXgpWzBdLm1vZGFsKTtcclxuXHJcbiAgICAgICAgLy8gaW5jcmVtZW50IG1vZGFsIHotaW5kZXhcclxuICAgICAgICB0aGlzLm1vZGFsLnN0eWxlLnpJbmRleCA9IGhpZ2hlc3RaSW5kZXggKyAxO1xyXG5cclxuICAgICAgICBpZiAoIWVsZW1lbnRIYXNDbGFzcyh0aGlzLm1vZGFsLCBvcGVuQ2xhc3NOYW1lKSkge1xyXG4gICAgICAgICAgICB0aGlzLm1vZGFsLmNsYXNzTmFtZSA9IHRoaXMubW9kYWwuY2xhc3NOYW1lICsgJyAnICsgb3BlbkNsYXNzTmFtZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfSxcclxuICAgIC8qKlxyXG4gICAgICogKGZ1bmN0aW9uIHRoYXQgaGlkZXMgdGhlIG1vZGFsKVxyXG4gICAgICogXHJcbiAgICAgKiBAcmV0dXJucyAodGhlIGN1cnJlbnQgaW5zdGFuY2Ugb2YgdGhlIG1vZGFsKVxyXG4gICAgICovXHJcbiAgICBmb3JjZUhpZGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAoZWxlbWVudEhhc0NsYXNzKHRoaXMubW9kYWwsIG9wZW5DbGFzc05hbWUpKSB7XHJcbiAgICAgICAgICAgIHRoaXMubW9kYWwuY2xhc3NOYW1lID0gZWxlbWVudFJlbW92ZUNsYXNzKHRoaXMubW9kYWwsIG9wZW5DbGFzc05hbWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9LFxyXG4gICAgLyoqXHJcbiAgICAgKiAoZnVuY3Rpb24gdGhhdCBkZXN0cm95cyB0aGUgbW9kYWwgZG9tIGFuZCBpdHMgcmVmZXJlbmNlZCBpbnN0YW5jZSlcclxuICAgICAqIFxyXG4gICAgICogQHJldHVybnMgKG51bGwpXHJcbiAgICAgKi9cclxuICAgIGRlc3Ryb3k6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAvLyByZW1vdmUgbW9kYWwgRE9NXHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZCh0aGlzLm1vZGFsKTtcclxuXHJcbiAgICAgICAgLy8gcmVtb3ZlIG1vZGFsIHJlZmVyZW5jZVxyXG4gICAgICAgIHZhciBpbmRleCA9IG1vZGFsQXJyLmluZGV4T2YodGhpcyk7XHJcbiAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcclxuICAgICAgICAgICAgbW9kYWxBcnIuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfSxcclxuICAgIC8qKlxyXG4gICAgICogKGZ1bmN0aW9uIHRoYXQgc2V0cyB0aGUgY29udGVudCBvZiB0aGUgbW9kYWwpXHJcbiAgICAgKiBcclxuICAgICAqIEBwYXJhbSBjb250ZW50IChzYW1lIHZhbHVlcyBhcyBkZWZpbmVkIGZvciB0aGUgXCJjb250ZW50XCIgcHJvcGVydHkgd2l0aGluIHRoZSBvcHRpb25zKVxyXG4gICAgICogQHJldHVybnMgKHRoZSBjdXJyZW50IGluc3RhbmNlIG9mIHRoZSBtb2RhbClcclxuICAgICAqL1xyXG4gICAgc2V0Q29udGVudDogZnVuY3Rpb24gKGNvbnRlbnQpIHtcclxuICAgICAgICB2YXIgY29udGVudEhvbGRlciA9IHRoaXMuY29udGVudC5wYXJlbnROb2RlO1xyXG4gICAgICAgIHZhciBuZXdDb250ZW50ID0gYnVpbGRNb2RhbENvbnRlbnQoY29udGVudCk7XHJcblxyXG4gICAgICAgIGNvbnRlbnRIb2xkZXIucmVtb3ZlQ2hpbGQodGhpcy5jb250ZW50KTtcclxuICAgICAgICBjb250ZW50SG9sZGVyLmFwcGVuZENoaWxkKG5ld0NvbnRlbnQpO1xyXG5cclxuICAgICAgICB0aGlzLmNvbnRlbnQgPSBuZXdDb250ZW50O1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH0sXHJcbiAgICAvKipcclxuICAgICAqIChmdW5jdGlvbiB0aGF0IGNoZWNrcyBpZiB0aGUgbW9kYWwgaXMgaGlkZGVuIChkb2VzbnQgaGF2ZSBoYXMgY29uc3RhbnQgY2xhc3MpKVxyXG4gICAgICogXHJcbiAgICAgKiBAcmV0dXJucyAoYm9vbGVhbilcclxuICAgICAqL1xyXG4gICAgaXNIaWRkZW46IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gIWVsZW1lbnRIYXNDbGFzcyh0aGlzLm1vZGFsLCBvcGVuQ2xhc3NOYW1lKTtcclxuICAgIH0sXHJcbiAgICAvKipcclxuICAgICAqIChmdW5jdGlvbiB0aGF0IGNoZWNrcyBpZiB0aGUgbW9kYWwgaXMgc2hvd2luZyAoaGFzIGhhcyBjb25zdGFudCBjbGFzcykpXHJcbiAgICAgKiBcclxuICAgICAqIEByZXR1cm5zIChib29sZWFuKVxyXG4gICAgICovXHJcbiAgICBpc1Nob3dpbmc6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gZWxlbWVudEhhc0NsYXNzKHRoaXMubW9kYWwsIG9wZW5DbGFzc05hbWUpO1xyXG4gICAgfSxcclxuICAgIC8qKlxyXG4gICAgICogKGZ1bmN0aW9uIHRoYXQgY2hlY2tzIGlmIHRoZSBtb2RhbCBpcyB2aXNpYmxlIChjb25zaWRlcnMgei1pbmRleCBvcmRlcikpXHJcbiAgICAgKiBcclxuICAgICAqIEByZXR1cm5zIChib29sZWFuKVxyXG4gICAgICovXHJcbiAgICBpc1Zpc2libGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgaXNTaG93aW5nID0gX2lnY21vZGFsLnByb3RvdHlwZS5pc1Nob3dpbmcuY2FsbCh0aGlzKTtcclxuXHJcbiAgICAgICAgaWYgKGlzU2hvd2luZykge1xyXG4gICAgICAgICAgICAvLyBjaGVjayBpZiBtb2RhbCBpbnN0YW5jZSBoYXMgdGhlIGhpZ2hlc3Qgei1pbmRleFxyXG5cclxuICAgICAgICAgICAgLy8gb3JkZXIgbW9kYWxzIGJ5IGhpZ2hlc3Qgei1pbmRleFxyXG4gICAgICAgICAgICB2YXIgb3JkZXJNb2RhbEFyciA9IG1vZGFsQXJyLnNvcnQoY29tcGFyZU1vZGFsWkluZGV4KTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IG9yZGVyTW9kYWxBcnIubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChvcmRlck1vZGFsQXJyW2ldLmlzU2hvd2luZygpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgY3VycmVudCBtb2RhbCBpcyBzaG93aW5nXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGdldE1vZGFsWkluZGV4KG9yZGVyTW9kYWxBcnJbaV0ubW9kYWwpID4gZ2V0TW9kYWxaSW5kZXgodGhpcy5tb2RhbCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgY3VycmVudCBtb2RhbCBoYXMgYSBoaWdoZXIgei1pbmRleFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpdCBtdXN0IG1lYW4gdGhhdCBcInRoaXNcIiBtb2RhbCBpcyBub3QgdmlzaWJsZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBpZiBubyBjdXJyZW50bHkgc2hvd2luZyBtb2RhbHMgaGF2ZSBhIGhpZ2hlciB6LWluZGV4XHJcbiAgICAgICAgICAgIC8vIGl0IG11c3QgbWVhbiB0aGF0IFwidGhpc1wiIG1vZGFsIGlzIHZpc2libGVcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBpZiBcInRoaXNcIiBtb2RhbCBpcyBub3Qgc2hvd2luZyBpdCBjYW5ub3QgYmUgdmlzaWJsZSAgICAgICAgICAgIFxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxufTtcclxuXHJcbi8qKlxyXG4gKiAoaW5pdGlhbGl6YXRpb24gb2YgYSBtb2RhbCBpbnN0YW5jZSlcclxuICogXHJcbiAqIEBwYXJhbSBvcHRpb25zIChtb2RhbCBpbnN0YW5jZSBvcHRpb25zKVxyXG4gKiBAcmV0dXJucyAobW9kYWwgaW5zdGFuY2UpXHJcbiAqL1xyXG5faWdjbW9kYWwuaW5pdCA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICB0aGlzLmNsb3NlQnV0dG9uID0gbnVsbDtcclxuICAgIHRoaXMubW9kYWwgPSBudWxsO1xyXG4gICAgdGhpcy5vcHRpb25zID0gbnVsbDtcclxuXHJcbiAgICAvLyBDcmVhdGUgb3B0aW9ucyBieSBleHRlbmRpbmcgZGVmYXVsdHMgd2l0aCB0aGUgcGFzc2VkIGluIGFydWdtZW50c1xyXG4gICAgaWYgKG9wdGlvbnMgJiYgdHlwZW9mIG9wdGlvbnMgPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zID0gZXh0ZW5kRGVmYXVsdHMoZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMgPSBkZWZhdWx0T3B0aW9ucztcclxuICAgIH1cclxuXHJcbiAgICBidWlsZE1vZGFsLmNhbGwodGhpcyk7XHJcbiAgICBpbml0RXZlbnRzLmNhbGwodGhpcyk7XHJcblxyXG4gICAgbW9kYWxBcnIucHVzaCh0aGlzKTtcclxuXHJcbiAgICByZXR1cm4gdGhpcztcclxufTtcclxuXHJcbi8qKlxyXG4gKiAoZnVuY3Rpb24gdGhhdCBoaWRlcyBhbGwgbW9kYWwgaW5zdGFuY2VzKVxyXG4gKiBcclxuICogQHBhcmFtIHNob3VsZEZvcmNlSGlkZSAoYm9vbGVhbiB0aGF0IHNldHMgaWYgdGhlIG1vZGFscyBzaG91bGQgYmUgaGlkZGVuIGZvcmNlbHkgd2l0aG91dCBmaXJpbmcgZXZlbnRzKVxyXG4gKi9cclxuX2lnY21vZGFsLmhpZGVBbGwgPSBmdW5jdGlvbiAoc2hvdWxkRm9yY2VIaWRlKSB7XHJcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gbW9kYWxBcnIubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgICBpZiAoc2hvdWxkRm9yY2VIaWRlKSB7XHJcbiAgICAgICAgICAgIG1vZGFsQXJyW2ldLmZvcmNlSGlkZSgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIG1vZGFsQXJyW2ldLmhpZGUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07XHJcblxyXG4vKipcclxuICogKGZ1bmN0aW9uIHRoYXQgc2V0cyBuZXcgZGVmYXVsdCBvcHRpb25zKVxyXG4gKiBcclxuICogQHBhcmFtIG9wdGlvbnMgKG9wdGlvbnMgb2JqZWN0IHRoYXQgd2lsbCBvdmVycmlkZSB0aGUgZGVmYXVsdCBvcHRpb25zKVxyXG4gKi9cclxuX2lnY21vZGFsLnNldERlZmF1bHRPcHRpb25zID0gZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgIGlmIChvcHRpb25zICYmIHR5cGVvZiBvcHRpb25zID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgIGRlZmF1bHRPcHRpb25zID0gZXh0ZW5kRGVmYXVsdHMoZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgb3B0aW9ucyBwYXJhbWV0ZXIsIHR5cGVvZiBvYmplY3QgcmVxdWlyZWQhJyk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5faWdjbW9kYWwuaW5pdC5wcm90b3R5cGUgPSBfaWdjbW9kYWwucHJvdG90eXBlO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBfaWdjbW9kYWw7Il19

(function(global) {
    /* IGC MODAL PLUGIN
     *
     * Events:
     * - beforeShow
     * - afterShow
     * - beforeHide
     * - afterHide
     * - afterDomInit
     *
     * Instance Functions: 
     * - show
     * - hide
     * - forceShow (no events)
     * - forceHide (no events)
     * - destroy (remove element and events from dom) 
     * - setContent (change content - dom element, html, string)
     * - isShowing 
     * - isHidden
     * - isVisible
     * 
     * Global Functions:
     * - hideAll
     */

    var className, openClassName, closeBtnClassName, contentClassName, cellClassName, boxClassName, innerClassName, modalArr;

    className = 'igc-modal';
    openClassName = className + '-visible';
    closeBtnClassName = className + '-closebtn';
    contentClassName = className + '-content';
    cellClassName = className + '-cell';
    boxClassName = className + '-box';
    innerClassName = className + '-inner';
    modalArr = [];

    /**
     * (Shortcut for removing the "new" keyword when creating an instance of the modal)
     * 
     * @param options (plugin options)
     * @returns (a new modal instance)
     */
    var IgcModal = function(options) {
        return new IgcModal.init(options);
    };

    var defaultOptions = {
        className: null,
        // content: $('#header').get(0),
        // content: "This is a modal",
        // content = '<iframe src="' + contentA + '" frameborder="0" allowfullscreen align="center" style="overflow:hidden;height:100%;width:100%" height="100%" width="100%"><p>Your browser does not support iframes.</p></iframe>',
        content: '',
        maxWidth: null, // 600 = 600px
        minWidth: null,
        closeButton: true, // accepts same args as content property
        overlay: true,
        hideOverlayOnClick: true,
        /**
         * (callback fired before the modal is shown)
         */
        beforeShow: function() { },
        /**
         * (callback fired after the modal is shown)
         */
        afterShow: function() { },
        /**
         * (callback fired before the modal is hid)
         */
        beforeHide: function() { },
        /**
         * (callback fired after the modal is hid)
         */
        afterHide: function() { },
        /**
         * (callback fired after the modal dom is initiated)
         */
        afterDomInit: function() { },
        /**
         * (callback fired when a "click" event is triggered on the modal overlay)
         */
        onOverlayClick: function() { }
    };

    IgcModal.prototype = {
        /**
         * (function that shows the modal while also calling the respective callbacks passed in the options)
         * 
         * @returns (the current instance of the modal)
         */
        show: function() {
            this.options.beforeShow.call(this);
            IgcModal.prototype.forceShow.call(this);
            this.options.afterShow.call(this);

            return this;
        },
        /**
         * (function that hides the modal while also calling the respective callbacks passed in the options)
         * 
         * @returns (the current instance of the modal)
         */
        hide: function() {
            this.options.beforeHide.call(this);
            IgcModal.prototype.forceHide.call(this);
            this.options.afterHide.call(this);

            return this;
        },
        /**
         * (function that shows the modal while taking into account that other modals might already be visible)
         * 
         * @returns (the current instance of the modal)
         */
        forceShow: function() {
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
        forceHide: function() {
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
        destroy: function() {
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
        setContent: function(content) {
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
        isHidden: function() {
            return !elementHasClass(this.modal, openClassName);
        },
        /**
         * (function that checks if the modal is showing (has has constant class))
         * 
         * @returns (boolean)
         */
        isShowing: function() {
            return elementHasClass(this.modal, openClassName);
        },
        /**
         * (function that checks if the modal is visible (considers z-index order))
         * 
         * @returns (boolean)
         */
        isVisible: function() {
            var isShowing = IgcModal.prototype.isShowing.call(this);
            
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
    IgcModal.init = function(options) {
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
    IgcModal.hideAll = function(shouldForceHide) {
        for (var i = 0, len = modalArr.length; i < len; i++) {
            if (shouldForceHide) {
                modalArr[i].forceHide();
            } else {
                modalArr[i].hide();
            }
        }
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
            var self = this;

            this.modal.addEventListener('click', function(e) {
                if (e === undefined || !elementIsDescendant(self.content, e.target)) {
                    self.hide();
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

    IgcModal.init.prototype = IgcModal.prototype;
    global.IgcModal = IgcModal;
} (window));
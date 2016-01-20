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
     * - onOverlayClick
     * 
     * Global Functions:
     * - hideAll
     */

    var className, openClassName, contentClassName, overlayClassName, modalArr;

    className = "igc-modal";
    openClassName = className + "-visible";
    closeBtnClassName = className + "-closebtn";
    contentClassName = className + "-content";
    overlayClassName = className + "-overlay";
    modalArr = [];

    var IgcModal = function(options) {
        return new IgcModal.init(options);
    };

    var defaultOptions = {
        className: null,
        // content: $('#header').get(0),
        // content: "This is a modal",
        // content = '<iframe src="' + contentA + '" frameborder="0" allowfullscreen align="center" style="overflow:hidden;height:100%;width:100%" height="100%" width="100%"><p>Your browser does not support iframes.</p></iframe>',
        content: "",
        maxWidth: null, // 600 = 600px
        minWidth: null,
        closeButton: true, // accepts same args as content property
        overlay: true,
        beforeShow: function() {},
        afterShow: function() {},
        beforeHide: function() {},
        afterHide: function() {},
        afterDomInit: function() {},
        onOverlayClick: function() {}
    };

    IgcModal.prototype = {
        show: function() {
            this.options.beforeShow.call(this);
            IgcModal.prototype.forceShow.call(this);
            this.options.afterShow.call(this);

            return this;
        },
        hide: function() {
            this.options.beforeHide.call(this);
            IgcModal.prototype.forceHide.call(this);
            this.options.afterHide.call(this);

            return this;
        },
        forceShow: function() {
            if (!elementHasClass(this.modal, openClassName)) {
                this.modal.className = this.modal.className + " " + openClassName;
            }

            if (this.overlay && !elementHasClass(this.overlay, openClassName)) {
                this.overlay.className = this.overlay.className + " " + openClassName;
            }

            return this;
        },
        forceHide: function() {
            if (elementHasClass(this.modal, openClassName)) {
                this.modal.className = elementRemoveClass(this.modal, openClassName);
            }

            if (elementHasClass(this.overlay, openClassName)) {
                this.overlay.className = elementRemoveClass(this.overlay, openClassName);
            }

            return this;
        },
        destroy: function() {
            document.body.removeChild(this.modal);
            document.body.removeChild(this.overlay);

            var index = modalArr.indexOf(this);
            if (index > -1) {
                modalArr.splice(index, 1);
            }
        },
        setContent: function(content) {
            this.content.parentNode.removeChild(this.content);

            this.content = buildModalContent(content);
            this.modal.appendChild(this.content);

            return this;
        },
        isHidden: function() {
            return !elementHasClass(this.modal, openClassName);
        },
        isShowing: function() {
            return elementHasClass(this.modal, openClassName);
        }
    };

    IgcModal.init = function(options) {
        this.closeButton = null;
        this.modal = null;
        this.overlay = null;

        // Create options by extending defaults with the passed in arugments
        if (options && typeof options === "object") {
            this.options = extendDefaults(defaultOptions, options);
        } else {
            this.options = defaultOptions;
        }

        buildModal.call(this);
        initEvents.call(this);

        modalArr.push(this);

        return this;
    };

    IgcModal.hideAll = function(/*callback*/) {
        // callback = callback ? callback : function(){ return true; }
        for (var i = 0, len = modalArr.length; i < len; i++) {
            // if (callback(modalArr[i], i)) {
                modalArr[i].hide();
            // };
        };
    };

    function buildModal() {
        var contentHolder, docFrag;

        // https://developer.mozilla.org/en-US/docs/Web/API/Document/createDocumentFragment
        docFrag = document.createDocumentFragment();

        // modal container
        this.modal = document.createElement("div");
        this.modal.className = className + ((typeof this.options.className === "string") ? " " + this.options.className : "");
        this.modal.style.minWidth = this.options.minWidth + "px";
        this.modal.style.maxWidth = this.options.maxWidth + "px";

        if (this.options.closeButton === true) {
            this.closeButton = document.createElement("a");
            this.closeButton.className = closeBtnClassName;
            this.closeButton.innerHTML = "×";
            this.modal.appendChild(this.closeButton);
        } else if (this.options.closeButton.tagName) {
            this.closeButton = this.options.closeButton;
            this.modal.appendChild(this.closeButton);
        }

        if (this.options.overlay === true) {
            this.overlay = document.createElement("div");
            this.overlay.className = overlayClassName + ((typeof this.options.className === "string") ? " " + this.options.className : "");
            docFrag.appendChild(this.overlay);
        }

        this.content = buildModalContent(this.options.content);
        this.modal.appendChild(this.content);

        docFrag.appendChild(this.modal);

        document.body.appendChild(docFrag);

        this.options.afterDomInit.call(this);
    }

    function buildModalContent(content) {
        var contentHolder;

        if (content.innerHTML) {
            content = content.innerHTML;
        }

        // append content
        contentHolder = document.createElement("div");
        contentHolder.className = contentClassName;
        contentHolder.innerHTML = content;

        return contentHolder;
    }

    function initEvents() {
        // close button click -- hide modal
        if (this.closeButton) {
            this.closeButton.addEventListener('click', this.hide.bind(this));
        }

        // overlay click -- trigger defined event
        if (this.overlay) {
            this.overlay.addEventListener('click', this.options.onOverlayClick.bind(this));
        }
    }

    function elementHasClass(element, className) {
        return ((" " + element.className + " ").replace(/[\n\t]/g, " ").indexOf(" " + className + " ") > -1);
    }

    function elementRemoveClass(element, className) {
        return element.className.replace(new RegExp("(\\s|^)" + className + "(\\s|$)"), '');
    }

    function extendDefaults(source, properties) {
        var property;
        for (property in properties) {
            if (properties.hasOwnProperty(property)) {
                source[property] = properties[property];
            }
        }
        return source;
    }

    IgcModal.init.prototype = IgcModal.prototype;
    global.IgcModal = IgcModal;
}(window));
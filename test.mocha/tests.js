describe('IGC Modal (Visual) Tests', function() {
    var modal1 = IgcModal({
        className: 'modal1',
        content: '<h1>This is a modal #1.</h1>',
        maxWidth: 600,
        minWidth: 280,
        closeButton: true
    });

    var modal2 = IgcModal({
        className: 'modal2',
        content: '<h1>This is a modal #2.</h1>',
        maxWidth: 600,
        minWidth: 280,
        closeButton: false
    });

    describe('Features', function() {
        it('Modal closeButton === true, Passed!', function() {
            expect($('.igc-modal-closebtn', modal1.modal).length > 0).to.equal(true);
        });

        it('Modal closeButton === false, Passed!', function() {
            expect($('.igc-modal-closebtn', modal2.modal).length > 0).to.equal(false);
        });

        it('Modal has correct min-width attribute!', function() {
            expect($('.igc-modal-content', modal1.modal).css('min-width')).to.equal(280 + 'px');
        });

        it('Modal has correct max-width attribute!', function() {
            expect($('.igc-modal-content', modal1.modal).css('max-width')).to.equal(600 + 'px');
        });
    });

    describe('While Modal is showing', function() {
        // while modal is showing tests
        it('Modal can be shown!', function() {
            modal1.forceShow();
            expect($(modal1.modal).hasClass('igc-modal-visible')).to.equal(true);
        });

        it('Modal isShowing reading is correct!', function() {
            modal1.forceShow();
            expect(modal1.isShowing()).to.equal(true);
        });

        it('Modal isHidden reading is correct!', function() {
            modal1.forceShow();
            expect(modal1.isHidden()).to.equal(false);
        });

        it('Modal isVisible (1 modal) reading is correct!', function() {
            modal1.forceShow();
            expect(modal1.isVisible()).to.equal(true);
        });
    });

    describe('While Modal is hidden', function() {
        // while modal is hidden tests
        it('Modal can be hid!', function() {
            modal1.forceHide();
            expect($(modal1.modal).hasClass('igc-modal-visible')).to.equal(false);
        });

        it('Modal isShowing reading is correct!', function() {
            modal1.forceHide();
            expect(modal1.isShowing()).to.equal(false);
        });

        it('Modal isHidden reading is correct!', function() {
            modal1.forceHide();
            expect(modal1.isHidden()).to.equal(true);
        });

        it('Modal isVisible (1 modal) reading is correct!', function() {
            modal1.forceHide();
            expect(modal1.isVisible()).to.equal(false);
        });
    });

    describe('Multiple Modal instances', function() {
        it('Modal1 isVisible (multiple modals) reading is correct!', function() {
            modal1.forceHide();
            modal2.forceShow();
            modal1.forceShow();

            expect(modal1.isVisible()).to.equal(true);

            modal2.forceHide();
            modal1.forceHide();
        });

        it('Modal2 isVisible (multiple modals) reading is correct!', function() {
            modal1.forceHide();
            modal2.forceShow();
            modal1.forceShow();

            expect(modal2.isVisible()).to.equal(false);

            modal2.forceHide();
            modal1.forceHide();
        });
    });
});
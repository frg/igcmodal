'use strict';

describe('IGC Modal Tests', function() {

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
        maxWidth: 444,
        minWidth: 111,
        closeButton: false
    });

    after(function() {
        modal2.destroy();
        modal1.destroy();
    });

    describe('Features', function() {

        it('Modal closeButton === true, Passed!', function() {
            expect($('.igc-modal-closebtn', modal1.modal).length > 0).to.equal(true);
        });

        it('Modal closeButton === false, Passed!', function() {
            expect($('.igc-modal-closebtn', modal2.modal).length > 0).to.equal(false);
        });

        it('Modal has correct min-width attribute!', function() {
            expect($('.igc-modal-content', modal2.modal).css('min-width')).to.equal(111 + 'px');
        });

        it('Modal has correct max-width attribute!', function() {
            expect($('.igc-modal-content', modal2.modal).css('max-width')).to.equal(444 + 'px');
        });

    });

    describe('While Modal is showing', function() {

        before(function() {
            modal1.forceShow();
        });

        it('Modal can be shown!', function() {
            expect($(modal1.modal).hasClass('igc-modal-visible')).to.equal(true);
        });

        it('Modal isShowing reading is correct!', function() {
            expect(modal1.isShowing()).to.equal(true);
        });

        it('Modal isHidden reading is correct!', function() {
            expect(modal1.isHidden()).to.equal(false);
        });

        it('Modal isVisible (1 modal) reading is correct!', function() {
            expect(modal1.isVisible()).to.equal(true);
        });

    });

    describe('While Modal is hidden', function() {

        before(function() {
            modal1.forceHide();
        });

        it('Modal can be hid!', function() {
            expect($(modal1.modal).hasClass('igc-modal-visible')).to.equal(false);
        });

        it('Modal isShowing reading is correct!', function() {
            expect(modal1.isShowing()).to.equal(false);
        });

        it('Modal isHidden reading is correct!', function() {
            expect(modal1.isHidden()).to.equal(true);
        });

        it('Modal isVisible (1 modal) reading is correct!', function() {
            expect(modal1.isVisible()).to.equal(false);
        });

    });

    describe('Multiple Modal instances', function() {

        before(function() {
            modal1.forceHide();
            modal2.forceShow();
            modal1.forceShow();
        });

        after(function() {
            modal2.forceHide();
            modal1.forceHide();
        });

        it('Modal1 isVisible (multiple modals) reading is correct!', function() {
            expect(modal1.isVisible()).to.equal(true);
        });

        it('Modal2 isVisible (multiple modals) reading is correct!', function() {
            expect(modal2.isVisible()).to.equal(false);
        });

    });

    describe('Callbacks', function() {

        it('beforeShow callback triggers with correct reference to "this"!', function(done) {
            var handleCallback, tempModal;

            handleCallback = function() {
                expect(tempModal === this).to.equal(true);
                done();
            };

            tempModal = IgcModal({
                beforeShow: handleCallback
            });

            tempModal.show().destroy();
        });

        it('afterShow callback triggers with correct reference to "this"!', function(done) {
            var handleCallback, tempModal;

            handleCallback = function() {
                expect(tempModal === this).to.equal(true);
                done();
            };

            tempModal = IgcModal({
                afterShow: handleCallback
            });

            tempModal.show().destroy();
        });

        it('beforeHide callback triggers with correct reference to "this"!', function(done) {
            var handleCallback, tempModal;

            handleCallback = function() {
                expect(tempModal === this).to.equal(true);
                done();
            };

            tempModal = IgcModal({
                beforeHide: handleCallback
            });

            tempModal.show().hide().destroy();
        });

        it('afterHide callback triggers with correct reference to "this"!', function(done) {
            var handleCallback, tempModal;

            handleCallback = function() {
                expect(tempModal === this).to.equal(true);
                done();
            };

            tempModal = IgcModal({
                afterHide: handleCallback
            });

            tempModal.show().hide().destroy();
        });

        it('afterDomInit callback triggers with correct reference to "this"!', function(done) {
            var handleCallback, tempModal;

            handleCallback = function() {
                // setTimeout is required to test the correct instance reference
                // because afterDomInit callback is fired before the "this" instance
                // is returned on IgcModal invocation. Thus the purpose of setTimeout
                // is to clear the callstack and move the reference checks to run after
                // the "this" reference is assigned to tempModal
                setTimeout(function() {
                    expect(tempModal === this).to.equal(true);
                    done();
                }.bind(this), 0);
            };

            tempModal = IgcModal({
                afterDomInit: handleCallback
            });

            tempModal.destroy();
        });

    });

    describe('Glabal Modal Callbacks', function() {

        it('hideAll function hides all visible modals!', function() {
            modal1.show();
            modal2.show();

            IgcModal.hideAll();

            expect(modal1.isHidden() && modal2.isHidden()).to.equal(true);
        });

    });

});
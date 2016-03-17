QUnit.test('modal.visibility', function(assert) {
    var modal1 = IgcModal({
        className: 'modal1',
        content: '<h1>This is a modal #1.</h1>',
        maxWidth: 600,
        minWidth: 280,
        closeButton: false
    });
    
    modal1.forceShow();
    assert.ok($(modal1.modal).hasClass('igc-modal-visible'), 'Modal can be shown!');
    assert.ok(modal1.isShowing(), 'Modal isShowing (while showing) reading is correct!');
    assert.ok(!modal1.isHidden(), 'Modal isHidden (while showing) reading is correct!');
    assert.ok(modal1.isVisible(), 'Modal isVisible (while showing, 1 modal) reading is correct!');
    
    modal1.forceHide();
    assert.ok(!$(modal1.modal).hasClass('igc-modal-visible'), 'Modal can be hid!');
    assert.ok(!modal1.isShowing(), 'Modal isShowing (while hidden) reading is correct!');
    assert.ok(modal1.isHidden(), 'Modal isHidden (while hidden) reading is correct!');
    assert.ok(!modal1.isVisible(), 'Modal isVisible (while hidden, 1 modal) reading is correct!');
    
    assert.ok($('.igc-modal-content', modal1.modal).css('min-width') === 280 + 'px', 'Modal has correct min-width attribute!');
    assert.ok($('.igc-modal-content', modal1.modal).css('max-width') === 600 + 'px', 'Modal has correct max-width attribute!');
    
    assert.ok(!($('.igc-modal-closebtn', modal1.modal).length > 0), 'Modal closeButton === false, Passed!');
    
    var modal2 = IgcModal({
        className: 'modal2',
        content: '<h1>This is a modal #1.</h1>',
        maxWidth: 600,
        minWidth: 280,
        closeButton: true
    });
    
    assert.ok($('.igc-modal-closebtn', modal2.modal).length > 0, 'Modal closeButton === true, Passed!');
    
    modal1.forceHide();
    modal2.forceShow();
    modal1.forceShow();
    assert.ok(modal1.isVisible(), 'Modal isVisible (while hidden, 2 modals) reading is correct!');
    
    modal1.destroy();
    modal2.destroy();
});

QUnit.test('modal.content', function(assert) {
    assert.ok(true, 'placeholder');
});

QUnit.test('modal.callbacks', function(assert) {
    assert.ok(true, 'placeholder');
});

QUnit.test('modal.globals', function(assert) {
    assert.ok(true, 'placeholder');
});
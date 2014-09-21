require('rootpath')();

var expect = require('chai').expect;
var sinon = require('sinon');

var Dispatcher = require('src/Dispatcher');

describe.skip('Dispatcher.dispatch', function() {
  it('works', function() {
    var dispatcher = new Dispatcher();

    var action = sinon.spy(function(payload, next) {
      next();
    });

    dispatcher.register('store', 'action', [], action);

    dispatcher.dispatch('action', {text: "A"});

    expect(action.callCount).to.equal(1);
  });
});
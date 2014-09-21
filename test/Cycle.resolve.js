require('rootpath')();

var expect = require('chai').expect;
var sinon = require('sinon');

var Cycle = require('src/Cycle');

describe('Cycle.resolve', function() {
  it('with no dependencies', function() {
    var actions = {
      'store1': {
        dependencies: [],
        cb: sinon.spy(function(payload, next) {
          next();
        })
      },
      'store2': {
        dependencies: [],
        cb: sinon.spy(function(payload, next) {
          next();
        })
      }
    };

    var cycle = new Cycle(actions, {});
    cycle.run();

    expect(actions.store1.cb.callCount).to.be.equal(1);
    expect(actions.store2.cb.callCount).to.be.equal(1);
  });

  it('with one dependency', function() {
    var actions = {
      'store1': {
        dependencies: ['store2'],
        cb: sinon.spy(function(payload, next) {
          next();
        })
      },
      'store2': {
        dependencies: [],
        cb: sinon.spy(function(payload, next) {
          next();
        })
      }
    };

    var cycle = new Cycle(actions, {});
    cycle.run();

    expect(actions.store1.cb.callCount).to.be.equal(1);
    expect(actions.store2.cb.callCount).to.be.equal(1);

    expect(actions.store1.cb.calledAfter(actions.store2.cb)).to.equal(true);

  });

  it('with multiple dependencies', function() {
    var actions = {
      'store1': {
        dependencies: ['store2', 'store3'],
        cb: sinon.spy(function(payload, next) {
          next();
        })
      },
      'store2': {
        dependencies: [],
        cb: sinon.spy(function(payload, next) {
          next();
        })
      },
      'store3': {
        dependencies: [],
        cb: sinon.spy(function(payload, next) {
          next();
        })
      }
    };

    var cycle = new Cycle(actions, {});
    cycle.run();

    expect(actions.store1.cb.callCount).to.be.equal(1);
    expect(actions.store2.cb.callCount).to.be.equal(1);
    expect(actions.store3.cb.callCount).to.be.equal(1);

    expect(actions.store1.cb.calledAfter(actions.store2.cb)).to.equal(true);
    expect(actions.store1.cb.calledAfter(actions.store3.cb)).to.equal(true);

  });

  it('async', function(done) {
    function check() {
      expect(actions.store1.cb.callCount).to.be.equal(1);
      expect(actions.store2.cb.callCount).to.be.equal(1);
      expect(actions.store3.cb.callCount).to.be.equal(1);

      expect(actions.store1.cb.calledAfter(actions.store2.cb)).to.equal(true);
      expect(actions.store1.cb.calledAfter(actions.store3.cb)).to.equal(true);
      done();
    }

    var actions = {
      'store1': {
        dependencies: ['store2', 'store3'],
        cb: sinon.spy(function(payload, next) {
          next();
          check();
        })
      },
      'store2': {
        dependencies: [],
        cb: sinon.spy(function(payload, next) {
          setTimeout(next, 10);
        })
      },
      'store3': {
        dependencies: [],
        cb: sinon.spy(function(payload, next) {
          setTimeout(next, 100);
        })
      }
    };

    var cycle = new Cycle(actions, {});
    cycle.run();
  });
});
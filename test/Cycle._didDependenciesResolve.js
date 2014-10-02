require('rootpath')();

var _ = require('lodash');
var expect = require('chai').expect;
var sinon = require('sinon');

var Cycle = require('src/Cycle');

describe('Cycle.didDependenciesResolve', function() {
  var actions = [];

  it('with no dependencies', function() {
    var cycle = new Cycle(actions, {});
    expect(cycle._didDependenciesResolve([])).to.be.equal(true);
  });

  it('with one dependency [false]', function() {
    var cycle = new Cycle(actions, {});
    expect(cycle._didDependenciesResolve(['store1'])).to.be.equal(false);
  });

  it('with multiple dependencies [false]', function() {
    var cycle = new Cycle(actions, {});
    expect(cycle._didDependenciesResolve(['store1', 'store2'])).to.be.equal(false);
  });

  it('with one dependency [true]', function() {
    var cycle = new Cycle(actions, {});
    cycle._resolved.push('store1');

    expect(cycle._didDependenciesResolve(['store1'])).to.be.equal(true);
  });

  it('with multiple dependencies [true]', function() {
    var cycle = new Cycle(actions, {});
    cycle._resolved.push('store1');
    cycle._resolved.push('store2');

    expect(cycle._didDependenciesResolve(['store1', 'store2'])).to.be.equal(true);
  });
});
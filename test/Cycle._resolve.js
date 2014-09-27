require('rootpath')();

var _ = require('lodash');
var expect = require('chai').expect;
var sinon = require('sinon');

var Cycle = require('src/Cycle');


describe('Cycle.resolve', function() {
	var actions;
	var payload;

	var next = function(payload, next) {
		next();
	};

	beforeEach(function() {
		actions = {};
	});


	it('with no dependencies', function() {
		var spy1 = sinon.spy(next);
		var spy2 = sinon.spy(next);

		actions = [
			{
				'dependencies': [],
				'fn': spy1,
				'id': 1
			},
			{
				'dependencies': [],
				'fn': spy2,
				'id': 2
			}
		];

		var cycle = new Cycle(actions, payload);
		

		expect(spy1.callCount).to.equal(1);
		expect(spy2.callCount).to.equal(1);
	});

	it('with multiple dependencies', function() {
		var spy1 = sinon.spy(next);
		var spy2 = sinon.spy(next);
		var spy3 = sinon.spy(next);

		actions = [
			{
				'dependencies': [2, 3],
				'fn': spy1,
				'id': 1
			},
			{
				'dependencies': [],
				'fn': spy2,
				'id': 2
			},
			{
				'dependencies': [],
				'fn': spy3,
				'id': 3
			}
		];

		var cycle = new Cycle(actions, payload);
		

		expect(spy1.callCount).to.equal(1);
		expect(spy2.callCount).to.equal(1);
		expect(spy3.callCount).to.equal(1);

		expect(spy2.calledBefore(spy1)).to.be.true;
		expect(spy3.calledBefore(spy1)).to.be.true;
	});


	it('with transitive dependencies', function() {
		var spy1 = sinon.spy(next);
		var spy2 = sinon.spy(next);
		var spy3 = sinon.spy(next);

		actions = [
			{
				'dependencies': [],
				'fn': spy1,
				'id': 1
			},
			{
				'dependencies': [1],
				'fn': spy2,
				'id': 2
			},
			{
				'dependencies': [2],
				'fn': spy3,
				'id': 3
			}
		];

		var cycle = new Cycle(actions, payload);
		

		expect(spy1.callCount).to.equal(1);
		expect(spy2.callCount).to.equal(1);
		expect(spy3.callCount).to.equal(1);

		expect(spy1.calledBefore(spy2)).to.be.true;
		expect(spy1.calledBefore(spy3)).to.be.true;
		expect(spy2.calledBefore(spy3)).to.be.true;
	});

	it('with multiple async dependencies', function() {
		var spy1 = sinon.spy(next);		
		var spy2 = sinon.spy(function(payload, next) {
			setTimeout(next, 0);
		});
		var spy3 = sinon.spy(function(payload, next) {
			setTimeout(next, 20);
		});

		actions = [
			{
				'dependencies': [2, 3],
				'fn': spy1,
				'id': 1
			},
			{
				'dependencies': [],
				'fn': spy2,
				'id': 2
			},
			{
				'dependencies': [],
				'fn': spy3,
				'id': 3
			}
		];

		var onComplete = function() {
			expect(spy1.callCount).to.equal(1);
			expect(spy2.callCount).to.equal(1);
			expect(spy3.callCount).to.equal(1);

			expect(spy1.calledBefore(spy2)).to.be.true;
			expect(spy1.calledBefore(spy3)).to.be.true;
		};

		var cycle = new Cycle(actions, payload, onComplete);
	
	});

	it('with transitive async dependencies', function() {
		var spy1 = sinon.spy(function(payload, next) {
			setTimeout(next, 0);
		});
		var spy2 = sinon.spy(function(payload, next) {
			setTimeout(next, 0);
		});
		var spy3 = sinon.spy(next);

		actions = [
			{
				'dependencies': [],
				'fn': spy1,
				'id': 1
			},
			{
				'dependencies': [1],
				'fn': spy2,
				'id': 2
			},
			{
				'dependencies': [2],
				'fn': spy3,
				'id': 3
			}
		];

		var onComplete = function() {
			expect(spy1.callCount).to.equal(1);
			expect(spy2.callCount).to.equal(1);
			expect(spy3.callCount).to.equal(1);

			expect(spy1.calledBefore(spy2)).to.be.true;
			expect(spy1.calledBefore(spy3)).to.be.true;
			expect(spy2.calledBefore(spy3)).to.be.true;
		};

		var cycle = new Cycle(actions, payload, onComplete);
		
	});

	
});
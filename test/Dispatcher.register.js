require('rootpath')();

var expect = require('chai').expect;
var sinon = require('sinon');

var Dispatcher = require('src/Dispatcher');

describe('Dispatcher.register', function() {
	it('with 3 method parameters', function() {
		var dispatcher = new Dispatcher();

		var store1Function = function() {};
		var store2Function = function() {};

		var token1 = dispatcher.register('action1', [], store1Function);
		var token2 = dispatcher.register('action1', [], store1Function);
		var token3 = dispatcher.register('action1', [token1, token2], store2Function);

		var token4 = dispatcher.register('action2', [], store1Function);

		expect(dispatcher._actions).to.deep.equal({
			'action1': [
				{
					'id': 0,
					'dependencies': [],
					'fn': store1Function
				},
				{
					'id': 1,
					'dependencies': [],
					'fn': store1Function
				},
				{
					'id': 2,
					'dependencies': [token1, token2],
					'fn': store2Function
				}
			],
			'action2': [
				{
					'id': 3,
					'dependencies': [],
					'fn': store1Function
				}
			]
		});
	});

	it('with 1 method parameters', function() {
		var dispatcher = new Dispatcher();

		var store1Function = function() {};
		var store2Function = function() {};

		var token1 = dispatcher.register({
			action: 'action1',
			dependencies: [],
			fn: store1Function
		});
		var token2 = dispatcher.register({
			action: 'action1',
			dependencies: [],
			fn: store1Function
		});
		var token3 = dispatcher.register({
			action: 'action1',
			dependencies: [token1, token2],
			fn: store2Function
		});

		var token4 = dispatcher.register({
			action: 'action2',
			dependencies: [],
			fn: store1Function
		});

		expect(dispatcher._actions).to.deep.equal({
			'action1': [
				{
					'id': 0,
					'dependencies': [],
					'fn': store1Function
				},
				{
					'id': 1,
					'dependencies': [],
					'fn': store1Function
				},
				{
					'id': 2,
					'dependencies': [token1, token2],
					'fn': store2Function
				}
			],
			'action2': [
				{
					'id': 3,
					'dependencies': [],
					'fn': store1Function
				}
			]
		});
	});

});
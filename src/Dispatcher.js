"use strict";

var Listener = require('./Listener');
var Cycle = require('./Cycle');

/**
 * The dispatcher
 *
 * @constructor
 */
function Dispatcher() {
	this._actions = {};
	this._idCounter = 0;
}

Dispatcher.prototype = {

	/**
	 * Registers listeners to actions with their dependencies
	 * It's also possible to use the following notation to register a listener:
	 * {
	 * 	action: 'exampleaction',
	 * 	dependencies: [dependency1, dependecy2],
	 * 	fn: myCallbackFunction
	 * }
	 *
	 * @param  {string} action
	 * @param  {Array.<integer>} dependencies
	 * @param  {Function} fn The listener function
	 * @return {integer} Token to be used as dependency for other listeners
	 */
	register: function(action, dependencies, fn) {
		if(arguments.length === 1) {
			action = arguments[0].action;
			dependencies = arguments[0].dependencies;
			fn = arguments[0].fn;
		}

		if(!this._actions.hasOwnProperty(action)) {
			this._actions[action] = [];
 		}

 		var id = this._generateId();

		this._actions[action].push(new Listener(id, dependencies, fn));

    return id;
	},

	/**
	 * Generates unique ids for listeners
	 *
	 * @return {integer}
	 */
	_generateId: function() {
		return this._idCounter++;
	},

	/**
	 * Dispatches a given action with the given payload
	 *
	 * @param  {string} actionName
	 * @param  {*} payload
	 * @param  {function} onComplete
	 */
	dispatch: function(actionName, payload, onComplete) {
		if(!this._actions[actionName]) {
			onComplete();
			return;
		}

		new Cycle(this._actions[actionName], payload, onComplete);
	}
};

module.exports = Dispatcher;
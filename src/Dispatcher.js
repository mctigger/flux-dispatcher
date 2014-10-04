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
	 *
	 * @param  {string} actionName
	 * @param  {Array.<integer>} dependencies
	 * @param  {Function} fn The listener function
	 * @return {integer} Token to be used as dependency for other listeners
	 */
	register: function(actionName, dependencies, fn) {
		if(!this._actions.hasOwnProperty(actionName)) {
			this._actions[actionName] = [];
 		}

 		var id = this._generateId();

		this._actions[actionName].push(new Listener(id, dependencies, fn));

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
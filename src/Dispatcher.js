var _ = require('lodash');
var Cycle = require('./Cycle');

/**
 * The dispatcher
 *
 * @constructor
 */
function Dispatcher() {
	this.actions = {};
	this.idCounter = 0;
}

_.extend(Dispatcher.prototype, {

	/**
	 * Registers listeners to actions with their dependencies
	 * 
	 * @param  {string} actionName
	 * @param  {Array.<integer>} dependencies
	 * @param  {Function} fn The listener function
	 * @return {integer} Token to be used as dependency for other listeners
	 */
	register: function(actionName, dependencies, fn) {
		if(!_.has(this.actions, actionName)) {
			this.actions[actionName] = [];
 		}

 		var id = this._generateId();

		this.actions[actionName].push({
			id: id,
      dependencies: dependencies,
      fn: fn
    });

    return id;
	},

	/**
	 * Generates unique ids for listeners
	 * 
	 * @return {integer}
	 */
	_generateId: function() {
		return this.idCounter++;
	},

	/**
	 * Dispatches a given action with the given payload
	 * 
	 * @param  {string} actionName
	 * @param  {*} payload
	 * @param  {function} onComplete
	 */
	dispatch: function(actionName, payload, onComplete) {
		new Cycle(this.actions[actionName], payload, onComplete);
	}
});

module.exports = Dispatcher;
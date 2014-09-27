var _ = require('lodash');
var Cycle = require('./Cycle');


function Dispatcher() {
	this.actions = {};
	this.idCounter = 0;
}

_.extend(Dispatcher.prototype, {
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

	_generateId: function() {
		return this.idCounter++;
	},

	dispatch: function(actionName, payload, onComplete) {
		new Cycle(this.actions[actionName], payload, onComplete);
	}
});

module.exports = Dispatcher;
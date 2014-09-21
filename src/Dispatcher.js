var _ = require('lodash');
var Cycle = require('./Cycle');


function Dispatcher() {}

_.extend(Dispatcher.prototype, {
	actions: {},

	register: function(storeName, actionName, dependencies, cb) {
		if(!_.has(this.actions, actionName)) {
			this.actions[actionName] = {};
		}

		this.actions[actionName][storeName] = {
      dependencies: dependencies,
      cb: cb
    };
	},

	dispatch: function(actionName, payload) {
		new Cycle(this.actions[actionName], payload);
	}
});

module.exports = Dispatcher;
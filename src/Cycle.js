var _ = require('lodash');

/**
 * Controlls the successful diaptching of a single action
 *
 * @constructor
 * @param {Array.<Object>} actions Store listeners, their dependencies and ids
 * @param {*} payload The payload to be delivered to the stores
 * @param {function} onComplete Callback after the payload has been delivered
 */
function Cycle(actions, payload, onComplete) {
	// Actions to be resolved
	this.actions = _.clone(actions);

	this.payload = payload;
	this.onComplete = onComplete;

	this._resolved = [];
	this._actionCount = actions.length;

	this._resolve();
}

_.extend(Cycle.prototype, {

	/**
	 * Iterates over all actions and invokes every action whose dependencies 
	 * already resolved.
	 */
	_resolve: function() {
		this._resolvedInCurrentRun = false;

    // Mark as running.
    this._isResolving = true;

    // Invoked actions
    var invoked = [];

    // Invoke all actions which dependencies already resolved
    _.forEach(this.actions, function(action, index) {
  		if(this._didDependenciesResolve(action.dependencies)) {

  			var next = this._generateNext(action.id);
  			action.fn(this.payload, next);

  			invoked.push(action);
  		}
    }.bind(this));

		// Remove invoked actions from actions
		this.actions = _.difference(this.actions, invoked);

    // Remove mark.
    this._isResolving = false;

    // If there are dependencies which resolved while this method was running
    if(this._resolvedInCurrentRun) {
    	this._resolve();
    }

    // If all actions are resolved, invoke callback
    if(this._resolved.length === this._actionCount) {
    	if(this.onComplete) {
	    	this.onComplete();	
	    }
		}
  },

  /**
   * Generates a callback functions for actions. Invoking the generated function
   * will mark the action as resolved. If _resolve is currently running, a mark
   * is set. Else if _resolve is not running, it is invoked.
   * 
   * @param  {string} key The actions identifier
   * @return {function} Callback function for actions, signaling that the actions has completed
   */
  _generateNext: function(key) {
  	return function() {
  		this._resolved.push(key);   

  		if(!this._isResolving) {
  			this._resolve();
  		}
  		else {
  			this._resolvedInCurrentRun = true;
  		}
  	}.bind(this);
  },

  /**
   * Checks whether all actions in the given array already resolved
   * 
   * @param  {Array.<Object>} dependencies Array of actions
   * @return {boolean} 
   */
  _didDependenciesResolve: function(dependencies) {
  	var didResolve = true;

  	_.forEach(dependencies, function(dependency) {
  		if(!_.contains(this._resolved, dependency)) {
  			didResolve = false;
        // Break Loop
        return false;
      }
    }.bind(this));

  	return didResolve;
  }
});

module.exports = Cycle;
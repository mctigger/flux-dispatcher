var _ = require('lodash');

/**
 * Controlls the successful disptching of a payload
 *
 * @constructor
 * @param {Array.<Object>} listeners Store listeners, their dependencies and ids
 * @param {*} payload The payload to be delivered to the listeners
 * @param {function} onComplete Callback after the payload has been delivered
 */
function Cycle(listeners, payload, onComplete) {
	// Listeners to be invoked
	this.listeners = _.clone(listeners);

	this.payload = payload;
	this.onComplete = onComplete;

	this._resolved = [];
	this._totalListenerCount = listeners.length;

	this._resolve();
}

_.extend(Cycle.prototype, {

	/**
	 * Iterates over all listeners and invokes every listener whose dependencies 
	 * already resolved.
	 */
	_resolve: function() {
		this._resolvedInCurrentRun = false;

    // Mark as running.
    this._isResolving = true;

    // Invoked listeners
    var invoked = [];

    // Invoke all listeners which dependencies already resolved
    _.forEach(this.listeners, function(listener, index) {
  		if(this._didDependenciesResolve(listener.dependencies)) {

  			var next = this._generateNext(listener.id);
  			listener.fn(this.payload, next);

  			invoked.push(listener);
  		}
    }.bind(this));

		// Remove invoked listeners from this.listeners
		this.listeners = _.difference(this.listeners, invoked);

    // Remove mark.
    this._isResolving = false;

    // If there are dependencies which resolved while this method was running
    if(this._resolvedInCurrentRun) {
    	this._resolve();
    }

    // If all listeners are resolved, invoke callback
    if(this._resolved.length === this._totalListenerCount) {
    	if(this.onComplete) {
	    	this.onComplete();	
	    }
		}
  },

  /**
   * Generates a callback functions for listeners. Invoking the generated function
   * will mark the listener as resolved. If _resolve is currently running, a mark
   * is set. Else if _resolve is not running, it is invoked.
   * 
   * @param  {string} key The listener's identifier
   * @return {function} Callback function for listeners, signaling that the listener has completed
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
   * Checks whether all listeners in the given array already resolved
   * 
   * @param  {Array.<Object>} dependencies Array of listeners
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
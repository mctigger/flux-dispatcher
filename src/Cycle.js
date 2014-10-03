"use strict";

/**
 * Controlls the successful disptching of a payload
 *
 * @constructor
 * @param {Array.<Object>} listeners Store listeners, their dependencies and ids
 * @param {*} payload The payload to be delivered to the listeners
 * @param {function} onComplete Callback after the payload has been delivered
 */
function Cycle(listeners, payload, onComplete) {
	// Copy references to listeners
	this._listenersToBeInvoked = listeners.slice();

	this._payload = payload;
	this._onComplete = onComplete;

	// Listeners their dependencies already resolved
	this._resolved = [];
	this._totalListenerCount = listeners.length;

	this._resolve();
}

Cycle.prototype = {

	/**
	 * Iterates over all listeners and invokes every listener whose dependencies 
	 * already resolved.
	 */
	_resolve: function() {
		this._resolvedInCurrentRun = false;

    // Mark as running.
    this._isResolving = true;

    // Invoke all listeners which dependencies already resolved
    for(var key in this._listenersToBeInvoked) {
  		var listener = this._listenersToBeInvoked[key];

  		if(this._didDependenciesResolve(listener.dependencies)) {
  			var next = this._generateNext(listener.id);
  			listener.fn(this._payload, next);

  			delete this._listenersToBeInvoked[key];
  		}
    }

    // Remove mark.
    this._isResolving = false;

    // If there are dependencies which resolved while this method was running
    if(this._resolvedInCurrentRun) {
    	this._resolve();
    }

    // If all listeners are resolved, invoke callback
    if(this._resolved.length === this._totalListenerCount) {
    	if(this._onComplete) {
	    	this._onComplete();	
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

  	dependencies.forEach(function(dependency) {
  		// Checks whether this._resolved contains a dependency
  		if(this._resolved.indexOf(dependency) === -1) {
  			didResolve = false;
        // Break Loop
        return false;
      }
    }.bind(this));

  	return didResolve;
  }
};

module.exports = Cycle;
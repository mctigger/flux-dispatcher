var _ = require('lodash');

function Cycle(actions, payload) {
	this.actions = _.clone(actions);
	this.payload = payload;
  this.resolved = [];
}

_.extend(Cycle.prototype, {
  run: function() {
    this._resolvedInCurrentRun = false;

    // Mark as running.
    this._isRunning = true;

    _.forEach(this.actions, function(action, key) {
      if(this._didDependenciesResolve(action.dependencies)) {
        action.cb(this.payload, this._generateNext(key));
        delete this.actions[key];
      }
    }.bind(this));

    // Remove mark.
    this._isRunning = false;

    // If there are dependencies which resolved while this method was running
    if(this._resolvedInCurrentRun) {
      this.run();
    }
  },

  _generateNext: function(key) {
    return function() {
      this.resolved.push(key);      
      this._startRun();
    }.bind(this);
  },

  _startRun: function() {
    if(!this._isRunning) {
      this.run();
    }
    else {
      this._resolvedInCurrentRun = true;
    }
  },  

  _didDependenciesResolve: function(dependencies) {
    var didResolve = true;

    _.forEach(dependencies, function(dependency) {
      if(!_.contains(this.resolved, dependency)) {
        didResolve = false;
        // Break Loop
        return false;
      }
    }.bind(this));

    return didResolve;
  }
});

module.exports = Cycle;
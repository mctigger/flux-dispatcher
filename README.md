flux-dispatcher
===============

This is a dispatcher for Facebook's (React) Flux architecture.

##Installation

    npm install mctigger-flux-dispatcher

##Use

### Synchronous

```javascript
var Dispatcher = require('mctigger-flux-dispatcher');

var d = new Dispatcher();

var THREAD_SELECTED_ACTION = 'thread_selected_action';

var MessageStore = {};
var ThreadStore = {};

ThreadStore.onThreadSelected = d.register(THREAD_SELECTED_ACTION, [], function(payload, next) {
	// Do something important here and use the payload

	console.log(payload);
	console.log('A');

	// Don't forget to call next!
	next();
});

MessageStore.onThreadSelected = d.register(THREAD_SELECTED_ACTION, [ThreadStore.onThreadSelected], function(payload, next) {
	// Do something important here
	
	console.log(payload);
	console.log('B');

	next();
});

d.dispatch(THREAD_SELECTED_ACTION, 1);

```

Result:

```
	-> 1
	-> A
	-> 1
	-> B
```

### Asynchrous

Just a little change in onThreadSelected to demonstrate how the dispatcher works with async dependencies.

```javascript
ThreadStore.onThreadSelected = d.register(THREAD_SELECTED_ACTION, [], function(payload, next) {
	// Do something important here and use the payload

	console.log(payload);
	console.log('A');

	setTimeout(function() {
		// Don't forget to call next!
		next();
	}, 1000);
});

```

Result:

```
	-> 1
	-> A
	After 1000ms
	-> 1
	-> B
```

### Optimistic updates

You can combine synchronous and async dependencies to create optimistic updates.

```javascript
var Dispatcher = require('mctigger-flux-dispatcher');

var d = new Dispatcher();

var THREAD_SELECTED_ACTION = 'thread_selected_action';

var MessageStore = {};
var ThreadStore = {};

ThreadStore.onThreadSelected = d.register(THREAD_SELECTED_ACTION, [], function(payload, next) {
	console.log('C');
	loadThreadFromServer(function() {
		console.log('D');
		next();
	});
});

ThreadStore.onThreadSelectedOptimistic = d.register(THREAD_SELECTED_ACTION, [], function(payload, next) {
	console.log('A');
	next();
});

MessageStore.onThreadSelected = d.register(THREAD_SELECTED_ACTION, [ThreadStore.onThreadSelected], function(payload, next) {
	console.log('E');
	next();
});

MessageStore.onThreadSelectedOptmistic = d.register(THREAD_SELECTED_ACTION, [ThreadStore.onThreadSelectedOptimistic], function(payload, next) {
	console.log('B');
	next();
});

d.dispatch(THREAD_SELECTED_ACTION, {id: 2});

```

Result

```
	-> A/C Update UI with cached data here
	-> B Update UI with cached data here
	After server responded
	->D Update UI with the real data
	->E Update UI with the real data

```
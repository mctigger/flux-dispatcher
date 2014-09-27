require('rootpath')();

var expect = require('chai').expect;
var sinon = require('sinon');

var Cycle = require('src/Cycle');

describe('Cycle._generateNext', function() {

	it('with a call count 1', function() {
		var cycle = new Cycle([], {});
		var next = cycle._generateNext('somekey');

		next();

		expect(cycle._resolved).to.deep.equal(['somekey']);
	});
	
});
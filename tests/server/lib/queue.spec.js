'use strict'; // eslint-disable-line strict

/* global describe, it, before, beforeEach, afterEach, after */

const chai = require('chai');
const expect = chai.expect;

let queue = require('../../../server/lib/queue');

describe('queue', function () {

	it('contains a `has` method', function () {
		expect(queue.has).to.be.a('function');
	});

	it('contains an `add` method', function () {
		expect(queue.add).to.be.a('function');
	});

	it('contains a `retrieveMessage` method', function () {
		expect(queue.retrieveMessage).to.be.a('function');
	});

	it('contains a `reset` method', function () {
		expect(queue.reset).to.be.a('function');
	});

	it('`has` returns a boolean', function () {
		expect(queue.has()).to.be.a('boolean');
	});

	it('`retrieveMessage` returns undefined for an empty queue', function () {
		expect(queue.retrieveMessage()).to.be.undefined;
	});

	it('`add` returns the added item', function () {
		expect(queue.add()).to.be.undefined;
		expect(queue.add('a')).to.be.a('string');
		expect(queue.add(1)).to.be.a('number');
		expect(queue.add({})).to.be.an('object');
	});

	it('`has` returns false if item is not in queue', function () {
		expect(queue.has('banana')).to.be.false;
	});

	it('`has` returns true if item is in queue', function () {
		expect(queue.has('banana')).to.be.false;
		queue.add('banana');
		expect(queue.has('banana')).to.be.true;
	});

	it('`reset` removes all items in the queue', function() {
		queue.add('banana');
		expect(queue.has('banana')).to.be.true;
		queue.reset();
		expect(queue.has('banana')).to.be.false;
	});

	it('`retrieveMessage` returns first item from the queue', function () {
		queue.add('apple');
		expect(queue.retrieveMessage()).to.equal('apple');
	});

	it('`retrieveMessage` removes first item from the queue', function () {
		queue.add('pineapple');
		queue.retrieveMessage('pineapple');
		expect(queue.has('pineapple')).to.be.false;
	});
});

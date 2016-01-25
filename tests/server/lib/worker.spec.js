'use strict'; // eslint-disable-line strict

/* global describe, it, before, beforeEach, afterEach, after */

const chai = require('chai');
const expect = chai.expect;

const worker = require('../../../server/lib/worker');

describe('worker', function () {

	it('contains a `start` method', function () {
		expect(worker.start).to.be.a('function');
	});

	it('contains a `stop` method', function () {
		expect(worker.stop).to.be.a('function');
	});
});

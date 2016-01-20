'use strict'; // eslint-disable-line strict

/* global describe, it, before, beforeEach, afterEach, after */

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const mockery = require('mockery');
const sinon = require('sinon');

const databaseMock = {
	query: sinon.stub()
};

mockery.registerMock('./database', databaseMock);

const moduleUnderTest = '../../../server/lib/pageExists';

mockery.enable({
	useCleanCache: true,
	warnOnReplace: false,
	warnOnUnregistered: false
});

mockery.registerAllowable(moduleUnderTest);

const pageExists = require(moduleUnderTest);

describe('pageExists', function () {
	afterEach(function () {
		databaseMock.query.reset();
	});

	after(mockery.disable);

	it('given any parameters, it returns a promise', function () {
		databaseMock.query.returns(Promise.resolve());
		expect(pageExists()).to.be.a('promise');
		expect(pageExists(null)).to.be.a('promise');
		expect(pageExists(0)).to.be.a('promise');
		expect(pageExists(true)).to.be.a('promise');
		expect(pageExists(NaN)).to.be.a('promise');
		expect(pageExists('a')).to.be.a('promise');
		expect(pageExists([])).to.be.a('promise');
		expect(pageExists({})).to.be.a('promise');
	});

	it('rejects if the queries promise is rejected', function () {
		databaseMock.query.returns(Promise.reject());
		expect(pageExists()).to.be.rejected;
		expect(pageExists(null)).to.be.rejected;
		expect(pageExists(0)).to.be.rejected;
		expect(pageExists(true)).to.be.rejected;
		expect(pageExists(NaN)).to.be.rejected;
		expect(pageExists('a')).to.be.rejected;
		expect(pageExists([])).to.be.rejected;
		expect(pageExists({})).to.be.rejected;
	});

	it('resolves if the queries promise is resolved', function () {
		databaseMock.query.returns(Promise.resolve());
		expect(pageExists()).to.be.resolved;
		expect(pageExists(null)).to.be.resolved;
		expect(pageExists(0)).to.be.resolved;
		expect(pageExists(true)).to.be.resolved;
		expect(pageExists(NaN)).to.be.resolved;
		expect(pageExists('a')).to.be.resolved;
		expect(pageExists([])).to.be.resolved;
		expect(pageExists({})).to.be.resolved;
	});

	it('resolves with a boolean value', function () {
		databaseMock.query.returns(Promise.resolve());
		expect(pageExists()).to.eventually.be.resolved;
		expect(pageExists(0, 1)).to.eventually.be.a('boolean');
	});

	it('resolves with true is page exists', function () {
		databaseMock.query.returns(Promise.resolve(1));
		expect(pageExists()).to.eventually.be.true;
	});

	it('resolves with false is page does not exist', function () {
		databaseMock.query.returns(Promise.resolve(0));
		expect(pageExists()).to.eventually.be.false;
	});
});

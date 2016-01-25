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

const mysqlMock = {
	escape: sinon.stub()
};
mockery.registerMock('mysql', mysqlMock);

const moduleUnderTest = '../../../server/lib/insightsExist';

mockery.enable({
	useCleanCache: true,
	warnOnReplace: false,
	warnOnUnregistered: false
});

mockery.registerAllowable(moduleUnderTest);

const insightsExist = require(moduleUnderTest);

describe('insightsExist', function () {
	afterEach(function () {
		databaseMock.query.reset();
		mysqlMock.escape.reset();
	});

	after(mockery.disable);

	it('given any parameters, it returns a promise', function () {
		mysqlMock.escape.returnsArg(0);
		databaseMock.query.returns(Promise.resolve());
		expect(insightsExist()).to.be.a('promise');
		expect(insightsExist(null)).to.be.a('promise');
		expect(insightsExist(0)).to.be.a('promise');
		expect(insightsExist(true)).to.be.a('promise');
		expect(insightsExist(NaN)).to.be.a('promise');
		expect(insightsExist('a')).to.be.a('promise');
		expect(insightsExist([])).to.be.a('promise');
		expect(insightsExist({})).to.be.a('promise');
	});

	it('rejects if the queries promise is rejected', function () {
		mysqlMock.escape.returnsArg(0);
		databaseMock.query.returns(Promise.reject());
		expect(insightsExist()).to.be.rejected;
		expect(insightsExist(null)).to.be.rejected;
		expect(insightsExist(0)).to.be.rejected;
		expect(insightsExist(true)).to.be.rejected;
		expect(insightsExist(NaN)).to.be.rejected;
		expect(insightsExist('a')).to.be.rejected;
		expect(insightsExist([])).to.be.rejected;
		expect(insightsExist({})).to.be.rejected;
	});

	it('resolves if the queries promise is resolved', function () {
		mysqlMock.escape.returnsArg(0);
		databaseMock.query.returns(Promise.resolve());
		expect(insightsExist()).to.be.resolved;
		expect(insightsExist(null)).to.be.resolved;
		expect(insightsExist(0)).to.be.resolved;
		expect(insightsExist(true)).to.be.resolved;
		expect(insightsExist(NaN)).to.be.resolved;
		expect(insightsExist('a')).to.be.resolved;
		expect(insightsExist([])).to.be.resolved;
		expect(insightsExist({})).to.be.resolved;
	});

	it('resolves with a boolean value', function () {
		mysqlMock.escape.returnsArg(0);
		databaseMock.query.returns(Promise.resolve());
		expect(insightsExist()).to.eventually.be.resolved;
		expect(insightsExist(0, 1)).to.eventually.be.a('boolean');
	});

	it('resolves with true if page exists', function () {
		mysqlMock.escape.returnsArg(0);
		databaseMock.query.returns(Promise.resolve(1));
		expect(insightsExist()).to.eventually.be.true;
	});

	it('resolves with false if page does not exist', function () {
		mysqlMock.escape.returnsArg(0);
		databaseMock.query.returns(Promise.resolve(0));
		expect(insightsExist()).to.eventually.be.false;
	});
});

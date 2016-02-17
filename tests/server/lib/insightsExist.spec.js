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

	it('rejects if the queries promise is rejected', function () {
		mysqlMock.escape.returnsArg(0);
		databaseMock.query.returns(Promise.reject());
		expect(insightsExist('a')).to.be.rejected;
	});

	it('resolves if the queries promise is resolved', function () {
		mysqlMock.escape.returnsArg(0);
		databaseMock.query.returns(Promise.resolve([{a:1}]));
		expect(insightsExist('a')).to.be.resolved;
	});

	it('resolves with a boolean value', function () {
		mysqlMock.escape.returnsArg(0);
		databaseMock.query.returns(Promise.resolve([{a:1}]));
		expect(insightsExist('a')).to.eventually.be.resolved;
		expect(insightsExist('a')).to.eventually.be.a('boolean');
	});

	it('resolves with true if page exists', function () {
		mysqlMock.escape.returnsArg(0);
		databaseMock.query.returns(Promise.resolve([{a:1}]));
		expect(insightsExist('a')).to.eventually.be.true;
	});

	it('resolves with false if page does not exist', function () {
		mysqlMock.escape.returnsArg(0);
		databaseMock.query.returns(Promise.resolve([{a:0}]));
		expect(insightsExist('a')).to.eventually.be.false;
	});
});

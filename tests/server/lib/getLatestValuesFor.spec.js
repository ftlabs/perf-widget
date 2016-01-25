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

const moduleUnderTest = '../../../server/lib/getLatestValuesFor';

mockery.enable({
	useCleanCache: true,
	warnOnReplace: false,
	warnOnUnregistered: false
});

mockery.registerAllowable(moduleUnderTest);

const getLatestValuesFor = require(moduleUnderTest);

describe('getLatestValuesFor', function () {
	afterEach(function () {
		databaseMock.query.reset();
		mysqlMock.escape.reset();
	});

	after(mockery.disable);

	it('it returns a promise', function () {
		mysqlMock.escape.returnsArg(0);
		databaseMock.query.returns(Promise.resolve());
		expect(getLatestValuesFor()).to.be.a('promise');
	});

	it('rejects if the queries promise is rejected', function () {
		mysqlMock.escape.returnsArg(0);
		databaseMock.query.returns(Promise.reject());
		expect(getLatestValuesFor()).to.be.rejected;

	});

	it('resolves if the queries promise is resolved', function () {
		mysqlMock.escape.returnsArg(0);
		databaseMock.query.returns(Promise.resolve());
		expect(getLatestValuesFor()).to.be.resolved;
	});

	it('resolves with an empty Map object if query returned no rows', function () {
		mysqlMock.escape.returnsArg(0);
		databaseMock.query.returns(
			Promise.resolve([])
		);
		expect(getLatestValuesFor('https://next.ft.com')).to.eventually.be.resolved;
		expect(getLatestValuesFor('https://next.ft.com')).to.eventually.be.a('map');
		expect(getLatestValuesFor('https://next.ft.com')).to.eventually.have.property('size', 0);
	});
});

'use strict'; //eslint-disable-line strict
/*global describe, before, it, after*/

const request = require('supertest');

const app = require('../../../server/app');

describe('App', function () {
	before(done => {
		app.listen(9999, done);
	});

	it('returns 422 for /api/data-for', function (done) {
		request(app)
			.get('/api/data-for')
			.expect(422, done);
	});

	it('returns JSON for /api/data-for', function (done) {
		request(app)
			.get('/api/data-for')
			.expect('Content-Type', /json/, done)
	});

	it('returns FT Labs API JSON structure for /api/data-for', function (done) {
		request(app)
			.get('/api/data-for')
			.expect({
				success: false,
				data: {
					error: 'Missing url query parameter.'
				}, 
				code: 422 
			}, done);
	});

	it('returns 202 for a never before seen url', function (done) {
		request(app)
			.get('/api/data-for?url=https://next.ft.com/uk')
			.expect(202, done);
	});

	it('returns 202 for a url it has seen before but has no data for', function (done) {
		request(app)
			.get('/api/data-for?url=https://next.ft.com/uk')
			.expect(202, done);
	});
});

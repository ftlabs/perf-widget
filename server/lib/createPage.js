'use strict'; // eslint-disable-line strict
const query = require('./database').query;
const escape = require('mysql').escape;
const detectPageType = require('./detectPageType');
const parse = require('url').parse;
const debug = require('debug')('perf-widget:lib:createPage'); // eslint-disable-line no-unused-vars

module.exports = function createPage(url) {
	const domain = parse(url).host || url;

	return detectPageType(url).then(function pageType(type) {
		let addPageCommand;

		if (type) {
			addPageCommand = `INSERT INTO page (url, type, domain) VALUES (${escape(url)}, ${escape(type)}, ${escape(domain)});`;
		} else {
			addPageCommand = `INSERT INTO page (url, domain) VALUES (${escape(url)}, ${escape(domain)});`;
		}

		return query(addPageCommand).then(function () {
			return true;
		});
	});
};

'use strict'; // eslint-disable-line strict
const query = require('./database').query;
const escape = require('mysql').escape;
const detectPageType = require('./detectPageType');

module.exports = function createPage(url) {

	return detectPageType(url).then(function pageType(type) {
		let addPageCommand;

		if (type) {
			addPageCommand = `INSERT INTO page (url, type) VALUES (${escape(url)}, ${escape(type)});`;
		} else {
			addPageCommand = `INSERT INTO page (url) VALUES (${escape(url)});`;
		}

		return query(addPageCommand).then(function () {
			return true;
		});
	});
};

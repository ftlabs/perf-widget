const query = require('./database').query;
const escape = require('mysql').escape;
const detectPageType = require('./detectPageType');

module.exports = function createPage(url) {

	return detectPageType(url).then(function pageType(type) {
		if (type === undefined) {
			return false;
		}

		const addPageCommand = `INSERT INTO page (url, type) VALUES (${escape(url)}, ${escape(type)});`;

		return query(addPageCommand).then(function () {
			return true;
		});
	});
};

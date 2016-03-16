const bluebird = require('bluebird');
const query = require('./database').query;
const escape = require('mysql').escape;
const debug = require('debug')('perf-widget:lib:pageExists'); // eslint-disable-line no-unused-vars

const pageExists = bluebird.coroutine(function* pageExists(url) {
	const command = `SELECT EXISTS(SELECT 1 FROM page WHERE url=${escape(url)})`

	const result = yield query(command);

	// Database closed the connection early return that the page does not exist
	if (!result) {
		return false;
	}

	const exists = result[0][Object.keys(result[0])[0]] === 1;

	return exists;
});

module.exports = url => pageExists(url);

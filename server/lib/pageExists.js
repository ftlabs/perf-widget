const bluebird = require('bluebird');
const query = require('./database').query;
const escape = require('mysql').escape;

module.exports = bluebird.coroutine(function* pageExists(url) {
	const command = `SELECT EXISTS(SELECT 1 FROM page WHERE url=${escape(url)})`

	const result = yield query(command);

	const exists = result[0][Object.keys(result[0])[0]] === 1;

	return exists;
});

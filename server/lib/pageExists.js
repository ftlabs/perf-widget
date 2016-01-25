const query = require('./database').query;
const escape = require('mysql').escape;

module.exports = function pageExists(url) {
	const command = `SELECT EXISTS(SELECT 1 FROM page WHERE url=${escape(url)})`

	const queryResult = query(command);

	return queryResult.then(function(result) {
		const exists = result[0][Object.keys(result[0])[0]] === 1;

		return exists;
	});
};

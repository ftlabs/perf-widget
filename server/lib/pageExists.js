const query = require('./database').query;
const escape = require('mysql').escape;

module.exports = function pageExists(url) {
	const queryResult = query(`SELECT EXISTS(SELECT 1 FROM page WHERE url=${escape(url)})`);

	return queryResult.then(function(result) {
		if (result === 1) {
			return true;
		} else {
			return false;
		}
	});
};

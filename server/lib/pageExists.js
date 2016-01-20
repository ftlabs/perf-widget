const query = require('./database').query;

module.exports = function pageExists(url) {
	const queryResult = query(`SELECT EXISTS(SELECT 1 FROM page WHERE url=${url})`);

	return queryResult.then(function(result) {
		if (result === 1) {
			return true;
		} else {
			return false;
		}
	});
};

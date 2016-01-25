const query = require('./database').query;

module.exports = function detectPageType(url) {
	const command = `SELECT * FROM pagetype`;

	const queryResult = query(command);

	return queryResult.then(function(results) {
		
		const patternType = {};
		
		results.forEach(function(result) {
			patternType[new RegExp(result.pattern)] = result.type;
		});

		const patterns = results.map(function(result) {
			return new RegExp(result.pattern);
		});

		const pattern = patterns.find(function(pattern) {
			return pattern.test(url);
		});

		if (pattern !== undefined) {
			return patternType[pattern];
		} else {
			return undefined;
		}
	});
};

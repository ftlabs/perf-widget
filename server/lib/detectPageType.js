const query = require('./database').query;

module.exports = function detectPageType(url) {
	const command = `SELECT * FROM pagetype`;

	const queryResult = query(command);

	return queryResult.then(function(results) {
		
		const patternType = {};
		const patterns = [];

		results.forEach(function(result) {
			const patternRegex = new RegExp(result.pattern);
			patternType[patternRegex] = result.type;
			patterns.push(patternRegex);
		});

		const matchedPattern = patterns.find(function(pattern) {
			return pattern.test(url);
		});

		if (matchedPattern !== undefined) {
			return patternType[matchedPattern];
		} else {
			return undefined;
		}
	});
};

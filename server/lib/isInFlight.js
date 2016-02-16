const debug = require('debug')('perf-widget:lib:isInFlight'); //eslint-disable-line no-unused-vars
const query = require('./database').query;

module.exports = function isInFlight(url) {
	const command = `SELECT EXISTS(SELECT 1 FROM in_flight WHERE url="${escape(url)}")`

	const queryResult = query(command);

	return queryResult.then(function(result) {
		const exists = result[0][Object.keys(result[0])[0]] === 1;

		return exists;
	});
};

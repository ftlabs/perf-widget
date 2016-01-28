const query = require('./database').query;
const escape = require('mysql').escape;
const debug = require('debug')('perf-widget:lib:insightsOutOfDate');

module.exports = function insightsOutOfDate(url) {
	const command = `SELECT date FROM current_values JOIN page ON page.id = current_values.page_id and page.url = ${escape(url)};`;

	const queryResult = query(command);

	return queryResult.then(function(result) {

		const key = Object.keys(result[0])[0];
		
		const date = result[0][key];

		return (date + 604800) < (Date.now() / 1000);
	});
};

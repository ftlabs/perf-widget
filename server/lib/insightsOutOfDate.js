const query = require('./database').query;
const escape = require('mysql').escape;
const debug = require('debug')('perf-widget:lib:insightsOutOfDate'); // eslint-disable-line no-unused-vars
const DAYS_TO_STAY_IN_CACHE = process.env.DAYS_TO_STAY_IN_CACHE;

function daysToSeconds(days) {
	return (60 * 60 * 24) * days;
}

module.exports = function insightsOutOfDate(url) {
	const command = `SELECT date FROM current_values JOIN page ON page.id = current_values.page_id and page.url = ${escape(url)};`;

	const queryResult = query(command);

	return queryResult.then(function(result) {

		const key = Object.keys(result[0])[0];
		
		const date = result[0][key];

		return (date + daysToSeconds(DAYS_TO_STAY_IN_CACHE)) < (Date.now() / 1000);
	});
};

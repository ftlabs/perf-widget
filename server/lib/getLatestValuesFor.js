const query = require('./database').query;
const escape = require('mysql').escape;
const debug = require('debug')('perf-widget:lib:getLatestValuesFor');

module.exports = function getLatestValuesFor(url) {
	const command = `SELECT properties.name, properties.description, current_values.value FROM current_values JOIN properties JOIN page ON  page.id = current_values.page_id and page.url = ${escape(url)}`;

	debug(command);

	const queryResult = query(command);

	return queryResult.then(function(rows) {
		const values = {};

		rows.forEach(function(row) {
			values[row.name] = row.value;
		});

		return values;
	});
};

const query = require('./database').query;
const escape = require('mysql').escape;
const debug = require('debug')('perf-widget:lib:getLatestValuesFor');
const isConcerningValue = require('./isConcerningValue');

module.exports = function getLatestValuesFor(url) {
	const command = `SELECT properties.name, properties.category, properties.provider, current_values.link, properties.name, properties.description, current_values.value FROM current_values JOIN properties JOIN page ON page.id = current_values.page_id AND page.url = ${escape(url)}`;

	debug(command);

	const queryResult = query(command);

	return queryResult.then(function(rows) {

		const result = rows.map(function (row) {
			return isConcerningValue(row.name, row.value).then(function (concern) {

				return {
					category: row.category,
					provider: row.provider,
					text: row.description,
					link: row.link,
					value: row.value,
					concern: concern
				}
			});
		});

		return Promise.all(result);
	});
};

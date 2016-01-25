const query = require('./database').query;
const escape = require('mysql').escape;
const debug = require('debug')('perf-widget:lib:addInsights');

module.exports = function addInsights(propertyName, url, value, date) {
	debug(propertyName, url, value, date);
	const insertIntoValueHistory = `INSERT INTO value_history (property_id, page_id, value, date) VALUES ((SELECT id from properties WHERE name=${escape(propertyName)}), (SELECT id from page WHERE url=${escape(url)}), ${escape(value)}, ${escape(date)});`;
	const deleteFromCurrentValues = `DELETE FROM current_values WHERE current_values.property_id = (SELECT id from properties WHERE properties.name=${escape(propertyName)}) AND current_values.page_id = (SELECT id from page WHERE url=${escape(url)});`;
	const insertIntoCurrentValues = `INSERT INTO current_values (property_id, page_id, value, date) VALUES ((SELECT id from properties WHERE name=${escape(propertyName)}), (SELECT id from page WHERE url=${escape(url)}), ${escape(value)}, ${escape(date)});`; 

	return query(insertIntoValueHistory)
	.then(function() {
		debug('Inserted into value_history');
		return query(deleteFromCurrentValues);
	})
	.then(function() {
		debug('Deleted from current_values');
		return query(insertIntoCurrentValues);
	})
	.then(function() {
		return debug('Inserted into current_values');
	});
};

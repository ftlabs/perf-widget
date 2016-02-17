const bluebird = require('bluebird');
const query = require('./database').query;
const escape = require('mysql').escape;
const debug = require('debug')('perf-widget:lib:addInsights'); // eslint-disable-line no-unused-vars

module.exports = bluebird.coroutine(function* addInsights(propertyName, url, value, date, link) {
	const insertIntoValueHistory = `INSERT INTO value_history (property_id, page_id, value, date, link) VALUES ((SELECT id from properties WHERE name=${escape(propertyName)}), (SELECT id from page WHERE url=${escape(url)}), ${escape(value)}, ${escape(date)}, ${escape(link)});`;
	const deleteFromCurrentValues = `DELETE FROM current_values WHERE current_values.property_id = (SELECT id from properties WHERE properties.name=${escape(propertyName)}) AND current_values.page_id = (SELECT id from page WHERE url=${escape(url)});`;
	const insertIntoCurrentValues = `INSERT INTO current_values (property_id, page_id, value, date, link) VALUES ((SELECT id from properties WHERE name=${escape(propertyName)}), (SELECT id from page WHERE url=${escape(url)}), ${escape(value)}, ${escape(date)}, ${escape(link)});`; 
	const deleteFromCurrentValuesForDomain = `DELETE FROM current_values_for_domain WHERE current_values_for_domain.property_id = (SELECT id from properties WHERE properties.name=${escape(propertyName)}) AND current_values_for_domain.domain = (SELECT domain from page WHERE url=${escape(url)});`;
	const insertIntoCurrentValuesForDomain = `INSERT INTO current_values_for_domain (property_id, domain, value) VALUES ((SELECT id from properties WHERE name=${escape(propertyName)}), (SELECT domain from page WHERE url=${escape(url)}), ${escape(value)});`; 

	yield query(insertIntoValueHistory)
	yield query(deleteFromCurrentValues);
	yield query(insertIntoCurrentValues);
	yield query(deleteFromCurrentValuesForDomain);
	yield query(insertIntoCurrentValuesForDomain);
});

const debug = require('debug')('perf-widget:lib:areWeGettingBetter'); // eslint-disable-line no-unused-vars
const escape = require('mysql').escape;
const query = require('./database').query;

function getHistoricalInsightsForDomain (domain){

	debug('\n\n\n', domain);

	const command = `SELECT page.url, value_history.value, value_history.date FROM page JOIN value_history ON page.id = value_history.page_id JOIN properties ON value_history.property_id=1 WHERE page.domain=${escape(domain)} GROUP BY value_history.date;`;

	return query(command)
		.then(result => {
			debug('\n\n\n', result);
			return {
				data : result,
				domain : domain,
				str : JSON.stringify(result)
			};
		})
	;

}

function getAllValuesFromTheLastTwentyFourHours (){
	const command = `SELECT current_values.value, current_values.link, current_values.date, page.url, page.domain, properties.provider, properties.name FROM current_values JOIN properties ON current_values.property_id = properties.id JOIN page ON current_values.page_id = page.id WHERE date > UNIX_TIMESTAMP() - 86400 ORDER BY page.domain;`;

	return query(command)
		.then(result => {
			return result;
		})
	;
}

module.exports.insights = {
	allValues : getAllValuesFromTheLastTwentyFourHours,
	historicalDomain : getHistoricalInsightsForDomain
}

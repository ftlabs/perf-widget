const debug = require('debug')('perf-widget:lib:areWeGettingBetter'); // eslint-disable-line no-unused-vars
const query = require('./database').query;

module.exports = function (){

	const command = `SELECT current_values.value, current_values.link, current_values.date, page.url, page.domain, properties.provider, properties.name FROM current_values JOIN properties ON current_values.property_id = properties.id JOIN page ON current_values.page_id = page.id WHERE date > UNIX_TIMESTAMP() - 86400 ORDER BY page.domain;`;

	return query(command)
		.then(result => {
			return result;
		})
	;

	/*return Promise.resolve({
		gettingBetter : true,
		historicalResponseTimes : {
			timePeriod : "24 Hours",
			data : [
				{}
			]
		}
	});*/

}
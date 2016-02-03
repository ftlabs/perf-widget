const query = require('./database').query;
const escape = require('mysql').escape;
const debug = require('debug')('perf-widget:lib:betterThanFT');

module.exports = function betterThanFT(name, value) {
	
	const count = `SELECT COUNT(DISTINCT current_values_for_domain.domain) as amount FROM current_values_for_domain JOIN page ON page.domain = current_values_for_domain.domain JOIN properties ON properties.id = current_values_for_domain.property_id WHERE current_values_for_domain.domain NOT IN (SELECT domain FROM page WHERE domain='www.theguardian.com' OR domain='international.nytimes.com' OR domain='www.nytimes.com' OR domain='www.wsj.com') AND properties.name = ${escape(name)};`;
	const average = `SELECT better, a.average FROM properties JOIN (SELECT AVG(current_values.value) as average FROM current_values JOIN page ON page.id = current_values.page_id JOIN properties ON properties.id = current_values.property_id WHERE current_values.page_id NOT IN (SELECT id FROM page WHERE domain='www.theguardian.com' OR domain='international.nytimes.com' OR domain='www.nytimes.com' OR domain='www.wsj.com') AND properties.name = ${escape(name)}) as a WHERE name = ${escape(name)};`;

	return Promise.all([query(count), query(average)]).then(function(results) {
		const count = results[0][0].amount;
		const averageForFT = results[1][0].average;
		const better = results[1][0].better;
		
		var result; // eslint-disable-line no-var
		if (count > 1) {
			if (better === 'increasing') {
				result = value >= averageForFT;
			} else if (better === 'decreasing') {
				result = value <= averageForFT;
			}
		}
		
		debug('averageForFT:', averageForFT, 'value:', value, 'better:', result, 'count:', count);

		return result;
	});
};

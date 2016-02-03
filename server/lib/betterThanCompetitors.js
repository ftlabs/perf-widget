const query = require('./database').query;
const escape = require('mysql').escape;
const debug = require('debug')('perf-widget:lib:betterThanCompetitors'); // eslint-disable-line no-unused-vars
const partition = require("lodash").partition;

module.exports = function betterThanCompetitors(name, value, type) {
	if (type === null || type === undefined) {
		return undefined;
	}

	const command = `SELECT page.domain, current_values_for_domain.value FROM current_values_for_domain JOIN page ON page.domain = current_values_for_domain.domain JOIN properties ON properties.id = current_values_for_domain.property_id WHERE current_values_for_domain.domain IN (SELECT domain FROM page WHERE domain='www.theguardian.com' OR domain='international.nytimes.com' OR domain='www.nytimes.com' OR domain='www.wsj.com') AND properties.name = ${escape(name)} AND page.type = ${escape(type)};`;

	return query(command).then(function(results) {

		const temp = partition(results, function(o) { return o.value < value; });
		const betterThan = temp[0].map(o => o.domain);
		const worseThan = temp[1].map(o => o.domain);

		return {
			'true': betterThan,
			'false': worseThan
		};
	});
};
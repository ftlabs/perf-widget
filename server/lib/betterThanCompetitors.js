const query = require('./database').query;
const escape = require('mysql').escape;
const debug = require('debug')('perf-widget:lib:betterThanCompetitors'); // eslint-disable-line no-unused-vars
const partition = require("lodash").partition;

function percentageDifference(v1, v2) {
	return (Math.abs((v1 - v2) / ((v1 + v2) / 2)) * 100).toFixed(2);
}

module.exports = function betterThanCompetitors(name, value, type) {
	if (type === null || type === undefined) {
		return undefined;
	}

	const command = `SELECT page.domain, current_values_for_domain.value, page.friendly_name FROM current_values_for_domain JOIN page ON page.domain = current_values_for_domain.domain JOIN properties ON properties.id = current_values_for_domain.property_id WHERE current_values_for_domain.domain IN (SELECT domain FROM page WHERE domain='www.theguardian.com' OR domain='international.nytimes.com' OR domain='www.nytimes.com' OR domain='www.wsj.com') AND properties.name = ${escape(name)} AND page.type = ${escape(type)};`;

	return query(command).then(function(results) {

		const temp = partition(results, function(o) { return o.value < value; });

		const betterThan = temp[0].map(function (o) {
			return {
				domain: o.friendly_name,
				difference: percentageDifference(o.value, value)
			};
		});
		const worseThan = temp[1].map(function (o) {
			return {
				domain: o.friendly_name,
				difference: percentageDifference(o.value, value)
			};
		});

		return {
			'true': betterThan,
			'false': worseThan
		};
	});
};

const debug = require('debug')('perf-widget:lib:removeFromInFlight'); // eslint-disable-line no-unused-vars
const query = require('./database').query;
const escape = require('mysql').escape;

module.exports = function removeFromInFlight(url) {
	const command = `DELETE FROM in_flight WHERE in_flight.url = (${escape(url)});`;

	return query(command);
};

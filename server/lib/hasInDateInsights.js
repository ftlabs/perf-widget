const debug = require('debug')('perf-widget:lib:hasInDateInsights');
const insightsExist = require('./insightsExist');
const pageExists = require('./pageExists');
const insightsOutOfDate = require('./insightsOutOfDate');

module.exports = function hasInDateInsights (url) {
	return pageExists(url)
		.then (function (exists) {
			debug('pageExists', exists, url)
			if (!exists) {
				return false;
			}

			return insightsExist(url)
			.then (function (exists) {

				if (!exists) {
					return false;
				}

				return insightsOutOfDate(url)
				.then (function (outOfDate) {

					if (outOfDate) {
						return false;
					}

					return true;
			});
		});
	});
};

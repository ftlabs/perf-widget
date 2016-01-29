const debug = require('debug')('perf-widget:lib:pageDataFor');
const insightsExist = require('./insightsExist');
const pageExists = require('./pageExists');
const getLatestValuesFor = require('./getLatestValuesFor');
const createPage = require('./createPage');
const insightsOutOfDate = require('./insightsOutOfDate');
const addInsights = require('./addInsights');
const gatherPageInsights = require('./gatherPageInsights');

module.exports = function pageDataFor(url) {
	return pageExists(url)
		.then(function(exists) {
			debug('pageExists', exists, url)
			if (!exists) {

				return createPage(url).then(function() {
					return gatherAndAddPageInsights(url).then(function() {
						return getLatestValuesFor(url);
					});
				});
			}

			return insightsExist(url)
			.then(function(exists) {

				if (!exists) {
					return gatherAndAddPageInsights(url).then(function() {
						return getLatestValuesFor(url);
					});
				}

				return insightsOutOfDate(url)
				.then(function(outOfDate) {

					if (outOfDate) {
						return gatherAndAddPageInsights(url).then(function() {
							return getLatestValuesFor(url);
						});
					}

					return getLatestValuesFor(url);
			});
		});
	});
};

function gatherAndAddPageInsights(page) {
	return gatherPageInsights(page)
	.then(function(results) {

		// Use same timestamp for all results
		const date = Date.now() / 1000;

		// Add results to the database
		const insightsAdded = results.map(function (insight) {
			debug('addInsights', insight.name, page, insight.value, date, insight.link)
			return addInsights(insight.name, page, insight.value, date, insight.link);
		});

		// After results are added to the database, repeat this process
		return Promise.all(insightsAdded)
	});
}

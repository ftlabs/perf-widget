const debug = require('debug')('perf-widget:lib:domainDataFor');
const insightsExist = require('./insightsExist');
const pageExists = require('./pageExists');
const getLatestValuesFor = require('./getLatestValuesFor');
const createPage = require('./createPage');
const insightsOutOfDate = require('./insightsOutOfDate');
const addInsights = require('./addInsights');
const gatherDomainInsights = require('./gatherDomainInsights');

module.exports = function domainDataFor(domain, freshInsights) {
	return pageExists(domain)
		.then(function(exists) {
			debug('pageExists', exists, domain)
			if (!exists) {

				return createPage(domain).then(function() {
					return gatherAndAddDomainInsights(domain).then(function() {
						return getLatestValuesFor(domain);
					});
				});
			}

			if(freshInsights){

				return gatherAndAddDomainInsights(domain).then(function() {
					return getLatestValuesFor(domain);
				});				

			}

			return insightsExist(domain)
			.then(function(exists) {

				if (!exists) {
					return gatherAndAddDomainInsights(domain).then(function() {
						return getLatestValuesFor(domain);
					});
				}

				return insightsOutOfDate(domain)
				.then(function(outOfDate) {

					if (outOfDate) {
						return gatherAndAddDomainInsights(domain).then(function() {
							return getLatestValuesFor(domain);
						});
					}

					return getLatestValuesFor(domain);
			});
		});
	});
};

function gatherAndAddDomainInsights(domain) {
	return gatherDomainInsights(domain)
	.then(function(results) {

		// Use same timestamp for all results
		const date = Date.now() / 1000;

		// Add results to the database
		const insightsAdded = results.map(function (insight) {
			debug('addInsights', insight.name, domain, insight.value, date, insight.link)
			return addInsights(insight.name, domain, insight.value, date, insight.link);
		});

		// After results are added to the database, repeat this process
		return Promise.all(insightsAdded);
	});
}

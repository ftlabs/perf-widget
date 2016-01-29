const debug = require('debug')('perf-widget:lib:dataFor');
const detectUrl = require('is-url-superb');
const parseUrl = require('url').parse;
const insightsExist = require('./insightsExist');
const pageExists = require('./pageExists');
const getLatestValuesFor = require('./getLatestValuesFor');
const createPage = require('./createPage');
const insightsOutOfDate = require('./insightsOutOfDate');
const flattenDeep = require('lodash').flattenDeep;
const addInsights = require('./addInsights');
const gatherPageInsights = require('./gatherPageInsights');
const gatherDomainInsights = require('./gatherDomainInsights');
const bluebird = require('bluebird');

const cache = require("lru-cache")(
	{ 
		max: 500, 
		maxAge: 1000 * 60 * 60 * 24 
	}
);

function pageDataFor(url) {
	return pageExists(url)
		.then(function(exists) {
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
}

function domainDataFor(domain) {
	return pageExists(domain)
		.then(function(exists) {
			if (!exists) {

				return createPage(domain).then(function() {
					return gatherAndAddDomainInsights(domain).then(function() {
						return getLatestValuesFor(domain);
					});
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
}

function gatherAndAddDomainInsights(domain) {
	return gatherDomainInsights(domain)
	.then(function(results) {

		// Use same timestamp for all results
		const date = Date.now() / 1000;

		// Add results to the database
		const insightsAdded = results.map(function (insight) {
			return addInsights(insight.name, domain, insight.value, date, insight.link);
		});

		// After results are added to the database, repeat this process
		return Promise.all(insightsAdded);
	});
}

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

module.exports = function (url) {
	return Promise.resolve().then(function() {
		if (!url) {
			return {
				error: 'Missing url parameter.'
			};
		}

		const isUrl = typeof url === 'string' ? detectUrl(url) : false;

		if (!isUrl) {
			return {
				error: 'URL parameter needs to be a valid URL.'
			};
		}

		debug('cache.has(url)', cache.has(url));
		if (cache.has(url)) {
			const insightsPromise = bluebird.resolve(cache.get(url));

			if (insightsPromise.isFulfilled()) {
				debug('insightsPromise.value()', insightsPromise.value())
				return insightsPromise.value();
			} else if (insightsPromise.isRejected()) {
				debug('Promise was rejected, deleting from cache.')
				cache.del(url);
			}
		}

		const host = parseUrl(url).host;
		const insights = bluebird.all([pageDataFor(url), domainDataFor(host)]).then(flattenDeep);

		cache.set(url, insights);

		return {
			reason: 'Gathering results'
		};
	});
};

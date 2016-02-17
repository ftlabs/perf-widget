const debug = require('debug')('perf-widget:lib:domainDataFor');
const bluebird = require('bluebird');
const insightsExist = require('./insightsExist');
const pageExists = require('./pageExists');
const getLatestValuesFor = require('./getLatestValuesFor');
const createPage = require('./createPage');
const insightsOutOfDate = require('./insightsOutOfDate');
const addInsights = require('./addInsights');
const gatherDomainInsights = require('./gatherDomainInsights');

module.exports = bluebird.coroutine(function* domainDataFor(domain, freshInsights) {
	const page = yield pageExists(domain);
	debug('pageExists', page, domain)
	
	if (!page) {
		yield createPage(domain);
		yield gatherAndAddDomainInsights(domain);
	}

	if (freshInsights) {
		yield gatherAndAddDomainInsights(domain);
	}

	const insights = yield insightsExist(domain);

	if (!insights) {
		yield gatherAndAddDomainInsights(domain)
	}

	const outOfDate = yield insightsOutOfDate(domain);

	if (outOfDate) {
		yield gatherAndAddDomainInsights(domain)
	}

	yield getLatestValuesFor(domain)
});

const gatherAndAddDomainInsights = bluebird.coroutine(function* (domain) {
	const results = yield gatherDomainInsights(domain);

	// Use same timestamp for all results
	const date = Date.now() / 1000;

	// Add results to the database
	const insightsAdded = results.map(function (insight) {
		debug('addInsights', insight.name, domain, insight.value, date, insight.link)
		return addInsights(insight.name, domain, insight.value, date, insight.link);
	});

	return Promise.all(insightsAdded);
});

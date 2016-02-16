const debug = require('debug')('perf-widget:lib:pageDataFor');
const bluebird = require('bluebird');
const insightsExist = require('./insightsExist');
const pageExists = require('./pageExists');
const getLatestValuesFor = require('./getLatestValuesFor');
const createPage = require('./createPage');
const insightsOutOfDate = require('./insightsOutOfDate');
const addInsights = require('./addInsights');
const gatherPageInsights = require('./gatherPageInsights');

module.exports = bluebird.coroutine(function* pageDataFor (url, freshInsights) {
	const page = yield pageExists(url);
	debug('pageExists', page, url)
	if (!page) {
		yield createPage(url);
		yield gatherAndAddPageInsights(url);
		yield getLatestValuesFor(url);
	}

	if (freshInsights) {
		yield gatherAndAddPageInsights(url);
		yield getLatestValuesFor(url);
	}

	const insights = yield insightsExist(url);
	
	if (!insights) {
		yield gatherAndAddPageInsights(url);
		yield getLatestValuesFor(url);
	}

	const outOfDate = yield insightsOutOfDate(url);

	if (outOfDate) {
		yield gatherAndAddPageInsights(url);
		yield getLatestValuesFor(url);
	}

	return getLatestValuesFor(url);
});

const gatherAndAddPageInsights = bluebird.coroutine(function* (page) {
	const results = yield gatherPageInsights(page);

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

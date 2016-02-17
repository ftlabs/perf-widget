const debug = require('debug')('perf-widget:lib:hasInDateInsights');
const bluebird = require('bluebird');
const insightsExist = require('./insightsExist');
const pageExists = require('./pageExists');
const insightsOutOfDate = require('./insightsOutOfDate');

module.exports = bluebird.coroutine(function* hasInDateInsights (url) {
	const page = yield pageExists(url);
	debug('pageExists', page, url);

	if (!page) {
		return false;
	}

	const insights = yield insightsExist(url);

	if (!insights) {
		return false;
	}

	const outOfDate = yield insightsOutOfDate(url);

	if (outOfDate) {
		return false;
	}

	return true;
});

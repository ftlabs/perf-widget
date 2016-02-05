'use strict';
const debug = require('debug')('perf-widget:lib:insightsProviders:pageInsightProviders:webPageTest'); // eslint-disable-line no-unused-vars
const bluebird = require("bluebird");
const WebPageTest = require('webpagetest');
const denodeify = require('denodeify');
const wpt = new WebPageTest('www.webpagetest.org', process.env.WEB_PAGE_TEST_API_KEY);
const runTest = denodeify(wpt.runTest.bind(wpt));
const getTestResults = denodeify(wpt.getTestResults.bind(wpt));
const resultOptions = {
	breakDown: false,
	domains: false,
	pageSpeed: false,
	requests: false
};
const waitThen = function (fn, timeout) {
	return new Promise(resolve => setTimeout(resolve, timeout || 10)).then(fn);
}
function* webPageTest (url) {
	const response = yield runTest(url);

	if (response.statusCode < 400) {
		const testId = response.data.testId;
		let statusCode;
		let results;
		
		while(statusCode === undefined || statusCode !== 200) {
			yield bluebird.delay(3000)
			results = yield getTestResults(testId, resultOptions);
			statusCode = results.statusCode;
			debug('in while', statusCode);
		}

		debug('out of while', statusCode);
		debug(results);

		const result = [{
			name: 'NumberOfRequests',
			value: results.data.runs["1"].firstView.requestsFull,
			link: results.data.summary
		}];

		debug(result);

		return result;
	} else {
		debug('ARGHHHH:', response.statusCode)
		debug(response.statusText)
	}
}

module.exports = bluebird.coroutine(webPageTest)

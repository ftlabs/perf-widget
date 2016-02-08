'use strict';
const debug = require('debug')('perf-widget:lib:insightsProviders:pageInsightProviders:webPageTest'); // eslint-disable-line no-unused-vars
const bluebird = require("bluebird");
const WebPageTest = require('webpagetest');
const denodeify = require('denodeify');
const wpt = new WebPageTest(process.env.WEB_PAGE_TEST_SERVER, process.env.WEB_PAGE_TEST_API_KEY);

const runTest = denodeify(wpt.runTest.bind(wpt));
const getTestResults = denodeify(wpt.getTestResults.bind(wpt));

const resultOptions = {
	breakDown: false,
	domains: false,
	pageSpeed: false,
	requests: false
};

function* webPageTest (url) {
	const response = yield runTest(url);

	if (response.statusCode < 400) {
		const testId = response.data.testId;
		let statusCode;
		let results;
		
		while(statusCode === undefined || statusCode !== 200) {
			yield bluebird.delay(3000);
			results = yield getTestResults(testId, resultOptions);
			statusCode = results.statusCode;
		}

		const result = [{
			name: 'NumberOfRequests',
			value: results.data.runs["1"].firstView.requestsFull,
			link: results.data.summary
		}];

		return result;
	} else {
		debug(response.statusText);
		throw new Error(response.statusText);
	}
}

module.exports = bluebird.coroutine(webPageTest)

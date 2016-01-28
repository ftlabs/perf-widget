const debug = require('debug')('perf-widget:lib:dataFor');
const detectUrl = require('is-url-superb');
const parseUrl = require('url').parse;
const insightsExist = require('./insightsExist');
const pageExists = require('./pageExists');
const queue = require('./queue');
const getLatestValuesFor = require('./getLatestValuesFor');
const createPage = require('./createPage');
const domainQueue = require('./domainQueue');
const insightsOutOfDate = require('./insightsOutOfDate');

function pageDataFor(url) {
	return Promise.resolve()
	.then(function() {

		if (queue.has(url)) {				
			debug('Page is already in the queue.');

			return {
				reason: 'This page is currently in the queue to be processed.'
			};
		}

		return pageExists(url)
		.then(function(exists) {
			if (!exists) {
				debug('Page does not exist, creating page row for', url);

				return createPage(url).then(function(added) {
					debug('Page created for', url, 'Adding page to queue');

					queue.add(url);

					return {
						reason: 'This page has been added to the queue to be processed.'
					};
				});
			}

			debug('Page exists, checking if insights exist for page.');

			return insightsExist(url)
			.then(function(exists) {

				if (!exists) {
					queue.add(url);

					return {
						reason: 'This page has been added to the queue to be processed.'
					};
				}
			
				debug('Insights exist, retrieving latest insights.');

				return insightsOutOfDate(url)
				.then(function(outOfDate) {

					if (outOfDate) {
						queue.add(url);

						return {
							reason: 'Results were out of date. This page has been added to the queue to be processed.'
						};
					}

					return getLatestValuesFor(url);
				});
			});
		});
	});
}

function domainDataFor(url) {
	return Promise.resolve()
	.then(function() {

		if (domainQueue.has(url)) {
			debug('Page is already in the queue.');

			return {
				reason: 'This page is currently in the queue to be processed.'
			};
		}

		return pageExists(url)
		.then(function(exists) {
			if (!exists) {
				debug('Page does not exist, creating page row for', url);

				return createPage(url).then(function(added) {
					debug('Page created for', url, 'Adding page to queue');

					domainQueue.add(url);

					return {
						reason: 'This page has been added to the queue to be processed.'
					};
				});
			}

			debug('Page exists, checking if insights exist for page.');

			return insightsExist(url)
			.then(function(exists) {

				if (!exists) {
					domainQueue.add(url);

					return {
						reason: 'This page has been added to the queue to be processed.'
					};
				}
			
				debug('Insights exist, retrieving latest insights.');

				return getLatestValuesFor(url);
			});
		});
	});
}

module.exports = function (url) {
	return Promise.resolve()
	.then(function() {
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

		const host = parseUrl(url).host;

		return Promise.all([pageDataFor(url), domainDataFor(host)]).then(function(data) {
			const pageData = data[0];
			const domainData = data[1];
			if (pageData.reason || domainData.reason) {
				return {
					reason: pageData.reason || domainData.reason
				};
			}

			return {
				domain: domainData,
				page: pageData
			};
		});
	});
};

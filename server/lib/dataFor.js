const debug = require('debug')('perf-widget:lib:dataFor');
const detectUrl = require('is-url-superb');

const insightsExist = require('./insightsExist');
const pageExists = require('./pageExists');
const queue = require('./queue');
const getLatestValuesFor = require('./getLatestValuesFor');
const createPage = require('./createPage');

module.exports = function dataFor(url) {
	return Promise.resolve()
	.then(function() {

		if (!url) {
			debug('Missing url parameter.');

			return {
				error: 'Missing url parameter.'
			};
		}

		const isUrl = typeof url === 'string' ? detectUrl(url) : false;

		if (!isUrl) {
			debug('Missing url parameter.');

			return {
				error: 'URL parameter needs to be a valid URL.'
			};
		}

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
					if (!added) {
						debug('Page not created for', url);

						return {
							error: 'URL does not map to a type. Please contact FT Labs to add a corresponding type for this URL.'
						};
					}

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

				return getLatestValuesFor(url);
			});
		});
	});
}

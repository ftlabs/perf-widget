const response = require('./../lib/jsonResponse');
const insightsExist = require('./../lib/insightsExist');
const pageExists = require('./../lib/pageExists');
const queue = require('./../lib/queue');
const getLatestValuesFor = require('./../lib/getLatestValuesFor');
const debug = require('debug')('perf-widget:routes:dataFor');
const createPage = require('./../lib/createPage');
const detectUrl = require('is-url-superb');

module.exports = function dataFor(req, res) {

	const badResponse = response(res, 422, false);
	const alreadyCreated = response(res, 201, true);
	const jobCreated = response(res, 202, true);
	const data = response(res, 200, true);

	const url = req.query.url;
	const isUrl = detectUrl(url);

	if (!isUrl) {

		return badResponse({
			error: 'Missing url query parameter.'
		});

	} else {
		pageExists(url).then(function(exists) {
			
			if (exists) {
				
				debug('Page exists, checking if insights exist for page.');

				insightsExist(url)
				.then(function(exists) {
					debug('here:', exists)
					if (exists)	{
						
						debug('Insights exist, retrieving latest insights.');

						getLatestValuesFor(url)
						.then(function(insights) {
							
							debug('Insights:', insights);

							data({
								pageData: insights
							});
						});
					} else if (queue.has(url)) {
						
						debug('Page is already in the queue.');

						alreadyCreated({
							reason: 'This page is currently in the queue to be processed.'
						});

					} else {
						queue.add(url);

						jobCreated({
							reason: 'This page has been added to the queue to be processed.'
						});
					}
				});	
			} else {
				debug('page does not exist, creating page row for', url);

				createPage(url).then(function(added) {
					if (added) {
						debug('Page created for', url, 'Adding page to queue');

						queue.add(url);

						jobCreated({
							reason: 'This page has been added to the queue to be processed.'
						});
					} else {
						debug('Page not created for', url);
						badResponse({
							error: 'URL does not map to a type. Please contact FT Labs to add a corresponding type for this URL.'
						});
					}
				});
			}
		});
	}
}

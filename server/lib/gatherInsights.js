const insights = require('./insightProviders');
const debug = require('debug')('perf-widget:lib:gatherInsights');
const flattenDeep = require('lodash').flattenDeep;

module.exports = function gatherInsights(url) {
	
	debug('Gathering insights for', url);

	return Promise.all(insights(url)).then(flattenDeep);
};

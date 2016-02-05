const insights = require('./insightProviders/pageInsightProviders');
const debug = require('debug')('perf-widget:lib:gatherPageInsights');
const flattenDeep = require('lodash').flattenDeep;

module.exports = function gatherPageInsights(url) {
	
	debug('Gathering insights for', url);

	return Promise.all(insights(url)).then(flattenDeep);
};

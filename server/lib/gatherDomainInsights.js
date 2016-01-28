const insights = require('./insightProviders/domainInsightProviders');
const debug = require('debug')('perf-widget:lib:gatherDomainInsights');
const flattenDeep = require('lodash').flattenDeep;

module.exports = function gatherDomainInsights(domain) {
	
	debug('Gathering domain insights for', domain);

	return Promise.all(insights(domain)).then(flattenDeep);
};

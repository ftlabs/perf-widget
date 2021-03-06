const debug = require('debug')('perf-widget:lib:getLatestValuesFor'); // eslint-disable-line no-unused-vars

const psi = require('psi');

module.exports = function googlePageSpeedInsights(url) {

	console.time('PSI');

	return psi(url).then(function(results) {
		debug(console.timeEnd('PSI'));

		return [{
			name: 'PageSpeedInsightsScore',
			value: parseInt(results.ruleGroups.SPEED.score, 10),
			link: `https://developers.google.com/speed/pagespeed/insights/?url=${url}&tab=mobile`
		},{
			name: 'NumberOfHosts',
			value: parseInt(results.pageStats.numberHosts, 10),
			link: `https://developers.google.com/speed/pagespeed/insights/?url=${url}&tab=mobile`
		},{
			name: 'NumberOfResources',
			value: parseInt(results.pageStats.numberResources, 10),
			link: `https://developers.google.com/speed/pagespeed/insights/?url=${url}&tab=mobile`
		},{
			name: 'WeightOfResources',
			value: parseInt(results.pageStats.htmlResponseBytes, 10) || 0 + 
					parseInt(results.pageStats.cssResponseBytes, 10) || 0 + 
					parseInt(results.pageStats.imageResponseBytes, 10) || 0 + 
					parseInt(results.pageStats.javascriptResponseBytes, 10) || 0 + 
					parseInt(results.pageStats.otherResponseBytes, 10) || 0,
			link: `https://developers.google.com/speed/pagespeed/insights/?url=${url}&tab=mobile`
		}];
	});
};

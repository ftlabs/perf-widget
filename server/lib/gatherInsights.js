const psi = require('psi');
const debug = require('debug')('perf-widget:lib:gatherInsights');

module.exports = function gatherInsights(url) {
	
	debug('Gathering insights for', url);

	const insights = [];

	insights.push(psi(url));

	return Promise.all(insights).then(function results(data) {
		const map = new Map();

		const pageSpeedScore = data[0].ruleGroups.SPEED.score;

		map.set('PageSpeedInsightsScore', pageSpeedScore);
		debug('PageSpeedInsightsScore', pageSpeedScore);
		
		return map;
	});
};

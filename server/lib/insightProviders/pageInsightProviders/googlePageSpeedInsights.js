const psi = require('psi');

module.exports = function gatherInsights(url) {

	return psi(url).then(function(results) {
		const pageSpeedScore = results.ruleGroups.SPEED.score;
		return [{
			name: 'PageSpeedInsightsScore',
			value: pageSpeedScore,
			link: `https://developers.google.com/speed/pagespeed/insights/?url=${url}&tab=mobile`
		}];
	});
};

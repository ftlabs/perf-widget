const pagespeed = require('./pageInsightProviders/googlePageSpeedInsights');

module.exports = function(url) {
	return [
		pagespeed(url)
	];
};

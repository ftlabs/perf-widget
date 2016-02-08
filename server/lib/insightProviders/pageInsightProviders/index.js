const pagespeed = require('./googlePageSpeedInsights');
const wpt = require('./webPageTest');

module.exports = function(url) {
	return [
		pagespeed(url),
		wpt(url)
	];
};

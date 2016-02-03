const pageDataFor = require('./pageDataFor');
const bluebird = require('bluebird');
const debug = require('debug')('perf-widget:lib:updateCompetitorInsights'); // eslint-disable-line no-unused-vars

module.exports = function updateCompetitorInsights () {
	const DAY_IN_MILLISECONDS = 60 * 60 * 24 * 1000;

	const competitorUrls = [
		'http://www.theguardian.com/uk',
		'http://international.nytimes.com/',
		'http://www.wsj.com/europe',
		'http://www.theguardian.com/politics/2016/jan/17/britain-stronger-in-europe-eu-campaign-leaflet-uk',
		'http://www.nytimes.com/2016/01/18/us/politics/14-testy-months-behind-us-prisoner-swap-with-iran.html',
		'http://www.wsj.com/articles/oil-extends-slide-below-30-as-market-braces-for-iran-oil-influx-1453088057',
		'http://www.theguardian.com/uk-news',
		'http://www.nytimes.com/pages/politics/index.html',
		'http://www.wsj.com/news/politics',
		'http://www.theguardian.com/commentisfree/video/2016/jan/13/marlon-james-are-you-racist-video',
		'http://www.nytimes.com/video/technology/personaltech/100000004142268/fresh-from-ces.html?playlistId=1194811622182',
		'http://www.wsj.com/video/democratic-debate-in-two-minutes/31043401-0168-4AAD-ABB3-08F6E888F07E.html'
	];

	return bluebird.map(competitorUrls, pageDataFor, {concurrency: 6}).then(function () {
		debug('Finished updating the competitor pages.');
	});

	setTimeout(updateCompetitorInsights, DAY_IN_MILLISECONDS);
};

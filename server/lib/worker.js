'use strict'; // eslint-disable-line strict

const debug = require('debug')('perf-widget:lib:worker');
const parseUrl = require('url').parse;
const flattenDeep = require('lodash').flattenDeep;

const queue = require('./queue');
const domainQueue = require('./domainQueue');
const addInsights = require('./addInsights');
const gatherInsights = require('./gatherInsights');
const gatherDomainInsights = require('./gatherDomainInsights');

const WORKER_TIMEOUT = parseInt(process.env.WORKER_TIMEOUT, 10) || 1000;

let processDomainQueueTimeout;
let processPageQueueTimeout;

function processDataQueue() {
	const domain = domainQueue.retrieveMessage();

	if (domain) {
		
		debug('retrievedMessage:', domain);

		const domainInsights = gatherDomainInsights(domain);

		domainInsights
		.then(function(results) {

			debug('Insights:', results);

			// Use same timestamp for all results
			const date = Date.now() / 1000;

			// Add results to the database
			const insightsAdded = results.map(function (insight) {
				debug('addInsights', insight.name, domain, insight.value, date, insight.link)
				return addInsights(insight.name, domain, insight.value, date, insight.link);
			});

			// After results are added to the database, repeat this process
			return Promise.all(insightsAdded)
			.then(function() {
				debug('Insights added.');
				processDomainQueueTimeout = setTimeout(processDataQueue, WORKER_TIMEOUT);
			})
		})
		.catch(function(e) {
			debug('Error:', e);
		});

	} else {

		processDomainQueueTimeout = setTimeout(processDataQueue, WORKER_TIMEOUT);

	}
}

function processPageQueue() {

	const page = queue.retrieveMessage();

	if (page) {
		
		debug('retrievedMessage:', page);

		const pageInsignts = gatherInsights(page);

		pageInsignts
		.then(function(results) {

			debug('Insights:', results);

			// Use same timestamp for all results
			const date = Date.now() / 1000;

			// Add results to the database
			const insightsAdded = results.map(function (insight) {
				debug('addInsights', insight.name, page, insight.value, date, insight.link)
				return addInsights(insight.name, page, insight.value, date, insight.link);
			});

			// After results are added to the database, repeat this process
			return Promise.all(insightsAdded)
			.then(function() {
				debug('Insights added.');
				processPageQueueTimeout = setTimeout(processPageQueue, WORKER_TIMEOUT);
			})
		})
		.catch(function(e) {
			debug('Error:', e);
		});

	} else {

		processPageQueueTimeout = setTimeout(processPageQueue, WORKER_TIMEOUT);

	}
}

function addCompetitorsToQueue() {
	const DAY_IN_MILLISECONDS = 60 * 60 * 24 * 1000;

	const competitorUrls = [
		'http://www.theguardian.com/uk',
		'http://international.nytimes.com/',
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

	competitorUrls.forEach(function(url) {
		queue.add(url);
	});

	setTimeout(addCompetitorsToQueue, DAY_IN_MILLISECONDS);
}

module.exports.start = function start () {
	processDataQueue();
	processPageQueue();
	addCompetitorsToQueue();
}

module.exports.stop = function stop() {

	if (typeof processPageQueueTimeout === 'number') {
		clearTimeout(processPageQueueTimeout);
	}

	if (typeof processDomainQueueTimeout === 'number') {
		clearTimeout(processDomainQueueTimeout);
	}
};

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
};

module.exports.start = function start () {
	processDataQueue();
	processPageQueue();
}

module.exports.stop = function stop() {

	if (typeof processPageQueueTimeout === 'number') {
		clearTimeout(processPageQueueTimeout);
	}

	if (typeof processDomainQueueTimeout === 'number') {
		clearTimeout(processDomainQueueTimeout);
	}
};

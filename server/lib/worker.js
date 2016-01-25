'use strict'; // eslint-disable-line strict

const queue = require('./queue');
const addInsights = require('./addInsights');
const gatherInsights = require('./gatherInsights');
const debug = require('debug')('perf-widget:lib:worker');
const WORKER_TIMEOUT = parseInt(process.env.WORKER_TIMEOUT, 10) || 1000;

let timeout;

module.exports.start = function start() {

	const page = queue.retrieveMessage();

	if (page) {
		
		debug('retrievedMessage:', page);

		gatherInsights(page)
		.then(function(results) {

			debug('Insights:', results);

			// Use same timestamp for all results
			const date = Date.now() / 1000;

			// Add results to the database
			const insightsAdded = [];

			results.forEach(function insight(value, name) {
				debug('addInsights', name, page, value, date)
				const insight = addInsights(name, page, value, date);

				insightsAdded.push(insight);
			});

			// After results are added to the database, repeat this process
			Promise.all(insightsAdded)
			.then(function() {
				debug('Insights added.');
				timeout = setTimeout(start, WORKER_TIMEOUT);
			})
			.catch(function(e) {
				debug('Error:', e);
			});
		});

	} else {

		timeout = setTimeout(start, WORKER_TIMEOUT);

	}
};

module.exports.stop = function stop() {

	if (typeof timeout === 'number') {

		clearTimeout(timeout);

	}
};

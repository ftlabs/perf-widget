const debug = require('debug')('perf-widget:lib:dataFor');
const detectUrl = require('is-url-superb');
const parseUrl = require('url').parse;
const flattenDeep = require('lodash').flattenDeep;
const bluebird = require('bluebird');
const pageDataFor = require('./pageDataFor');
const domainDataFor = require('./domainDataFor');

const cache = require("lru-cache")(
	{ 
		max: 500, 
		maxAge: 1000 * 60 * 60 * 24 
	}
);

module.exports = function (url) {
	return Promise.resolve().then(function () {
		if (!url) {
			return {
				error: 'Missing url parameter.'
			};
		}

		const isUrl = typeof url === 'string' ? detectUrl(url) : false;

		if (!isUrl) {
			return {
				error: 'URL parameter needs to be a valid URL.'
			};
		}

		debug('cache.has(url)', cache.has(url), url);
		if (cache.has(url)) {
			const insightsPromise = bluebird.resolve(cache.get(url));

			if (insightsPromise.isFulfilled()) {
				debug('insightsPromise.value()', insightsPromise.value())
				return insightsPromise.value();
			} else if (insightsPromise.isRejected()) {
				debug('Promise was rejected, deleting from cache.')
				cache.del(url);
			} else {
				return {
					reason: 'Gathering results'
				};				
			}
		}

		const host = parseUrl(url).host;
		const insights = bluebird.all([pageDataFor(url), domainDataFor(host)]).then(flattenDeep);

		cache.set(url, insights);

		return {
			reason: 'Gathering results'
		};
	});
};

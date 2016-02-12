const debug = require('debug')('perf-widget:lib:dataFor');
const detectUrl = require('is-url-superb');
const parseUrl = require('url').parse;
const flattenDeep = require('lodash').flattenDeep;
const bluebird = require('bluebird');
const pageDataFor = require('./pageDataFor');
const domainDataFor = require('./domainDataFor');
const fetch = require('node-fetch');
const lru = require('lru-cache');

const lruOptions = { 
		max: 500, 
		maxAge: 1000 * 60 * 60 * 24 
	}

const pingCache = lru(lruOptions)
const insightsCache = lru(lruOptions);

module.exports = function (url, freshInsights) {
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

		if (!freshInsights){
			debug('pingCache.has(url)', pingCache.has(url), url);
			if (!pingCache.has(url)){
				pingCache.set(url, null);
				fetch(url, {cache : 'no-cache', timeout : 2500})
					.then(res => {
						debug(res, res.status, typeof(res.status));
						if(res.status !== 200){
							pingCache.set(url, false);
						} else {
							pingCache.set(url, true);
						}
					}).
					catch(err => {
						debug(`An error occurred whilst checking a URL's network visility`, err);
					})
				;
				return {
					reason: 'Checking page can be accessed'
				}
			
			} else {
				const isAccessible = pingCache.get(url);

				if(!isAccessible){
					return {
						error: 'Unable to access this URL to perform insights'
					}

				}

			} 

		}

		if (!freshInsights) {
			debug('insightsCache.has(url)', insightsCache.has(url), url);
			if (insightsCache.has(url)) {
				const insightsPromise = bluebird.resolve(insightsCache.get(url));
				if (insightsPromise.isFulfilled()) {
					debug('insightsPromise.value()', insightsPromise.value())
					return insightsPromise.value();
				} else if (insightsPromise.isRejected()) {
					debug(`Promise was rejected, deleting ${url} from insightsCache.`);
					return { error : 'Unable to check this url' }
				} else {
					return {
						reason: 'Gathering results'
					};
				}
			}
		}

		const host = parseUrl(url).host;
		const insights = bluebird.all([pageDataFor(url, freshInsights), domainDataFor(host, freshInsights)]).then(flattenDeep);

		insightsCache.set(url, insights);

		insights.catch(function (err) {
			debug(`Promise was rejected, deleting ${url} from insightsCache. ${err} `);
		});

		return {
			reason: 'Gathering results'
		};
	});
};

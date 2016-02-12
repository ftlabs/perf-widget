const debug = require('debug')('perf-widget:lib:dataFor');
const detectUrl = require('is-url-superb');
const parseUrl = require('url').parse;
const flattenDeep = require('lodash').flattenDeep;
const bluebird = require('bluebird');
const pageDataFor = require('./pageDataFor');
const domainDataFor = require('./domainDataFor');
const fetch = require('node-fetch');
const lru = require('lru-cache');

const pingCache = lru({ 
		max: 500, 
		maxAge: 1000 * 60 * 60 * 2 
	})
const insightsCache = lru({ 
		max: 500, 
		maxAge: 1000 * 60 * 60 * 24 
	});

const isUp = function (url){

	return fetch( url, {cache: 'no-cache', timeout : 2500} )
		.then(res => {
			const up = res.status < 500;
			pingCache.set(url, up);
			debug('Is site up?', url, up);

			return up;
		})
	;
}

const getInsights = function(url, freshInsights){

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

}

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

		if(!freshInsights){
			debug('URL in pingCache', pingCache.has(url), url);
			if (!pingCache.has(url)){
				pingCache.set(url, null);
				return isUp(url)
					.then(up => {
						if(up){

							return getInsights(url, freshInsights);

						} else {
							return {
								error: 'Unable to access this URL to perform insights'
							}
						}
					})
					.catch(() => {
						pingCache.delete(url);
						return {
							error : `An error occurred when we tried to check this URL.`
						}
					})
				;
			
			} else {
				const isAccessible = pingCache.get(url);
				debug('isAccessible', isAccessible);

				if(!isAccessible){
					return {
						error: 'Unable to access this URL to perform insights'
					}
				}

				return getInsights(url, freshInsights);

			}

		}

		return getInsights(url, freshInsights);

	});
};

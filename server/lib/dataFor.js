const debug = require('debug')('perf-widget:lib:dataFor');
const detectUrl = require('is-url-superb');
const parseUrl = require('url').parse;
const flattenDeep = require('lodash').flattenDeep;
const bluebird = require('bluebird');
const pageDataFor = require('./pageDataFor');
const domainDataFor = require('./domainDataFor');
const fetch = require('node-fetch');
const lru = require('lru-cache');

const insightsCache = lru({ 
	max: 500, 
	maxAge: 1000 * 60 * 60 * 24 
});

const domainInsightsCache = lru({ 
	max: 500, 
	maxAge: 1000 * 60 * 60 * 24 
});

const isUp = function (url){

	return fetch( url, {cache: 'no-cache', mode: 'head', timeout : 2500} )
		.then(res => {
			const up = res.status < 500;

			debug('Is site accessible from the server\'s location?', url, up);

			return up;
		})
	;
}

const isRedirect = function (url){

	return fetch( url, {cache: 'no-cache', mode: 'head', redirect: 'error', timeout : 2500, follow: 0} )
		.then(res => {
			return false;
		}).catch(err => {
			debug('err', err, true);
			return true;
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

const getDomainInsights = function(url, freshInsights){

	if (!freshInsights) {
		debug('domainInsightsCache.has(url)', domainInsightsCache.has(url), url);
		if (domainInsightsCache.has(url)) {
			const insightsPromise = bluebird.resolve(domainInsightsCache.get(url));
			if (insightsPromise.isFulfilled()) {
				debug('insightsPromise.value()', insightsPromise.value())
				return insightsPromise.value();
			} else if (insightsPromise.isRejected()) {
				debug(`Promise was rejected, deleting ${url} from domainInsightsCache.`);
				return { error : 'Unable to check this url' }
			} else {
				return {
					reason: 'Gathering results'
				};
			}
		}
	}

	const host = parseUrl(url).host;
	const insights = bluebird.all([domainDataFor(host, freshInsights)]).then(flattenDeep);

	domainInsightsCache.set(url, insights);

	insights.catch(function (err) {
		debug(`Promise was rejected, deleting ${url} from domainInsightsCache. ${err} `);
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

		return isUp(url)
			.then(up => {
				if(up){
					return isRedirect(url).then(redirect => {
						if (redirect) {
							return getDomainInsights(url, freshInsights);
						} else {
							return getInsights(url, freshInsights);
						}
					})
				} else {
					return {
						error: 'Unable to access this URL to perform insights'
					}
				}
			})
			.catch(() => {
				return {
					error : `An error occurred when we tried to check this URL.`
				}
			})
		;
	});
};

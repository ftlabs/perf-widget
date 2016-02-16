const debug = require('debug')('perf-widget:lib:dataFor');
const detectUrl = require('is-url-superb');
const parseUrl = require('url').parse;
const flattenDeep = require('lodash').flattenDeep;
const bluebird = require('bluebird');
const pageDataFor = require('./pageDataFor');
const domainDataFor = require('./domainDataFor');
const fetch = require('node-fetch');
const inFlight = require('./inFlight');

const hasInDateInsights = require('./hasInDateInsights');
const getLatestValuesFor = require('./getLatestValuesFor');

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

	return fetch(url, {cache: 'no-cache', mode: 'head', redirect: 'error', timeout : 2500, follow: 0})
		.then(() => {
			return false;
		}).catch(err => {
			debug('err', err, true);
			return true;
		})
	;
}

const getPageInsights = function(url, freshInsights){
	return pageDataFor(url, freshInsights).catch(function (err) {
		debug(`Promise was rejected, deleting ${url} from insightsCache. ${err} `);
	});
}

const getDomainInsights = function(url, freshInsights){
	const host = parseUrl(url).host;
	return domainDataFor(host, freshInsights).catch(function (err) {
		debug(`Promise was rejected, ${url} . ${err} `);
	});
}

function getLatestValuesForPageAndDomain (url) {
	const host = parseUrl(url).host;

	return bluebird.all([getLatestValuesFor(url), getLatestValuesFor(host)]).then(flattenDeep);
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

		return hasInDateInsights(url).then(inDateInsights => {
			if (inDateInsights) {
				debug('has in date insights, returning insights.');
				return getLatestValuesForPageAndDomain(url);
			} else {
				if (inFlight.has(url)) {
					return {
						reason: 'Gathering results'
					};
				}

				return isUp(url)
					.then(up => {
						if(up){
							debug('adding to in flight table.');
							
							inFlight.add(url);
							
							return isRedirect(url).then(redirect => {
								if (redirect) {
									getDomainInsights(url, freshInsights).then(() => {
										debug('insights gathered, removing from in flight table.');
										inFlight.remove(url);
									});
								} else {
									Promise.all([getPageInsights(url, freshInsights), getDomainInsights(url, freshInsights)]).then(() => {
										debug('insights gathered, removing from in flight table.');
										inFlight.remove(url);
									});
								}

								return {
									reason: 'Gathering results'
								};
							});
						}
						return {
							error: 'Unable to access this URL to perform insights'
						}
					})
					.catch((e) => {
						debug(e)
						return {
							error : `An error occurred when we tried to check this URL.`
						}
					})
				;
			}
		});
	});
};

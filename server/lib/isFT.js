const debug = require('debug')('perf-widget:lib:isFT'); // eslint-disable-line no-unused-vars
const parse = require('url').parse;

module.exports = function isFT(url) {
	const domain = parse(url).host || url;
	const nonFTDomains = ['www.theguardian.com', 'international.nytimes.com', 'www.nytimes.com', 'www.wsj.com'];

	return nonFTDomains.indexOf(domain) === -1;
};

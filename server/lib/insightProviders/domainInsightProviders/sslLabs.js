const ssllabs = require("node-ssllabs");
const denodeify = require('denodeify');
const scan = denodeify(ssllabs.scan.bind(ssllabs));
const debug = require('debug')('perf-widget:lib:insightsProviders:domainInsightProviders:sslLabs'); // eslint-disable-line no-unused-vars

module.exports = function (url) {

	return scan(url).then(function(results) {
		return [{
			name: 'SSLLabsGrade',
			value: results.endpoints[0].grade.charCodeAt(),
			link: `https://www.ssllabs.com/ssltest/analyze.html?d=${url}`
		}];
	});
};

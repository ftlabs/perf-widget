const debug = require('debug')('perf-widget:lib:insightsProviders:domainInsightProviders:sslLabs'); // eslint-disable-line no-unused-vars
const ssllabs = require("node-ssllabs");
const denodeify = require('denodeify');
const scan = denodeify(ssllabs.scan.bind(ssllabs));

const g = {
	A : 1,
	B : 2,
	C : 3,
	D : 4,
	E : 5,
	F : 6,
	T : 7
};

module.exports = function (url) {
	console.time('SSL-Labs');
	return scan(url).then(function(results) {
		debug(console.timeEnd('SSL-Labs'));

		const grade = results.endpoints[0].grade === undefined ? null : g[results.endpoints[0].grade[0]];

		return [{
			name: 'SSLLabsGrade',
			value: grade,
			link: `https://www.ssllabs.com/ssltest/analyze.html?d=${url}`
		}];
	});
};

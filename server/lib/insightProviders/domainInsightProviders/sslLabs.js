const ssllabs = require("node-ssllabs");
const denodeify = require('denodeify');
const scan = denodeify(ssllabs.scan.bind(ssllabs));

module.exports = function (url) {

	return scan(url).then(function(results) {
		return [{
			name: 'VulnerableToBeast',
			value: results.endpoints[0].details.vulnBeast,
			link: `https://www.ssllabs.com/ssltest/analyze.html?d=${url}`
		}];
	});
};

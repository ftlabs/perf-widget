const sslLabs = require('./sslLabs');

module.exports = function(domain) {
	return [
		sslLabs(domain)
	];
};

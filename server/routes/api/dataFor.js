const debug = require('debug')('perf-widget:routes:api:dataFor'); // eslint-disable-line no-unused-vars
const dataFor = require('./../../lib/dataFor');

const response = require('./../../lib/jsonResponse');
const _ = require('lodash');

module.exports = function (req, res) {
	
	const freshInsights = req.query.fresh === "true";

	dataFor(req.query.url, freshInsights)
	.then(function (data) {

		if (data.error) {
			
			response(res, 422, false, data);

		} else if (data.reason) {

			response(res, 202, true, data);
		} else {
			const results = data.map(d => {
				d.comparisons = [_.sample(d.comparisons)];
				return d;
			});
			response(res, 200, true, results);
		}
	});
}

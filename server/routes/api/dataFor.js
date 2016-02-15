const debug = require('debug')('perf-widget:routes:api:dataFor'); // eslint-disable-line no-unused-vars
const dataFor = require('./../../lib/dataFor');

const response = require('./../../lib/jsonResponse');
const _ = require('lodash');

module.exports = function (req, res) {

	res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  	res.header('Expires', '-1');
  	res.header('Pragma', 'no-cache');
	
	const freshInsights = req.query.fresh === "true";

	dataFor(req.query.url, freshInsights)
	.then(function (data) {
		if (data.error) {
			
			response(res, 422, false, data);

		} else if (data.reason) {

			response(res, 202, true, data);
		} else {
			// we have data
			const results = data.map(function(datum) {
				const clone = Object.assign({}, datum);

				const oneRandomComparison = _.sample(clone.comparisons);

				clone.comparisons = [oneRandomComparison];

				return clone;
			});
			response(res, 200, true, results);
		}
	});
}

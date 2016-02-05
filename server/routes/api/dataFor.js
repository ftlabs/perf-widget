const dataFor = require('./../../lib/dataFor');

const response = require('./../../lib/jsonResponse');

module.exports = function (req, res) {
	
	const freshInsights = req.query.fresh === "true";

	dataFor(req.query.url, freshInsights)
	.then(function (data) {

		if (data.error) {
			
			response(res, 422, false, data);

		} else if (data.reason) {

			response(res, 202, true, data);
		} else {

			response(res, 200, true, data);
		}
	});
}

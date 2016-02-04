const debug = require('debug')('perf-widget:lib:clientData'); // eslint-disable-line no-unused-vars
const dataFor = require('../lib/dataFor');

module.exports = function (req, res) {

	const websiteToTest = req.query.url;
	const freshInsights = req.query.fresh === 'true';
	const serviceURL = `${process.env.SERVER_DOMAIN}${ process.env.NODE_ENV === 'development' ? ':' + process.env.PORT : ''}`;


	dataFor(websiteToTest, freshInsights)
		.then(response => {
			
				if(Array.isArray(response)){

					res.render('bookmarklet', {
						serviceURL,
						data : response
					});

				} else {

					res.render('bookmarklet', {
						serviceURL,
						message : response.reason || response.error
					});

				}

		})
		.catch(err => {
			res.end(err);
		})
	;
};

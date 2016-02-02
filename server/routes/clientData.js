const debug = require('debug')('perf-widget:lib:clientData'); // eslint-disable-line no-unused-vars
const dataFor = require('../lib/dataFor');
const bm = require('../lib/bookmarklet');

module.exports = function (req, res) {

	const websiteToTest = req.query.url;
	const freshInsights = req.query.fresh === 'true';
	const categories = {};
	const serviceURL = `${process.env.SERVER_DOMAIN}${ process.env.NODE_ENV === 'development' ? ':' + process.env.PORT : ''}`;


	dataFor(websiteToTest, freshInsights)
		.then(response => {
			
				if(Array.isArray(response)){

					response.forEach(insight => {
						if(categories[insight.category] === undefined){
							categories[insight.category] = [];
						}
						categories[insight.category].push(insight);
					});

					res.render('bookmarklet', {
						serviceURL,
						data : categories,
						bm
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

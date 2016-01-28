const debug = require('debug')('perf-widget:lib:clientData');
const dataFor = require('../lib/dataFor');

module.exports = function (req, res) {

	const websiteToTest = req.query.url;
	const categories = {};

	dataFor(websiteToTest)
		.then(results => {

			if(results !== undefined){

				results.forEach(insight => {
					if(categories[insight.category] === undefined){
						categories[insight.category] = [];
					}
					categories[insight.category].push(insight);
				});

			}

			res.render('bookmarklet', {
				serviceURL : process.env.SERVER_DOMAIN === undefined ? `http://localhost:${process.env.PORT}` : `${process.env.SERVER_DOMAIN}:${process.env.PORT}`,
				data : categories
			});

		})
		.catch(err => {
			res.end(err);
		})
	;
	

};

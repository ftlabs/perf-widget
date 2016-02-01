const debug = require('debug')('perf-widget:lib:clientData'); // eslint-disable-line no-unused-vars
const dataFor = require('../lib/dataFor');

module.exports = function (req, res) {

	const websiteToTest = req.query.url;
	const categories = {};

	dataFor(websiteToTest)
		.then(response => {
				
				if(Array.isArray(response)){

					response.forEach(insight => {
						if(categories[insight.category] === undefined){
							categories[insight.category] = [];
						}
						categories[insight.category].push(insight);
					});

					res.render('bookmarklet', {
						serviceURL : `${process.env.SERVER_DOMAIN}:${process.env.PORT}`,
						data : categories
					});

				} else {

					res.render('bookmarklet', {
						message : response.reason
					});

				}

		})
		.catch(err => {
			res.end(err);
		})
	;
};

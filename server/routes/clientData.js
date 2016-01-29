const debug = require('debug')('perf-widget:lib:clientData');
const dataFor = require('../lib/dataFor');

module.exports = function (req, res) {

	const websiteToTest = req.query.url;
	const categories = {};

	dataFor(websiteToTest)
		.then(response => {
			
			if(response.reason === undefined && response.error === undefined){

				response.forEach(insight => {
					if(categories[insight.category] === undefined){
						categories[insight.category] = [];
					}
					categories[insight.category].push(insight);
				});

				res.render('bookmarklet', {
					data : categories
				});

			} else {

				res.render('bookmarklet', {
					message : "No available data for this site"
				});

			}

			

		})
		.catch(err => {
			res.end(err);
		})
	;
	

};

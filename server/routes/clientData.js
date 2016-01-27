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
				data : categories
			});

		})
		.catch(err => {
			res.end(err);
		})
	;
	

};

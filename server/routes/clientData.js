const debug = require('debug')('perf-widget:lib:clientData');
const dataFor = require('../lib/dataFor');
/*const dataFor = function (){

	return new Promise(function (resolve){

		resolve({
			success: true,
			data: {

				insights: [
					{
						category: 'performance',
						text: 'Your page is slow',
						provider: 'Google Pagespeed',
						link: 'http://example.com/1234575785',
						value: 42,
						concern : false
					},
					{
						cat: 'security',
						text: 'Your page is insecure',
						provider: 'Google Pagespeed',
						link: 'http://example.com/1234575785',
						value: 42,
						concern : true
					},
					{
						cat: 'accessibility',
						text: 'Your page is inaccessible',
						provider: 'Google Pagespeed',
						link: 'http://example.com/1234575785',
						value: 42
					},
				]

			},
			code: 200
		});

	});	

}*/

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

// const dataFor = require('../lib/dataFor');
const dataFor = function (){

	return new Promise(function (resolve){

		resolve({
			success: true,
			data: {

				insights: [
					{
						cat: 'perf',
						text: 'Your page is slow',
						provider: 'Google Pagespeed',
						link: 'http://example.com/1234575785',
						value: 42
					},
					{
						cat: 'security',
						text: 'Your page is insecure',
						provider: 'Google Pagespeed',
						link: 'http://example.com/1234575785',
						value: 42
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

}

module.exports = function (req, res) {

	const websiteToTest = req.get('referer');
	const categories = {};

	dataFor(websiteToTest)
		.then(results => {

			if(results.data !== undefined){

				results.data.insights.forEach(insight => {

					if(categories[insight.cat] === undefined){
						categories[insight.cat] = [];
					}
					categories[insight.cat].push(insight);

				});

			}

			res.render('bookmarklet', {
				data : categories
			});

		})
	;
	

};

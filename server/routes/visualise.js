const debug = require('debug')('perf-widget:routes:visualise'); // eslint-disable-line no-unused-vars
const whatDoesItAllMean = require('../lib/report');

module.exports = function (req, res){

	const visRequests = [whatDoesItAllMean.insights.allValues(), whatDoesItAllMean.insights.historicalDomain('www.theguardian.com')];

	Promise.all(visRequests)
		.then(results => {

			// debug(`First row of response\n${results[0][0]}\n${results[1][0]}`);

			debug(results[1]);

			res.render('main', {
				partial : 'visualise',
				results : {
					dayResults : results[0],
					historical : results[1]
				}
			});

		})
		.catch(err => {

			res.render('main', {
				partial : 'visualise'
			});

			debug(`An error occured when we tried to get data for the visualisations ${err}`);

		});
	;

	/*whatDoesItAllMean.insights.allValues()
		.then(data => {
			debug('First row of response', data[0]);
			res.render('main', {
				partial : 'visualise',
				results : data
			})
		})
		.catch(err => {
			res.end();
			debug(`An error occured whilst trying to show what this all means\n${ err }`);
		})
	;*/

}
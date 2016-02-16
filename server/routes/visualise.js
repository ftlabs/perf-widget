const debug = require('debug')('perf-widget:routes:visualise'); // eslint-disable-line no-unused-vars
const whatDoesItAllMean = require('../lib/report');

module.exports = function (req, res){

	whatDoesItAllMean()
		.then(data => {
			debug('First row of response', data[0]);
			res.render('visualise', {results : data});
		})
		.catch(err => {
			res.end();
			debug(`An error occured whilst trying to show what this all means\n${ err }`);
		})
	;

}
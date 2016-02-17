const bluebird = require('bluebird');
const query = require('./database').query;
const escape = require('mysql').escape;

module.exports = bluebird.coroutine(function* insightsExist(url) {
	const command = `SELECT EXISTS (SELECT 1 FROM current_values JOIN page ON page.id = current_values.page_id and page.url = ${escape(url)})`

	const result = yield query(command);

	const key = Object.keys(result[0])[0];
		
	const exists = result[0][key];
		
	return exists === 1;
});

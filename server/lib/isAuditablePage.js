const query = require('./database').query;

module.exports = function isAuditablePage(url) {
	const result = query('SELECT pattern, type FROM pagetype');

	return result.then(function(rows) {
		
		const pagetypes = new Map();
		
		rows.forEach(function(row) {
			pagetypes.set(RegExp(row.pattern), row.type);
		});
		
		const patterns = rows.map(row => RegExp(row.pattern));

		const patternMatch = patterns.find(pattern => pattern.test(url));

		return patternMatch !== undefined;

	}).catch(function(e) {
		console.log('error', e)
	})
};

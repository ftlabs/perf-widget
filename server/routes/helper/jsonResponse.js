const curry = require('lodash').curry;

module.exports = curry(function (res, code, success, data) {
	return res.status(code).json({ success, data, code })
});

const express = require('express');
const router = express.Router(); //eslint-disable-line new-cap
const path = require('path');
const curry = require('lodash').curry;
const appVersion = require(path.join(__dirname, '../../package.json')).version;

const response = curry(function (res, code, success, data) {
	return res.status(code).json({ success, data, code })
});

// Serve static assets from /static
router.use('/static', express.static(path.join(__dirname, '../../client/dist')));

// Home page
router.get('/', function (req, res) {
	res.render('index', {
		version : appVersion,
		isProduction : process.env.NODE_ENV === "production",
		sentryClientKey : process.env.sentryClientKey
	});
});

router.get('/data-for', function (req, res) {
	const badResponse = response(res, 422, false);
	badResponse({
		error: 'Missing url query parameter.'
	});
});

// 404 handler
router.use(function (req, res) {
	res.sendStatus(404); // TODO: Redirect to FT 404 Page?
});

module.exports = router;

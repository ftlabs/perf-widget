const express = require('express');
const router = express.Router(); //eslint-disable-line new-cap
const path = require('path');
const appVersion = require(path.join(__dirname, '../../package.json')).version;

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

// 404 handler
router.use(function (req, res) {
	res.sendStatus(404); // TODO: Redirect to FT 404 Page?
});

module.exports = router;

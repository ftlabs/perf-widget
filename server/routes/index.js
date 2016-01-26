const router = require('express').Router(); //eslint-disable-line new-cap

const dataFor = require('./dataFor');
const clientData = require('./clientData');
const staticFiles = require('./staticFiles');

// Serve static assets from /static
router.use('/static', staticFiles);

// Home page
router.get('/', function (req, res) {
	res.render('index', {
		isProduction : process.env.NODE_ENV === "production",
		sentryClientKey : process.env.sentryClientKey
	});
});

router.get('/data-for', dataFor);

router.get('/client/data-for', clientData);

// 404 handler
router.use(function (req, res) {
	res.sendStatus(404); // TODO: Redirect to FT 404 Page?
});

module.exports = router;

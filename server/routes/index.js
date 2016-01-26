const router = require('express').Router(); //eslint-disable-line new-cap

// Serve static assets from /static
router.use('/static', require('./staticFiles'));

router.get('/api', require('./api/index.js'));

// 404 handler
router.use(function (req, res) {
	res.sendStatus(404); // TODO: Redirect to FT 404 Page?
});

module.exports = router;

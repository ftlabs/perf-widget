const router = require('express').Router(); //eslint-disable-line new-cap

// Serve static assets from /static
router.get('/insights', require('./insights'));
router.get('/contrastbreakdown', require('./contrast'));
router.use('/static', require('./staticFiles'));
router.use('/api', require('./api'));
router.use('/destruct', function(req, res){

	res.json({
		selfDestruct : process.env.EXTENSION_SELFDESTRUCT === "true"
	});

});

const authS3O = require('s3o-middleware');

router.use(authS3O);
router.get('/', require('./home'));
router.use('/visualise', require('./visualise'));

// 404 handler
router.use(function (req, res) {
	res.sendStatus(404); // TODO: Redirect to FT 404 Page?
});

module.exports = router;

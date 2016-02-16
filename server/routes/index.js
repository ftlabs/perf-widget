const router = require('express').Router(); //eslint-disable-line new-cap

// Serve static assets from /static
router.get('/', require('./home'));
router.get('/insights', require('./insights'));
router.get('/contrastbreakdown', require('./contrast'));
router.use('/static', require('./staticFiles'));
router.use('/api', require('./api'));
router.use('/visualise', require('./visualise'));

/*router.use('/main', function(req, res){
	res.render('main');
});*/

// 404 handler
router.use(function (req, res) {
	res.sendStatus(404); // TODO: Redirect to FT 404 Page?
});

module.exports = router;

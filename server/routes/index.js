const router = require('express').Router(); //eslint-disable-line new-cap

// Serve static assets from /static
router.get('/', function(req, res){
	res.render('main');
});

router.use('/static', require('./staticFiles'));
router.use('/api', require('./api'));
router.get('/client/data-for', require('./clientData'));

router.use('/grading', function (req, res){
	res.render('main', {
		grading : true
	});
} );

// 404 handler
router.use(function (req, res) {
	res.sendStatus(404); // TODO: Redirect to FT 404 Page?
});

module.exports = router;

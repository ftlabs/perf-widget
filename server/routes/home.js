const bm = require('../lib/bookmarklet');

module.exports = function(req, res){

	res.render('index', {
		bookmarklet : bm
	});

}
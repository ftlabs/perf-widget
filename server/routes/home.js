const fs = require('fs');
const path = require('path');
const bm = require('../lib/bookmarklet');

module.exports = function(req, res){

	res.render('index', {
		bookmarklet : bm
	});

}
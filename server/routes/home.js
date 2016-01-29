const fs = require('fs');
const path = require('path');
const bm = fs.readFileSync(path.join(__dirname, '/../../client/dist/bookmarklet.js'), {encoding : 'utf8'});

module.exports = function(req, res){

	res.render('index', {
		bookmarklet : bm
	});

}
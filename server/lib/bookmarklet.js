const fs = require('fs');
const path = require('path');
const bm = fs.readFileSync(path.join(__dirname, '../../client/dist/bookmarklet.js'), {encoding : 'utf8'});

module.exports = function(req, res){

	if (res !== undefined){
		res.send(bm);
	} else {
		return bm;
	}

};
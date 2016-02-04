const dataFor = require('./../../lib/dataFor');

const response = require('./../../lib/jsonResponse');

function waitForData (url, res){

	dataFor(url)
		.then(function (data){

			if(data.reason === undefined && data.error === undefined){
				response(res, 202, true, data);
			} else {
				setTimeout(function (){

					waitForData(url, res);

				}, 3000);
			}

		})
	;

}

module.exports = function (req, res) {
	
	const wait = req.query.wait === 'true';
	
	dataFor(req.query.url)
	.then(function (data) {
		if (data.error) {
			
			response(res, 422, false, data);

		} else if (data.reason) {

			if(wait){

				waitForData(req.query.url, res);


			} else {
				response(res, 202, true, data);				
			}


		} else {

			response(res, 200, true, data);

		}
	});

}

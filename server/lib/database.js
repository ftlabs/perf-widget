const mysql = require('mysql');
const denodeify = require('denodeify');
const debug = require('debug')('perf-widget:lib:database'); // eslint-disable-line no-unused-vars
const fs = require('fs');
const path = require('path');

const pool = mysql.createPool({
	connectionLimit : process.env.MYSQL_CONNECTION_LIMIT,
	host     : process.env.MYSQL_HOST,
	user     : process.env.MYSQL_USER,
	password : process.env.MYSQL_PASSWORD,
	database : process.env.MYSQL_DATABASE,
	debug    : process.env.MYSQL_DEBUG === 'false' || process.env.MYSQL_DEBUG === undefined ? false : true
});

const getConnection = denodeify(pool.getConnection.bind(pool));

function readSQLFiles () {
	return fs.readdirSync(path.join(__dirname, '../../database')).map(function(item) {
		if (item.endsWith('.sql')) {
			return fs.readFileSync(path.join(__dirname, '../../database', item), 'utf8');
		}
	});
}

module.exports.createTables = function createTables () {

	const connection = getConnection();

	function createDB (conn){

		const query = denodeify(conn.query.bind(conn));

		return readSQLFiles().map(function (sql) {
			return query(sql);
		});

	}

	if (process.env.NODE_ENV !== 'production'){

		debug('Not in production. Rebuild DB');
		return connection.then(function (connection){
			return Promise.all( createDB(connection) )
		});

	} else {
		debug('In production. Check state of DB. Build if required.');
		return connection.then(function (connection){

			const query = denodeify(connection.query.bind(connection));

			return query(`SELECT table_name FROM information_schema.tables WHERE table_schema='perf_widget'`)
				.then(res => {
					if(res.length < 1){
						// There are no tables, let's add them
						return Promise.all( createDB(connection) );
					} else {
						connection.release();
						return
					}
				})
			;

		});

	}
};

module.exports.query = function query (command) {
	const connection = getConnection();

	return connection.then(function (connection) {

		const query = denodeify(connection.query.bind(connection));
		return query(command).then(function (results) {
			connection.release();
			return results;
		}).catch(err => {
			debug('An error occured when running the query.');
			debug('>>>>>>> SQL ERROR <<<<<<<\n\n', command, '>>>\n\n', err, '\n\n>>>>>>> |||||||| <<<<<<<');
			connection.release();
		});
	})
	.catch(err => {
			debug('An error occured when retrieving a database connection');
			debug(err);
	});
};

module.exports.abort = function (){
	return new Promise(function (resolve, reject){

		pool.end(function (err){
			if(err){
				reject(err);
			} else {
				resolve();			
			}
		});

	});
}

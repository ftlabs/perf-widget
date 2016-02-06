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

function readSQLFiles() {
	return fs.readdirSync(path.join(__dirname, '../../database')).map(function(item) {
		if (item.endsWith('.sql')) {
			return fs.readFileSync(path.join(__dirname, '../../database', item), 'utf8');
		}
	});
}

module.exports.createTables = function createTables() {
	const connection = getConnection();

	return connection.then(function(connection) {

		const query = denodeify(connection.query.bind(connection));

		const queries = readSQLFiles().map(function(sql) {
			return query(sql);
		});

		return Promise.all(queries);
	});
};

module.exports.query = function query(command) {
	const connection = getConnection();

	return connection.then(function(connection) {

		const query = denodeify(connection.query.bind(connection));
		return query(command).then(function(results) {
			connection.release();
			return results;
		});
	});
};

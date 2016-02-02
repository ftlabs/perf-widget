require('dotenv').load({silent: true});
const express = require('express');
const path = require('path');
const app = express();
const db = require('./lib/database');
const debug = require('debug')('perf-widget:app');
const hsts = require('hsts');
const enforceSSL = require('express-enforces-ssl');

db.createTables().then(function() {
	require('./lib/updateCompetitorInsights')();
})
.catch(function(error) {
	debug('Could not create the tables required for the application.');
	debug(error);
	process.kill(1);
	return;
});

app.use( hsts({
	maxAge : 604800000,
	includeSubdomains : true,
	force : true
 }));

app.enable('trust proxy');

if(process.env.NODE_ENV !== 'development'){
	app.use(enforceSSL());	
}

// FT Web App configuration
const ftwebservice = require('express-ftwebservice');
ftwebservice(app, {
	manifestPath: path.join(__dirname, '../package.json'),
	about: require('./runbook.json'),
	healthCheck: require('./healthcheck'),
	goodToGoTest: () => Promise.resolve(true) // TODO
});

// Error Reporting
const SENTRY_DSN = process.env.SENTRY_DSN;
const raven = require('raven');
const client = new raven.Client(SENTRY_DSN);
app.use(raven.middleware.express.requestHandler(SENTRY_DSN));
app.use(raven.middleware.express.errorHandler(SENTRY_DSN));
client.patchGlobal();
const logger = require('morgan');
app.use(logger('dev'));

// View Engine
const hbs = require('express-hbs');
app.engine('hbs', hbs.express4({
	partialsDir: path.join(__dirname, '/views/partials')
}));
app.set('views', path.join(__dirname, 'views')); //TODO: remove this
app.set('view engine', 'hbs');

// Decode JSON sent in request bodies
app.use(require('body-parser').json());

// Assign routes
app.use('/', require('./routes'));

module.exports = app;

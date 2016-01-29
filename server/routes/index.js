const router = require('express').Router(); //eslint-disable-line new-cap
const path = require('path');
const express = require('express');

// Serve static assets from /static
router.get('/', require('./home'));
router.use('/static', require('./staticFiles'));
router.use('/api', require('./api'));
router.get('/client/data-for', require('./clientData'));
router.use('/bookmarklet', express.static( path.join(__dirname, '/../../client/dist/bookmarklet.js') ) );

// 404 handler
router.use(function (req, res) {
	res.sendStatus(404); // TODO: Redirect to FT 404 Page?
});

module.exports = router;

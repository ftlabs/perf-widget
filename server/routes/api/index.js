const router = require('express').Router(); //eslint-disable-line new-cap

router.get('/data-for', require('./dataFor'));

module.exports = router;

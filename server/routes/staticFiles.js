const express = require('express');
const path = require('path');

module.exports = express.static(path.join(__dirname, '../../client/dist'));

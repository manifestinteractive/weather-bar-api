/**
 * @module routes
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var express = require('express');
var config = require('../../../config');

var apiUser = require('./user');
var guest = require('./guest');
var geolocation = require('./geolocation');

var profile = require('./profile');
var settings = require('./settings');
var token = require('./token');
var unauthorized = require('./unauthorized');
var weather = require('./weather');

var API_VERSION = config.get('version');

var router = express.Router(config.router);

router.use('/' + API_VERSION + '/', apiUser);
router.use('/' + API_VERSION + '/', guest);
router.use('/' + API_VERSION + '/', geolocation);
router.use('/' + API_VERSION + '/', profile);
router.use('/' + API_VERSION + '/', settings);
router.use('/' + API_VERSION + '/', token);
router.use('/' + API_VERSION + '/', unauthorized);
router.use('/' + API_VERSION + '/', weather);

module.exports = router;

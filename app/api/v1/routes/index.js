/**
 * @module routes
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var express = require('express');
var config = require('../../../config');

var geolocation = require('./geolocation');
var owm_city_list = require('./owm_city_list');
var saved_locations = require('./saved_locations');
var settings = require('./settings');
var weather = require('./weather');

var API_VERSION = config.get('version');

var router = express.Router(config.router);

router.use('/' + API_VERSION + '/', geolocation);
router.use('/' + API_VERSION + '/', owm_city_list);
router.use('/' + API_VERSION + '/', saved_locations);
router.use('/' + API_VERSION + '/', settings);
router.use('/' + API_VERSION + '/', weather);

module.exports = router;

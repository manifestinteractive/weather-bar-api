/**
 * @module routes/weather
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var express = require('express');
var validator = require('validator');

var external = require('../../../external');
var config = require('../../../config');
var util = require('./util');
var router = express.Router(config.router);

/**
 * Legislators
 * @memberof module:routes/weather
 * @name [GET] /weather/current/:cityid
 * @property {string} cityid - Open Weather Map City ID
 */
/* istanbul ignore next */
router.route('/weather/current/id/:cityid').get(function(request, response) {
  var id = request.params.cityid;
  var url = 'https://api.openweathermap.org/data/2.5/weather?id=' + id + '&appid=' + config.get('openweathermap.key');

  external.getContent(url, 900).then(function (content){
    var weather = JSON.parse(content);
    var cache = weather.wbcache;
    delete weather.wbcache;

    if (!cache.cached) {
      response.setHeader("Cache-Control", "public, max-age=900");
      response.setHeader("Expires", new Date(Date.now() + 900000).toUTCString());
    } else {
      response.status(304);
    }

    response.json(util.createAPIResponse({
      cache: cache,
      data: weather
    }, request.query.fields));
  }).catch(function (error){
    var message = (error && error.message) ? error.message : '';

    message += '. Unable to Fetch Weather for City ID ' + id;

    response.json(util.createAPIResponse({
      errors: [message]
    }, request.query.fields));
  });
});

/**
 * Legislators
 * @memberof module:routes/weather
 * @name [GET] /weather/current/zipcode/:zipcode
 * @property {string} zipcode - Zip Code
 */
/* istanbul ignore next */
router.route('/weather/current/zipcode/:zipcode').get(function(request, response) {
  var zipcode = request.params.zipcode;
  var url = 'https://api.openweathermap.org/data/2.5/weather?zip=' + zipcode + '&appid=' + config.get('openweathermap.key');

  external.getContent(url, 900).then(function (content){
    var weather = JSON.parse(content);
    var cache = weather.wbcache;
    delete weather.wbcache;

    if (!cache.cached) {
      response.setHeader("Cache-Control", "public, max-age=900");
      response.setHeader("Expires", new Date(Date.now() + 900000).toUTCString());
    } else {
      response.status(304);
    }

    response.json(util.createAPIResponse({
      cache: cache,
      data: weather
    }, request.query.fields));
  }).catch(function (error){
    var message = (error && error.message) ? error.message : '';

    message += '. Unable to Fetch Weather for Zipcode ' + zipcode;

    response.json(util.createAPIResponse({
      errors: [message]
    }, request.query.fields));
  });
});

/**
 * Legislators
 * @memberof module:routes/weather
 * @name [GET] /weather/current/geo/:latitude/:longitude
 * @property {float} latitude - GPS Latitude ( required if also passing over `longitude` )
 * @property {float} longitude - GPS Longitude ( required if also passing over `latitude` )
 */
/* istanbul ignore next */
router.route('/weather/current/geo/:latitude/:longitude').get(function(request, response) {
  var latitude = request.params.latitude;
  var longitude = request.params.longitude;
  var url = 'https://api.openweathermap.org/data/2.5/weather?lat=' + latitude + '&lon=' + longitude + '&appid=' + config.get('openweathermap.key');

  external.getContent(url, 900).then(function (content){
    var weather = JSON.parse(content);
    var cache = weather.wbcache;
    delete weather.wbcache;

    if (!cache.cached) {
      response.setHeader("Cache-Control", "public, max-age=900");
      response.setHeader("Expires", new Date(Date.now() + 900000).toUTCString());
    } else {
      response.status(304);
    }

    response.json(util.createAPIResponse({
      cache: cache,
      data: weather
    }, request.query.fields));
  }).catch(function (error){
    var message = (error && error.message) ? error.message : '';

    message += '. Unable to Fetch Weather Geo for ' + latitude + ' ' + longitude;

    response.json(util.createAPIResponse({
      errors: [message]
    }, request.query.fields));
  });
});

module.exports = router;

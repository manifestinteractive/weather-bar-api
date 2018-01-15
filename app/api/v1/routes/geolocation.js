/**
 * @module routes/geolocation
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 * @todo Create Unit Tests for Routes
 */

var express = require('express');
var config = require('../../../config');
var util = require('./util');
var ipaddr = require('ipaddr.js');
var analytics = require('../../../analytics');

var router = express.Router(config.router);
var GeolocationDomain = require('../domain/geolocation');

/**
 * Lookup Location Data from IP Address
 * @memberof module:routes/geolocation
 * @name [GET] /geolocation/ip/:ipaddress
 * @property {string} [ipaddress=Requester's IP Address] - IP Address to Search For
 */
/* istanbul ignore next */
router.route('/geolocation/ip/:ipaddress?').get(function(request, response) {

  var valid = true;
  var ip = request.params.ipaddress;

  if (ip) {
    valid = (ip && /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ip));
  } else {
    ip = request.headers['x-forwarded-for'] ||
      request.connection.remoteAddress ||
      request.socket.remoteAddress ||
      request.connection.socket.remoteAddress;
  }

  var addr = ipaddr.process(ip).toString();

  if (addr && valid) {
    GeolocationDomain.getIpAddress(addr, 'cities')
      .then(function (results) {
        if (results) {
          var cleanData = {
            ip_address: addr,
            city: results.city.names.en,
            state: (results.subdivisions && results.subdivisions.length > 0) ? results.subdivisions[0].iso_code : null,
            postalcode: (results.postal && typeof results.postal.code !== 'undefined') ? results.postal.code : null,
            country: results.country.iso_code,
            latitude: results.location.latitude,
            longitude: results.location.longitude,
            time_zone: results.location.time_zone
          };

          response.json(util.createAPIResponse({
            data: cleanData
          }, request.query.fields));
        } else {
          response.json(util.createAPIResponse({
            data: results
          }, request.query.fields));
        }
      })
      .catch(function (error) {
        response.json(util.createAPIResponse({
          errors: [error]
        }, request.query.fields));
      });
  } else {
    response.json(util.createAPIResponse({
      errors: ['Invalid IP Address']
    }, request.query.fields));
  }
});

module.exports = router;

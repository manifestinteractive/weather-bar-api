/**
 * @module routes/saved_locations
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 * @todo Create Unit Tests for Routes
 */

var express = require('express');
var config = require('../../../config');
var saved_locations = require('../domain/saved_locations');
var util = require('./util');
var router = express.Router(config.router);

/**
 * SavedLocations
 * @memberof module:routes/saved_locations
 * @name [GET] /saved_locations/uuid/:uuid
 */
/* istanbul ignore next */
router.route('/saved_locations/uuid/:uuid').get(function(request, response) {
  saved_locations.get(request.params.uuid)
    .then(function(data) {
      response.json(util.createAPIResponse({
        data: data
      }, request.query.fields));
    })
    .catch(function(errors) {
      response.status(400);
      response.json(util.createAPIResponse({
        errors: [errors.toString()]
      }, request.query.fields));
    });
});

/**
 * SavedLocations
 * @memberof module:routes/saved_locations
 * @name [POST] /saved_locations/uuid/:uuid
 */
/* istanbul ignore next */
router.route('/saved_locations/new').post(function(request, response) {
  saved_locations.save(request.body)
    .then(function(data) {
      response.json(util.createAPIResponse({
        data: data
      }, request.query.fields));
    })
    .catch(function(errors) {
      response.status(400);
      response.json(util.createAPIResponse({
        errors: [errors.toString()]
      }, request.query.fields));
    });
});

/**
 * SavedLocations
 * @memberof module:routes/saved_locations
 * @name [GET] /saved_locations/uuid/:uuid
 */
/* istanbul ignore next */
router.route('/saved_locations/uuid/:uuid/:hash_key').delete(function(request, response) {
  saved_locations.delete(request.params.uuid, request.params.hash_key)
    .then(function() {
      response.json(util.createAPIResponse({
        data: []
      }, request.query.fields));
    })
    .catch(function(errors) {
      response.status(400);
      response.json(util.createAPIResponse({
        errors: [errors.toString()]
      }, request.query.fields));
    });
});

module.exports = router;

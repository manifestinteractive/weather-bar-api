/**
 * @module routes/settings
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 * @todo Create Unit Tests for Routes
 */

var express = require('express');
var config = require('../../../config');
var settings = require('../domain/settings');
var util = require('./util');
var router = express.Router(config.router);

/**
 * Settings
 * @memberof module:routes/settings
 * @name [GET] /settings/uuid/:uuid
 */
/* istanbul ignore next */
router.route('/settings/uuid/:uuid').get(function(request, response) {
  settings.get(request.params.uuid)
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
 * Settings
 * @memberof module:routes/settings
 * @name [POST] /settings/uuid/:uuid
 */
/* istanbul ignore next */
router.route('/settings/uuid/:uuid').post(function(request, response) {
  settings.init(request.params.uuid)
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
 * Settings
 * @memberof module:routes/settings
 * @name [POST] /settings/update/:uuid/:key/:value
 */
/* istanbul ignore next */
router.route('/settings/update/:uuid/:key/:value').post(function(request, response) {
  settings.update(request.params.uuid, request.params.key, request.params.value)
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

module.exports = router;

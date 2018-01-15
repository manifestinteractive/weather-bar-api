/**
 * @module routes/guest
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 * @todo Create Unit Tests for Routes
 */

var express = require('express');
var moment = require('moment');
var passport = require('passport');
var config = require('../../../config');
var auth = require('../domain/users/auth');
var registration = require('../domain/users/registration');
var user = require('../domain/user');
var util = require('./util');
var router = express.Router(config.router);
var elasticsearchClient = require('../../../elasticsearch/client');

/**
 * User Registration
 * @memberof module:routes/user
 * @name [POST] /guest/register
 * @property {string} uuid - Unique User ID of Users Device
 * @property {string} agree - User Indicated that they Agreed to the Terms of Service
 */
/* istanbul ignore next */
router.route('/guest/register').post(function(request, response, next) {
  registration.registerGuest(request.body)
  .then(function(user) {

    var data = user.publicJSON();
    data.token = auth.createUserToken(user);

    util.trackActivity(data.id, 'created_account', null, function(){
      response.json(util.createAPIResponse({
        data: data
      }, request.query.fields));

      return next();
    });
  })
  .catch(function(errors) {
    var responseErrors = [];
    for (var key in errors) {
      if (!errors.hasOwnProperty(key)) {
        continue;
      }

      responseErrors.push(errors[key][0]);
    }

    response.json(util.createAPIResponse({
      errors: responseErrors,
      field_errors: errors
    }, request.query.fields));

    return next();
  });
});

/**
 * User Login
 * @memberof module:routes/guest
 * @name [POST] /guest/login
 * @property {string} uuid - Unique User ID of Users Device
 */
/* istanbul ignore next */
router.route('/guest/login').post(function(request, response, next) {

  passport.authenticate('local', function(error, user, info) {
    if (error) {
      response
        .json(util.createAPIResponse({
          errors: error ? [error] : []
        }, request.query.fields));
      return next(error);
    }

    util.trackLogin(user, request);
    util.trackActivity(user.get('id'), 'login');

    // Pull out public user data and generate token
    var data = user.publicJSON();
    data.token = auth.createUserToken(user);

    response.json(util.createAPIResponse({
      data: data
    }, request.query.fields));

  })(request, response, next);
});

module.exports = router;

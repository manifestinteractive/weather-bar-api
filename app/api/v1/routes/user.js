/**
 * @module routes/user
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
 * @name [POST] /user/register
 * @property {string} username - Requested Username ( 3-30 `a-zA-Z0-9_` Characters )
 * @property {string} password - User Password ( must be at least 6 characters in length )
 * @property {string} retype_password - Retyped Password ( must match `password` )
 * @property {string} first_name - First Name of User
 * @property {string} last_name - Last Name of User
 * @property {string} email - Users Email Addresses
 * @property {string} agree - User Indicated that they Agreed to the Terms of Service
 */
/* istanbul ignore next */
router.route('/user/register').post(function(request, response, next) {
  registration.register(request.body)
  .then(function(user) {

    var data = user.publicJSON();
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
 * @memberof module:routes/user
 * @name [POST] /user/login
 * @property {string} username - Username of Existing Account
 * @property {string} password - Password of Existing Account
 */
/* istanbul ignore next */
router.route('/user/login').post(function(request, response, next) {

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

    return next();

  })(request, response, next);
});

/**
 * User Logout
 * @memberof module:routes/user
 * @name [POST] /user/logout
 */
/* istanbul ignore next */
router.route('/user/logout').post(function(request, response, next) {
  util.isValidUser(request, function(validUserId){
    if(typeof validUserId === 'number'){
      util.trackActivity(validUserId, 'logout', null, function(){
        response.json(util.createAPIResponse({
          data: {
            success: true
          }
        }, request.query.fields));

        return next();
      });
    } else {
      response.json(util.createAPIResponse({
        errors: ['Invalid API Authorization Token']
      }, request.query.fields));
    }
  });
});

/**
 * Refresh User Token
 * User token refresh, extracts the token out of the Authorization header and refreshes it, returning a new token under data: {token: '...'}
 * @memberof module:routes/user
 * @name [POST] /user/refresh
 */
/* istanbul ignore next */
router.route('/user/refresh').post(function(request, response, next) {
  var errorMessage = 'No Authorization header found';

  if (request.headers && request.headers.authorization) {
    var parts = request.headers.authorization.split(' ');

    if (parts.length === 2) {
      var scheme = parts[0];
      var credentials = parts[1];

      if (/^Bearer$/i.test(scheme)) {
        var token = credentials;
        var newToken = auth.refreshToken(token);
        if (newToken) {
          response.json(util.createAPIResponse({
            data: {
              token: newToken
            }
          }, request.query.fields));
          return;
        } else {
          errorMessage = 'Invalid or expired token';
        }
      } else {
        errorMessage = 'Malformed Authorization header, must be "Bearer (token)"';
      }
    } else {
      errorMessage = 'Malformed Authorization header, must be "Bearer (token)"';
    }
  }

  // Return an error
  response.status(400).json(util.createAPIResponse({ errors: [errorMessage] }));
});

module.exports = router;

/**
 * @module models/api
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

/**
 * API Models
 * @type {object}
 */
module.exports = {
  ApiAuthentication: require('./api_authentication'),
  UserActivity: require('./user_activity'),
  UserLogin: require('./user_login'),
  User: require('./users')
};

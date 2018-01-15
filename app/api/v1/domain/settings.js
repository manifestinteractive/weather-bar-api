/**
 * @module domain/settings
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var _ = require('lodash');
var Promise = require('bluebird');

var User = require('../../../models/api/users');
var UserSettings = require('../../../models/weatherbar/user_settings.js');

var UserES = require('../../../elasticsearch/update/user');

/* istanbul ignore next */
User.hook('afterCreate', function(user){ UserES.update(user.id); });

/* istanbul ignore next */
User.hook('afterUpdate', function(user){ UserES.update(user.id); });

/* istanbul ignore next */
User.hook('afterDestroy', function(user){ UserES.update(user.id); });

/**
 * Domain Settings
 * @type {object}
 */
module.exports = {

  getSettings: function (userId) {
    // Set defaults for API before overwriting below
    return UserSettings.findOne({
      where: {
        user_id: userId
      }
    })
    .then(function(user_settings) {

      var settings = {
        theme: 'pink-orange'
      };

      if (user_settings && user_settings.theme) {
        settings.theme = user_settings.theme;
      }

      return settings;
    });
  }
};

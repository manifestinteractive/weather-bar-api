/**
 * @module domain/settings
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var Settings = require('../../../models/weatherbar/settings.js');

/**
 * Domain Settings
 * @type {object}
 */
module.exports = {
  get: function (uuid) {
    return Settings.findOne({
      where: {
        uuid: uuid
      }
    })
    .then(function(settings) {
      return (settings) ? settings.dataValues : null;
    });
  },
  init: function (uuid) {
    return Settings.create({
      uuid: uuid
    })
    .then(function(created) {
      return (created) ? created.dataValues : null;
    });
  },
  update: function (uuid, key, value) {
    if (uuid && key && value) {
      return Settings.findOne({
          where: {
            uuid: uuid
          }
        })
        .then(function(settings) {
          if (settings) {
            settings.set(key, value);
            settings.save();

            return (settings) ? settings.dataValues : null;
          } else {
            return Promise.reject('No user found with ID ' + uuid);
          }
        });
    } else {
      return Promise.reject('Request Invalid');
    }
  }
};

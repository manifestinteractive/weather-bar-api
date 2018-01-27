/**
 * @module domain/saved_locations
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var SavedLocations = require('../../../models/weatherbar/saved_locations');

/**
 * Domain SavedLocations
 * @type {object}
 */
module.exports = {
  get: function (uuid) {
    return SavedLocations.findOne({
      where: {
        uuid: uuid
      }
    })
    .then(function(saved_locations) {
      return (saved_locations) ? saved_locations.dataValues : null;
    });
  },
  init: function (uuid) {
    return SavedLocations.create({
      uuid: uuid
    })
    .then(function(created) {
      return (created) ? created.dataValues : null;
    });
  },
  update: function (uuid, key, value) {
    if (uuid && key && value) {
      return SavedLocations.findOne({
          where: {
            uuid: uuid
          }
        })
        .then(function(saved_locations) {
          if (saved_locations) {
            saved_locations.set(key, value);
            saved_locations.save();

            return (saved_locations) ? saved_locations.dataValues : null;
          } else {
            return Promise.reject('No user found with ID ' + uuid);
          }
        });
    } else {
      return Promise.reject('Request Invalid');
    }
  }
};

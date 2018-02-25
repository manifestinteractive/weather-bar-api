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
    return SavedLocations.findAll({
      where: {
        uuid: uuid
      },
      order: [
        ['city_name', 'ASC']
      ]
    })
    .then(function(saved_locations) {
      return (saved_locations) ? saved_locations : [];
    });
  },
  save: function (data) {
    if (data && typeof data.uuid !== 'undefined' &&typeof data.hash_key !== 'undefined' && typeof data.city_name !== 'undefined' && typeof data.owm_city_id !== 'undefined' && typeof data.latitude !== 'undefined' && typeof data.longitude !== 'undefined') {
      return SavedLocations.findOne({
          where: {
            uuid: data.uuid,
            hash_key: data.hash_key
          }
        })
        .then(function(saved_locations) {
          if (saved_locations) {
            saved_locations.set('city_name', data.city_name);
            saved_locations.set('region', data.region);
            saved_locations.set('country', data.country);
            saved_locations.set('owm_city_id', data.owm_city_id);
            saved_locations.set('latitude', data.latitude);
            saved_locations.set('longitude', data.longitude);
            saved_locations.set('time_zone', data.time_zone);
            saved_locations.save();

            return (saved_locations) ? saved_locations.dataValues : null;
          } else {
            return SavedLocations.create({
              uuid: data.uuid,
              hash_key: data.hash_key,
              city_name: data.city_name,
              region: data.region,
              country: data.country,
              owm_city_id: data.owm_city_id,
              time_zone: data.time_zone,
              latitude: data.latitude,
              longitude: data.longitude
            })
            .then(function(created) {
              return (created) ? created.dataValues : null;
            });
          }
        });
    } else {
      return Promise.reject('Request Invalid');
    }
  },
  delete: function (uuid, hash_key) {
    if (typeof uuid !== 'undefined' && typeof hash_key !== 'undefined') {
      return SavedLocations.destroy({
          where: {
            uuid: uuid,
            hash_key: hash_key
          }
        })
        .then(function(deleted) {
          return (deleted) ? deleted.dataValues : null;
        });
    } else {
      return Promise.reject('Request Invalid');
    }
  },
  makePrimary: function (uuid, hash_key) {
    if (typeof uuid !== 'undefined' && typeof hash_key !== 'undefined') {
      SavedLocations.update({ primary: false }, { where: { uuid: uuid }});
      return SavedLocations.update({ primary: true }, { where: { uuid: uuid, hash_key: hash_key }});
    } else {
      return Promise.reject('Request Invalid');
    }
  }
};

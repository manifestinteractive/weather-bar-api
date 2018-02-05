/**
 * @module models/weatherbar/saved_locations
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var DataTypes = require('sequelize');
var db = require('../../config/sequelize');

/**
 * SavedLocations Schema
 * @type {Object}
 * @property {Number} id - Unique ID
 * @property {Number} uuid - Unique ID of User
 * @property {Boolean} primary - City is User's Primary City
 * @property {String} city_name - City Name use in Display
 * @property {Number} [owm_city_id] - Open Weather Map City ID
 * @property {Number} [latitude] - GPS Latitude ( required if no owm_city_id )
 * @property {Number} [longitude] - GPS Longitude ( required if no owm_city_id )
 */
var SavedLocations = db.dbApi.define('saved_locations', {
  id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  uuid: {
    type: DataTypes.STRING(36),
    allowNull: false
  },
  hash_key: {
    type: DataTypes.STRING(37),
    allowNull: false
  },
  primary : {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  city_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  region: {
    type: DataTypes.STRING,
    allowNull: false
  },
  country: {
    type: DataTypes.STRING(2),
    allowNull: false
  },
  owm_city_id: {
    type: DataTypes.INTEGER(11).UNSIGNED,
    allowNull: true
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 6),
    allowNull: true
  },
  longitude: {
    type: DataTypes.DECIMAL(10, 6),
    allowNull: true
  },
  time_zone: {
    type: DataTypes.STRING,
    allowNull: true
  },
}, {
  indexes: [
    {
      fields: ['uuid', 'hash_key'],
      unique: true
    },
    {
      fields: ['uuid']
    },
    {
      fields: ['primary']
    },
    {
      fields: ['owm_city_id']
    },
    {
      fields: ['time_zone']
    }
  ]
});

module.exports = SavedLocations;

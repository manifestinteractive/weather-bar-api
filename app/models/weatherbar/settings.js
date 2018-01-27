/**
 * @module models/weatherbar/settings
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var DataTypes = require('sequelize');
var db = require('../../config/sequelize');

/**
 * Settings Schema
 * @type {object}
 * @property {number} id - Unique ID
 * @property {number} uuid - Unique ID of User
 */
var Settings = db.dbApi.define('settings', {
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
  current_city: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  current_country: {
    type: DataTypes.STRING(2),
    allowNull: true
  },
  current_ip_address: {
    type: DataTypes.STRING(15),
    allowNull: true
  },
  current_latitude: {
    type: DataTypes.DECIMAL(10, 6),
    allowNull: true
  },
  current_longitude: {
    type: DataTypes.DECIMAL(10, 6),
    allowNull: true
  },
  current_postalcode: {
    type: DataTypes.STRING(15),
    allowNull: true
  },
  current_region: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  current_time_zone: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  app_language: {
    type: DataTypes.STRING(2),
    allowNull: false,
    defaultValue: 'en'
  },
  app_always_on_top: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  app_launch_at_startup: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  app_launch_icon: {
    type: DataTypes.ENUM('condition','temperature','both'),
    allowNull: false,
    defaultValue: 'both'
  },
  layout_current_temp: {
    type: DataTypes.ENUM('actual','feels-like'),
    allowNull: false,
    defaultValue: 'actual'
  },
  layout_weather_map: {
    type: DataTypes.ENUM('standard','satellite','hybrid','black'),
    allowNull: false,
    defaultValue: 'standard'
  },
  units_temperature: {
    type: DataTypes.ENUM('fahrenheit','celcius'),
    allowNull: false,
    defaultValue: 'fahrenheit'
  },
  units_time: {
    type: DataTypes.ENUM('12-hour','24-hour'),
    allowNull: false,
    defaultValue: '12-hour'
  },
  units_accumulation: {
    type: DataTypes.ENUM('inches','millimeters'),
    allowNull: false,
    defaultValue: 'inches'
  },
  units_wind_speed: {
    type: DataTypes.ENUM('mph','kms', 'knots'),
    allowNull: false,
    defaultValue: 'mph'
  },
  units_pressure: {
    type: DataTypes.ENUM('inhb','mb'),
    allowNull: false,
    defaultValue: 'inhb'
  }
}, {
  indexes: [
    {
      fields: ['uuid'],
      unique: true
    },
    {
      fields: ['current_ip_address']
    },
    {
      fields: ['app_language']
    },
    {
      fields: ['app_always_on_top']
    },
    {
      fields: ['app_launch_at_startup']
    },
    {
      fields: ['app_launch_icon']
    },
    {
      fields: ['layout_current_temp']
    },
    {
      fields: ['layout_weather_map']
    },
    {
      fields: ['units_temperature']
    },
    {
      fields: ['units_time']
    },
    {
      fields: ['units_accumulation']
    },
    {
      fields: ['units_wind_speed']
    },
    {
      fields: ['units_pressure']
    }
  ]
});

module.exports = Settings;

/**
 * @module models/weatherbar/owm_city_list
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var DataTypes = require('sequelize');
var db = require('../../config/sequelize');

/**
 * OwmCityList Schema
 * @type {object}
 */
var OwmCityList = db.dbApi.define('owm_city_list', {
  id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  owm_city_id: {
    type: DataTypes.INTEGER(11).UNSIGNED,
    allowNull: false
  },
  owm_city_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  owm_latitude: {
    type: DataTypes.DECIMAL(10, 6),
    allowNull: true
  },
  owm_longitude: {
    type: DataTypes.DECIMAL(10, 6),
    allowNull: true
  },
  owm_country: {
    type: DataTypes.STRING(2),
    allowNull: true
  },
  locality_short: {
    type: DataTypes.STRING,
    allowNull: true
  },
  locality_long: {
    type: DataTypes.STRING,
    allowNull: true
  },
  admin_level_1_short: {
    type: DataTypes.STRING,
    allowNull: true
  },
  admin_level_1_long: {
    type: DataTypes.STRING,
    allowNull: true
  },
  admin_level_2_short: {
    type: DataTypes.STRING,
    allowNull: true
  },
  admin_level_2_long: {
    type: DataTypes.STRING,
    allowNull: true
  },
  admin_level_3_short: {
    type: DataTypes.STRING,
    allowNull: true
  },
  admin_level_3_long: {
    type: DataTypes.STRING,
    allowNull: true
  },
  admin_level_4_short: {
    type: DataTypes.STRING,
    allowNull: true
  },
  admin_level_4_long: {
    type: DataTypes.STRING,
    allowNull: true
  },
  admin_level_5_short: {
    type: DataTypes.STRING,
    allowNull: true
  },
  admin_level_5_long: {
    type: DataTypes.STRING,
    allowNull: true
  },
  country_short: {
    type: DataTypes.STRING(2),
    allowNull: true
  },
  country_long: {
    type: DataTypes.STRING,
    allowNull: true
  },
  postal_code: {
    type: DataTypes.STRING(25),
    allowNull: true
  },

}, {
  indexes: [
    {
      fields: ['owm_city_id'],
      unique: true
    },
    {
      fields: ['owm_country']
    },
    {
      fields: ['locality_short']
    },
    {
      fields: ['locality_long']
    },
    {
      fields: ['admin_level_1_short']
    },
    {
      fields: ['admin_level_1_long']
    },
    {
      fields: ['admin_level_2_short']
    },
    {
      fields: ['admin_level_2_long']
    },
    {
      fields: ['country_short']
    },
    {
      fields: ['country_long']
    },
    {
      fields: ['postal_code']
    }
  ]
});

module.exports = OwmCityList;

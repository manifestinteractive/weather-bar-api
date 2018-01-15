/**
 * @module models/weatherbar/user_settings
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var DataTypes = require('sequelize');
var db = require('../../config/sequelize');

var User = require('../api/users');

/**
 * UserSettings Schema
 * @type {object}
 * @property {number} id - Unique ID
 * @property {number} user_id - Unique ID of User
 */
var UserSettings = db.dbApi.define('user_settings', {
  id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER(10).UNSIGNED,
    allowNull: false
  },
  theme: {
    type: DataTypes.STRING,
    allowNull: false,
    default: 'pink-orange'
  }
}, {
  indexes: [
    {
      fields: ['user_id']
    }
  ]
});

UserSettings.belongsTo(User, {
  foreignKey: 'user_id',
  targetKey: 'id',
  foreignKeyConstraint: true
});

module.exports = UserSettings;

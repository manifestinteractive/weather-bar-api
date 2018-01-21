/**
 * @module elasticsearch/update
 * @version 1.1.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var User = require('./user');
var OwmCityList = require('./owm_city_list');

User.update();
OwmCityList.update();

/**
 * Update
 * @type {object}
 */
module.exports = {
  User: User,
  OwmCityList: OwmCityList
};

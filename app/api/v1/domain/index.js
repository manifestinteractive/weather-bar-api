/**
 * @module domain
 * @version 1.0.0
 */

/**
 * Domain
 * @type {object}
 */
module.exports = {
  Geolocation: require('./geolocation'),
  OwmCityList: require('./owm_city_list'),
  SavedLocations: require('./saved_locations'),
  Settings: require('./settings'),
  User: require('./user'),
  Util: require('./util')
};

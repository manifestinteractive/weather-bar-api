/**
 * @module elasticsearch/delete/owm_city_list
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var config = require('../../config');
var client = require('./../client');
var debug = require('../../debug');

var env = config.get('env');
var indexType = env + '_owm_city_list';
var indexName = config.get('elasticsearch.indexName') + '_' + indexType;

/**
 * Delete OwmCityList Index
 * @type {object}
 */
var OwmCityList = client.indices.delete({
  index: indexName
})
.then(function() {
  debug.success('Index Deleted: ' + indexName);
})
.catch(function(error) {
  debug.error(error.status + ' ' + error.message);
});

module.exports = OwmCityList;

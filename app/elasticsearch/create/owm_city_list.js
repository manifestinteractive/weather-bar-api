/**
 * @module elasticsearch/create/owm_city_list
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var Promise = require('bluebird');
var config = require('../../config');
var client = require('../client');
var debug = require('../../debug');

var env = config.get('env');
var indexType = env + '_owm_city_list';
var indexName = config.get('elasticsearch.indexName') + '_' + indexType;

/**
 * OWM City List Mapping
 * @type {{index: string, type: string, body: {}}}
 */
var mapping = {
  index: indexName,
  type: indexType,
  body: {}
};

/**
* OWM City List Mapping Body
 * @type {Object}
 */
mapping.body[indexType] = {
  properties: {
    owm_city_id: {
      type: 'string'
    },
    owm_latitude: {
      type: 'float',
      index: 'no'
    },
    owm_longitude: {
      type: 'float',
      index: 'no'
    },
    owm_country: {
      type: 'string'
    },
    locality_short: {
      type: 'string'
    },
    locality_long: {
      type: 'string'
    },
    admin_level_1_short: {
      type: 'string'
    },
    admin_level_1_long: {
      type: 'string'
    },
    admin_level_2_short: {
      type: 'string'
    },
    admin_level_2_long: {
      type: 'string'
    },
    country_short: {
      type: 'string'
    },
    country_long: {
      type: 'string'
    },
    postal_code: {
      type: 'string'
    },
    display_name_long: {
      type: 'string'
    },
    display_name_short: {
      type: 'string'
    },
    location: {
      type: 'geo_point'
    }
  }
};

/**
 * Create OwmCityList Index
 * @type {object}
 */
var OwmCityList = client.indices.exists({
  index: indexName
}).then(function(exists) {
  if ( !exists) {
    return client.indices.create({
      index: indexName,
      ignore: [404]
    });
  } else {
    return Promise.resolve();
  }
})
.then(function() {
  client.indices.putMapping(mapping)
    .then(function() {
      debug.success('Index Created: ' + indexName);
    })
    .catch(function(error) {
      debug.error('Error applying ' + indexType + ' mapping');
      debug.error(error.status + ' ' + error.message);
    });
})
.catch(function(error) {
  debug.error('There was an error creating the ' + indexType + ' index');
  debug.error(error.status + ' ' + error.message);
});

module.exports = OwmCityList;

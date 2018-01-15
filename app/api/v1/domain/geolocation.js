/**
 * @module domain/geolocation
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var _ = require('lodash');
var validator = require('validator');
var util = require('./util');
var config = require('../../../config');
var elasticsearchClient = require('../../../elasticsearch/client');
var mmdbreader = require('maxmind-db-reader');
var Promise = require('bluebird');

var env = config.get('env');
var indexType = env + '_geolocation';
var indexName = config.get('elasticsearch.indexName') + '_' + indexType;

var DEFAULT_PAGE_SIZE = 30;

/**
 * Geolocation
 * @type {object}
 */
module.exports = {
  /**
   * Prepare For API Output
   * @param {object} data - Data to be processed for API Output
   * @return {object}
   */
  prepareForAPIOutput: function(data) {
    var fields = [
      'alternate_city_names',
      'area_codes',
      'city',
      'county',
      'estimated_population',
      'location',
      'state',
      'timezone',
      'zipcode'
    ];

    return _.pick(data._source, fields);
  },

  /**
   * Prepare For Elastic Search
   * @param {object} data - Data to be Processed for Elastic Search
   * @param {object} data.id - Tag ID
   * @param {object} data.name - Tag Name
   * @param {object} data.slug - Tag Slug
   * @return {object}
   */
  prepareForElasticSearch: function(data) {
    return {
      alternate_city_names: (data.acceptable_cities && data.acceptable_cities.length > 0) ? data.acceptable_cities.split(', ') : [],
      area_codes: (data.area_codes && data.area_codes.length > 0) ? data.area_codes.split(',') : [],
      city: data.primary_city,
      county: data.county,
      estimated_population: data.estimated_population,
      id: data.id,
      latitude: parseFloat(data.latitude),
      location: {
        lat: parseFloat(data.latitude),
        lon: parseFloat(data.longitude)
      },
      longitude: parseFloat(data.longitude),
      state: data.state,
      timezone: data.timezone,
      zipcode: data.zipcode
    };
  },

  /**
   * Get IP Address
   * @param {string} ip - IP Address to Lookup
   * @param {string} source - Data Source [ 'cities', 'countries' ]
   * @returns {*}
   */
  getIpAddress: function (ip, source) {
    var possibleSources = ['cities', 'countries'];

    return new Promise(function (resolve, reject) {
      if (possibleSources.indexOf(source) !== -1) {
        mmdbreader.open('./app/flat-db/' + source + '.mmdb',function(err, cities) {
          cities.getGeoData(ip, function(err, geodata) {
            if (err) {
              reject(err);
            } else {
              resolve(geodata);
            }
          });
        });
      } else {
        reject('Invalid Source');
      }
    });
  }
};

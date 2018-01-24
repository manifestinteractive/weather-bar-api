/**
 * @module domain/owm_city_list
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

 var _ = require('lodash');
 var validator = require('validator');
 var util = require('./util');
 var config = require('../../../config');
 var elasticsearchClient = require('../../../elasticsearch/client');

 var env = config.get('env');
 var indexType = env + '_owm_city_list';
 var indexName = config.get('elasticsearch.indexName') + '_' + indexType;

var DEFAULT_PAGE_SIZE = 30;

/**
 * Domain OwmCityList
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
      'owm_city_id',
      'display_name_short',
      'location'
    ];

    return _.pick(data._source, fields);
  },

  /**
   * Prepare For Elastic Search
   * @return {object}
   */
  prepareForElasticSearch: function(data) {
    var displayNameShort = (data.locality_long && data.owm_city_name !== data.locality_long)
      ? data.locality_short + ' ( ' + data.owm_city_name + ' ), ' + data.admin_level_1_short + ', ' + data.country_short
      : data.owm_city_name + ', ' + data.admin_level_1_short + ', ' + data.country_short;

    var displayNameLong = (data.locality_long && data.owm_city_name !== data.locality_long)
      ? data.locality_long + ' ( ' + data.owm_city_name + ' ), ' + data.admin_level_1_long + ', ' + data.country_long
      : data.owm_city_name + ', ' + data.admin_level_1_long + ', ' + data.country_long;

    return {
      owm_city_id: data.owm_city_id,
      owm_latitude: parseFloat(data.owm_latitude),
      owm_longitude: parseFloat(data.owm_longitude),
      owm_country: data.owm_country,
      locality_short: data.locality_short,
      locality_long: data.locality_long,
      admin_level_1_short: data.admin_level_1_short,
      admin_level_1_long: data.admin_level_1_long,
      admin_level_2_short: data.admin_level_2_short,
      admin_level_2_long: data.admin_level_2_long,
      country_short: data.country_short,
      country_long: data.country_long,
      postal_code: data.postal_code,
      display_name_long: displayNameLong,
      display_name_short: displayNameShort,
      location: {
        lat: parseFloat(data.owm_latitude),
        lon: parseFloat(data.owm_longitude)
      }
    };
  },

  /**
   * Search Senate
   * @param {object} query - GET Parameters
   * @returns {*}
   */
  search: function (query) {
    // Defaults
    var andFilters;
    var pageSize = DEFAULT_PAGE_SIZE;
    var page = 1;
    var self = this;
    var searchParams = {
      index: indexName,
      type: indexType,
      body: {}
    };

    function getAndFilters() {
      if (!_.get(searchParams, 'body.query.bool.must')) {
        _.set(searchParams, 'body.query.bool.must', []);
      }

      return _.get(searchParams, 'body.query.bool.must');
    }

    // Page size
    if (query.pageSize && validator.isInt(query.pageSize) && validator.toInt(query.pageSize, 10) >= 1) {
      pageSize = validator.toInt(query.pageSize, 10);
    }

    searchParams.size = pageSize;

    // Determine Page
    if (query.page && validator.isInt(query.page) && validator.toInt(query.page, 10) >= 1) {
      page = validator.toInt(query.page, 10);
    }

    searchParams.from = (page - 1) * searchParams.size;

    // Sorting
    var sort = (query.sort) ? query.sort.split(',') : ['display_name_short'];
    var order = (query.order) ? query.order.toLowerCase().split(',') : ['asc'];

    searchParams.body.sort = {};

    for (var i = 0; i < sort.length; i++) {
      var sortOrder = (typeof order[i] !== 'undefined' && ( order[i] === 'asc' || order[i] === 'desc' )) ? order[i] : 'asc';
      searchParams.body.sort[sort[i]] = {
        order: sortOrder
      };
    }

    /**
     * Filter By Keyword
     */
    if (query.keyword) {
      andFilters = getAndFilters();

      var keywords = query.keyword.replace(/[^0-9a-z' ]/gi, '').split(' ');

      for (var i = 0; i < keywords.length; i++) {
        andFilters.push({
          multi_match: {
            query: '*' + keywords[i] + '*',
            type: 'best_fields',
            fields: [
              'admin_level_1_long',
              'admin_level_1_short',
              'admin_level_2_long',
              'admin_level_2_short',
              'owm_city_id',
              'locality_short',
              'locality_long',
              'postal_code',
              'display_name_long',
              'display_name_short'
            ]
          }
        });
      }
    }

    return elasticsearchClient.search(searchParams).then(function(result) {
      var data = result.hits.hits.map(self.prepareForAPIOutput);
      return {
        meta: {
          total: result.hits.total,
          showing: result.hits.hits.length,
          pages: Math.ceil(result.hits.total / searchParams.size),
          page: page
        },
        data: data
      };
    })
    .catch(function(error) {
      return util.createAPIResponse({
        errors: [error]
      });
    });
  }
};

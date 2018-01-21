/**
 * @module routes/owm_city_list
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var express = require('express');
var config = require('../../../config');
var util = require('./util');

var router = express.Router(config.router);
var OwmCityListDomain = require('../domain/owm_city_list');

/**
 * OwmCityList
 * @memberof module:routes/owm_city_list
 */

/* istanbul ignore next */
router.route('/owm_city_list').get(function(request, response) {
  OwmCityListDomain.search(request.query)
    .then(function(results){
      response.json(util.createAPIResponse(results, request.query.fields));
    });
});

module.exports = router;

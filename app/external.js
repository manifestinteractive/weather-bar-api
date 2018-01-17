/**
 * @module external
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var path = require('path');
var fs = require('fs');
var md5 = require('md5');
var request = require('request');
var Promise = require('bluebird');
var moment = require('moment');

var config = require('./config');

var redisClient = require('./redis');
var redisCacheExpires = config.get('redis.cacheExpire');

/* istanbul ignore next */
module.exports = {
  /**
   * Get External Content
   * @param {string} url - URL of Content to Fetch
   * @returns {bluebird|exports|module.exports}
   */
  getContent: function(url) {
    var cacheKey = md5(url);

    return new Promise(function (resolve, reject) {
      redisClient.get(cacheKey, function (err, result) {
        if (!err && result) {
          var json = JSON.parse(result);

          remaining = moment(json.wbcache.expires).diff(moment(), 'seconds')

          json.wbcache.cached = true;
          json.wbcache.remaining = remaining;

          resolve(JSON.stringify(json));
        } else {
          var lib = url.startsWith('https') ? require('https') : require('http');
          var request = lib.get(url, function (response) {
            if (response.statusCode < 200 || response.statusCode > 299) {
              reject(new Error('Failed to load page, status code: ' + response.statusCode));
              return;
            }

            var body = [];

            response.on('data', function (chunk) { body.push(chunk); });
            response.on('end', function () {
              var content = body.join('');
              var wbcache = {
                cached: false,
                created: moment().format('YYYY-MM-DD HH:mm:ss Z'),
                expires: moment().add(redisCacheExpires, 'Seconds').format('YYYY-MM-DD HH:mm:ss Z'),
                remaining: redisCacheExpires
              };

              if (typeof content === 'object') {
                content.wbcache = wbcache
                content = JSON.stringify(content);
              } else {
                var json = JSON.parse(content);
                json.wbcache = wbcache
                content = JSON.stringify(json);
              }

              if (!err) {
                redisClient.setex(cacheKey, redisCacheExpires, content);
              }

              resolve(content);
            });
          });

          request.on('error', function (err) { reject(err); });
        }
      });
    });
  }
};

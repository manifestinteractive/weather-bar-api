/**
 * @module domain/user
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var _ = require('lodash');
var User = require('../../../models/api/users');
var md5 = require('md5');
var randomString = require('randomstring');
var hasher = require('../../../util/hasher');
var routeUtil = require('../routes/util');
var Hashids = require('hashids');
var config = require('../../../config');

/**
 * Domain User
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
      'bio',
      'company_name',
      'email',
      'first_name',
      'hash_id',
      'join_date',
      'last_name',
      'location',
      'profile_link_1',
      'profile_link_2',
      'profile_link_3',
      'profile_link_twitter',
      'profile_link_website',
      'profile_name',
      'profile_photo',
      'username'
    ];

    return _.pick(data._source, fields);
  },

  /**
   * Prepare For Elastic Search
   * @param {object} data - Data to be Processed for Elastic Search
   * @param {number} data.id - User ID
   * @param {string} data.bio - User Bio
   * @param {string} data.company_name - User Company Name
   * @param {string} data.email - User Email Address
   * @param {string} data.first_name - User First Name
   * @param {string} data.hash_id - User Hash ID
   * @param {timestamp} data.join_date - User Join Date
   * @param {string} data.last_name - User Last Name
   * @param {string} data.location - User Location
   * @param {string} data.profile_link_1 - User Misc Link #1
   * @param {string} data.profile_link_2 - User Misc Link #2
   * @param {string} data.profile_link_3 - User Misc Link #3
   * @param {string} data.profile_link_twitter - User Twitter Link
   * @param {string} data.profile_link_website - User Website Link
   * @param {string} data.profile_name - User Profile Name
   * @param {string} data.profile_photo - User Profile Photo URL
   * @param {string} data.username - Users Username
   * @return {object}
   */
  prepareForElasticSearch: function(data) {
    return {
      id: data.id,
      bio: data.bio,
      company_name: data.company_name,
      email: data.email,
      first_name: data.first_name,
      hash_id: data.hash_id,
      join_date: data.join_date,
      last_name: data.last_name,
      location: data.location,
      profile_link_1: data.profile_link_1,
      profile_link_2: data.profile_link_2,
      profile_link_3: data.profile_link_3,
      profile_link_twitter: data.profile_link_twitter,
      profile_link_website: data.profile_link_website,
      profile_name: data.profile_name,
      profile_photo: data.profile_photo,
      username: data.username
    };
  }
};

/**
 * @module domain/user
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var _ = require('lodash');

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

/**
 * @module domain/util/registration
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

var _ = require('lodash');
var Promise = require('bluebird');
var randomString = require('randomstring');
var hasher = require('../../../../util/hasher');
var User = require('../../../../models/api/users');
var config = require('../../../../config');
var RegistrationForm = require('./registration_form');
var auth = require('./auth');
var Hashids = require('hashids');

var hashID = new Hashids(config.get('hashID.secret'), config.get('hashID.length'), config.get('hashID.alphabet'));

/**
 * Registration
 * @type {object}
 */
module.exports = {

  /**
   * Confirmation Key Length
   * @constant {number}
   */
  CONFIRMATION_KEY_LENGTH: 12,

  /**
   * Extensive List of Usernames that cannot be used
   * @constant {array}
   */
  INVALID_NAMES: [
    'weatherbar', 'weatherbarapp'
  ],

  /**
   * Check if Username is acceptable
   * @param name
   * @returns {boolean}
   */
  validUserName: function(name){
    var validPattern = /^[a-zA-Z0-9-_]{3,30}$/;
    if(typeof name === 'string') {
      name = name.toLowerCase().trim();
      return validPattern.test(name) && (this.INVALID_NAMES.indexOf(name) === -1);
    }
  },

  /**
   * Check if Name is acceptable
   * @param name
   * @returns {boolean}
   */
  validName: function(name){
    if(typeof name === 'string') {
      name = name.toLowerCase().trim();
      return (this.INVALID_NAMES.indexOf(name) === -1);
    }
  },

  /**
   * Validate passed in user data and, if valid, create the user. Returns
   * a promise object that should spit out the created user data.
   * @param  {object} data Object of user registration data
   * @return {object} Promise
   */
  register: function(data) {
    var self = this;
    var form = new RegistrationForm();

    return form
      .validate(data)
      .then(function(cleanedData) {
        return self.createUser(cleanedData);
      });
  },

  /**
   * Register a guest in the database, encoding
   * @param  {object} data Object of validated and cleaned user data to insert into the database
   * @return {object} Promise object
   */
  registerGuest: function(data) {

    var self = this;
    var insert = _.clone(data);

    // Set Display name to Username if not defined
    insert.profile_name = 'Guest';
    insert.first_name = 'Guest';
    insert.last_name = 'Guest';
    insert.agree = true;
    insert.guest = true;

    if (typeof insert.guest_id !== 'string') {
      insert.guest_id = randomString.generate(32);
    }

    // Store username as lowercase
    insert.username = 'guest_' + randomString.generate(self.CONFIRMATION_KEY_LENGTH).toLowerCase();

    // Create Fake Email
    insert.email = insert.username + '@weatherbarapp.com';

    return hasher
      .generate(insert.guest_id)
      .then(function(encodedPassword) {
        insert.activated = true;
        insert.password = encodedPassword;
        insert.guest_password = encodedPassword;

        return User
          .create(insert)
          .then(function(created) {
            if (created) {
              if (typeof created.id !== 'undefined') {
                return Promise.resolve(created);
              }
            }  else {
              return Promise.reject('Unable to Create User');
            }
          });
      });
  },

  /**
   * Create a user in the database, encoding
   * @param  {object} data Object of validated and cleaned user data to insert into the database
   * @return {object} Promise object
   */
  createUser: function(data) {

    var self = this;
    var insert = _.clone(data);

    if(self.validUserName(insert.username) === false) {
      return Promise.reject({ username: ['Unacceptable Username'] });
    } else if(self.validName(insert.first_name) === false) {
      return Promise.reject({ first_name: ['Unacceptable First Name'] });
    } else if(self.validName(insert.last_name) === false) {
      return Promise.reject({ last_name: ['Unacceptable Last Name'] });
    } else if(!insert.agree || insert.agree === 'false') {
      return Promise.reject({ agree: ['Must Accept Terms of Use'] });
    }

    // Set Display name to Username if not defined
    if( !insert.profile_name){
      insert.profile_name = insert.username;
    }

    // Store username as lowercase
    insert.username = insert.username.toLowerCase();

    return hasher
      .generate(insert.password)
      .then(function(encodedPassword) {
        insert.activated = false;
        insert.password = encodedPassword;

        if (insert.email) {
          insert.new_email_key = randomString.generate(self.CONFIRMATION_KEY_LENGTH);
        }

        return User
          .create(insert)
          .then(function(created) {
            if (created) {
              if (typeof created.id !== 'undefined') {
                return Promise.resolve(created);
              }
            }  else {
              return Promise.reject('Unable to Create User');
            }
          });
      });
  },

  /**
   * Activate account matching passed in new_email_key value
   * @param  {string} key Activation key to find a match for
   * @return {object} Returns promise that passes the user if found
   */
  confirmAccount: function(key) {
    if (key && key.length === this.CONFIRMATION_KEY_LENGTH) {
      return User.findOne({
        where: {
          new_email_key: key
        }
      })
      .then(function(user) {
        if (user) {
          var currentTimeMinusOneWeek = new Date()-(7*24*60*60*1000);
          var requestedDate = new Date(user.new_email_requested).getTime();

          if(requestedDate > currentTimeMinusOneWeek){

            user.set('activated', true);
            user.set('new_email', null);
            user.set('new_email_key', null);
            user.set('new_email_requested', null);
            user.set('new_password_requested', null);

            user.save();

            return Promise.resolve(user);

          } else {

            user.set('activated', false);
            user.set('new_email', null);
            user.set('new_email_key', null);
            user.save();

            return Promise.reject('Activation Key Expired');
          }

        } else {
          return Promise.reject('Activation Key not found');
        }
      });
    } else {
      return Promise.reject('Invalid Key');
    }
  },

  /**
   * Activate account matching passed in new_email_key value
   * @param {string} key Activation key to find a match for
   * @return {object} Returns promise that passes the user if found
   */
  confirmEmail: function(key) {
    if (key && key.length === this.CONFIRMATION_KEY_LENGTH) {
      return User.findOne({
        where: {
          new_email_key: key
        }
      })
      .then(function(user) {
        if (user) {

          var email = user.new_email;
          var currentTimeMinusOneWeek = new Date()-(7*24*60*60*1000);
          var requestedDate = new Date(user.new_email_requested).getTime();

          user.set('new_email', null);
          user.set('new_email_key', null);
          user.set('new_email_requested', null);

          if(requestedDate > currentTimeMinusOneWeek){

            user.set('email', email);
            return user.save();

          } else {

            user.save();
            return Promise.reject('Email Confirmation Key Expired');
          }

        } else {
          return Promise.reject('Confirmation Key not found');
        }
      });
    } else {
      return Promise.reject('Invalid Key');
    }
  },

  /**
   * Activate account matching passed in new_email_key value
   * @param  {string} key Activation key to find a match for
   * @return {object} Returns promise that passes the user if found
   */
  confirmPassword: function(key) {
    if (key && key.length === this.CONFIRMATION_KEY_LENGTH) {
      return User.findOne({
        where: {
          new_password_key: key
        }
      })
      .then(function(user) {
        if (user) {

          var password = user.new_password;
          var currentTimeMinusOneWeek = new Date()-(7*24*60*60*1000);
          var requestedDate = new Date(user.new_password_requested).getTime();

          user.set('new_password', null);
          user.set('new_password_key', null);
          user.set('new_password_requested', null);

          if(requestedDate > currentTimeMinusOneWeek){


            user.set('password', password);
            return user.save();

          } else {

            user.save();
            return Promise.reject('Password Confirmation Key Expired');
          }

        } else {
          return Promise.reject('Confirmation Key not found');
          }
        });
    } else {
      return Promise.reject('Invalid Key');
    }
  },

  /**
   * User Password Recover
   * @param {object} data to find a match for and sets `new_password_key` & `new_password_requested`
   * @return {object} Returns promise that passes the user if found
   */
  forgotPassword: function(data) {
    var self = this;
    if (data && data.email) {
      return User
        .findOne({
          where: {
            email: data.email
          }
        })
        .then(function(user) {
          if (user) {
            var generatedKey = randomString.generate(self.CONFIRMATION_KEY_LENGTH);
            user.set('new_password_key', generatedKey);
            user.set('new_password_requested', Date.now());
            return user.save();
          } else {
            return Promise.reject('No Matching Email Found');
          }
        });
    } else {
      return Promise.reject('Forgot Password Request Invalid');
    }
  },

  /**
   * Reset Password if token is valid and not older than 24 hours, and passwords match
   * @param  {object} data to find a match for and sets `token` & `password` & `retype_password`
   * @return {object} Returns promise that passes the user if found
   */
  resetPassword: function(data) {
    var self = this;

    if (data && data.password && data.retype_password && data.token && data.token.length === self.CONFIRMATION_KEY_LENGTH) {

      if(data.password !== data.retype_password){
        return Promise.reject('Passwords do not match');
      }

      var currentTimeMinusOneWeek = new Date()-(7*24*60*60*1000);

      return User
        .findOne({
          where: {
            new_password_key: data.token,
            new_password_requested: {
              gt: currentTimeMinusOneWeek
            }
          }
        })
        .then(function(user) {
          if (user) {
            return hasher
              .generate(data.password)
              .then(function(encodedPassword) {
                user.set('password', encodedPassword);
                user.set('new_password_key', null);
                user.set('new_password_requested', null);
                return user.save();
              });
          } else {
            return Promise.reject('Request Invalid or Expired');
          }
        });
    } else {
      return Promise.reject('Request Invalid');
    }
  },

  /**
   * Reset Password if token is valid and not older than 24 hours, and passwords match
   * @param  {object} id to find a match for and sets `token` & `password` & `retype_password`
   * @return {object} Returns promise that passes the user if found
   */
  resendConfirmation: function(id) {

    id = parseInt(hashID.decode(id, 10));

    if(id > 0) {

      var self = this;

      return User
        .findOne({
          where: {
            id: id,
            activated: false
          }
        })
        .then(function(user) {
          if (user) {

            user.set('new_password_requested', null);
            user.set('new_email_requested', Date.now());
            user.set('new_email_key', randomString.generate(self.CONFIRMATION_KEY_LENGTH));
            user.save();

            return Promise.resolve('Confirmation Email Resent');
          } else {
            return Promise.reject('Reset Password Token Invalid of Expired');
          }
        });
    } else {
      return Promise.reject('Invalid Request');
    }
  }
};

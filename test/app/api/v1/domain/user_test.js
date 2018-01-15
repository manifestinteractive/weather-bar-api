var assert = require('chai').assert;
var sinon = require('sinon');
var Hashids = require('hashids');
var randomString = require('randomstring');

var User = require('../../../../../app/models/api/users');
var userDomain = require('../../../../../app/api/v1/domain/user');

var config = require('../../../../../app/config');
var hashid = new Hashids(config.get('hashID.secret'), config.get('hashID.length'), config.get('hashID.alphabet'));

var userAccount = {
  id: 1,
  activated: true,
  banned: false,
  banned_reason: '',
  bio: 'I exist only in memory.',
  company_name: 'My Company',
  created_at: new Date(),
  email: 'jane.doe@email.com',
  first_name: 'Jane',
  hash_id: 'abc123',
  join_date: new Date(),
  last_name: 'Doe',
  location: 'Florida, USA',
  modified_at: new Date(),
  new_email: 'new@email.com',
  new_email_key: '',
  new_email_requested: new Date(),
  new_password: 'abc123',
  new_password_requested: new Date(),
  password: 'password',
  profile_link_1: 'https://website1.com',
  profile_link_2: 'https://website2.com',
  profile_link_3: 'https://website3.com',
  profile_link_twitter: 'https://twitter.com/handler',
  profile_link_website: 'http://mywebsite.com',
  profile_name: 'Awesome Sauce',
  profile_photo: 'http://www.mywebsite.com/img/avatar.jpg',
  username: 'JaneDoe'
};

describe('Domain User', function() {
  beforeEach(function() {
    this.sandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    this.sandbox.restore();
  });

  it('should be defined', function() {
    assert.isDefined(userDomain);
    assert.isDefined(userDomain.prepareForAPIOutput);
    assert.isDefined(userDomain.prepareForElasticSearch);
  });

  describe('prepareForAPIOutput', function() {
    it('prepareForAPIOutput should return correct data', function() {
      var output = userDomain.prepareForAPIOutput({ _source: userAccount });

      assert.isDefined(output.bio);
      assert.isDefined(output.company_name);
      assert.isDefined(output.email);
      assert.isDefined(output.first_name);
      assert.isDefined(output.hash_id);
      assert.isDefined(output.join_date);
      assert.isDefined(output.last_name);
      assert.isDefined(output.location);
      assert.isDefined(output.profile_link_1);
      assert.isDefined(output.profile_link_2);
      assert.isDefined(output.profile_link_3);
      assert.isDefined(output.profile_link_twitter);
      assert.isDefined(output.profile_link_website);
      assert.isDefined(output.profile_name);
      assert.isDefined(output.profile_photo);
      assert.isDefined(output.username);

      assert.isTrue(output.bio === userAccount.bio);
      assert.isTrue(output.company_name === userAccount.company_name);
      assert.isTrue(output.email === userAccount.email);
      assert.isTrue(output.first_name === userAccount.first_name);
      assert.isTrue(output.hash_id === userAccount.hash_id);
      assert.isTrue(output.join_date === userAccount.join_date);
      assert.isTrue(output.last_name === userAccount.last_name);
      assert.isTrue(output.location === userAccount.location);
      assert.isTrue(output.profile_link_1 === userAccount.profile_link_1);
      assert.isTrue(output.profile_link_2 === userAccount.profile_link_2);
      assert.isTrue(output.profile_link_3 === userAccount.profile_link_3);
      assert.isTrue(output.profile_link_twitter === userAccount.profile_link_twitter);
      assert.isTrue(output.profile_link_website === userAccount.profile_link_website);
      assert.isTrue(output.profile_name === userAccount.profile_name);
      assert.isTrue(output.profile_photo === userAccount.profile_photo);
      assert.isTrue(output.username === userAccount.username);

      assert.isUndefined(output.id);
      assert.isUndefined(output.activated);
      assert.isUndefined(output.banned);
      assert.isUndefined(output.banned_reason);
      assert.isUndefined(output.created_at);
      assert.isUndefined(output.modified_at);
      assert.isUndefined(output.new_email);
      assert.isUndefined(output.new_email_key);
      assert.isUndefined(output.new_email_requested);
      assert.isUndefined(output.new_password);
      assert.isUndefined(output.new_password_requested);
      assert.isUndefined(output.password);
    });
  });

  describe('prepareForElasticSearch', function() {
    it('prepareForElasticSearch should return correct data', function() {
      var output = userDomain.prepareForElasticSearch(userAccount);

      assert.isDefined(output.id);
      assert.isDefined(output.bio);
      assert.isDefined(output.company_name);
      assert.isDefined(output.email);
      assert.isDefined(output.first_name);
      assert.isDefined(output.hash_id);
      assert.isDefined(output.join_date);
      assert.isDefined(output.last_name);
      assert.isDefined(output.location);
      assert.isDefined(output.profile_link_1);
      assert.isDefined(output.profile_link_2);
      assert.isDefined(output.profile_link_3);
      assert.isDefined(output.profile_link_twitter);
      assert.isDefined(output.profile_link_website);
      assert.isDefined(output.profile_name);
      assert.isDefined(output.profile_photo);
      assert.isDefined(output.username);

      assert.isTrue(output.id === userAccount.id);
      assert.isTrue(output.bio === userAccount.bio);
      assert.isTrue(output.company_name === userAccount.company_name);
      assert.isTrue(output.email === userAccount.email);
      assert.isTrue(output.first_name === userAccount.first_name);
      assert.isTrue(output.hash_id === userAccount.hash_id);
      assert.isTrue(output.join_date === userAccount.join_date);
      assert.isTrue(output.last_name === userAccount.last_name);
      assert.isTrue(output.location === userAccount.location);
      assert.isTrue(output.profile_link_1 === userAccount.profile_link_1);
      assert.isTrue(output.profile_link_2 === userAccount.profile_link_2);
      assert.isTrue(output.profile_link_3 === userAccount.profile_link_3);
      assert.isTrue(output.profile_link_twitter === userAccount.profile_link_twitter);
      assert.isTrue(output.profile_link_website === userAccount.profile_link_website);
      assert.isTrue(output.profile_name === userAccount.profile_name);
      assert.isTrue(output.profile_photo === userAccount.profile_photo);
      assert.isTrue(output.username === userAccount.username);

      assert.isUndefined(output.activated);
      assert.isUndefined(output.banned);
      assert.isUndefined(output.banned_reason);
      assert.isUndefined(output.created_at);
      assert.isUndefined(output.modified_at);
      assert.isUndefined(output.new_email);
      assert.isUndefined(output.new_email_key);
      assert.isUndefined(output.new_email_requested);
      assert.isUndefined(output.new_password);
      assert.isUndefined(output.new_password_requested);
      assert.isUndefined(output.password);
    });
  });
});

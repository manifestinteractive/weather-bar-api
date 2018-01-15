var assert = require('chai').assert;
var sinon = require('sinon');

var User = require('../../../../../app/models/api/users');
var settings = require('../../../../../app/api/v1/domain/settings');

describe('Domain Settings', function() {
  beforeEach(function() {
    this.sandbox = sinon.sandbox.create();
  });

  afterEach(function() {
    this.sandbox.restore();
  });

  it('should be defined', function() {
    assert.isDefined(settings);
  });

  it('getSettings should be defined', function() {
    assert.isDefined(settings.getSettings);
  });
});

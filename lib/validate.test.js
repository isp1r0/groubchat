'use strict';

var chai = require('chai');
chai.should();

var validate = require('./validate');

describe('Validate', function () {
  /* jshint expr:true */

  describe('#isEmail', function () {
    it('should not allow empty string', function () {
      validate.isEmail('').should.be.false;
    });

    it('should not allow null', function () {
      validate.isEmail(null).should.be.false;
    });

    it('should allow a valid email', function () {
      validate.isEmail('foo@example.org').should.be.true;
    });

    it('should not allow a string without @', function () {
      validate.isEmail('foo example.org').should.be.false;
    });

    it('should not allow a string without .', function () {
      validate.isEmail('foo@example').should.be.false;
    });

    it('should require . to be after @', function () {
      validate.isEmail('.foo@example').should.be.false;
    });

    it('should allow + sign', function () {
      validate.isEmail('foo+heroku@gmail.com').should.be.true;
    });
  });

  describe('#required', function () {
    it('should not allow empty string', function () {
      validate.required('').should.be.false;
    });

    it('should not allow spaces', function () {
      validate.required('     ').should.be.false;
    });

    it('should not allow null', function () {
      validate.required(null).should.be.false;
    });

    it('should not allow newlines and tabs', function () {
      validate.required('\n\t').should.be.false;
    });

    it('should allow if a single non whitespace char is present', function () {
      validate.required('.').should.be.true;
    });

    it('should allow if whitespaces and a single char is present', function () {
      validate.required('\n\t . \t').should.be.true;
    });
  });

  describe('#length', function () {
    it('should allow empty string with length of 0', function () {
      validate.length('', 0).should.be.true;
    });

    it('should not allow length to be negative', function () {
      validate.length('a', -1).should.be.false;
    });

    it('should not allow a string that is too short', function () {
      validate.length('a', 2).should.be.false;
    });

    it('should allow a string that is long enough', function () {
      validate.length('abc', 3).should.be.true;
    });

    it('should not allow length to not be a number', function () {
      validate.length('a', 'a').should.be.false;
    });

    it('should not allow inputs to be null', function () {
      validate.length(null, null).should.be.false;
    });
  });

  describe('#address', function () {
    it('should not allow empty string', function () {
      validate.address('').should.be.false;
    });

    it('should not allow null', function () {
      validate.address(null).should.be.false;
    });

    it('should allow something that looks like an address', function () {
      validate.address('Foogata 1').should.be.true;
    });

    it('should not allow string that doesnt look like an address', function () {
      validate.address('Foogata').should.be.false;
    });
  });

  describe('#oneOf', function () {
    it('should not allow empty string', function () {
      validate.oneOf('').should.be.false;
    });

    it('should not allow null inputs', function () {
      validate.oneOf(null, null).should.be.false;
    });

    it('should allow empty string of empty array', function () {
      validate.oneOf('', []).should.be.true;
    });

    it('should allow a string that is in array', function () {
      validate.oneOf('foo', ['foo']).should.be.true;
    });

    it('should not allow a string that is not in array', function () {
      validate.oneOf('foo', ['bar']).should.be.false;
    });
  });

  describe('#phonenumber', function () {
    it('should not allow empty string', function () {
      validate.phonenumber('').should.be.false;
    });

    it('should not allow null', function () {
      validate.phonenumber(null).should.be.false;
    });

    it('should not allow too short a number', function () {
      validate.phonenumber('1234').should.be.false;
    });

    it('should not allow strings', function () {
      validate.phonenumber('foo').should.be.false;
    });

    it('should allow a string of seven numbers starting with 5', function () {
      validate.phonenumber('5678900').should.be.true;
    });

    it('should allow a valid number with space separator', function () {
      validate.phonenumber('567 8900').should.be.true;
    });

    it('should allow a valid number with dash separator', function () {
      validate.phonenumber('567-8900').should.be.true;
    });

    it('should not allow a valid start with string rest', function () {
      validate.phonenumber('5asdfgh').should.be.false;
    });
  });
});
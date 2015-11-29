'use strict';

var hash = require('../lib/pass').hash;
var query = require('./query');

function createUserWithHashAndSalt (username, salt, hash, cb) {
  var values = [username, salt, hash, new Date()],
   q = 'INSERT INTO users (username, salt, hash, date) VALUES($1, $2, $3, $4)';

  query(q, values, function (err) {
    if (err) {
      return cb(err);
    } else {
      return cb(null, true);
    }
  });
}

function findUser (username, cb) {
  var values = [username];
  var q = 'SELECT id, username, salt, hash FROM users WHERE username = $1';
  
  query(q, values, function (err, result) {
    if (err) {
      return cb(err);
    } else {
      return cb(null, result.rows);
    }
  });
}

module.exports.createUser = function createUser (username, password, cb) {
  hash(password, function (err, salt, hash) {
    if (err) {
      return cb(err);
    }

    createUserWithHashAndSalt(username, salt, hash, cb);
  });
};

module.exports.auth = function auth (name, pass, fn) {
  findUser(name, function (err, result) {
    var user = null;

    if (result.length === 1) {
      user = result[0];
    }

    if (!user) {
      return fn(new Error('cannot find user'));
    }

    hash(pass, user.salt, function(err, hash){
      if (err) {
        return fn(err);
      }
      
      if (hash === user.hash) {
        return fn(null, user);
      }

      fn(new Error('invalid password'));
    });
  });
};
'use strict';

var pg = require('pg');

var DATABASE = process.env.DATABASE_URL;


/**
 * Runs query against database.
 *
 * @param {string} q - Query to run
 * @param {array} values - Values for query
 * @param {function} cb - Callback to run after query, if successful, second
 *                        param is result object
 * @returns {undefined}
 */
module.exports = function query (q, values, cb) {
  pg.connect(DATABASE, function (error, client, done) {

    if (error) {
      console.error('Error running query', q, values, error);
      return cb(error);
    }

    client.query(q, values, function (err, result) {
      done();

      if (err) {
        console.error('Error running query', q, values, err);
        return cb(err);
      } else {
        return cb(null, result);
        console.log("connected to PG")
      }
    });
  });
};
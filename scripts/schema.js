#!/usr/bin/env node
'use strict';

var fs = require('fs');
var path = require('path');
require('dotenv').load();

var query = require('../lib/query');

var schema = path.join(__dirname, '../schema.sql');

console.log('Dropping tables and re-creating...');

fs.readFile(schema, function (err, data) {
  if (err) {
    console.error('Error!', err);
    return;
  }

  query(data.toString('utf8'), [], function (err) {
    if (err) {
      console.error('Error running script!', err);
      return;
    }

    console.log('Done!');
  });
});

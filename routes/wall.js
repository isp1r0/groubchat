'use strict';

var express = require('express');
var router = express.Router();

var wall = require('../lib/wall');
var validation = require('../lib/validate');
var formValidator = require('../lib/formValidator');

var ensureLoggedIn = require('../middleware/ensureLoggedIn');

router.get('/', ensureLoggedIn, wallIndex);
router.post('/add', ensureLoggedIn, wallPost);

function wallIndex(req, res) {
  var userId = req.session.user.id;
  wall.getWall(userId, 50, function (err, result) {
    var error = err;

    var items = result.rows;

    var data = {
      items: items,
      error: error,
      form: wallPost
    };

    res.render('wall', data);
  });
}

function wallPost(req, res) {
  var result = formValidator(wallPost, req.body);

  var hasErrors = result.hasErrors;
  var processedForm = result.processedForm;
  
  var data = { title: 'Bæta við færslu',
               form: processedForm,
               submitted: true,
               errors: hasErrors
             };

  if (!hasErrors) {
    var text = processedForm[0].value;
    var userId = req.session.user.id;

    wall.add(userId, text, function (err, result) {
      if (result) {
        res.redirect('/');
      } else {
        data.hasErrors = true;
        data.addError = true;
        res.render('add', data);
      }
    });
  } else {
    res.render('add', data);
  }
}

var wallPost = [
  {
    name: 'text',
    label: 'Texti',
    type: 'textarea',
    value: '',
    required: true,
    validation: [boundLengthValidation(2)],
    valid: false,
    validationString: 'Færsla þarf að vera a.m.k. tveir stafir'
  }
];

function boundLengthValidation(n) {
  return function (s) {
    return validation.length(s, n);
  };
}

module.exports = router;
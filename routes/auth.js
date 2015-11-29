'use strict';

var express = require('express');
var router = express.Router();
var stripe = require("stripe")("sk_test_B4ykXpMTeXBahompXXl8WQzn");

var users = require('../lib/users');
var validation = require('../lib/validate');
var formValidator = require('../lib/formValidator');

router.get('/login', redirectIfLoggedIn, login);
router.post('/login', loginHandler);
router.get('/logout', logout);
router.get('/create', createForm);
router.post('/create', createHandler);

module.exports = router;

/** route middlewares **/

function createForm(req, res) {
  var data = { title: 'Búa til notanda', form: form, submitted: false };
  res.render('create', data);
}

function createHandler(req, res) {
  var result = formValidator(form, req.body);

  var hasErrors = result.hasErrors;
  var processedForm = result.processedForm;
  
  var data = { title: 'Búa til notanda',
               form: processedForm,
               submitted: true,
               errors: hasErrors
             };

  if (!hasErrors) {
    var username = processedForm[0].value;
    var password = processedForm[1].value;
    users.createUser(username, password, function (err, result) {
      if (result) {
        res.redirect('/login');
      } else {
        data.hasErrors = true;
        res.render('create', data);
      }
    });
  } else {
    res.render('create', data);
  }
}

function redirectIfLoggedIn(req, res, next) {
  if (req.session.user) {
    res.redirect('/');
  } else {
    next();
  }
}

function login(req, res) {
  var data = { title: 'Búa til notanda', form: form, submitted: false };
  res.render('login', data);
}

function loginHandler(req, res) {
  var result = formValidator(form, req.body);

  var hasErrors = result.hasErrors;
  var processedForm = result.processedForm;
  
  var data = { title: 'Innskrá',
               form: processedForm,
               submitted: true,
               errors: hasErrors
             };

  if (!hasErrors) {
    var username = processedForm[0].value;
    var password = processedForm[1].value;
    users.auth(username, password, function (err, user) {
      if (user) {
        req.session.regenerate(function (){
          req.session.user = user;
          res.redirect('/');
        });
      } else {
        data.errors = true;
        data.loginError = true;
        res.render('login', data);
      }
    });
  } else {
    res.render('login', data);
  }
}

function logout(req, res) {
  req.session.destroy(function(){
    res.redirect('/login');
  });
}

/** data **/

var form = [
  {
    name: 'username',
    label: 'Notendanafn',
    type: 'text',
    value: '',
    required: true,
    validation: [boundLengthValidation(3)],
    valid: false,
    validationString: 'Notendanafn þarf að vera a.m.k. þrír stafir'
  },
  {
    name: 'password',
    label: 'Lykilorð',
    type: 'password',
    required: true,
    validation: [boundLengthValidation(5)],
    valid: false,
    validationString: 'Lykilorð verður að vera a.m.k. fimm stafir'
  }
];

/** helpers **/

function boundLengthValidation(n) {
  return function (s) {
    return validation.length(s, n);
  };
}


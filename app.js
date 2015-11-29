'use strict';

var express = require('express');
var path = require('path');
var logger = require('morgan'); 
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var moment = require('moment');

var notFoundHandler = require('./middleware/notFoundHandler');
var errorHandler = require('./middleware/errorHandler');

var SESSION_NAME = process.env.SESSION_NAME;
var SESSION_SECRET = process.env.SESSION_SECRET;

//var isDev = process.env.NODE_ENV === 'development';

var auth = require('./routes/auth');
var wall = require('./routes/wall');
var charge = require('./routes/charge');

var app = express();

var cookie = { domain: '',
               httpOnly: true,
               secure: false };

app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: cookie,
  name: SESSION_NAME
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Gefum viewum aðgang að moment library
app.locals.moment = moment;

// HTML verður ekki minnkað í eina línu
//app.locals.pretty = isDev;

app.use(function (req, res, next) {

  if (req.session.user) {
    app.locals.user = req.session.user;
  }

  next();
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', auth);
app.use('/', wall);
app.use('/', charge);  

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;

'use strict';

var express = require('express');
var router = express.Router();
var stripe = require("stripe")("sk_test_B4ykXpMTeXBahompXXl8WQzn");

router.post('/charge', function(req, res) {

  var stripeToken = req.body.stripeToken;

  var charge = stripe.charges.create({
    amount: 2000, // amount in cents, again
    currency: "usd",
    card: stripeToken,
    description: "payinguser@example.com"
  }, function(err, charge) {
    if (err && err.type === 'StripeCardError') {
      // The card has been declined
    } else {
      //Render a thank you page called "Charge"
      res.render('charge', { title: 'Charge' });
    }
  });
});
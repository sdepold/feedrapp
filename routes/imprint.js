const _ = require('lodash');
const Bluebird = require('bluebird');
const express = require('express');
const Feed = require('../src/feed');
const helper = require('../src/helper');
const router = express.Router();
const ua = require('universal-analytics');

router.get('/', function(req, res, next) {
  const sections = [
    'contact',
    'disclaimer',
    'privacy',
  ];

  res.render('imprint', { title: 'FeedrApp', sections });
});

module.exports = router;

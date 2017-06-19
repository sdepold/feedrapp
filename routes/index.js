const _ = require('lodash');
const Bluebird = require('bluebird');
const express = require('express');
const Feed = require('../src/feed');
const helper = require('../src/helper');
const router = express.Router();
const ua = require('universal-analytics');

router.get('/', function(req, res, next) {
  if (req.headers.accept.includes('text/html')) {
    handleHtmlRequest(req, res, next);
  } else {
    handleJsonRequest(req, res, next);
  }
});

module.exports = router;

function handleHtmlRequest(req, res, next) {
  const sections = [
    'introduction',
    'usage',
    'options',
    'development',
    'caching',
  ];

  res.render('index', { title: 'FeedrApp', sections });
}

function handleJsonRequest(req, res, next) {
  getResponseData(req).then(function (feed) {
    if (req.query.callback) {
      res.set('Content-Type', 'text/javascript; charset=utf-8');
      res.send(`${req.query.callback}(${JSON.stringify(feed)});`);
    } else {
      res.json(feed);
    }
  })
  .then(() => trackRequest(req));
}

function getResponseData(req) {
  const feedUrl = req.query.q;
  const feedOptions = _.pick(req.query, 'num');

  if (feedUrl) {
    return new Feed(feedUrl).read(feedOptions).then((feed) => {
      return { responseStatus: 200, responseDetails: null, responseData: { feed } };
    }).catch((error) => {
      console.error({ feedUrl, error });
      return helper.badRequest({ message: 'Parsing the provided feed url failed.' });
    });
  } else {
    return Bluebird.resolve(helper.badRequest({
      message: 'No q param found!',
      details: 'Please add a query parameter "q" to the request URL which points to a feed!'
    }));
  }
}

function trackRequest (req) {
  ua('UA-100419142-1', { https: true })
    .pageview(req.originalUrl)
    .send();
}

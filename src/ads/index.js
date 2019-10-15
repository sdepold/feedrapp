const _ = require('lodash');
const tracking = require('../tracking');
const redis = require('./redis-ads');
const inMemory = require('./in-memory-ads');

const selection = [
  {
    title: 'Ad | Play-Doh Modeling Compound',
    link: 'https://amzn.to/2lWpeo5',
    content: '<img src="https://ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B00JM5GW10&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=mamaskind-20"> 10 cans of creative fun kids can get creative with just the right colors They need in this Play Doh 10 pack of 2 ounce cans',
    contentSnippet: '10 cans of creative fun kids can get creative with just the right colors They need in this Play Doh 10 pack of 2 ounce cans',
    publishedDate: '2019-09-11T12:00:00.000Z',
    categories: [],
    author: 'Play-Doh'
  },
  {
    title: 'Ad | All-new Echo (3rd Gen) - Smart speaker with Alexa - Twilight Blue',
    link: 'https://amzn.to/2ntWMu4',
    content: '<img src="https://ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B07R1CXKN7&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=mamaskind-20"> Meet Echo - Echo (3rd Gen) has new premium speakers powered by Dolby to play 360° audio with crisp vocals and dynamic bass response.',
    contentSnippet: 'Meet Echo - Echo (3rd Gen) has new premium speakers powered by Dolby to play 360° audio with crisp vocals and dynamic bass response.',
    publishedDate: '2019-09-11T12:00:00.000Z',
    categories: [],
    author: 'Amazon'
  }
];
const getAd = function () {
  return _.sample(selection);
};

const shouldShowAd = async function (req) {
  const adsTracker = tracking.isReady() ? redis : inMemory;

  if (req.query.support) {
    adsTracker.trackSupportRequest();

    if (await adsTracker.aboveThreshold()) {
      await adsTracker.reset();

      return true;
    }
  }

  return false;
};

const addAds = async function (req, response) {
  if (await shouldShowAd(req)) {
    if (req.query.callback) {
      // eslint-disable-next-line no-param-reassign
      response = response.match(new RegExp(`${req.query.callback}\\((.*)\\)`))[1];
    }

    const data = JSON.parse(response);
    const ad = getAd();

    data.responseData.feed.entries.pop();
    data.responseData.feed.entries.unshift(ad);
    // eslint-disable-next-line no-param-reassign
    response = JSON.stringify(data);

    if (req.query.callback) {
      // eslint-disable-next-line no-param-reassign
      response = `${req.query.callback}(${response});`;
    }

    tracking.trackToday('ad:served');

    // eslint-disable-next-line no-console
    console.log(`Embedded ad: ${JSON.stringify(ad)}`);
  }

  return response;
};

module.exports = {
  getAd, shouldShowAd, addAds
};

const _ = require('lodash');
const tracking = require('../tracking');
const redis = require('./redis-ads');
const inMemory = require('./in-memory-ads');

const selection = [
  {
    title: 'Ad | Oculus Quest All-in-one VR Gaming Headset',
    link: 'https://amzn.to/2J9POCH',
    content: '<img src="https://ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B07HNW68ZC&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=mamaskind-20&language=en_US"> Oculus Quest is an all-in-one gaming system for virtual reality. No wires. No PC. Just set up with the Oculus mobile app, and you\'re free to explore VR from almost anywhere. Sensors inside the headset precisely track your movements and instantly translate them into VR, while helping you steer clear of nearby objects. And with Oculus Touch controllers, your hands are in the game, so you can see your every gesture and feel the power of every impact. Take VR gaming to the next level. And everywhere else. Setup requires an iPhone(iOS 10 or higher) or Android(6.0 Marshmallow or higher) smartphone, the Oculus App (free download), 802.11 b/g/n wireless Internet access, and an Oculus account.',
    contentSnippet: 'Oculus Quest is an all-in-one gaming system for virtual reality. No wires. No PC. Just set up with the Oculus mobile app, and you\'re free to explore VR from almost anywhere. Sensors inside the headset precisely track your movements and instantly translate them into VR, while helping you steer clear of nearby objects. And with Oculus Touch controllers, your hands are in the game, so you can see your every gesture and feel the power of every impact. Take VR gaming to the next level. And everywhere else. Setup requires an iPhone(iOS 10 or higher) or Android(6.0 Marshmallow or higher) smartphone, the Oculus App (free download), 802.11 b/g/n wireless Internet access, and an Oculus account.',
    publishedDate: '2019-09-11T12:00:00.000Z',
    categories: [],
    author: 'Oculus'
  },
  {
    title: 'Ad | All-new Echo (3rd Gen) - Smart speaker with Alexa - Twilight Blue',
    link: 'https://amzn.to/2ntWMu4',
    content: '<img src="https://ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B07R1CXKN7&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=mamaskind-20"> Meet Echo - Echo (3rd Gen) has new premium speakers powered by Dolby to play 360° audio with crisp vocals and dynamic bass response.',
    contentSnippet: 'Meet Echo - Echo (3rd Gen) has new premium speakers powered by Dolby to play 360° audio with crisp vocals and dynamic bass response.',
    publishedDate: '2019-09-11T12:00:00.000Z',
    categories: [],
    author: 'Amazon'
  },
  {
    title: 'Ad | PlayStation 4 Pro 1TB Console',
    link: 'https://amzn.to/2BdNhmo',
    content: '<img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B01LOP8EZC&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=mamaskind-20&language=en_US"> The most advanced PlayStation system ever. PS4 Pro is designed to take your favorite PS4 games and add to them with more power for graphics, performance, or features for your 4K HDR TV, or 1080p HD TV. Ready to level up?',
    contentSnippet: 'The most advanced PlayStation system ever. PS4 Pro is designed to take your favorite PS4 games and add to them with more power for graphics, performance, or features for your 4K HDR TV, or 1080p HD TV. Ready to level up?    ',
    publishedDate: '2019-09-11T12:00:00.000Z',
    categories: [],
    author: 'Sony'
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

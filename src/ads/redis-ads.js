const tracking = require('../tracking');

const showAdThreshold = 250;

// eslint-disable-next-line no-multi-assign
const redisAds = module.exports = {
  trackSupportRequest() {
    tracking.trackToday('supportRequest');
    tracking.track('feedr-ads', 'requestsSinceLastAd');
  },

  async getRequestsSinceLastAd() {
    return JSON.parse(await tracking.get('feedr-ads', 'requestsSinceLastAd')) || 0;
  },

  async aboveThreshold() {
    return (await redisAds.getRequestsSinceLastAd()) >= showAdThreshold;
  },

  async reset() {
    return tracking.client.hset('feedr-ads', 'requestsSinceLastAd', 0);
  }
};

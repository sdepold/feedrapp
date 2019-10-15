let _requestsSinceLastAd = 0;
const showAdThreshold = 250;

// eslint-disable-next-line no-multi-assign
const inMemoryAds = module.exports = {
  trackSupportRequest() {
    _requestsSinceLastAd += 1;
  },

  async getRequestsSinceLastAd() {
    return _requestsSinceLastAd;
  },

  async aboveThreshold() {
    return (await inMemoryAds.getRequestsSinceLastAd()) >= showAdThreshold;
  },

  async reset() {
    _requestsSinceLastAd = 0;
  }
};

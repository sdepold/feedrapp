let _requestsSinceLastAd = 0;
const showAdThreshold = 250;

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

    reset() {
        _requestsSinceLastAd = 0;
    }
};

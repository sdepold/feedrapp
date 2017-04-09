// 3rd-party modules
const _ = require('lodash');
const axios = require('axios');
const cache = require('memory-cache');

const TTL = 30 * 60 * 1000; // 30 minutes

module.exports = {
  getResource: function getResource(url) {
    const cachedResource = cache.get(url);

    if (cachedResource) {
      console.log(`Hit cache for URL: ${url}`); // eslint-disable-line no-console
      return Promise.resolve(cachedResource);
    }

    return axios.get(url).then((result) => {
      console.log(`Requested remote server for URL: ${url}`); // eslint-disable-line no-console
      return cache.put(url, result, TTL);
    }).catch((err) => {
      if (_.includes([301, 302], err.status)) {
        return getResource(err.headers.location);
      }
      throw err;
    });
  },

  badRequest: function badRequest(details) {
    return {
      responseStatus: 400,
      responseDetails: details,
      responseData: { feed: null }
    };
  }
};

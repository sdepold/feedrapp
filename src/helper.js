// 3rd-party modules
const _ = require('lodash');
const axios = require('axios');

module.exports = {
  getResource: function getResource(url) {
    return axios
      .get(url)
      .catch((err) => {
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

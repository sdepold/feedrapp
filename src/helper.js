// 3rd-party modules
const _ = require("lodash");
const request = require("request");
const iconv = require("iconv-lite");

module.exports = {
  getResource: function getResource(url, options) {
    // eslint-disable-next-line no-param-reassign
    options = _.extend({ encoding: "utf8" }, options);

    return new Promise((resolve, reject) => {
      request.get(
        {
          uri: url,
          encoding: null
        },
        (err, resp, body) => {
          if (err) {
            return reject(err);
          }

          resolve(iconv.decode(body, options.encoding));
        }
      );
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

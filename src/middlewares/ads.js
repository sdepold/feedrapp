const adsConfig = require("../../config/ads");
const AD_CAP_LIMIT = adsConfig.limit;

const getAd = (req) => {
  const ads = adsConfig.mapping[".de"];
  const ad = ads[Math.floor(Math.random() * ads.length)];

  return ad;
};

function handleCallback(_body, callbackArg, fn) {
  let body = `${_body}`;

  if (callbackArg && body.startsWith(`${callbackArg}(`)) {
    body = body.replace(`${callbackArg}(`, "");
    body = body.replace(/\);?$/, "");
  }

  body = JSON.parse(body);

  const data = fn(body);
  const response = JSON.stringify(data);

  if (callbackArg) {
    return `${callbackArg}(${response});`;
  }

  return response;
}

const injectAd = (body, callback, ad) => {
  return handleCallback(body, callback, (data) => {
    data.responseData.feed.entries[0] = ad;

    return data;
  });
};

module.exports =
  (adsHits = {}) =>
  async (req, res, next) => {
    res.sendAdsResponse = res.send;
    res.send = async (body) => {
      if (String(req.query.support) === "true") {
        adsHits[req.query.q] = (adsHits[req.query.q] || 0) + 1;

        if (adsHits[req.query.q] >= AD_CAP_LIMIT) {
          body = injectAd(body, req.query.callback, getAd(req));
          adsHits[req.query.q] = 0;
        }
      }

      res.sendAdsResponse(body);
    };

    return next();
  };

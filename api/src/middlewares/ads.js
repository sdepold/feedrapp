const adsConfig = require('../../config/ads');
const { getEthicalAd } = require('../models/ethical-ads');

const AD_CAP_LIMIT = adsConfig.limit;

function handleCallback(_body, callbackArg, fn) {
  let body = `${_body}`;

  if (callbackArg && body.startsWith(`${callbackArg}(`)) {
    body = body.replace(`${callbackArg}(`, '');
    body = body.replace(/\);?$/, '');
  }

  const data = fn(JSON.parse(body));
  const response = JSON.stringify(data);

  if (callbackArg) {
    return `${callbackArg}(${response});`;
  }

  return response;
}

const injectAd = (body, callback, ad) =>
  handleCallback(body, callback, (data) => {
    if (data.responseData.feed && data.responseData.feed.entries) {
      data.responseData.feed.entries[0] = ad;
    } else if (!data.responseData.feed) {
      data.responseData.feed = { entries: [ad] };
    }

    return data;
  });

const _adsHits = {};

setInterval(() => {
  console.log(_adsHits);
}, 10000);

module.exports =
  (adsHits = _adsHits) =>
  async (req, res, next) => {
    res.sendAdsResponse = res.send;

    res.send = async (body) => {
      if (String(req.query.support) === 'true') {
        adsHits[req.query.q] = (adsHits[req.query.q] || 0) + 1;

        const reachedLimit = adsHits[req.query.q] >= AD_CAP_LIMIT;
        const requestFailed = body.includes('"responseStatus":400');

        if (requestFailed || reachedLimit) {
          const ad = await getEthicalAd(req);

          if (ad) {
            console.log('Injecting Ad', ad, 'into', req.query.q);

            body = injectAd(body, req.query.callback, ad);
            adsHits[req.query.q] = 0;
          }
        }
      }

      res.sendAdsResponse(body);
    };

    return next();
  };

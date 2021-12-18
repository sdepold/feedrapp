const adsConfig = require("../../config/ads");

const AD_CAP_LIMIT = adsConfig.limit;

const getAd = (req) => {
  const pair = Object.entries(adsConfig.mapping).find(([needle]) =>
    req.query.q.includes(needle)
  );

  if (pair) {
    const [, ads] = pair;
    const ad = ads[Math.floor(Math.random() * ads.length)];

    console.log(`Injecting ad into "${req.query.q}" -->`, JSON.stringify(ad));

    return ad;
  }
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

const injectAd = (body, callback, ad) =>
  handleCallback(body, callback, (data) => {
    data.responseData.feed.entries[0] = ad;

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
      if (String(req.query.support) === "true") {
        adsHits[req.query.q] = (adsHits[req.query.q] || 0) + 1;

        if (adsHits[req.query.q] >= AD_CAP_LIMIT) {
          const ad = getAd(req);

          if (ad) {
            console.log(req.query.support, adsHits[req.query.q], ad)
            body = injectAd(body, req.query.callback, ad);
            adsHits[req.query.q] = 0;
          }
        }
      }

      res.sendAdsResponse(body);
    };

    return next();
  };

const TTL = 30 * 60 * 1000; // 30 minutes
const memoryCache = require('memory-cache');
const querystring = require('querystring');
const { addAds } = require('./ads');
const tracking = require("../src/tracking");

function formatResponse(req, cacheResult) {
  if (cacheResult.callback) {
    return cacheResult.body.replace(`${cacheResult.callback}(`, `${req.query.callback}(`);
  }

  return cacheResult.body;
}

function toCacheKey(req) {
  const queryParams = Object.assign({
    isApiRequest: !(req.headers.accept && req.headers.accept.includes('text/html')),
    path: req.path
  }, req.query);

  if (queryParams.callback) {
    // Sanitize callback instead of removing it.
    // This fixes the situation where a feed was requested first without a callback
    // and later on with a callback.
    queryParams.callback = 'callback';
  }
  delete queryParams._;

  return querystring.stringify(queryParams);
}

module.exports = (duration = TTL) => async (req, res, next) => {
  if (!req.headers.accept.includes('text/html')) {
    tracking.trackToday(`feedUrl:${req.query.q || 'none'}`);
    tracking.trackToday(`options:support:${req.query.support || 'disabled'}`);
    tracking.trackToday(`options:version:${req.query.version || 'unknown'}`);
  }

  const cacheKey = toCacheKey(req);
  console.time(cacheKey); // eslint-disable-line no-console
  const cacheResult = memoryCache.get(cacheKey);

  if (cacheResult) {
    console.timeEnd(cacheKey); // eslint-disable-line no-console
    return res.send(await addAds(req, formatResponse(req, cacheResult)));
  }

  res.sendResponse = res.send;
  res.send = (body) => {
    memoryCache.put(cacheKey, { body, callback: req.query.callback }, duration);
    console.timeEnd(cacheKey); // eslint-disable-line no-console
    res.sendResponse(body);
  };

  return next();
};

// 3rd-party modules
import _ from 'lodash';
import axios from 'axios';
import cache from 'memory-cache';

const TTL = 30 * 60 * 1000; // 30 minutes

export function getResource (url) {
  var cachedResource = cache.get(url);

  if (cachedResource) {
    console.log(`Hit cache for URL: ${url}`);
    return Promise.resolve(cachedResource);
  }

  return axios.get(url).then(function (result) {
    console.log(`Requested remote server for URL: ${url}`);
    return cache.put(url, result, TTL);
  }).catch((err) => {
    if (_.includes([301, 302], err.status)) {
      return getResource(err.headers.location);
    } else {
      throw err;
    }
  });
}

export function badRequest (details) {
  return {
    responseStatus: 400,
    responseDetails: details,
    responseData: { feed: null }
  };
}

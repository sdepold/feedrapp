// 3rd-party modules
import _ from 'lodash';
import axios from 'axios';

export function getResource (url) {
  return axios.get(url).catch((err) => {
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

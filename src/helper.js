// 3rd-party modules
import axios from 'axios';

export function getResource (url) {
  return axios.get(url).catch((err) => {
    if (err.status === 301) {
      return getResource(err.headers.location);
    } else {
      throw err;
    }
  });
}

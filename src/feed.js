// 3rd-party modules
import axios from 'axios';
import fastFeed from 'fast-feed';

export default class Feed {
  constructor (url) {
    this.url = url;
  }

  read () {
    return axios.get(this.url).then(function (res) {
      return new Promise((resolve, reject) => {
        fastFeed.parse(res.data, (err, feed) => {
          if (err) {
            return reject(err);
          } else {
            return resolve(feed);
          }
        });
      });
    });
  }
}

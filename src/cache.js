// 3rd-party modules
import _ from 'lodash';
import Redis from 'redis-fast-driver';

var redis, options;
var defaults = {
  prefix: 'feedrapp'
};

export function connect (opt) {
  options = _.merge(defaults, opt);
  redis = new Redis(options);
}

export function cache (key, value, time = 3600) {
  if (!redis) {
    return;
  }

  redis.rawCall(['SETEX', options.prefix + ':' + key, time, JSON.stringify(value)]);
}

export function getFromCache (key) {
  return new Promise((resolve, reject) => {
    if (!redis) {
      return reject();
    }

    redis.rawCall(['GET', options.prefix + ':' + key], (e, d) => {
      if (e || !d) {
        return reject(e);
      }
      return resolve(JSON.parse(d));
    });
  });
}

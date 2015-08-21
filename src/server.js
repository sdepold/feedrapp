// 3rd-party modules
import _ from 'lodash';
import webPockets from 'web-pockets';

// Local modules
import Feed from './feed';
import { badRequest } from './helper';

export default class Server {
  constructor () {
    this.app = webPockets();

    this.bindRoutes();
  }

  listen (port, iface, callback) {
    return this.app.listen(port, iface, callback);
  }

  bindRoutes () {
    this.app.request.value('feedUrl', (queryParams) => {
      return queryParams.q;
    });

    this.app.request.value('feedOptions', (queryParams) => {
      return _.pick(queryParams, 'num');
    });

    this.app.request.value('feed', (feedOptions, feedUrl) => {
      if (feedUrl) {
        return new Feed(feedUrl).read(feedOptions).then((feed) => {
          return { responseStatus: 200, responseDetails: null, responseData: { feed } };
        }).catch((e) => {
          console.error(e);
          return badRequest({ message: 'Parsing the provided feed url failed.' });
        });
      } else {
        return badRequest({
          message: 'No q param found!',
          details: 'Please add a query parameter "q" to the request URL which points to a feed!'
        });
      }
    });

    this.app.route('GET /', (queryParams, feed) => {
      if (queryParams.callback) {
        return {
          headers: {
            'content-type': 'text/javascript; charset=utf-8'
          },
          body: `${queryParams.callback}(${JSON.stringify(feed)});`
        };
      } else {
        return feed;
      }
    });
  }
}

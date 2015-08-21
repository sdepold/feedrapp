// 3rd-party modules
import _ from 'lodash';
import fastFeed from 'fast-feed';

// Local modules
import { getResource } from './helper';

export default class Feed {
  constructor (url) {
    this.url = url;
  }

  read (options) {
    options = _.extend({
      num: 4
    }, options);

    return getResource(this.url).then((res) => {
      return new Promise((resolve, reject) => {
        fastFeed.parse(res.data, { extensions: true }, (err, feed) => {
          if (err) {
            return reject(err);
          } else {
            return resolve(feed);
          }
        });
      });
    }).then((feed) => {
      return this._format(feed);
    }).then((feed) => {
      return this._applyOptions(feed, options);
    });
  }

  _format (data) {
    let author = data.author || '';

    return {
      feedUrl: this.url,
      title: data.title,
      link: data.link,
      description: data.subtitle || data.description || '',
      author: author,
      entries: data.items.map((item) => this._formatItem(author, item))
    };
  }

  _applyOptions (feed, options) {
    feed.entries = feed.entries.slice(0, options.num);

    return feed;
  }

  _formatItem (author, item) {
    let result = {
      title: item.title,
      link: item.link,
      content: item.content || item.summary || item.description || '',
      publishedDate: item.published || item.pubDate || item.date,
      categories: [],
      author: item.author || this._extractCreator(item) || author
    };

    result.contentSnippet = result.content.replace(/(<([^>]+)>)/ig, '').substring(0, 120);

    return result;
  }

  _extractCreator (item) {
    if (item.extensions) {
      let extension = item.extensions.find((extension) => {
        return extension.name === 'dc:creator';
      });

      return (extension || {}).value;
    }
  }
}

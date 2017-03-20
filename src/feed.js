// 3rd-party modules
const _ = require('lodash');
const fastFeed = require('fast-feed');

// Local modules
const getResource = require('./helper').getResource;

module.exports = class Feed {
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
    let content = item.content || item.summary || item.description || '';

    content = content.replace(/\u2028/g, '').replace(/\u2029/g, '');

    return {
      title: item.title,
      link: item.link,
      content: content,
      contentSnippet: content.replace(/(<([^>]+)>)/ig, '').substring(0, 120),
      publishedDate: item.published || item.pubDate || item.date,
      categories: item.categories || [],
      author: item.author || this._extractCreator(item) || author,
      thumbnail: this._extractThumbnail(item)
    };
  }

  _extractCreator (item) {
    return this._extractExtension(item, 'dc:creator').value;
  }

  _extractThumbnail (item) {
    let extension = this._extractExtension(item, 'media:thumbnail');

    if (extension.attributes) {
      return extension.attributes.url;
    }
  }

  _extractExtension (item, extensionName) {
    let result;

    if (item.extensions) {
      result = item.extensions.find((extension) => {
        return extension.name === extensionName;
      });
    }

    return result || {};
  }
};

// 3rd-party modules
const _ = require("lodash");
const fastFeed = require("fast-feed");

// Local modules
const getResource = require("./helper").getResource;

module.exports = class Feed {
  constructor(url) {
    this.url = url;
  }

  read(options) {
    // eslint-disable-next-line no-param-reassign
    options = _.extend(
      {
        num: 4,
        encoding: 'UTF-8'
      },
      options
    );

    return getResource(this.url, options)
      .then(
        res =>
          new Promise((resolve, reject) => {
            fastFeed.parse(res, { extensions: true }, (err, feed) => {
              return err ? reject(err) : resolve(feed);
            });
          })
      )
      .then(feed => this._format(feed))
      .then(feed => this._applyOptions(feed, options));
  }

  _format(data) {
    const author = data.author || "";

    return {
      feedUrl: this.url,
      title: data.title,
      link: data.link,
      description: data.subtitle || data.description || "",
      author,
      entries: data.items.map(item => this._formatItem(author, item))
    };
  }

  _applyOptions(feed, options) {
    feed.entries = feed.entries.slice(0, options.num); // eslint-disable-line no-param-reassign

    return feed;
  }

  _formatItem(author, item) {
    let content = item.content || item.summary || item.description || "";

    content = content.replace(/\u2028/g, "").replace(/\u2029/g, "");

    return {
      title: item.title,
      link: item.link,
      content,
      contentSnippet: content.replace(/(<([^>]+)>)/gi, "").substring(0, 120),
      publishedDate: item.published || item.pubDate || item.date,
      categories: item.categories || [],
      author: item.author || this._extractCreator(item) || author,
      thumbnail: this._extractThumbnail(item)
    };
  }

  _extractCreator(item) {
    return this._extractExtension(item, "dc:creator").value;
  }

  // eslint-disable-next-line consistent-return
  _extractThumbnail(item) {
    const extension = this._extractExtension(item, "media:thumbnail");

    if (extension.attributes) {
      return extension.attributes.url;
    }
  }

  _extractExtension(item, extensionName) {
    let result;

    if (item.extensions) {
      result = item.extensions.find(
        extension => extension.name === extensionName
      );
    }

    return result || {};
  }
};

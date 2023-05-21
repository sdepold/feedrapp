// 3rd-party modules
import _ from "lodash";
import fastFeed from "fast-feed";

// Local modules
const getResource = require("./helper").getResource;

export class Feed {
  declare url: string;

  constructor(url: string) {
    this.url = url;
  }

  read(options: any) {
    // eslint-disable-next-line no-param-reassign
    options = _.extend(
      {
        num: 4,
        encoding: "UTF-8",
      },
      options
    );

    return getResource(this.url, options)
      .then(
        (res: any) =>
          new Promise((resolve, reject) => {
            fastFeed.parse(
              res,
              { extensions: true },
              (err: Error | null, feed: any) => {
                return err ? reject(err) : resolve(feed);
              }
            );
          })
      )
      .then((feed: any) => this._format(feed))
      .then((feed: any) => this._applyOptions(feed, options));
  }

  _format(data: any) {
    const author = data.author || "";

    return {
      feedUrl: this.url,
      title: data.title,
      link: data.link,
      description: data.subtitle || data.description || "",
      author,
      entries: data.items.map((item: any) => this._formatItem(author, item)),
    };
  }

  _applyOptions(feed: any, options: any) {
    feed.entries = feed.entries.slice(0, options.num); // eslint-disable-line no-param-reassign

    return feed;
  }

  _formatItem(author: any, item: any) {
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
      thumbnail: this._extractThumbnail(item),
      enclosure: item.enclosure,
    };
  }

  _extractCreator(item: any) {
    return this._extractExtension(item, "dc:creator").value;
  }

  // eslint-disable-next-line consistent-return
  _extractThumbnail(item: any) {
    const extension = this._extractExtension(item, "media:thumbnail");

    if (extension.attributes) {
      return extension.attributes.url;
    }
  }

  _extractExtension(item: any, extensionName: any) {
    let result;

    if (item.extensions) {
      result = item.extensions.find(
        (extension: any) => extension.name === extensionName
      );
    }

    return result || {};
  }
}

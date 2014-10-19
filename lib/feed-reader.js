var Bluebird = require("bluebird");
var parser   = require("rssparser")
var url      = require("url");

var FeedReader = module.exports = {
  read: function (feedUrl) {
    return new Bluebird(function (resolve, reject) {
      try {
        feedUrl = url.parse(feedUrl).href;

        parser.parseURL("http://www.espnscrum.com/rss/rugby/rss/headlines_fantasy.rss", {
          pipeOriginal: true
        }, function (err, result) {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      } catch (e) {
        reject(e);
      }
    });
  }
}

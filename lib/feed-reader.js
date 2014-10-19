var Bluebird   = require("bluebird");
var FeedParser = require('feedparser')
var request    = require("request");

var FeedReader = module.exports = {
  read: function (url) {
    return new Bluebird(function (resolve, reject) {
      var parser = new FeedParser();
      var items  = [];

      readAndPipe(url, parser);

      parser.on('error', reject);

      parser.on('readable', function() {
        var stream = this;
        var meta   = this.meta;
        var item   = null;

        while (item = stream.read()) {
          items.push(item);
        }
      });

      parser.on('end', function () {
        console.log(items)
        resolve(items)
      })
    });
  }
}

var readAndPipe = function (url, target) {
  var req = request(url);

  req.on('error', function (error) {
    // handle any request errors
  });

  req.on('response', function (res) {
    var stream = this;

    if (res.statusCode != 200) {
      return this.emit('error', new Error('Bad status code'));
    }

    stream.pipe(target);
  });
}

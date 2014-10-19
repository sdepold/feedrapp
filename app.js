"use strict";

var app        = require('web-pockets')();
var feedReader = require("./lib/feed-reader");

app.request.value("feed", function (queryParams) {
  return feedReader.read(queryParams.url);
});

app.route("GET /entries*", function (feed) {
  return feed;
});

app.route("GET /", function () {
  return "Please use /entries with a query param 'url'!";
});

module.exports = app;

const _ = require("lodash");
const Bluebird = require("bluebird");
const express = require("express");
const Feed = require("../feed");
const helper = require("../helper");
const router = express.Router();
const sort = require("fast-sort");

router.get("/api", function (req, res, next) {
  getResponseData(req).then(function (feed) {
    helper.setContentType(req.query.callback, res);

    if (req.query.callback) {
      res.send(`${req.query.callback}(${JSON.stringify(feed)});`);
    } else {
      res.json(feed);
    }
  });
});

module.exports = router;

function sortEntries(arr, order) {
  if (!order) {
    return arr;
  }

  const match = order.match(/^(-){0,1}(.*)$/);
  const orderMethod = match[1] ? "desc" : "asc";
  const orderField = match[2];

  return sort(arr)[orderMethod]((entry) => entry[orderField]);
}

function getFeedData(feedUrls, feedOptions) {
  const errors = [];

  return Promise.all(
    feedUrls.map((feedUrl) =>
      new Feed(feedUrl).read(feedOptions).catch((e) => {
        errors.push(e);
      })
    )
  ).then((feeds) => {
    if (errors.length > 0 && feeds.filter((f) => !!f).length === 0) {
      throw errors[0];
    }

    return feeds.reduce(
      (acc, feed = {}) => ({
        ...feed,
        ...acc,
        entries: sortEntries(
          (acc.entries || []).concat(feed.entries || []),
          feedOptions.order
        ),
      }),
      {}
    );
  });
}

function getResponseData(req) {
  const feedUrl = req.query.q;
  const feedOptions = _.pick(req.query, ["num", "encoding", "order"]);

  if (feedUrl) {
    return getFeedData(feedUrl.split(","), feedOptions)
      .then((feed) => {
        return {
          responseStatus: 200,
          responseDetails: null,
          responseData: { feed },
        };
      })
      .catch((error) => {
        console.error({ feedUrl, error });
        return helper.badRequest({
          message: "Parsing the provided feed url failed.",
        });
      });
  } else {
    return Bluebird.resolve(
      helper.badRequest({
        message: "No q param found!",
        details:
          'Please add a query parameter "q" to the request URL which points to a feed!',
      })
    );
  }
}

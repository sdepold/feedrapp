import { sort } from "fast-sort";
import _ from "lodash";
import type { NextApiRequest, NextApiResponse } from "next";
import { Feed } from "../../src/feed";
import { badRequest } from "../../src/helper";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const feed = await getResponseData(req);

  if (req.query.callback) {
    res.send(`${req.query.callback}(${JSON.stringify(feed)});`);
  } else {
    res.json(feed);
  }
}

function sortEntries(arr: any, order: any) {
  if (!order) {
    return arr;
  }

  const match = order.match(/^(-){0,1}(.*)$/);
  const orderMethod = match[1] ? "desc" : "asc";
  const orderField = match[2];

  return sort(arr)[orderMethod]((entry: any) => entry[orderField]);
}

function getFeedData(feedUrls: string[], feedOptions: any) {
  const errors: any = [];

  return Promise.all(
    feedUrls.map((feedUrl) =>
      new Feed(feedUrl).read(feedOptions).catch((e: unknown) => {
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

function getResponseData(req: NextApiRequest) {
  const feedUrl = req.query.q;
  const feedOptions = _.pick(req.query, ["num", "encoding", "order"]);

  if (feedUrl) {
    return getFeedData((feedUrl as string).split(","), feedOptions)
      .then((feed) => {
        return {
          responseStatus: 200,
          responseDetails: null,
          responseData: { feed },
        };
      })
      .catch((error) => {
        console.error({ feedUrl, error });
        return badRequest({
          message: "Parsing the provided feed url failed.",
        });
      });
  } else {
    return Promise.resolve(
      badRequest({
        message: "No q param found!",
        details:
          'Please add a query parameter "q" to the request URL which points to a feed!',
      })
    );
  }
}

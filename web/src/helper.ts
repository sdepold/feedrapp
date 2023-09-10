// 3rd-party modules
import _ from "lodash";
import request from "request";
import iconv from "iconv-lite";

export function getResource(url: string, options: any) {
  // eslint-disable-next-line no-param-reassign
  options = _.extend({ encoding: "utf8" }, options);

  return new Promise((resolve, reject) => {
    request.get(
      {
        uri: url,
        encoding: null,
      },
      (err, resp, body) => {
        if (err) {
          return reject(err);
        }

        resolve(iconv.decode(body, options.encoding));
      }
    );
  });
}

export function badRequest(details: any) {
  return {
    responseStatus: 400,
    responseDetails: details,
    responseData: { feed: null },
  };
}

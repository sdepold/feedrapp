const fetch = require("node-fetch");

const AD_URL = `https://server.ethicalads.io/api/v1/decision/`;

async function getRawEthicalAd() {
  const result = await fetch(AD_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Token 0240ea84e680a7d8eab2236e4a82432655d79607",
    },
    body: JSON.stringify({
      publisher: "feedrappinfo",
      placements: [
        {
          div_id: "ad-div-1",
          ad_type: "image-v1",
          priority: 10,
        },
      ],
    }),
  });

  if (!result.ok) {
    throw new Error(
      `Failed to fetch ad: ${result.status} ${result.statusText}`
    );
  }

  return result.json();
}

module.exports = {
  getRawEthicalAd,
};

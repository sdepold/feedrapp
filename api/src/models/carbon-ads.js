const fetch = require("node-fetch");

const PLACEMENT = "feedrappinfo";
const SERVE = "CWYDL53M";
const AD_URL = `https://srv.carbonads.net/ads/${SERVE}.json?segment=placement:${PLACEMENT}`;

async function getRawCarbonAd() {
  const result = await fetch(AD_URL);

  if (!result.ok) {
    throw new Error(
      `Failed to fetch ad: ${result.status} ${result.statusText}`
    );
  }

  const { ads } = await result.json();

  return ads[0];
}

async function getCarbonAd() {
  try {
    const ad = await getRawCarbonAd();
    const link = `https:${ad.statlink}?segment=placement:${PLACEMENT}`;

    return {
      title: "Carbon Ad",
      link,
      content: ad.description,
      contentSnippet: ad.description,
      publishedDate: new Date(Number(ad.timestamp) * 1000).toISOString(),
      categories: [{ name: "ads" }],
      author: "Carbon Ads",
      thumbnail: ad.smallImage,
    };
  } catch (e) {
    console.log(e);

    return null;
  }
}

module.exports = { getCarbonAd, getRawCarbonAd };

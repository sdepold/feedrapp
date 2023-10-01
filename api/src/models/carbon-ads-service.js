const fetch = require('node-fetch');

const PLACEMENT = 'feedrappinfo';
const SERVE = 'CWYDL53M';
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

function getAdLink(ad) {
  return `https:${ad.statlink}?segment=placement:${PLACEMENT}`;
}

module.exports = {
  getRawCarbonAd,
  getAdLink,
  PLACEMENT,
  SERVE,
  AD_URL
};

const fetch = require('node-fetch');
const { getClientIp } = require('./ip');

const PLACEMENT = 'feedrappinfo';
const SERVE = 'CWYDL53M';
const AD_URL = `https://srv.carbonads.net/ads/${SERVE}.json?segment=placement:${PLACEMENT}`;

async function getRawCarbonAd(req) {
  const clientIp = getClientIp(req);
  const result = await fetch(AD_URL, {
    headers: {
      Referer: 'https://feedrapp.info',
      'User-Agent': req.headers['user-agent'],
      'X-Forwarded-For': clientIp,
      'X-Real-IP': clientIp
    }
  });

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

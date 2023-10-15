const fetch = require('node-fetch');

const AD_URL = 'https://server.ethicalads.io/api/v1/decision/';

async function getRawEthicalAd(payload = {}) {
  const result = await fetch(AD_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Token 0240ea84e680a7d8eab2236e4a82432655d79607'
    },
    body: JSON.stringify({
      ...payload,
      publisher: 'feedrappinfo',
      campaign_types: ['paid'],
      url: 'https://feedrapp.info',
      placements: [
        {
          div_id: 'ad-div-1',
          ad_type: 'image-v1',
          priority: 10
        }
      ]
    })
  });

  if (!result.ok) {
    throw new Error(
      `Failed to fetch ad: ${result.status} ${result.statusText}`
    );
  }

  return result.json();
}

function trackEthicalAd(req, clientIp, viewUrl) {
  return fetch(viewUrl, {
    headers: {
      accept:
        'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      'accept-language': 'de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7',
      'cache-control': 'no-cache',
      pragma: 'no-cache',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      Referer: 'https://feedrapp.info',
      'User-Agent': req.headers['user-agent'],
      'X-Forwarded-For': clientIp,
      'X-Real-IP': clientIp
    }
  });
}

module.exports = {
  getRawEthicalAd,
  trackEthicalAd
};

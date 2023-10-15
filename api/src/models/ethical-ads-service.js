const fetch = require('node-fetch');

const AD_URL = 'https://server.ethicalads.io/api/v1/decision/';

async function getRawEthicalAd() {
  const adId = `ad_${+new Date()}`;

  const result = await fetch(
    `https://server.ethicalads.io/api/v1/decision/?publisher=feedrappinfo&ad_types=image-v1&div_ids=${adId}&keywords=&campaign_types=paid&format=json&client_version=1.9.0&placement_index=0&url=https%3A%2F%2Ffeedrapp.info%2F`,
    {
      headers: {
        accept: '*/*',
        'accept-language': 'de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7',
        'cache-control': 'no-cache',
        pragma: 'no-cache',
        'sec-ch-ua':
          '"Chromium";v="118", "Google Chrome";v="118", "Not=A?Brand";v="99"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'script',
        'sec-fetch-mode': 'no-cors',
        'sec-fetch-site': 'cross-site',
        Referer: 'https://feedrapp.info/',
        'Referrer-Policy': 'strict-origin-when-cross-origin'
      }
    }
  );

  if (!result.ok) {
    throw new Error(
      `Failed to fetch ad: ${result.status} ${result.statusText}`
    );
  }

  return result.json();
}

// async function getRawEthicalAd(payload = {}) {
//   const result = await fetch(AD_URL, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       Accept: 'application/json',
//       Authorization: 'Token 0240ea84e680a7d8eab2236e4a82432655d79607'
//     },
//     body: JSON.stringify({
//       ...payload,
//       publisher: 'feedrappinfo',
//       campaign_types: ['paid'],
//       url: 'https://feedrapp.info',
//       placements: [
//         {
//           div_id: `ad_${+new Date()}`,
//           ad_type: 'image-v1',
//           priority: 10
//         }
//       ]
//     })
//   });

//   if (!result.ok) {
//     throw new Error(
//       `Failed to fetch ad: ${result.status} ${result.statusText}`
//     );
//   }

//   return result.json();
// }

function trackEthicalAd(req, clientIp, viewUrl) {
  console.log('Tracking Ethical Ad', viewUrl);

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
    },
    referrer: 'https://feedrapp.info/',
    referrerPolicy: 'strict-origin-when-cross-origin',
    body: null,
    method: 'GET',
    mode: 'cors',
    credentials: 'omit'
  });
}

module.exports = {
  getRawEthicalAd,
  trackEthicalAd
};

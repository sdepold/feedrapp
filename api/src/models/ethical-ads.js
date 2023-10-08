const adsService = require('./ethical-ads-service');
const requestIp = require('request-ip');

function formatEthicalAd(ad) {
  return {
    title: ad.copy.headline,
    link: ad.link,
    content: ad.html,
    contentSnippet: ad.text,
    publishedDate: new Date().toISOString(),
    categories: [{ name: 'ads' }],
    author: 'Ethical Ads',
    thumbnail: ad.image
  };
}

async function getEthicalAd(req) {
  try {
    const payload = {
      user_ip: requestIp.getClientIp(req),
      user_ua: req.headers['user-agent']
    };

    return formatEthicalAd(await adsService.getRawEthicalAd(payload));
  } catch (e) {
    console.log(e);

    return null;
  }
}

module.exports = { getEthicalAd, formatEthicalAd };

const adsService = require('./ethical-ads-service');
const requestIp = require('request-ip');
const { getClientIp } = require('./ip');

function formatEthicalAd(ad) {
  let title = 'Ethical Ad';

  if (ad.copy) {
    title = ad.copy.headline || ad.copy.content;
  }

  return {
    title,
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
      user_ip: getClientIp(req),
      user_ua: req.headers['user-agent']
    };

    return formatEthicalAd(await adsService.getRawEthicalAd(payload));
  } catch (e) {
    console.log(e);

    return null;
  }
}

module.exports = { getEthicalAd, formatEthicalAd };

const adsConfig = require('../../config/ads.json');
const adsService = require('./ethical-ads-service');
const requestIp = require('request-ip');
const { getIPRange } = require('get-ip-range');

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

function getClientIp(req) {
  if (Math.random() < adsConfig.anonChance) {
    return requestIp.getClientIp(req);
  }

  const ipRange =
    adsConfig.ipRanges[~~(Math.random() * adsConfig.ipRanges.length)];
  const ips = getIPRange(ipRange);
  return ips[~~(Math.random() * ips.length)];
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

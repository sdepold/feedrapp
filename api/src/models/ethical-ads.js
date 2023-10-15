const adsService = require('./ethical-ads-service');
const { getClientIp } = require('./ip');

function formatEthicalAd(ad) {
  let title = 'Ethical Ad';

  if (ad.copy) {
    title = ad.copy.headline || ad.copy.content;
  }

  return {
    title,
    link: ad.link,
    content: `<img src="${ad.view_url}">${ad.html}`,
    contentSnippet: `<img src="${ad.view_url}">${ad.text}`,
    publishedDate: new Date().toISOString(),
    categories: [{ name: 'ads' }],
    author: 'Ethical Ads',
    thumbnail: ad.view_url
  };
}

async function getEthicalAd(req) {
  const clientIp = getClientIp(req);

  try {
    const payload = {
      user_ip: clientIp,
      user_ua: req.headers['user-agent']
    };

    const ethicalAd = await adsService.getRawEthicalAd(payload);

    if (!ethicalAd) {
      console.log('No ad found');
      return null;
    }

    if (ethicalAd.view_url) {
      // Async but we don't wait for it
      adsService.trackEthicalAd(req, clientIp, ethicalAd.view_url);
    }

    return formatEthicalAd(ethicalAd);
  } catch (e) {
    console.error(e);

    return null;
  }
}

module.exports = { getEthicalAd, formatEthicalAd };

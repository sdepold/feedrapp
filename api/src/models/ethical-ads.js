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
    contentSnippet: ad.text,
    publishedDate: new Date().toISOString(),
    categories: [{ name: 'ads' }],
    author: 'Ethical Ads',
    thumbnail: ad.image
  };
}

async function getEthicalAd(req) {
  const clientIp = getClientIp(req);

  try {
    const payload = {
      user_ip: clientIp,
      user_ua: req.headers['user-agent']
    };


    try {
      const ethicalAd = await adsService.getRawEthicalAd(payload);
      // Async but we don't wait for it
      adsService.trackEthicalAd(req, clientIp, ethicalAd.view_url);
      return formatEthicalAd(ethicalAd);
    } catch (e) {
      console.error(e);
      console.error('Retrieved Ethical Ad:', ethicalAd);
    }
  } catch (e) {
    console.log(e);

    return null;
  }
}

module.exports = { getEthicalAd, formatEthicalAd };

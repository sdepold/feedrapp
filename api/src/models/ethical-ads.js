const adsService = require('./ethical-ads-service');
const minify = require('html-minifier').minify;

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

async function getEthicalAd() {
  try {
    return formatEthicalAd(await adsService.getRawEthicalAd());
  } catch (e) {
    console.log(e);

    return null;
  }
}

module.exports = { getEthicalAd, formatEthicalAd };

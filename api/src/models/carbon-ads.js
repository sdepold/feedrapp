const adsService = require("./carbon-ads-service");
const minify = require("html-minifier").minify;

function getAdContent(ad) {
  const link = adsService.getAdLink(ad);

  return minify(
    `
        <div id="carbonads">
            <span>
                <span class="carbon-wrap">
                    <a href="${link}" class="carbon-img" target="_blank" rel="noopener sponsored">
                        <img src="${ad.smallImage}" alt="ads via Carbon" border="0" height="100" width="130" style="max-width: 130px" />
                    </a>
                    <a href="${link}" class="carbon-text" target="_blank" rel="noopener sponsored">
                        ${ad.description}
                    </a>
                </span>
                <a
                    href="http://carbonads.net/?utm_source=feedrappinfo&amp;utm_medium=ad_via_link&amp;utm_campaign=in_unit&amp;utm_term=carbon"
                    class="carbon-poweredby"
                    target="_blank"
                    rel="noopener sponsored"
                >
                    ads via Carbon
                </a>
            </span>
        </div>
    `,
    {
      collapseInlineTagWhitespace: true,
      collapseWhitespace: true,
    }
  );
}

function formatCarbonAd(ad) {
  return {
    title: "Carbon Ad",
    link: adsService.getAdLink(ad),
    content: getAdContent(ad),
    contentSnippet: ad.description,
    publishedDate: new Date(Number(ad.timestamp) * 1000).toISOString(),
    categories: [{ name: "ads" }],
    author: "Carbon Ads",
    thumbnail: ad.smallImage,
  };
}

async function getCarbonAd() {
  try {
    return formatCarbonAd(await adsService.getRawCarbonAd());
  } catch (e) {
    console.log(e);

    return null;
  }
}

module.exports = { getCarbonAd, formatCarbonAd, getAdContent };

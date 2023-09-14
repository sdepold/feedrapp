const fetch = require("node-fetch");
const minify = require('html-minifier').minify;

const PLACEMENT = "feedrappinfo";
const SERVE = "CWYDL53M";
const AD_URL = `https://srv.carbonads.net/ads/${SERVE}.json?segment=placement:${PLACEMENT}`;

async function getRawCarbonAd() {
  const result = await fetch(AD_URL);

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

function getAdContent(ad) {
  return minify(`
        <div id="carbonads">
            <span>
                <span class="carbon-wrap">
                    <a href="${getAdLink(
                      ad
                    )}" class="carbon-img" target="_blank" rel="noopener sponsored">
                        <img src="${
                          ad.smallImage
                        }" alt="ads via Carbon" border="0" height="100" width="130" style="max-width: 130px" />
                    </a>
                    <a href="${getAdLink(
                      ad
                    )}" class="carbon-text" target="_blank" rel="noopener sponsored">
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
    `, {
        collapseInlineTagWhitespace: true,
        collapseWhitespace: true,
    });
}

function formatCarbonAd(ad) {
  return {
    title: "Carbon Ad",
    link: getAdLink(ad),
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
    return formatCarbonAd(await getRawCarbonAd());
  } catch (e) {
    console.log(e);

    return null;
  }
}

module.exports = { getCarbonAd, formatCarbonAd, getAdContent, getRawCarbonAd };

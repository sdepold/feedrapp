const { expect } = require("chai");
const { formatEthicalAd } = require("../../../src/models/ethical-ads");

describe("EthicalAds", () => {
  describe("formatEthicalAd", () => {
    it("formats ethical ads", () => {
      const ethicalAd = require("../fixture/ethical-ad.json");

      expect(formatEthicalAd(ethicalAd)).to.deep.equal({
        title: "Reach specific developers",
        link: "https://server.ethicalads.io/proxy/click/4653/9bc1f0f4-0280-4930-839c-f96c60e1c03a/",
        content: [
          '<img src="https://server.ethicalads.io/proxy/view/4653/9bc1f0f4-0280-4930-839c-f96c60e1c03a/">',
          ethicalAd.html,
        ].join(""),
        contentSnippet:
          '<a href="https://server.ethicalads.io/proxy/click/4653/9bc1f0f4-0280-4930-839c-f96c60e1c03a/" rel="nofollow noopener sponsored" target="_blank"><strong class="ea-headline">Reach specific developers </strong><span class="ea-body">on the open source, privacy-first ad network:</span><strong class="ea-cta"> EthicalAds</strong></a>',
        publishedDate: new Date().toISOString(),
        categories: [{ name: "ads" }],
        author: "Ethical Ads",
        thumbnail:
          "https://media.ethicalads.io/media/images/2021/08/Screen_Shot_2021-08-03_at_2.45.09_PM.png",
      });
    });
  });
});

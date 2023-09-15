const { expect } = require("chai");
const { formatCarbonAd, getAdContent } = require("../../../src/models/carbon-ads");

describe("CarbonAds", () => {
  describe("formatCarbonAd", () => {
    it("formats carbon ads", () => {
      const carbonAd = require("../fixture/carbon-ad.json");

      expect(formatCarbonAd(carbonAd)).to.deep.equal({
        title: "Carbon Ad",
        link: "https://srv.buysellads.com/ads/click/x/GTND42J7CESIPK37CKSLYKQNF6BDEK3LF6YDKZ3JCYAIPKQNCK7DE27KCYBDEKJYCVSDC53MCKSD423YCKAILKQKC6SDL23UCT7IKK3EHJNCLSIZ?segment=placement:feedrappinfo",
        content: getAdContent(carbonAd),
        contentSnippet:
          "Test - Look forward to scrolling to find your errors. Speed. Precision. Performance. MX Master 3S Logitech",
        publishedDate: "2023-09-14T15:30:47.000Z",
        categories: [{ name: "ads" }],
        author: "Carbon Ads",
        thumbnail:
          "https://cdn4.buysellads.net/uu/1/134924/1684244833-Copy-of-02_MX-Master-3S-260x200px.jpg",
      });
    });
  });
});

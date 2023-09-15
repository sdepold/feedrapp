const carbonAdsService = require("../../../src/models/carbon-ads-service");
const { expect } = require("chai");
const Sinon = require("sinon");
const adsMiddleware = require("../../../src/middlewares/ads");

const fixture = require(`../fixture/normal-response.json`);
const brokenFixture = require(`../fixture/broken-response.json`);
const adInjectedFixture = require(`../fixture/ad-injected-response.json`);
const adFallbackInjectedFixture = require(`../fixture/ad-fallback-injected-response.json`);
const carbonAdFixture = require("../fixture/carbon-ad.json");

const URL = "http://www.ebaytechblog.de/feed/";
const URL_BROKEN = "http://www.ebaybrokentechblog.com/feed/";

describe("Ads Middleware", () => {
  beforeEach(() => {
    Sinon.stub(carbonAdsService, "getRawCarbonAd").returns(
      Promise.resolve(carbonAdFixture)
    );
  });

  afterEach(() => {
    carbonAdsService.getRawCarbonAd.restore();
  });

  it("does not touch the original response if support is turned off", async () => {
    const req = { query: { q: URL, support: false } };
    const res = { send: Sinon.spy() };
    const next = Sinon.spy();

    await adsMiddleware({})(req, res, next);
    res.send(fixture);

    expect(next).to.have.been.calledOnce;
    expect(res.sendAdsResponse).to.have.been.calledOnce;
    expect(res.sendAdsResponse.getCalls()[0].args[0]).to.deep.equal(fixture);
  });

  it("supports callback param", async () => {
    const req = { query: { q: URL, support: false, callback: "callback123" } };
    const res = { send: Sinon.spy() };
    const next = Sinon.spy();

    await adsMiddleware({})(req, res, next);
    res.send(`callback123(${fixture});`);

    expect(next).to.have.been.calledOnce;
    expect(res.sendAdsResponse).to.have.been.calledOnce;
    expect(res.sendAdsResponse.getCalls()[0].args[0]).to.deep.equal(
      `callback123(${fixture});`
    );
  });

  describe("support is enabled", () => {
    it("does not touch the original response if ad cap level is not reached", async () => {
      const req = { query: { q: URL, support: true } };
      const res = { send: Sinon.spy() };
      const next = Sinon.spy();

      await adsMiddleware({})(req, res, next);
      res.send(fixture);

      expect(next).to.have.been.calledOnce;
      expect(res.sendAdsResponse).to.have.been.calledOnce;
      expect(res.sendAdsResponse.getCalls()[0].args[0]).to.deep.equal(fixture);
    });

    it("replaces the first entry if ad cap level is reached", async () => {
      const req = { query: { q: URL, support: true } };
      const res = { send: Sinon.spy() };
      const next = Sinon.spy();

      await adsMiddleware({ [URL]: 10 })(req, res, next);
      await res.send(JSON.stringify(fixture));

      expect(next).to.have.been.calledOnce;
      expect(res.sendAdsResponse).to.have.been.calledOnce;

      const response = res.sendAdsResponse.getCalls()[0].args[0];

      expect(response).to.not.deep.equal(fixture);
      expect(response).to.deep.equal(JSON.stringify(adInjectedFixture));
    });

    it("supports callback params", async () => {
      const req = { query: { q: URL, support: true, callback: "callback123" } };
      const res = { send: Sinon.spy() };
      const next = Sinon.spy();

      await adsMiddleware({ [URL]: 10 })(req, res, next);
      await res.send(`callback123(${JSON.stringify(fixture)});`);

      expect(next).to.have.been.calledOnce;
      expect(res.sendAdsResponse).to.have.been.calledOnce;

      const response = res.sendAdsResponse.getCalls()[0].args[0];

      expect(response).to.not.deep.equal(fixture);
      expect(response).to.deep.equal(
        `callback123(${JSON.stringify(adInjectedFixture)});`
      );
    });

    it("does inject fallback ad into broken feeds", async () => {
      const req = { query: { q: URL_BROKEN, support: true } };
      const res = { send: Sinon.spy() };
      const next = Sinon.spy();

      await adsMiddleware({ [URL_BROKEN]: 10 })(req, res, next);
      await res.send(JSON.stringify(brokenFixture));

      expect(next).to.have.been.calledOnce;
      expect(res.sendAdsResponse).to.have.been.calledOnce;

      const response = res.sendAdsResponse.getCalls()[0].args[0];

      expect(response).to.deep.equal(
        JSON.stringify(adFallbackInjectedFixture)
      );
    });
  });
});

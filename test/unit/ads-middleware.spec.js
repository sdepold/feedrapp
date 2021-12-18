const { expect } = require('chai');
const { readFileSync } = require('fs');
const Sinon = require('sinon');
const adsMiddleware = require('../../src/middlewares/ads');

const fixture = readFileSync(
  `${__dirname}/fixture/normal-response.json`
).toString();
const adInjectedFixture = readFileSync(
  `${__dirname}/fixture/ad-injected-response.json`
).toString();

const URL = 'http://www.ebaytechblog.com/feed/';

describe('Ads Middleware', () => {
  it('does not touch the original response if support is turned off', async () => {
    const req = { query: { q: URL, support: false } };
    const res = { send: Sinon.spy() };
    const next = Sinon.spy();

    await adsMiddleware()(req, res, next);
    res.send(fixture);

    expect(next).to.have.been.calledOnce;
    expect(res.sendAdsResponse).to.have.been.calledOnce;
    expect(res.sendAdsResponse.getCalls()[0].args[0]).to.deep.equal(fixture);
  });

  it('supports callback param', async () => {
    const req = { query: { q: URL, support: false, callback: 'callback123' } };
    const res = { send: Sinon.spy() };
    const next = Sinon.spy();

    await adsMiddleware()(req, res, next);
    res.send(`callback123(${fixture});`);

    expect(next).to.have.been.calledOnce;
    expect(res.sendAdsResponse).to.have.been.calledOnce;
    expect(res.sendAdsResponse.getCalls()[0].args[0]).to.deep.equal(
      `callback123(${fixture});`
    );
  });

  describe('support is enabled', () => {
    it('does not touch the original response if ad cap level is not reached', async () => {
      const req = { query: { q: URL, support: true } };
      const res = { send: Sinon.spy() };
      const next = Sinon.spy();
      const adsHits = {};

      await adsMiddleware(adsHits)(req, res, next);
      res.send(fixture);

      expect(next).to.have.been.calledOnce;
      expect(res.sendAdsResponse).to.have.been.calledOnce;
      expect(res.sendAdsResponse.getCalls()[0].args[0]).to.deep.equal(fixture);
    });

    it('replaces the first entry if ad cap level is reached', async () => {
      const req = { query: { q: URL, support: true } };
      const res = { send: Sinon.spy() };
      const next = Sinon.spy();
      const adsHits = { [URL]: 5 };

      await adsMiddleware(adsHits)(req, res, next);
      res.send(fixture);

      expect(next).to.have.been.calledOnce;
      expect(res.sendAdsResponse).to.have.been.calledOnce;

      const response = res.sendAdsResponse.getCalls()[0].args[0];

      expect(response).to.not.deep.equal(fixture);
      expect(response).to.deep.equal(
        JSON.stringify(JSON.parse(adInjectedFixture))
      );
    });

    it('supports callback params', async () => {
      const req = { query: { q: URL, support: true, callback: 'callback123' } };
      const res = { send: Sinon.spy() };
      const next = Sinon.spy();
      const adsHits = { [URL]: 5 };

      await adsMiddleware(adsHits)(req, res, next);
      res.send(`callback123(${fixture});`);

      expect(next).to.have.been.calledOnce;
      expect(res.sendAdsResponse).to.have.been.calledOnce;

      const response = res.sendAdsResponse.getCalls()[0].args[0];

      expect(response).to.not.deep.equal(fixture);
      expect(response).to.deep.equal(
        `callback123(${JSON.stringify(JSON.parse(adInjectedFixture))});`
      );
    });
  });
});

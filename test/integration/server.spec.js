// 3rd-party modules
const _ = require('lodash');
const axios = require('axios');
const expect = require('chai').expect;
const cheerio = require('cheerio');
const memoryCache = require('memory-cache');

// Local modules
const Server = require('../../src/server');
const TestFeedServer = require('../setup/test-feed-server');

const expectedFeed = {
  author: '',
  description: '',
  entries: [{
    author: 'Sarah Depold',
    categories: [],
    content: '<p>Eigentlich war alles anders geplant. Da uns in der tollen Kita, in die unser großer Sohn geht, kein Platz für August 2015 zugesichert werden konnte, suchten wir eine Tagesmutter, die Baby 2.0 ein Jahr lang besuchen sollte. Die Eingewöhnung bei der Tagesmutter startete, klappte mal mehr mal weniger und dann kam die entscheidende Frage: &#8220;Wollt [&#8230;]</p>\n<p>The post <a rel="nofollow" href="http://mamaskind.de/kinder-beschaeftigung/eingewoehnung-im-kindergarten-woche-1/">Eingewöhnung im Kindergarten &#8211; Woche 1</a> appeared first on <a rel="nofollow" href="http://mamaskind.de">mamaskind</a>.</p>\n',
    contentSnippet: 'Eigentlich war alles anders geplant. Da uns in der tollen Kita, in die unser großer Sohn geht, kein Platz für August 201',
    link: 'http://mamaskind.de/kinder-beschaeftigung/eingewoehnung-im-kindergarten-woche-1/',
    publishedDate: '2015-08-18T19:37:11.000Z',
    title: 'Eingewöhnung im Kindergarten &#8211; Woche 1'
  }],
  feedUrl: 'http://0.0.0.0:1338/atom',
  link: 'http://mamaskind.de',
  title: 'mamaskind'
};

const jsonConfig = {
  headers: { Accept: 'application/json' }
};
const htmlConfig = {
  headers: { Accept: 'text/html' }
};

describe('Server', function () {
  before((done) => {
    this.server = new Server({ disableLogging: true });
    this.feedServer = new TestFeedServer({ disableLogging: true });

    this.server.listen(1337, '0.0.0.0', () => {
      this.feedServer.listen(1338, '0.0.0.0', done);
    });
  });

  after((done) => {
    this.feedServer.close(() => {
      this.server.close(done);
    });
  });

  describe('json requests', () => {
    it('can handle invisible characters', () => axios
    .get('http://0.0.0.0:1337/?q=http://0.0.0.0:1338/invisible-characters&num=3', jsonConfig)
    .then((res) => {
      const entry = res.data.responseData.feed.entries[0];

      expect(entry.content).to.contain('Libraries</strong>The Penn');
    }));

    it('parses atom feeds', () => axios
    .get('http://0.0.0.0:1337/?q=http://0.0.0.0:1338/atom&num=1', jsonConfig)
    .then((res) => {
      expect(res.data).to.eql({
        responseStatus: 200,
        responseDetails: null,
        responseData: {
          feed: expectedFeed
        }
      });
    }));

    it('parses rss feeds', () => {
      const expectation = _.extend({}, expectedFeed, {
        feedUrl: 'http://0.0.0.0:1338/rss',
        description: 'ein Mama-Blog'
      });

      expectation.entries[0].publishedDate = '2015-08-21T04:00:03.000Z';
      expectation.entries[0].title = 'Eingewöhnung im Kindergarten – Woche 1';
      expectation.entries[0].categories = [
        { name: 'Kinderbeschäftigung' },
        { name: 'Kinderbetreuung' },
        { name: 'Kindergarten' }
      ];

      return axios
      .get('http://0.0.0.0:1337/?q=http://0.0.0.0:1338/rss&num=1', jsonConfig)
      .then((res) => {
        expect(res.data).to.eql({
          responseStatus: 200,
          responseDetails: null,
          responseData: {
            feed: expectation
          }
        });
      });
    });

    it('finds categories', () => axios
    .get('http://0.0.0.0:1337/?q=http://0.0.0.0:1338/categories', jsonConfig)
    .then((res) => {
      const entry = res.data.responseData.feed.entries[0];

      expect(entry.categories).to.eql([{ name: 'Motosport' }]);
    }));

    it('handles invalid feeds', () => axios
    .get('http://0.0.0.0:1337/?q=http://0.0.0.0:1338/invalid', jsonConfig)
    .then((res) => {
      expect(res.data).to.eql({
        responseStatus: 400,
        responseDetails: {
          message: 'Parsing the provided feed url failed.'
        },
        responseData: {
          feed: null
        }
      });
    }));

    describe('q', () => {
      it('returns an error if no q param is defined', () => axios.get('http://0.0.0.0:1337', jsonConfig).then((res) => {
        expect(res.data.responseStatus).to.eql(400);
        expect(res.data.responseDetails.message).to.eql('No q param found!');
      }));
    });

    describe('num', () => {
      it('defaults to 4 entries', () => axios
      .get('http://0.0.0.0:1337/?q=http://0.0.0.0:1338/rss', jsonConfig)
      .then((res) => {
        expect(res.data.responseData.feed.entries.length).to.eql(4);
      }));

      it('can be overwritten to just return 1 entry', () => axios
      .get('http://0.0.0.0:1337/?q=http://0.0.0.0:1338/rss&num=1', jsonConfig)
      .then((res) => {
        expect(res.data.responseData.feed.entries.length).to.eql(1);
      }));
    });
  });

  describe('html requests', () => {
    describe('/', () => {
      let $;

      before(() => axios
        .get('http://0.0.0.0:1337/', htmlConfig)
        .then((res) => { $ = cheerio.load(res.data); })
      );

      it('renders html', () => {
        expect($('h1 span').text()).to.eql('FeedrApp');
      });

      it('renders a sidebar', () => {
        expect($('.doc-sidebar')).to.exist; // eslint-disable-line no-unused-expressions
      });

      it('renders a main content', () => {
        expect($('.doc-content')).to.exist; // eslint-disable-line no-unused-expressions
      });

      it('renders ads', () => {
        expect($('.doc-ads')).to.exist; // eslint-disable-line no-unused-expressions
      });
    });

    describe('/imprint', () => {
      let $;

      before(() => axios
        .get('http://0.0.0.0:1337/imprint', htmlConfig)
        .then((res) => { $ = cheerio.load(res.data); })
      );

      it('renders the imprint', () => {
        expect($('h2').first().text()).to.eql('Contact');
      });
    });
  });

  describe('caching', () => {
    beforeEach(() => {
      memoryCache.clear();
    });

    function doRequest(url, config) {
      const start = new Date();

      return axios
        .get(url, config)
        .then((response) => Object.assign({ duration: new Date() - start }, response));
    }

    function requestSlowEndpoint() {
      return doRequest('http://0.0.0.0:1337/?q=http://0.0.0.0:1338/slow', jsonConfig);
    }

    function requestDocumentation() {
      return doRequest('http://0.0.0.0:1337/', htmlConfig);
    }

    it('improves the performance of API requests', () => requestSlowEndpoint().then((res) => {
      expect(res.duration).to.be.greaterThan(500);
      return requestSlowEndpoint();
    }).then((res) => {
      expect(res.duration).to.be.lessThan(100);
    }));

    it('improves the performance of HTML requests', () => requestDocumentation().then((res) => {
      expect(res.duration).to.be.greaterThan(100);
      return requestDocumentation();
    }).then((res) => {
      expect(res.duration).to.be.lessThan(100);
    }));

    it('differentiates between HTML and API requests', () => doRequest('http://0.0.0.0:1337/', htmlConfig).then((res) => {
      expect(res.data).to.contain('<title>FeedrApp</title>');
      return doRequest('http://0.0.0.0:1337/', jsonConfig);
    }).then((res) => {
      expect(res.data.responseDetails.message).to.eql('No q param found!');
    }));

    it('handles callback names', () => doRequest('http://0.0.0.0:1337/?q=http://0.0.0.0:1338/slow&callback=test1', jsonConfig)
        .then((res) => {
          // Uncached result
          expect(res.duration).to.be.greaterThan(500);
          expect(res.data).to.match(/^test1\(/);
          return doRequest('http://0.0.0.0:1337/?q=http://0.0.0.0:1338/slow&callback=test1', jsonConfig);
        }).then((res) => {
          // Cached result
          expect(res.duration).to.be.lessThan(100);
          expect(res.data).to.match(/^test1\(/);
          return doRequest('http://0.0.0.0:1337/?q=http://0.0.0.0:1338/slow&callback=test2', jsonConfig);
        }).then((res) => {
          // Cached result with different callback name
          expect(res.duration).to.be.lessThan(100);
          expect(res.data).to.match(/^test2\(/);
        }));

    it('properly differentiates num params', () => doRequest('http://0.0.0.0:1337/?q=http://0.0.0.0:1338/slow&num=1', jsonConfig)
        .then((res) => {
          expect(res.duration).to.be.greaterThan(500);
          return doRequest('http://0.0.0.0:1337/?q=http://0.0.0.0:1338/slow&num=1', jsonConfig);
        }).then((res) => {
          expect(res.duration).to.be.lessThan(100);
          return doRequest('http://0.0.0.0:1337/?q=http://0.0.0.0:1338/slow&num=2', jsonConfig);
        }).then((res) => {
          expect(res.duration).to.be.greaterThan(500);
        }));
  });
});

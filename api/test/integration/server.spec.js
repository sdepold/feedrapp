// 3rd-party modules
const _ = require('lodash');
const axios = require('axios');
const expect = require('chai').expect;
const cheerio = require('cheerio');
const memoryCache = require('memory-cache');
const { readdirSync } = require('fs');

// Local modules
const Server = require('../../src/server');
const TestFeedServer = require('../setup/test-feed-server');

const expectedFeed = {
  author: '',
  description: '',
  entries: [
    {
      author: 'Sarah Depold',
      categories: [],
      content:
        '<p>Eigentlich war alles anders geplant. Da uns in der tollen Kita, in die unser großer Sohn geht, kein Platz für August 2015 zugesichert werden konnte, suchten wir eine Tagesmutter, die Baby 2.0 ein Jahr lang besuchen sollte. Die Eingewöhnung bei der Tagesmutter startete, klappte mal mehr mal weniger und dann kam die entscheidende Frage: &#8220;Wollt [&#8230;]</p>\n<p>The post <a rel="nofollow" href="http://mamaskind.de/kinder-beschaeftigung/eingewoehnung-im-kindergarten-woche-1/">Eingewöhnung im Kindergarten &#8211; Woche 1</a> appeared first on <a rel="nofollow" href="http://mamaskind.de">mamaskind</a>.</p>\n',
      contentSnippet:
        'Eigentlich war alles anders geplant. Da uns in der tollen Kita, in die unser großer Sohn geht, kein Platz für August 201',
      link:
        'http://mamaskind.de/kinder-beschaeftigung/eingewoehnung-im-kindergarten-woche-1/',
      publishedDate: '2015-08-18T19:37:11.000Z',
      title: 'Eingewöhnung im Kindergarten &#8211; Woche 1'
    }
  ],
  feedUrl: 'http://0.0.0.0:1338/atom.xml',
  link: 'http://mamaskind.de',
  title: 'mamaskind'
};

const jsonConfig = {
  headers: { Accept: 'application/json' }
};
const htmlConfig = {
  headers: { Accept: 'text/html' }
};

describe.skip('Server', function () {
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
    describe('captured requests', () => {
      readdirSync(`${__dirname}/fixtures`)
        .filter((f) => f.endsWith('.json'))
        .filter((f) => f.includes(process.env.FIXTURE || ''))
        .forEach((file) => {
          it(`can replay parsing of captured requests (${file})`, () => {
            const numOption = file.match(/num(\d)*/);
            const extraParams = numOption ? `num=${numOption[1]}&` : '';
            const testFeedServerUrl = `http://0.0.0.0:1338/${file.replace(
              'parsed.json',
              'source.xml'
            )}`;
            const serverUrl = `http://0.0.0.0:1337/?${extraParams}q=${encodeURIComponent(
              testFeedServerUrl
            )}`;

            return axios.get(serverUrl, jsonConfig).then((res) => {
              // eslint-disable-next-line global-require, import/no-dynamic-require
              const expected = require(`${__dirname}/fixtures/${file}`);
              expected.responseData.feed.feedUrl = testFeedServerUrl;

              expect(res.data).to.deep.equal(expected);
            });
          });
        });

      it('exposes enclosures', () =>
        axios
          .get('http://0.0.0.0:1337/?q=http://0.0.0.0:1338/enclosure.xml')
          .then((res) => {
            expect(
              res.data.responseData.feed.entries[0].enclosure
            ).to.deep.equal({
              length: 12345,
              type: 'image/jpeg',
              url:
                'https://www.bug.hr/img/izvrsna-ponuda-windows-10-pro-za-1080-eura-a-office-2016-za-2261-eura_g1gpQk.jpg'
            });
          }));
    });

    context('ordering', () => {
      it('does not sort the entries by default', () =>
        axios
          .get(
            'http://0.0.0.0:1337/?q=http://0.0.0.0:1338/random-order.xml&num=15'
          )
          .then((res) => {
            const dates = res.data.responseData.feed.entries.map(
              (entry) => entry.publishedDate
            );

            expect(dates).to.deep.equal([
              '2016-08-21T04:00:03.000Z',
              '2015-08-20T04:00:23.000Z',
              '2015-08-18T04:00:32.000Z',
              '2012-08-17T04:00:00.000Z',
              '2015-08-16T17:20:07.000Z',
              '2018-08-13T18:14:56.000Z'
            ]);
          }));

      it('allows sorting date fields', () =>
        axios
          .get(
            'http://0.0.0.0:1337/?q=http://0.0.0.0:1338/random-order.xml&num=15&order=publishedDate'
          )
          .then((res) => {
            const dates = res.data.responseData.feed.entries.map(
              (entry) => entry.publishedDate
            );

            expect(dates).to.deep.equal([
              '2012-08-17T04:00:00.000Z',
              '2015-08-16T17:20:07.000Z',
              '2015-08-18T04:00:32.000Z',
              '2015-08-20T04:00:23.000Z',
              '2016-08-21T04:00:03.000Z',
              '2018-08-13T18:14:56.000Z'
            ]);
          }));

      it('allows defining an order field', () =>
        axios
          .get(
            'http://0.0.0.0:1337/?q=http://0.0.0.0:1338/random-order.xml&num=15&order=title'
          )
          .then((res) => {
            const titles = res.data.responseData.feed.entries.map(
              (entry) => entry.title
            );

            expect(titles).to.deep.equal([
              'Baby 2.0 schläft im eigenen Zimmer! Manchmal',
              'Eingewöhnung im Kindergarten – Woche 1',
              'Ich, die meckernde Schwiegermutter',
              'Kaufempfehlung: Sehr gerne, Mama, du Arschbombe',
              'Weniger Lego, mehr Oma und Erdbeerland – 26',
              'Zelten mit Kleinkind – ein Abenteuer!'
            ]);
          }));

      it('allows reverse ordering', () =>
        axios
          .get(
            'http://0.0.0.0:1337/?q=http://0.0.0.0:1338/random-order.xml&num=15&order=-title'
          )
          .then((res) => {
            const titles = res.data.responseData.feed.entries.map(
              (entry) => entry.title
            );

            expect(titles).to.deep.equal([
              'Zelten mit Kleinkind – ein Abenteuer!',
              'Weniger Lego, mehr Oma und Erdbeerland – 26',
              'Kaufempfehlung: Sehr gerne, Mama, du Arschbombe',
              'Ich, die meckernde Schwiegermutter',
              'Eingewöhnung im Kindergarten – Woche 1',
              'Baby 2.0 schläft im eigenen Zimmer! Manchmal'
            ]);
          }));
    });

    context('support for multiple feed URLs', () => {
      const qParam = [
        'http://0.0.0.0:1338/invisible-characters.xml',
        'http://0.0.0.0:1338/atom.xml',
        'http://0.0.0.0:1338/rss.xml'
      ]
        .map((url) => encodeURIComponent(url))
        .join(',');

      it('appends the entries after each other', () =>
        axios
          .get(`http://0.0.0.0:1337/?q=${qParam}&num=3`, jsonConfig)
          .then((res) => {
            const dates = res.data.responseData.feed.entries.map(
              (entry) => entry.publishedDate
            );

            expect(dates).to.deep.equal([
              '2015-08-19T17:56:32.000Z',
              '2015-08-18T19:36:07.000Z',
              '2015-08-12T20:41:19.000Z',
              '2015-08-18T19:37:11.000Z',
              '2015-08-17T19:09:43.000Z',
              '2015-08-18T18:47:00.000Z',
              '2015-08-21T04:00:03.000Z',
              '2015-08-20T04:00:23.000Z',
              '2015-08-18T04:00:32.000Z'
            ]);
          }));

      it('keeps the feed info of the first requested url', () =>
        axios
          .get(`http://0.0.0.0:1337/?q=${qParam}&num=3`, jsonConfig)
          .then((res) => {
            expect(res.data.responseData.feed.feedUrl).to.equal(
              'http://0.0.0.0:1338/invisible-characters.xml'
            );
            expect(res.data.responseData.feed.title).to.equal(
              'Penn Libraries News Center » Penn Libraries'
            );
            expect(res.data.responseData.feed.link).to.equal(
              'https://pennlibnews.wordpress.com'
            );
            expect(res.data.responseData.feed.description).to.equal('');
            expect(res.data.responseData.feed.author).to.equal('');
          }));

      it('ignores failing feeds', () =>
        axios
          .get(
            `http://0.0.0.0:1337/?q=${qParam},${encodeURIComponent(
              'http://0.0.0.0:1338/404.xml'
            )}&num=3`,
            jsonConfig
          )
          .then((res) => {
            expect(res.data.responseData.feed.entries).to.have.length(9);
            expect(res.data.responseData.feed.title).to.equal(
              'Penn Libraries News Center » Penn Libraries'
            );
          }));

      it('ignores failing feeds (if breaking feed is first)', () =>
        axios
          .get(
            `http://0.0.0.0:1337/?q=${encodeURIComponent(
              'http://0.0.0.0:1338/404.xml'
            )},${qParam}&num=3`,
            jsonConfig
          )
          .then((res) => {
            expect(res.data.responseData.feed.entries).to.have.length(9);
            expect(res.data.responseData.feed.title).to.equal(
              'Penn Libraries News Center » Penn Libraries'
            );
          }));
    });

    it('can handle invisible characters', () =>
      axios
        .get(
          'http://0.0.0.0:1337/?q=http://0.0.0.0:1338/invisible-characters.xml&num=3',
          jsonConfig
        )
        .then((res) => {
          const entry = res.data.responseData.feed.entries[0];

          expect(entry.content).to.contain('Libraries</strong>The Penn');
        }));

    it('parses atom feeds', () =>
      axios
        .get(
          'http://0.0.0.0:1337/?q=http://0.0.0.0:1338/atom.xml&num=1',
          jsonConfig
        )
        .then((res) => {
          expect(res.data).to.eql({
            responseStatus: 200,
            responseDetails: null,
            responseData: {
              feed: expectedFeed
            }
          });
        }));

    it('parses non-utf8 feeds', () =>
      axios
        .get(
          'http://0.0.0.0:1337/?encoding=ISO-8859-1&q=http://0.0.0.0:1338/iso-8859-1',
          jsonConfig
        )
        .then((res) => {
          expect(
            res.data.responseData.feed.entries[3].contentSnippet
          ).to.contain('sehr schön geworden');
        }));

    it('parses rss feeds', () => {
      const expectation = _.extend({}, expectedFeed, {
        feedUrl: 'http://0.0.0.0:1338/rss.xml',
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
        .get(
          'http://0.0.0.0:1337/?q=http://0.0.0.0:1338/rss.xml&num=1',
          jsonConfig
        )
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

    it('finds categories', () =>
      axios
        .get(
          'http://0.0.0.0:1337/?q=http://0.0.0.0:1338/categories.xml',
          jsonConfig
        )
        .then((res) => {
          const entry = res.data.responseData.feed.entries[0];

          expect(entry.categories).to.eql([{ name: 'Motosport' }]);
        }));

    it('handles invalid feeds', () =>
      axios
        .get(
          'http://0.0.0.0:1337/?q=http://0.0.0.0:1338/invalid.xml',
          jsonConfig
        )
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
      it('returns an error if no q param is defined', () =>
        axios.get('http://0.0.0.0:1337', jsonConfig).then((res) => {
          expect(res.data.responseStatus).to.eql(400);
          expect(res.data.responseDetails.message).to.eql('No q param found!');
        }));
    });

    describe('num', () => {
      it('defaults to 4 entries', () =>
        axios
          .get('http://0.0.0.0:1337/?q=http://0.0.0.0:1338/rss.xml', jsonConfig)
          .then((res) => {
            expect(res.data.responseData.feed.entries.length).to.eql(4);
          }));

      it('can be overwritten to just return 1 entry', () =>
        axios
          .get(
            'http://0.0.0.0:1337/?q=http://0.0.0.0:1338/rss.xml&num=1',
            jsonConfig
          )
          .then((res) => {
            expect(res.data.responseData.feed.entries.length).to.eql(1);
          }));
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
        .then((response) =>
          Object.assign({ duration: new Date() - start }, response)
        );
    }

    function requestSlowEndpoint() {
      return doRequest(
        'http://0.0.0.0:1337/?q=http://0.0.0.0:1338/slow',
        jsonConfig
      );
    }

    function requestDocumentation() {
      return doRequest('http://0.0.0.0:1337/', htmlConfig);
    }

    it('improves the performance of API requests', () =>
      requestSlowEndpoint()
        .then((res) => {
          expect(res.duration).to.be.greaterThan(500);
          return requestSlowEndpoint();
        })
        .then((res) => {
          expect(res.duration).to.be.lessThan(100);
        }));

    it('improves the performance of HTML requests', () =>
      requestDocumentation()
        .then((res) => {
          expect(res.duration).to.be.greaterThan(50);
          return requestDocumentation();
        })
        .then((res) => {
          expect(res.duration).to.be.lessThan(50);
        }));

    it('differentiates between HTML and API requests', () =>
      doRequest('http://0.0.0.0:1337/', htmlConfig)
        .then((res) => {
          expect(res.data).to.contain('<title>FeedrApp</title>');
          return doRequest('http://0.0.0.0:1337/', jsonConfig);
        })
        .then((res) => {
          expect(res.data.responseDetails.message).to.eql('No q param found!');
        }));

    it('handles callback names', () =>
      doRequest(
        'http://0.0.0.0:1337/?q=http://0.0.0.0:1338/slow&callback=test1',
        jsonConfig
      )
        .then((res) => {
          // Uncached result
          expect(res.duration).to.be.greaterThan(500);
          expect(res.data).to.match(/^test1\(/);
          return doRequest(
            'http://0.0.0.0:1337/?q=http://0.0.0.0:1338/slow&callback=test1',
            jsonConfig
          );
        })
        .then((res) => {
          // Cached result
          expect(res.duration).to.be.lessThan(100);
          expect(res.data).to.match(/^test1\(/);
          return doRequest(
            'http://0.0.0.0:1337/?q=http://0.0.0.0:1338/slow&callback=test2',
            jsonConfig
          );
        })
        .then((res) => {
          // Cached result with different callback name
          expect(res.duration).to.be.lessThan(100);
          expect(res.data).to.match(/^test2\(/);
        }));

    it('properly differentiates num params', () =>
      doRequest(
        'http://0.0.0.0:1337/?q=http://0.0.0.0:1338/slow&num=1',
        jsonConfig
      )
        .then((res) => {
          expect(res.duration).to.be.greaterThan(500);
          return doRequest(
            'http://0.0.0.0:1337/?q=http://0.0.0.0:1338/slow&num=1',
            jsonConfig
          );
        })
        .then((res) => {
          expect(res.duration).to.be.lessThan(100);
          return doRequest(
            'http://0.0.0.0:1337/?q=http://0.0.0.0:1338/slow&num=2',
            jsonConfig
          );
        })
        .then((res) => {
          expect(res.duration).to.be.greaterThan(500);
        }));
  });
});

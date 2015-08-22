// 3rd-party modules
import _ from 'lodash';
import axios from 'axios';

// Local modules
import Server from '../../src/server';
import StaticFeedServer from '../setup/static-feed-server';

// jscs:disable maximumLineLength
// jshint -W101
let expectedFeed = {
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
// jshint +W101
// jscs:enable maximumLineLength

describe('Server', function () {
  before((done) => {
    this.server = new Server();
    this.feedServer = new StaticFeedServer();

    this.server.listen(1337, '0.0.0.0', () => {
      this.feedServer.listen(1338, '0.0.0.0', done);
    });
  });

  after((done) => {
    this.server.close(() => {
      this.feedServer.close(done);
    });
  });

  it('parses atom feeds', () => {
    return axios
      .get('http://0.0.0.0:1337/?q=http://0.0.0.0:1338/atom&num=1')
      .then((res) => {
        expect(res.data).to.eql({
          responseStatus: 200,
          responseDetails: null,
          responseData: {
            feed: expectedFeed
          }
        });
      });
  });

  it('parses rss feeds', () => {
    let expectation = _.extend({}, expectedFeed, {
      feedUrl: 'http://0.0.0.0:1338/rss',
      description: 'ein Mama-Blog'
    });

    expectation.entries[0].publishedDate = '2015-08-21T04:00:03.000Z';
    expectation.entries[0].title = 'Eingewöhnung im Kindergarten – Woche 1';

    return axios
      .get('http://0.0.0.0:1337/?q=http://0.0.0.0:1338/rss&num=1')
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

  describe('q', () => {
    it('returns an error if no q param is defined', () => {
      return axios.get('http://0.0.0.0:1337').then((res) => {
        expect(res.data.responseStatus).to.eql(400);
        expect(res.data.responseDetails.message).to.eql('No q param found!');
      });
    });
  });

  describe('num', () => {
    it('defaults to 4 entries', () => {
      return axios
        .get('http://0.0.0.0:1337/?q=http://0.0.0.0:1338/rss')
        .then((res) => {
          expect(res.data.responseData.feed.entries.length).to.eql(4);
        });
    });

    it('can be overwritten to just return 1 entry', () => {
      return axios
        .get('http://0.0.0.0:1337/?q=http://0.0.0.0:1338/rss&num=1')
        .then((res) => {
          expect(res.data.responseData.feed.entries.length).to.eql(1);
        });
    });
  });
});

const expect = require('chai').expect;
const Feed = require('../../src/feed');

const testMatrix = {
  'http://mamaskind.de/feed/atom/': {
    title: 'Mamaskind',
    description: '',
    link: 'https://mamaskind.de'
  },

  'https://api.zotero.org/groups/9097/items/top?start=0&limit=55&format=atom': {
    title: 'Zotero / Continental European Philosophy Group / Top-Level Items',
    description: '',
    link: 'https://api.zotero.org/groups/9097/items/top?format=atom&limit=55'
  },

  'https://www.contentful.com/blog/feed.xml': {
    title: 'Contentful - Blog',
    author: 'Team von XML-RSS',
    description: 'Contentful gives you an API-first, cloud-based platform to power your sites and apps, allowing you to create first-class user experiences. Stop burying your content in a CMS, empower it with a content infrastructure.',
    link: 'https://www.contentful.com'
  }
};

describe('Feed', function () {
  this.timeout(10000);

  describe('read', () => {
    Object.keys(testMatrix).forEach((url) => {
      const expectations = testMatrix[url];

      it(`correctly parses ${url}`, () => {
        const feed = new Feed(url);

        return feed.read().then((res) => {
          expect(res.title).to.eql(expectations.title);
          expect(res.description).to.eql(expectations.description);
          expect(res.link).to.eql(expectations.link);
          expect(res.entries).to.be.an('Array');
        });
      });
    });

    it('exposes media tags', () => {
      const url = 'https://asijnews.com/feed/';
      const feed = new Feed(url);

      return feed.read().then((res) => {
        expect(res.title).to.eql('ASIJ News');
        expect(res.entries[0].thumbnail).to.match(
          new RegExp('https://asijnews.files.wordpress.com/.*.(jpg|png)$')
        );
      });
    });
  });
});

import Feed from '../../src/feed';

let testMatrix = {
  'http://blog.depold.com/rss/': {
    title: 'Sascha Depold ∴ Blog',
    description: 'Thoughts, stories and ideas.',
    link: 'http://blog.depold.com/'
  },

  'http://mamaskind.de/feed/atom/': {
    title: 'mamaskind',
    description: '',
    link: 'http://mamaskind.de'
  },

  'https://api.zotero.org/groups/9097/items/top?start=0&limit=55&format=atom': {
    title: 'Zotero / Continental European Philosophy Group / Top-Level Items',
    description: '',
    link: 'https://api.zotero.org/groups/9097/items/top?format=atom&limit=55'
  }
};

describe('Feed', function () {
  this.timeout(10000);

  describe('read', () => {
    Object.keys(testMatrix).forEach((url) => {
      let expectations = testMatrix[url];

      it(`correctly parses ${url}`, () => {
        let feed = new Feed(url);

        return feed.read().then((res) => {
          expect(res.title).to.eql(expectations.title);
          expect(res.description).to.eql(expectations.description);
          expect(res.link).to.eql(expectations.link);
          expect(res.entries).to.be.an('Array');
        });
      });
    });
  });
});

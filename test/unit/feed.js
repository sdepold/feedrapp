import Feed from '../../src/feed';

describe('Feed', function () {
  describe('read', () => {
    beforeEach(() => {
      this.rssFeed = new Feed('http://blog.depold.com/rss/');
      this.atomFeed = new Feed('http://mamaskind.de/feed/atom/');
    });

    it('resolves an RSS feed', () => {
      return this.rssFeed.read().then((feed) => {
        expect(feed.type).to.eql('rss');
        expect(feed.title).to.eql('Sascha Depold ∴ Blog');
        expect(feed.description).to.eql('Thoughts, stories and ideas.');
        expect(feed.link).to.eql('http://blog.depold.com/');
        expect(feed.items).to.be.an('Array');
      });
    });

    it('resolves an Atom feed', () => {
      return this.atomFeed.read().then((feed) => {
        expect(feed.type).to.eql('atom');
        expect(feed.title).to.eql('mamaskind');
        // expect(feed.description).to.eql('Thoughts, stories and ideas.');
        expect(feed.link).to.eql('http://mamaskind.de');
        expect(feed.items).to.be.an('Array');
      });
    });
  });
});

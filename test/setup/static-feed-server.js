// Code modules
import { readFileSync } from 'fs';

// Local modules
import AbstractServer from '../../src/abstract-server';

export default class StaticFeedServer extends AbstractServer {
  bindRoutes () {
    this.app.route('GET /rss', () => {
      return readFileSync(`${__dirname}/feeds/rss.xml`);
    });

    this.app.route('GET /atom', () => {
      return readFileSync(`${__dirname}/feeds/atom.xml`);
    });
  }
}

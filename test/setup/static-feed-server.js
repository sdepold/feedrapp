// Code modules
import { readFileSync, readdirSync } from 'fs';

// Local modules
import AbstractServer from '../../src/abstract-server';

export default class StaticFeedServer extends AbstractServer {
  bindRoutes () {
    readdirSync(`${__dirname}/feeds`).forEach((file) => {
      this.app.route(`GET /${file.split('.')[0]}`, () => {
        return readFileSync(`${__dirname}/feeds/${file}`);
      });
    });
  }
}

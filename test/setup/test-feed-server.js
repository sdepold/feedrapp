const { readFileSync, readdirSync } = require('fs');
const AbstractServer = require('../../src/abstract-server');
const express = require('express');

const router = express.Router();

module.exports = class TestFeedServer extends AbstractServer {
  bindRoutes(fixtureDir = `${__dirname}/../integration/fixtures`) {
    readdirSync(fixtureDir).forEach((file) => {
      router.get(`/${file}`, (req, res) => {
        res.send(readFileSync(`${fixtureDir}/${file}`).toString());
      });
    });

    router.get('/slow', ((req, res) => {
      setTimeout(() => {
        res.send(readFileSync(`${fixtureDir}/rss.xml`).toString());
      }, 500);
    }));

    this.app.use('/', router);
  }
};

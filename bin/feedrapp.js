#!/usr/bin/env node

'use strict';

require('babel/register');

var Server = require('../src/server');
var server = new Server();
var port   = process.env.PORT || 8080;
var cache = require('../src/cache');

server.listen(port, '0.0.0.0', function () {
  var address = this.address();

  cache.connect({
  	prefix: process.env.REDIS_PREFIX,
  	host: process.env.REDIS_HOST,
  	port: process.env.REDIS_PORT
  });

  console.log('Feedr is running on http://%s:%s', address.address, address.port);
});

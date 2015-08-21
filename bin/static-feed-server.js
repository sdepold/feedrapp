#!/usr/bin/env node

'use strict';

require('babel/register');

var Server = require('../test/setup/static-feed-server');
var server = new Server();
var port   = process.env.PORT || 8080;

server.listen(port, '0.0.0.0', function () {
  var address = this.address();

  console.log('Static feed server is running on http://%s:%s', address.address, address.port);
});

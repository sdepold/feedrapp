#!/usr/bin/env node

'use strict';

require('babel/register');

var Server = require('../src/server');
var server = new Server();
var port   = process.env.PORT || 8080;

server.listen(port, 'localhost', function () {
  var address = this.address();

  console.log('Feedr is running on http://%s:%s', address.address, address.port);
});

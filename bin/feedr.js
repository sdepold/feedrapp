#!/usr/bin/env node

'use strict';

require('babel/register');

var Server = require('../src/server');
var server = new Server();

server.listen(8080, 'localhost', function () {
  var address = this.address();

  console.log('Feedr is running on http://%s:%s', address.address, address.port);
});

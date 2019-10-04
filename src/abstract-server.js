const express = require('express');
const path = require('path');
// const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const debug = require('debug')('feedrapp:server');
const http = require('http');
const lessMiddleware = require('less-middleware');
const cors = require('cors');

const oneDay = 24 * 60 * 60 * 1000;

module.exports = class AbstractServer {
  constructor(options) {
    this.app = express();
    this.options = options || {};

    this.injectMiddlewares();
    this.bindRoutes();
  }

  listen(...args) {
    this.httpServer = http.createServer(this.app);

    this.httpServerListener = this.httpServer.listen(...args);
    this.httpServer.on('error', this.onError);
    this.httpServer.on('listening', () => this.onListening());

    return this.httpServer;
  }

  close(callback) {
    if (this.httpServer) {
      this.httpServer.close(callback);
    }
  }

  injectMiddlewares() {
    // view engine setup
    this.app.set('views', path.join(__dirname, '..', 'views'));
    this.app.set('view engine', 'pug');

    // uncomment after placing your favicon in /public
    // this.app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
    this.app.use(logger('dev'));
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(cookieParser());
    this.app.use(lessMiddleware(path.join(__dirname, '..', 'public')));
    this.app.use(express.static(path.join(__dirname, '..', 'public'), {
      maxAge: oneDay
    }));
    this.app.use(cors());
  }

  bindRoutes() {
    throw new Error('Overwrite bindRoutes!');
  }

  onError(error) {
    if (error.syscall !== 'listen') {
      throw error;
    }

    const port = this.httpServerListener.address().port;
    const bind = typeof port === 'string'
      ? `Pipe ${port}`
      : `Port ${port}`;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(`${bind} requires elevated privileges`); // eslint-disable-line no-console
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(`${bind} is already in use`); // eslint-disable-line no-console
        process.exit(1);
        break;
      default:
        throw error;
    }
  }

  onListening() {
    const addr = this.httpServer.address();
    const bind = typeof addr === 'string'
      ? `pipe ${addr}`
      : `port ${addr.port}`;

    debug(`Listening on ${bind}`);
  }
};

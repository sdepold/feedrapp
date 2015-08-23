// 3rd-party modules
import webPockets from 'web-pockets';

export default class AbstractServer {
  constructor (options) {
    this.app     = webPockets();
    this.options = options || {};

    this.injectLogging();
    this.bindRoutes();
  }

  listen (port, iface, callback) {
    this.httpServer = this.app.listen(port, iface, callback);
    return this.httpServer;
  }

  close (callback) {
    if (this.httpServer) {
      this.httpServer.close(callback);
    }
  }

  injectLogging () {
    function getStatusCode (result) {
      if (result.body && (result.body.responseStatus !== result.statusCode)) {
        return result.body.responseStatus;
      } else {
        return result.statusCode;
      }
    }

    this.app.request.wrap('result', (result, request) => {
      var start = new Date();

      return result().then((result) => {
        if (!this.options.disableLogging) {
          console[result.statusCode < 500 ? 'log' : 'error']({
            url: request.url,
            host: request.headers.host,
            success: result.statusCode < 400,
            tags: ['result'],
            statusCode: getStatusCode(result),
            responseDetails: result.body.responseDetails,
            duration: new Date() - start
          });
        }

        return result;
      });
    });
  }

  bindRoutes () {
    throw new Error('Overwrite bindRoutes!');
  }
}

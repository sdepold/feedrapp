// 3rd-party modules
import webPockets from 'web-pockets';

export default class AbstractServer {
  constructor () {
    this.app = webPockets();
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
        result.statusCode = getStatusCode(result);

        console[result.statusCode < 500 ? 'log' : 'error']({
          url: request.url,
          host: request.headers.host,
          success: result.statusCode < 400,
          tags: ['result'],
          statusCode: result.statusCode,
          responseDetails: result.body.responseDetails,
          duration: new Date() - start
        });

        return result;
      });
    });
  }

  bindRoutes () {
    throw new Error('Overwrite bindRoutes!');
  }
}

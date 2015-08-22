// 3rd-party modules
import webPockets from 'web-pockets';

export default class AbstractServer {
  constructor () {
    this.app = webPockets();
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

  bindRoutes () {
    throw new Error('Overwrite bindRoutes!');
  }
}

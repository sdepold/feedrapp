const AbstractServer = require('./abstract-server');
const cache = require('./cache');
const indexRoute = require('../routes/index');
const imprintRoute = require('../routes/imprint');

module.exports = class Server extends AbstractServer {
  injectMiddlewares() {
    super.injectMiddlewares();
    this.app.use(cache());
  }

  bindRoutes() {
    this.app.use('/', indexRoute);
    this.app.use('/imprint', imprintRoute);

    // catch 404 and forward to error handler
    this.app.use((req, res, next) => {
      const err = new Error('Not Found');
      err.status = 404;
      next(err);
    });

    // error handler
    this.app.use((err, req, res) => {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};

      // render the error page
      res.status(err.status || 500);
      res.render('error');
    });
  }
};

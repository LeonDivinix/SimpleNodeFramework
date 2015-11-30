var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

/**
 * 配置
 */
var config = require('./config');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, config.views));
app.set('view engine', config.viewEngine);

/**
 * Normalize a port into a number, string, or false.
 */

//function normalizePort(val) {
//  var port = parseInt(val, 10);
//
//  if (isNaN(port)) {
//    // named pipe
//    return val;
//  }
//
//  if (port >= 0) {
//    // port number
//    return port;
//  }
//
//  return false;
//}
/**
 * Get port from environment and store in Express.
 */
//var port = normalizePort(process.env.PORT || '3000');
app.set('port', config.port); // 仅用设置端口

// todo 网站图标 uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); //

// 加载路由跳转
var controllers = require('./controller');
var len = controllers.length;
var i = 0;
while (i < len) {
  app.use(controllers[i].route, require(controllers[i].path));
  ++i;
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;

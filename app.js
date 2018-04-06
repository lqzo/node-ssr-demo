const express = require('express')
  , path = require('path')
  , favicon = require('serve-favicon')
  , logger = require('morgan')
  , cookieParser = require('cookie-parser')
  , bodyParser = require('body-parser')
  , session = require("express-session")
  , MongoStore = require("connect-mongo")(session)
  , index = require('./routes/index')
  , users = require('./routes/users')

  , app = express()



// view engine setup
app.set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .set("view options", {
    cache: false
  })
  // uncomment after placing your favicon in /public
  .use(favicon(path.join(__dirname, '/public/favicon.ico')))
  .use(logger('dev'))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: false }))
  .use(cookieParser())
  .use(express.static(path.join(__dirname, 'public')))
  .use(session({
    secret: "keyboaed cat",
    saveUninitialized: true,
    resave: false,
    store: new MongoStore({
      url: "mongodb://127.0.0.1:27017/online_q_a_system"
    })
  }))

  .use('/', index)
  .use('/users', users)

  // catch 404 and forward to error handler
  .use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  })

  // error handler
  .use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });

module.exports = app;

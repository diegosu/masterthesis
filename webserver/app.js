var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//HERE IS TO SPECIFY THE MODULES WE WANT TO USE
/////var routes = require('./routes/index');
/////var users = require('./routes/users');

var producto = require('./controllers/producto')


//var mongoose = require('mongoose');
//mongoose.Promise = global.Promise;

//mongoose.connect('mongodb://192.168.1.142/mqtt')
  // .then(() => console.log('connection succesful'))
 //  .catch((err) => console.error(err));

//var passport = require('passport');
//var LocalStrategy = require('passport-local').Strategy;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use(require('express-session')({
//    secret: 'keyboard cat',
//    resave: false,
//    saveUninitialized: false
//}));
//app.use(passport.initialize());
//app.use(passport.session());

////app.use('/', routes);
////app.use('/users', users);


/////var User = require('./models');
//passport.use(new LocalStrategy(User.authenticate()));
//passport.serializeUser(User.serializeUser());
//passport.deserializeUser(User.deserializeUser());


////for the new thing od nodehispano.com
app.get('/', producto.index)
//we call the function index which is in producto.js

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

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

var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
const auth = require('./routes/auth');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
    secret: '94LCRr0Jik$IlJQIe8eUrQkN',
    lifetime: 600000,
    resave: true,
    saveUninitialized: true
}));

const cors = require('cors');
app.use(cors({
    exposedHeaders: 'x-csrf'
}));

app.get('/test', (req, res) => {
    res.status(200).send({
        success: 'true',
        message: 'api test endpoint'
    })
});

// configure routes
app.use('/auth', auth);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`);
})

module.exports = app;

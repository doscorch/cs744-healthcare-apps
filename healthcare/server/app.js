var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
const auth = require('./routes/auth');
const users = require('./routes/users');
const physician = require('./routes/physician');
const prescription = require('./routes/prescription');
const procedure = require('./routes/procedure');
const visitation = require('./routes/visitation');
const insurance = require('./routes/insurance');


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

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", req.header('Origin'));
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-csrf");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE, PATCH");
    res.header("Access-Control-Expose-Headers", "x-csrf")
    next();
});

app.get('/test', (req, res) => {
    res.status(200).send({
        success: 'true',
        message: 'api test endpoint'
    })
});

// configure routes
app.use('/auth', auth);
app.use('/users', users);
app.use('/physician', physician);
app.use('/prescription', prescription);
app.use('/procedure', procedure);
app.use('/visitation', visitation);
app.use('/insurance',insurance);

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

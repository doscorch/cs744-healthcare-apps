const { User_Type_Admin } = require('../models/user')
const debug_mode = true;
module.exports.isAuthenticated = (req, res, next) => {
    if (debug_mode) {
        next();
    } else {
        let user = req.session.user;
        if (user && req.headers['x-csrf'] && req.headers['x-csrf'] == req.session.csrf) {
            next();
        } else {
            req.session.regenerate(function (err) {
                res.status('403').send(new Error('Not Authenticated'));
                return;
            });
        }
    }
};


module.exports.isAdmin = (req, res, next) => {
    if (req.session.user.user_type != User_Type_Admin) {
        res.status('403').send(new Error('Not Admin'));
        return;
    }
    next();
};
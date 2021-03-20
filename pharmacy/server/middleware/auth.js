const { User_Type_Admin, User_Type_Pharmacist } = require('../models/user')

module.exports.isAuthenticated = (req, res, next) => {
    let user = req.session.user;
    if (user && req.headers['x-csrf'] && req.headers['x-csrf'] == req.session.csrf) {
        next();
    } else {
        req.session.regenerate(function (err) {
            res.status('403').send(new Error('Not Authenticated'));
            return;
        });
    }
};

module.exports.isAdmin = (req, res, next) => {
    if (req.session.user.user_type != User_Type_Admin) {
        res.status('403').send(new Error('Not Admin'));
        return;
    }
    next();
};

module.exports.isPharmacist = (req, res, next) => {
    if (req.session.user.user_type != User_Type_Pharmacist) {
        res.status('403').send(new Error('Not Pharmacist'));
        return;
    }
    next();
};
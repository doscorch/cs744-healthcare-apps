const bcrypt = require('bcrypt');
const saltRounds = 10;
var _userRepository = require('../data-repositories/users-repository');

// create user
function createUser(user, cb) {
    delete user.user_id;
    bcrypt.hash(user.password, saltRounds, function (err, hash) {
        if (err) throw err;
        user.password = hash;
        _userRepository.createUser(user, (err, u) => cb(err, u));
    });
}
module.exports.createUser = createUser;

// update user
function updateUser(user, cb) {
    delete user.password;
    _userRepository.updateUser(user, (err, user) => cb(err, user));
}
module.exports.updateUser = updateUser;

// getUserByCredentials used for login.. compare password with bcyrpted password
function getUserByCredentials(form, cb) {
    _userRepository.getUserByUsername(form.username, (err, user) => {
        console.log("here!!!!!!!!!!");
        console.log(user);

        if (err) throw err;
        bcrypt.compare(form.password, user.password, function (err, res) {
            if (err) throw err;
            if (res == true) cb(err, user);
        });
    });
}
module.exports.getUserByCredentials = getUserByCredentials;

// get all users.. used by admin
function getAllUsers(cb) {
    _userRepository.getAllUsers((err, users) => cb(err, users));
}
module.exports.getAllUsers = getAllUsers;

// get user by id 
function getUserById(userId, cb) {
    _userRepository.getUserById(userId, (err, user) => cb(err, user));
}
module.exports.getUserById = getUserById;

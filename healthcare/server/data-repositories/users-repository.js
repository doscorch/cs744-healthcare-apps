const users = require('../models/user');

function createUser(user, cb) {
    users.create({ ...user })
        .then(u => cb(null, u))
        .catch(err => cb(err, null));
}
module.exports.createUser = createUser;

function updateUser(user, cb) {
    users.update(...user).where({ user_id: user.user_id }).then(res => cb(null, user));
}
module.exports.updateUser = updateUser;

function getUserByUsername(username, cb) {
    users.findAll({ where: { username: username } }).then(users => cb(null, users.length ? users.first() : null))
}
module.exports.getUserByUsername = getUserByUsername;

function getAllUsers(cb) {
    users.findAll()
        .then(users => cb(null, users))
        .catch(err => cb(err, null));
}
module.exports.getAllUsers = getAllUsers;

function getUserById(id, cb) {
    users.findAll({ where: { user_id: id } }).then(users => cb(null, users.length ? users.first() : null))
}
module.exports.getUserById = getUserById;

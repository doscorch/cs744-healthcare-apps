const users = require('./dbmodels/user');

function createUser(user, cb) {
    users.create({ ...user })
        .then(u => cb(null, u))
        .catch(err => cb(err, null));
}
module.exports.createUser = createUser;

function updateUser(userId, user, cb) {
    users.update(user).where({ user_id: user.user_id }).then(res => cb(null, user));
}
module.exports.updateUser = updateUser;

function getUserByUsername(username, cb) {
    users.findAll({ where: { username: username } }).then(users => cb(null, users.length ? users[0].dataValues : null))
}
module.exports.getUserByUsername = getUserByUsername;

function getAllUsers(cb) {
    users.findAll()
        .then(users => cb(null, users.map(u => u.dataValues)))
        .catch(err => cb(err, null));
}
module.exports.getAllUsers = getAllUsers;

function getUserById(id, cb) {
    users.findAll({ where: { user_id: id } }).then(users => cb(null, users.length ? users[0].dataValues : null))
}
module.exports.getUserById = getUserById;

function patchUser(userId, userPartial, cb) {
    console.log(userPartial)
    users.update(userPartial, {
        where: { user_id: userId }
    }).then(res => cb(null, userPartial));
}
module.exports.patchUser = patchUser;
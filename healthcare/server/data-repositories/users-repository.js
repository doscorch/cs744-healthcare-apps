const db = require('./db');

function createUser(user, cb) {
    db.getUsersTable().then(table => {
        table.insert(["username", "password", "first_name", "last_name", "user_type", "user_status"])
            .values([user.username, user.password, user.first_name, user.last_name, user.user_type, user.user_status])
            .execute()
            .then(res => {
                const id = res.getAutoIncrementValue();
                user.user_id = id;
                cb(null, user);
            })
            .catch(err => { console.log(err); cb(err, user) })
    })
}
module.exports.createUser = createUser;

function updateUser(user, cb) {
    db.getUsersTable().then(table => {
        table.update()
            .where(`user_id = "${user.user_id}"`)
            .set('first_name', user.first_name)
            .set('last_name', user.last_name)
            .set('user_type', user.user_type)
            .set('user_status', user.user_status)
            .execute()
            .then(res => {
                cb(null, user);
            })
            .catch(err => { console.log(err); cb(err, user) })
    })
}
module.exports.updateUser = updateUser;

function getUserByUsername(username, cb) {
    db.getUsersTable().then(table => {
        table.select()
            .where(`username = "${username}"`)
            .execute()
            .then(res => {
                const user = res.fetchOne();
                console.log(user);
                if (user)
                    cb(null, user);
                else
                    cb("no user found", null);
            })
            .catch(err => { console.log(err); cb(err, null) })
    })
}
module.exports.getUserByUsername = getUserByUsername;

function getAllUsers(cb) {
    db.getUsersTable().then(table => {
        table.select()
            .execute()
            .then(res => {
                const user = res.fetchOne();
                console.log(user);
                if (user)
                    cb(null, user);
                else
                    cb("no user found", null);
            })
            .catch(err => { console.log(err); cb(err, null) })
    })
}
module.exports.getAllUsers = getAllUsers;

function getUserById(id, cb) {
    //todo
}
module.exports.getUserById = getUserById;

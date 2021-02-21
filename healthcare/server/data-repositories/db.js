const mysqlx = require('@mysql/xdevapi');
const schema = "peach_healthcare"
const userTable = "user";
const connectionString = "mysql://root:3peachDatabase!@localhost:33060/peach_healthcare";

const bcrypt = require('bcrypt');
const saltRounds = 10;


// quick test connection
mysqlx.getSession(connectionString)
    .then(session => {
        console.log(session.inspect());
    });

// init database
mysqlx.getSession(connectionString)
    .then(session => {
        bcrypt.hash("password", saltRounds, function (err, hash) {
            if (err) throw err;
            Promise
                .all([
                    session.sql('DROP TABLE IF EXISTS user').execute(),
                    session.sql('CREATE TABLE user(user_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,username VARCHAR(63) NOT NULL,password VARCHAR(512) NOT NULL,first_name VARCHAR(63) NOT NULL,last_name VARCHAR(63) NOT NULL,user_type INT NOT NULL,user_status INT NOT NULL)').execute()
                ])
                .then(() => {
                    const table = session.getSchema('peach_healthcare').getTable('user');
                    table.insert(["username", "password", "first_name", "last_name", "user_type", "user_status"]).values(["admin", hash, "first", "last", "1", "1"]).execute().then(res => console.log(res.getAutoIncrementValue())).catch(err => console.log(err))

                });
        });

    });

// exposed db interface
const db = {
    getUsersTable: () => {
        return mysqlx.getSession(connectionString)
            .then(session => {
                return session.getSchema(schema).getTable(userTable);
            });
    }
};

module.exports = db;

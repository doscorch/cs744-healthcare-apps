const mysqlx = require('@mysql/xdevapi');
const connectionString = "mysql://root:3peachDatabase!@localhost:33060/peach_healthcare";

mysqlx.getSession(connectionString)
    .then(session => {
        console.log(session.inspect());
    });

module.exports = db;
